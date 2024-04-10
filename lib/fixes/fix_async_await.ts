// Error.stackTraceLimit = Infinity;

import { IfStatement } from "ts-morph";
import * as ts from "typescript";
import { expandStatements, transformExpandStatement } from "./fix_block";
import { isBlockLike, isParenthesizedNamedCallExpression, replaceExpression, testTransformer, updateBlocklike, makeRemoveExpressionOfType } from "../utils";

function getInstructionName(instruction: number): string {
    switch (instruction) {
        case 0 /* Next */: return "next";
        case 1 /* Throw */: return "throw";
        case 2 /* Return */: return "return";
        case 3 /* Break */: return "break";
        case 4 /* Yield */: return "yield";
        case 5 /* YieldStar */: return "yield*";
        case 6 /* Catch */: return "catch";
        case 7 /* Endfinally */: return "endfinally";
        default: return ''; // TODO: GH#18217
    }
}

interface InstructionExpression extends Omit<ts.ArrayLiteralExpression, 'elements'> {
    elements: [ts.NumericLiteral, ts.Expression];
}

interface Instruction extends ts.ReturnStatement {
    expression: InstructionExpression;
}

interface SentCall extends ts.CallExpression {
    expression: {
        name: { escapedText: 'sent' } & ts.Identifier;
    } & ts.PropertyAccessExpression;
}
interface SentStatement extends ts.ExpressionStatement {
    expression: (
        {
            operatorToken: ts.Token<ts.SyntaxKind.EqualsToken>,
            right: SentCall
        } & ts.BinaryExpression
    ) | SentCall
}

function isSentCall(node: ts.Node): node is SentCall {
    return ts.isCallExpression(node)
        && ts.isPropertyAccessExpression(node.expression)
        && node.expression.name.escapedText === "sent";
}

function isSentStatement(s: ts.Node): s is SentStatement {
    if (ts.isExpressionStatement(s)) {
        const exp = (() => {
            if (ts.isBinaryExpression(s.expression)
                && s.expression.operatorToken.kind === ts.SyntaxKind.EqualsToken
                && ts.isCallExpression(s.expression.right)
            ) {
                return s.expression.right;
            } else if (ts.isCallExpression(s.expression)) {
                return s.expression;
            }
            return undefined;
        })();
        if (exp) {
            return ts.isPropertyAccessExpression(exp.expression) && exp.expression.name.getText() === "sent";
        }
    }
    return false;
}

interface InstructionTypeNode<T extends string> extends ts.NumericLiteral {
    text: T;
}

interface InstructionNode<T extends string> extends ts.ReturnStatement {
    expression: {
        elements: [InstructionTypeNode<T>, ts.Expression] | [InstructionTypeNode<T>]
    } & ts.ArrayLiteralExpression;
}

function isInstruction(s: ts.Node): s is InstructionNode<string> {
    return ts.isReturnStatement(s)
        && !!s.expression
        && ts.isArrayLiteralExpression(s.expression)
        && s.expression.elements.length >= 1
        && ts.isNumericLiteral(s.expression.elements[0])
}

function isReturnInstruction(s: ts.Node): s is InstructionNode<'2'> {
    return isInstruction(s)
        && s.expression.elements![0].text === '2';
}
interface BreakInstruction extends Omit<InstructionNode<'3'>, 'expression'> {
    expression: {
        elements: [InstructionTypeNode<'3'>, ts.NumericLiteral]
    }
}

function isBreakInstruction(s: ts.Node): s is BreakInstruction {
    return isInstruction(s)
        && s.expression.elements![0].text === '3';
}

function getBreakInstructionLabel(s: BreakInstruction): number {
    return parseInt(s.expression.elements[1].text);
}

function isYieldInstruction(s: ts.Node): s is InstructionNode<'4' | '5'> {
    return isInstruction(s)
        && (
            s.expression.elements![0].text === '4'
            || s.expression.elements![0].text === '5'
        );
}

function mapReturnInsturctions(node: ts.Node, context: ts.TransformationContext): ts.Node {
    const factory: ts.NodeFactory = context.factory
    function visit(node: ts.Node): ts.Node {
        const ret = ts.visitEachChild(node, visit, context);
        if (isReturnInstruction(ret)) {
            if (ret.expression.elements.length === 2) {
                return factory.createReturnStatement(ret.expression.elements[1])
            } else {
                return factory.createReturnStatement();
            }
        }
        return ret;
    }
    return ts.visitEachChild(node, visit, context);
}


function isSectionFallthrough(s: ts.Node): s is ts.ExpressionStatement {
    return ts.isExpressionStatement(s)
        && ts.isBinaryExpression(s.expression)
        && s.expression.operatorToken.kind === ts.SyntaxKind.EqualsToken
        && ts.isNumericLiteral(s.expression.right)
        && ts.isPropertyAccessExpression(s.expression.left)
        && s.expression.left.name.text === "label";
}

const removeSectionFallthrough = makeRemoveExpressionOfType(isSectionFallthrough);

interface TryCatchInfo extends ts.ExpressionStatement {
    expression: {
        expression: {
            name: { escapedText: 'push' } & ts.Identifier;
            expression: {
                name: { escapedText: 'trys' } & ts.Identifier
            } & ts.PropertyAccessExpression;
        } & ts.PropertyAccessExpression,
        arguments: [ts.ArrayLiteralExpression]
    } & Omit<ts.CallExpression, 'arguments'>;
}
function isTryCatchInfo(node: ts.Node): node is TryCatchInfo {
    return ts.isExpressionStatement(node)
        && ts.isCallExpression(node.expression)
        && ts.isPropertyAccessExpression(node.expression.expression)
        && node.expression.expression.name.escapedText == 'push'
        && ts.isPropertyAccessExpression(node.expression.expression.expression)
        && node.expression.expression.expression.name.escapedText == 'trys'
        && ts.isArrayLiteralExpression(node.expression.arguments[0])

}
const removeTryCatchInfo = makeRemoveExpressionOfType(isTryCatchInfo);

interface BrFalse extends ts.IfStatement {
    expression: {
        operatorToken: ts.Token<ts.SyntaxKind.ExclamationEqualsEqualsToken>;
    } & ts.BinaryExpression | ({ operator: ts.SyntaxKind.ExclamationToken } & ts.PrefixUnaryExpression);
    thenStatement: {
        statements: [BreakInstruction]
    } & ts.Block;
}
// if (! ) break elseLabel
function isBrFalse(node: ts.Node): node is BrFalse {
    return ts.isIfStatement(node)
        && (
            (
                ts.isPrefixUnaryExpression(node.expression)
                && node.expression.operator === ts.SyntaxKind.ExclamationToken
            )
            || (
                ts.isBinaryExpression(node.expression)
                && node.expression.operatorToken.kind === ts.SyntaxKind.ExclamationEqualsEqualsToken
            )
        )
        && ts.isBlock(node.thenStatement)
        && node.thenStatement.statements.length === 1
        && isBreakInstruction(node.thenStatement.statements[0]);
}

/** reverse the condition of a brfalse */
function positiveExpression(node: ts.PrefixUnaryExpression | ts.BinaryExpression, factory: ts.NodeFactory): ts.Expression {
    if (ts.isPrefixUnaryExpression(node)) {
        return node.operand;
    } else {
        return factory.createBinaryExpression(
            node.left,
            factory.createToken(ts.SyntaxKind.EqualsEqualsEqualsToken),
            node.right
        );
    }
}

interface BrTrue extends ts.IfStatement {
    expression: {
        operatorToken: ts.Token<ts.SyntaxKind.EqualsEqualsEqualsToken>;
    } & ts.BinaryExpression;
    thenStatement: {
        statements: [BreakInstruction]
    } & ts.Block;
}

function isBrTrue(node: ts.Node): node is BrTrue {
    return ts.isIfStatement(node)
        && ts.isBinaryExpression(node.expression)
        && node.expression.operatorToken.kind === ts.SyntaxKind.EqualsEqualsEqualsToken
        && ts.isBlock(node.thenStatement)
        && node.thenStatement.statements.length === 1
        && isBreakInstruction(node.thenStatement.statements[0]);
}

function getGenerateBody(statments: ts.Statement[], factory: ts.NodeFactory): ts.Statement[] {
    return statments.map(x => {
        console.log('getGenerateBody statments', ts.SyntaxKind[x.kind]);
        if (ts.isReturnStatement(x)
            && x.expression
            && isParenthesizedNamedCallExpression('__generator', x.expression)
        ) {
            const generateBody = (x.expression.arguments[1] as ts.FunctionLikeDeclaration).body!;
            if (ts.isArrayLiteralExpression(generateBody)) {
                return factory.createReturnStatement(generateBody);
            }
            if (ts.isBlock(generateBody)) {
                return generateBody;
            }
            console.assert(true, `generateBody ${ts.SyntaxKind[generateBody.kind]}`);
        }
        return x;
    }).filter(Boolean) as ts.Statement[];
}

function getYieldExpression(node: InstructionNode<string>) {
    return node.expression.elements[1];
}
interface AwaitSection {
    topYield: boolean;
    hasYield: boolean;
    yieldContainer: ts.BlockLike;

    merged: boolean;

    isBlank: boolean;
    index: string;
    tryCatch?: number[]; // [try, catch, finally, next]
    breakTo: string[];
    hasBreak: boolean;
    hasReceiveAwait: boolean;
    hasReturn: boolean;
    hasLoop: boolean;
    statements: ts.Statement[];
}

export function fixAsyncAwait(context: ts.TransformationContext) {
    const factory = context.factory;
    const freeStatements: ts.Statement[] = [];

    const getUpdateInstruction = () => {
        const labels: string[] = [];
        const sections: AwaitSection[] = [];

        function updateInstruction(_node: ts.Node): ts.Node {

            if (isParenthesizedNamedCallExpression('__generator', _node)
                && _node.arguments.length === 2
                && ts.isFunctionLike(_node.arguments[1])
            ) {
                const transFormed = ts.visitEachChild(_node, updateInstruction, context);
                const generateBody = transFormed.arguments[1] as ts.FunctionLikeDeclaration;
                console.assert(ts.isFunctionLike(transFormed.arguments[1]), '???');
                return factory.updateCallExpression(transFormed,
                    transFormed.expression,
                    transFormed.typeArguments,
                    [
                        transFormed.arguments[0],
                        factory.createFunctionExpression(
                            generateBody.modifiers,
                            generateBody.asteriskToken,
                            undefined,
                            generateBody.typeParameters,
                            generateBody.parameters,
                            generateBody.type,
                            (factory as any).converters.convertToFunctionBlock(
                                generateBody
                            )
                        )
                    ]
                );
            }

            if (ts.isBlock(_node)
                && _node.statements.some(x => {
                    return ts.isReturnStatement(x)
                        && x.expression
                        && ts.isConditionalExpression(x.expression)
                })
            ) {
                const transFormed: typeof _node = ts.visitEachChild(_node, updateInstruction, context);
                const statements = transFormed.statements.reduce((pre, x) => {
                    // this is a if statement
                    if (ts.isReturnStatement(x)
                        && x.expression
                        && ts.isConditionalExpression(x.expression)
                    ) {

                        const whenTrueStatements = (updateInstruction((transformExpandStatement(context))(factory.createBlock(
                            expandStatements([
                                factory.createReturnStatement(x.expression.whenTrue),
                            ], factory)
                        ) as unknown as ts.SourceFile)) as unknown as ts.Block).statements;
                        const whenFalseStatements = (updateInstruction((transformExpandStatement(context))(factory.createBlock(
                            expandStatements([
                                factory.createReturnStatement(x.expression.whenFalse),
                            ], factory)
                        ) as unknown as ts.SourceFile)) as unknown as ts.Block).statements;
                        const whenTrueLast = whenTrueStatements[whenTrueStatements.length - 1];
                        const whenFalseLast = whenFalseStatements[whenFalseStatements.length - 1];
                        if (isInstruction(whenTrueLast)
                            && isInstruction(whenFalseLast)
                        ) {
                            console.log('async await if');
                        }

                        pre.push(
                            factory.createIfStatement(
                                x.expression.condition,
                                factory.createBlock(
                                    whenTrueStatements
                                ),
                            ),
                            ...whenFalseStatements
                        );
                        return pre;
                    }
                    pre.push(x);
                    return pre;
                }, [] as ts.Statement[]);
                return factory.updateBlock(transFormed as typeof _node, statements)
            }

            if (ts.isCaseClause(_node)) {
                // dont process recursive case clauses
                labels.push(_node.expression.getText());
                const transFormed: typeof _node = ts.visitEachChild(_node, updateInstruction, context);
                const sectionInfo = getLoadSectionInfo(transFormed);
                sections.push(sectionInfo);
                return transFormed;
            }
            return ts.visitEachChild(_node, updateInstruction, context);
        }

        function getLoadSectionInfo(sectionRoot: ts.CaseClause) {
            const section = {
                index: sectionRoot.expression.getText(),
            } as AwaitSection;
            let trycatch: number[] = [];
            let breakTo: string[] = [];

            function loadSectionInfo(node: ts.Node): ts.Node {
                // fix parent;
                ts.visitEachChild(node, function (child) {
                    (child as any).parent = node;
                    return child;
                }, context);

                node = ts.visitEachChild(node, loadSectionInfo, context);

                if (isSentCall(node)) {
                    section.hasReceiveAwait = true;
                }

                if (isInstruction(node)) {
                    const instruction = getInstructionName(parseInt(node.expression.elements[0].text));
                    if (instruction === "yield") {
                        section.hasYield = true;
                        console.assert(isBlockLike(node.parent), 'container must be blocklike');
                        section.yieldContainer = node.parent as ts.BlockLike;
                        section.topYield = section.yieldContainer == sectionRoot.statements[0];

                    }
                    if (instruction === 'return') {
                        section.hasReturn = true;
                    }
                    if (instruction === 'break') {
                        section.hasBreak = true;
                        const breakLabel = (node.expression.elements[1] as ts.NumericLiteral).text;
                        breakTo.push(breakLabel)
                        // console.log('===> section.index', parseInt(section.index), parseInt(breakLabel), parseInt(breakLabel) < parseInt(section.index));
                        if (parseInt(breakLabel) < parseInt(section.index)) {
                            // console.log('is breakback');
                            section.hasLoop = true;
                        }
                        if (parseInt(breakLabel) > parseInt(section.index) + 1) {
                            // console.log('is breakforward');
                        }
                    }
                }

                if (isTryCatchInfo(node)) {
                    trycatch = node.expression.arguments[0].elements.map(a => {
                        if (ts.isNumericLiteral(a)) {
                            return parseInt(a.text);
                        }
                        return -1;
                    });
                }

                return node;
            }

            if (sectionRoot.statements.length <= 2) {
                section.isBlank = !!sectionRoot.statements.find(s => {
                    return !isSentStatement(s)
                        && !isBreakInstruction(s)
                        && !isSectionFallthrough(s);
                })
            }


            const statements = (ts.isBlock(sectionRoot.statements[0]) && sectionRoot.statements.length == 1)
                ? sectionRoot.statements[0].statements
                : sectionRoot.statements;

            section.statements = [...statements];
            ts.visitEachChild(sectionRoot, loadSectionInfo, context);


            if (trycatch.length > 0) {
                section.tryCatch = trycatch;
            }
            section.breakTo = breakTo;
            return section;
        }


        function joinYields(sections: AwaitSection[]) {
            return sections.reduce((pre, current, index) => {
                if (current.merged) {
                    return pre;
                }
                if (current.hasYield) {
                    const next = sections[index + 1];
                    if (next) {
                        next.merged = true;
                    } else {
                        throw new Error('???');
                    }

                    const lastExpresion = current.statements[current.statements.length - 1] as InstructionNode<string>;

                    console.assert(isInstruction(lastExpresion), `code ${ts.createPrinter().printNode(ts.EmitHint.Unspecified, lastExpresion, factory.createSourceFile(
                        current.statements,
                        factory.createToken(ts.SyntaxKind.EndOfFileToken),
                        ts.NodeFlags.None,
                    )
                    )}`);


                    if (current.topYield) {
                        pre.push({
                            ...current,
                            hasYield: false,
                            isBlank: false,
                            tryCatch: current.tryCatch || next.tryCatch,
                            statements: [
                                ...current.statements.slice(0, -1),
                                replaceExpression(next.statements[0], isSentCall, factory.createAwaitExpression(
                                    getYieldExpression(lastExpresion)
                                ), context) as ts.Statement,
                                ...next.statements.slice(1),
                            ]
                        });
                    } else {
                        pre.push({
                            ...current,
                            hasYield: false,
                            isBlank: false,
                            tryCatch: current.tryCatch || next.tryCatch,
                            statements: [
                                ...current.statements.map(s => {
                                    return replaceExpression(s, (node) => {
                                        return node === current.yieldContainer
                                    },
                                        updateBlocklike(
                                            current.yieldContainer,
                                            current.yieldContainer.statements.reduce((pre, current) => {
                                                if (isYieldInstruction(current)) {
                                                    const awaitExpression = factory.createAwaitExpression(getYieldExpression(current));
                                                    pre.push(
                                                        replaceExpression(next.statements[0], isSentCall, awaitExpression, context) as ts.Statement,
                                                        ...next.statements.slice(1)
                                                    );
                                                    return pre;
                                                }
                                                pre.push(current);
                                                return pre;
                                            }, [] as ts.Statement[]),
                                            factory
                                        ),
                                        context
                                    ) as typeof s;
                                })
                            ]
                        });
                    }

                } else {
                    pre.push(current);
                }

                return pre;
            }, [] as AwaitSection[]);
        }


        function joinTry(sections: AwaitSection[]): AwaitSection[] {
            function removeToTryEnd(node: ts.Node, end: number) {
                function visit(node: ts.Node): ts.Node {
                    const transformed = ts.visitEachChild(node, visit, context);
                    if (isBreakInstruction(transformed)) {
                        const label = parseInt(transformed.expression.elements[1].text);
                        if (label == end) {
                            return factory.createEmptyStatement();
                        }
                    }
                    return transformed;
                }
                return ts.visitEachChild(node, visit, context);
            }
            return sections.reduce((pre, current, index) => {
                if (current.merged) {
                    return pre;
                }
                if (current.tryCatch && current.tryCatch.length > 0) {
                    const tryBlock = sections.filter(s => (parseInt(s.index) >= current.tryCatch![0]) && (parseInt(s.index) < current!.tryCatch![1]));
                    const catchBlock = sections.filter(s => (parseInt(s.index) >= current.tryCatch![1] && parseInt(s.index) < (current!.tryCatch![2] || current!.tryCatch![3])));
                    const finallyBlock = current.tryCatch![2] ? sections.filter(s => (parseInt(s.index) >= current.tryCatch![2] && parseInt(s.index) < current!.tryCatch![3])) : [];

                    if (tryBlock.length > 1 || catchBlock.length > 1) {
                        pre.push(current);
                        return pre;
                    }
                    tryBlock.slice(1).forEach(t => {
                        t.merged = true;
                    });
                    catchBlock.forEach(c => {
                        c.merged = true;
                    });
                    finallyBlock.forEach(f => {
                        f.merged = true;
                    });
                    const catchName = (((catchBlock[0].statements[0] as ts.ExpressionStatement).expression as ts.BinaryExpression).left as ts.Identifier).text;
                    pre.push({
                        ...current,
                        tryCatch: undefined,
                        statements: [
                            removeToTryEnd(factory.createTryStatement(
                                removeTryCatchInfo(
                                    factory.createBlock(
                                        tryBlock.reduce((pre, s) => pre.concat(s.statements), [] as ts.Statement[]),
                                    ), context) as ts.Block,
                                factory.createCatchClause(
                                    factory.createVariableDeclaration(
                                        factory.createIdentifier(catchName),
                                        undefined,
                                        undefined,
                                    ),
                                    factory.createBlock(
                                        catchBlock.reduce((pre, s) => pre.concat(!pre.length ? s.statements.slice(1) : s.statements), [] as ts.Statement[]),
                                    ),
                                ),
                                finallyBlock.length > 0 ? factory.createBlock(
                                    finallyBlock.map(f => f.statements[0]),
                                ) : undefined,
                            ), current.tryCatch[3]),
                        ] as ts.Statement[],
                    });

                } else {
                    pre.push(current);
                }
                return pre;
            }, [] as AwaitSection[]);
        }

        function joinIf(sections: AwaitSection[]): AwaitSection[] {
            return sections.reduce((preSection, current, index) => {
                if (current.merged) {
                    return preSection;
                }
                const next = sections[index + 1];
                const nextLabel = next?.index;
                let lastBrBool = -1;
                let lastBrFalse = -1;

                for (let index = 0; index < current.statements.length; index++) {
                    const node = current.statements[index];
                    if (isBrFalse(node)) {
                        lastBrBool = index;
                        lastBrFalse = index;
                    } else if (isBrTrue(node)) {
                        lastBrBool = index;
                    }
                }
                if (lastBrBool !== -1 && lastBrFalse === lastBrBool) {
                    const lastBrFalseNode = current.statements[lastBrFalse] as BrFalse;
                    console.log( 
                        current.index,
                        '-----> ', ts.SyntaxKind[lastBrFalseNode.expression.kind],
                        ts.SyntaxKind[(lastBrFalseNode.expression as ts.BinaryExpression).left.kind],
                        (lastBrFalseNode.expression as ts.BinaryExpression).left.getText(),
                        ts.SyntaxKind[(lastBrFalseNode.expression as ts.BinaryExpression).operatorToken.kind],
                        ts.SyntaxKind[(lastBrFalseNode.expression as ts.BinaryExpression).right.kind],

                    );

                    const breakLabel = getBreakInstructionLabel(lastBrFalseNode.thenStatement.statements[0]);
                    const breakToLabelSectionIndex = sections.findIndex(s => parseInt(s.index) == breakLabel);
                    const beforeBreakToLabelSection = sections[breakToLabelSectionIndex - 1];
                    const lastExpresion = beforeBreakToLabelSection.statements.slice(-1)[0];

                    console.log('node is brfalse !', current.index, breakLabel, !!lastExpresion, isBreakInstruction(lastExpresion));
                    if (isBreakInstruction(lastExpresion)
                    
                     || isSectionFallthrough(lastExpresion)
                    ) {
                        // [source]
                        //      if (x)
                        //          /*thenStatement*/
                        //      else
                        //          /*elseStatement*/
                        //
                        // [intermediate]
                        //  .brfalse elseLabel, (x)
                        //      /*thenStatement*/
                        //  .br endLabel
                        //  .mark elseLabel
                        //      /*elseStatement*/
                        //  .mark endLabel
                        const statements: ts.Statement[] = [];

                        const endLabel = isBreakInstruction(lastExpresion) ? getBreakInstructionLabel(lastExpresion) : breakLabel;
                        console.log('result label is ', breakLabel, endLabel, );
                        const thenSection = sections.filter(s => (parseInt(s.index) > parseInt(current.index)) && (parseInt(s.index) < breakLabel));
                        const elseSection = sections.filter(s => (parseInt(s.index) >= breakLabel) && (parseInt(s.index) < endLabel));

                        console.log('->  then section is ', thenSection.length, thenSection.map(s => s.index));
                        console.log('->  else section is ', elseSection.length, elseSection.map(s => s.index));
                        if (thenSection.length <= 1 && elseSection.length <= 1) {
                            thenSection.forEach(s => s.merged = true);
                            elseSection.forEach(s => s.merged = true);

                            const thenStatements = [
                                ...current.statements.slice(lastBrFalse + 1),
                                ...thenSection.reduce((pre, s) => pre.concat(s.statements), [] as ts.Statement[]),
                            ].slice(0, -1);
                            const elseStatement = elseSection.reduce((pre, s) => pre.concat(s.statements), [] as ts.Statement[]);
                            // build if | else here
                            const condition = positiveExpression(lastBrFalseNode.expression, factory);
                            const ifStatement = factory.createIfStatement(
                                condition,
                                factory.createBlock(thenStatements),
                                elseStatement.length ? factory.createBlock(elseStatement) : undefined,
                            );
                            statements.push(...current.statements.slice(0, lastBrFalse), ifStatement);
                            current.statements = statements;
                        }
                    } else {
                        console.log('->  wtf?', isSectionFallthrough(lastExpresion));
                        if (isSectionFallthrough(lastExpresion)) {
                            console.log('->  wtf?', current.index, breakLabel);

                            const thenSection = sections.filter(s => (parseInt(s.index) >= breakLabel) && (parseInt(s.index) < breakLabel));
                            const elseSection = sections.filter(s => (parseInt(s.index) > parseInt(current.index)) && (parseInt(s.index) < breakLabel));

                            console.log('->  then section is ', thenSection.length, thenSection.map(s => s.index));
                            console.log('->  else section is ', elseSection.length, elseSection.map(s => s.index));

                            
                        }
                    }
                }
                preSection.push(current);
                return preSection;
            }, [] as AwaitSection[]);
        }

        function hasBreak(sections: AwaitSection[]): boolean {
            try {
                sections.some(s => s.statements.some(s => {
                    function visitor(node: ts.Node): ts.Node {
                        if (isBreakInstruction(node)) {
                            throw { breakFlag: true };
                        }
                        return ts.visitEachChild(node, visitor, context);
                    }
                    ts.visitEachChild(s, visitor, context);
                }));
            } catch (error: any) {
                if (error.breakFlag) {
                    return true;
                } else {
                    throw error;
                }
            }
            return false;
        }
        function joinSections() {
            sections.forEach(s => {
                console.log('from', s.index, 'to', s.breakTo);
                if (s.hasLoop) {
                    throw new Error("not support loop");
                }
            });

            let _sections = joinYields(sections);
            let count = 0;
            while (hasBreak(_sections)) {
                _sections = joinTry(_sections);
                _sections = joinIf(_sections);
                count += 1;
                console.log('loop count', count);
                
                if (count > 2) {
                    break;
                }
            }

            return _sections;
        }
        return {
            labels,
            sections,
            freeStatements,
            joinSections,
            updateInstruction
        }
    }

    interface Awaiter extends Omit<ts.CallExpression, 'arguments'> {
        expression: { right: { name: { text: '__awaiter' } & ts.Identifier } & ts.PropertyAccessExpression } & ts.ParenthesizedExpression;
        arguments: [ts.Node, ts.Node, ts.Node, ts.FunctionExpression];
    }
    function isAwaiterBody(node: ts.Node): node is Awaiter {
        return isParenthesizedNamedCallExpression('__awaiter', node)
            && node.arguments.length == 4
            && ts.isFunctionExpression(node.arguments[3])
            && node.arguments[3].body.statements.some(s => {
                return ts.isReturnStatement(s)
                    && s.expression
                    && isParenthesizedNamedCallExpression('__generator', s.expression)
            })
    }
    function getAwaiterBody(node: Awaiter): ts.Statement[] {
        return [...((node.arguments[3] as ts.FunctionExpression).body.statements)];
    }

    function _transformer(_node: ts.Node): ts.Node {
        let transformedNode = _node;
        let awaiterBody: ts.Statement[] = [];
        if (
            (ts.isFunctionDeclaration(transformedNode)
                || ts.isFunctionExpression(transformedNode)
                || ts.isArrowFunction(transformedNode)
                || ts.isMethodDeclaration(transformedNode)
            )
            && transformedNode.body
            && (
                ts.isBlock(transformedNode.body)
                && transformedNode.body.statements.slice(-1).some((s) => {
                    return ts.isReturnStatement(s)
                        && s.expression
                        && isAwaiterBody(s.expression);
                })
                || isAwaiterBody(transformedNode.body)
            )
        ) {
            if (ts.isBlock(transformedNode.body)) {
                freeStatements.push(...transformedNode.body.statements.slice(0, -1));
                const body = transformedNode.body.statements.slice(-1)[0] as ts.ReturnStatement;
                awaiterBody = getAwaiterBody(body.expression as Awaiter);
            } else {
                awaiterBody = getAwaiterBody(transformedNode.body);
            }

            const { labels, updateInstruction, joinSections } = getUpdateInstruction();
            const asyncFunction = ts.visitEachChild(_node, updateInstruction, context);

            const body: ts.Statement[] = [];

            if (freeStatements.length > 0) {
                body.push(...freeStatements);
            }
            if (!labels.length) {
                const generateBody = getGenerateBody(awaiterBody, factory);
                body.push(
                    ...generateBody,
                );
            } else {
                const sections = joinSections();
                body.push(...awaiterBody.slice(0, -1));
                sections.forEach(s => {
                    const node = factory.createEmptyStatement();
                    ts.addSyntheticLeadingComment(node, ts.SyntaxKind.MultiLineCommentTrivia, `label ${s.index}`, true);
                    body.push(node);
                    body.push(...s.statements);
                });
            }

            body.forEach((s, i, total) => {
                if (!s) {
                    throw new Error(`body[${i}] is null, ${body.length}`);
                }
            })
            const modifiers = [
                ...(transformedNode.modifiers || []).filter(m => m.kind !== ts.SyntaxKind.AsyncKeyword),
                factory.createModifier(ts.SyntaxKind.AsyncKeyword),
            ];

            // const transformed = removeSectionFallthrough(mapReturnInsturctions(factory.createBlock(body), context), context) as ts.Block;
            const transformed = mapReturnInsturctions(factory.createBlock(body), context) as ts.Block;

            if (ts.isFunctionDeclaration(transformedNode)) {
                return factory.createFunctionDeclaration(
                    transformedNode.decorators,
                    modifiers,
                    transformedNode.asteriskToken,
                    transformedNode.name,
                    transformedNode.typeParameters,
                    transformedNode.parameters,
                    transformedNode.type,
                    transformed
                );
            }
            if (ts.isFunctionExpression(transformedNode)) {
                return factory.createFunctionExpression(
                    modifiers,
                    transformedNode.asteriskToken,
                    transformedNode.name,
                    transformedNode.typeParameters,
                    transformedNode.parameters,
                    transformedNode.type,
                    transformed
                );
            }
            if (ts.isArrowFunction(transformedNode)) {
                return factory.createArrowFunction(
                    modifiers,
                    transformedNode.typeParameters,
                    transformedNode.parameters,
                    transformedNode.type,
                    transformedNode.equalsGreaterThanToken,
                    transformed
                );
            }
            if (ts.isMethodDeclaration(transformedNode)) {
                return factory.createMethodDeclaration(
                    transformedNode.decorators,
                    modifiers,
                    transformedNode.asteriskToken,
                    transformedNode.name,
                    transformedNode.questionToken,
                    transformedNode.typeParameters,
                    transformedNode.parameters,
                    transformedNode.type,
                    transformed
                );
            }
            return asyncFunction;
        }
        return ts.visitEachChild(_node, _transformer, context);
    }
    return (_transformer as unknown) as ts.Transformer<ts.SourceFile>;
}


export function reverseAsyncAwait(context: ts.TransformationContext) {
    const factory = context.factory;

    function _transformer(_node: ts.Node): ts.Node {
        let transformedNode = _node;

        return ts.visitEachChild(_node, _transformer, context);
    }
    return (_transformer as unknown) as ts.Transformer<ts.SourceFile>;
}

if (require.main === module) {
    // simple yield
    const source = `
function openDebugForm(e, t) {
    return (0, n.__awaiter)(this, undefined, undefined, function () {
      let a;
      return (0, n.__generator)(this, function (l) {
        switch (l.label) {
          case 0: {
            return [
              4,
              this.manager.scaffold(
                {
                  title: "上下文数据",
                  body: [{ ...this.dataViewer, readOnly: !t }],
                },
                { ctx: e },
              ),
            ];
          }
          case 1: {
            a = l.sent();
            if (!(null == t)) {
              t(a.ctx);
            }
            return [2];
          }
        }
      });
    });
  }
`;
    // trys
    const source1 = `
function handleConfirmClick() {
    let e;
    return (0, n.__awaiter)(this, undefined, undefined, function () {
      let t, a, l, i;
      return (0, n.__generator)(this, function (n) {
        switch (n.label) {
          case 0: {
            if (
              !(t =
                null === (e = this.amisScope) || undefined === e
                  ? undefined
                  : e.getComponents()[0])
            ) {
              return [2];
            }
            a = this.props.store;
            n.label = 1;
          }
          case 1: {
            n.trys.push([1, 3, 4, 5]);
            a.setScaffoldBuzy(true);
            return [4, t.doAction({ type: "submit" }, t.props.data, true)];
          }
          case 2: {
            l = n.sent();
            this.handleConfirm([l]);
            return [3, 5];
          }
          case 3: {
            i = n.sent();
            console.log(i.stack);
            a.setScaffoldError(i.message);
            return [3, 5];
          }
          case 4: {
            a.setScaffoldBuzy(false);
            return [7];
          }
          case 5: {
            return [2];
          }
        }
      });
    });
}
`;
    // arrow function
    const source2 = `
const scaffold = function (e, t) {
    return (0, n.__awaiter)(this, undefined, undefined, function () {
      const a = this;
      return (0, n.__generator)(this, (l) => [
        2,
        new Promise((l) => {
          a.store.openScaffoldForm({
            ...e,
            value: e.pipeIn ? e.pipeIn(t) : t,
            callback: l,
          });
        }),
      ]);
    });
}
`;
    // condition yield
    const source3 = `
    handleBlur = () =>
    (0, n.__awaiter)(t, undefined, undefined, function () {
        let e, t, a;
        return (0, n.__generator)(this, function (n) {
            switch (n.label) {
                case 0: {
                    e = this.state;
                    t = e.wrongSchema;
                    a = e.value;
                    return t ? [4, (0, s.prompt)(
                        [
                            {
                                className: "w-full",
                                type: "tpl",
                                label: false,
                                tpl: "当前有部分已更改数据因为格式不正确尚未保存，您确认要丢弃这部分更改吗？",
                            },
                            {
                                type: "switch",
                                label: false,
                                option: "查看更改",
                                name: "diff",
                                value: false,
                            },
                            {
                                visibleOn: "this.diff",
                                label: false,
                                type: "diff-editor",
                                allowFullscreen: true,
                                disabled: true,
                                name: "newValue",
                                size: "xxl",
                                language: "json",
                                diffValue: "\${oldValue}",
                            },
                        ],
                        { oldValue: a, newValue: t },
                        "请确认",
                    ),
                    ]
                        : [2];
                }
                case 1: {
                    n.sent()
                        ? this.setState({
                            wrongSchema: "",
                            contents: JSON.stringify(a),
                        })
                        : this.editor.focus();
                    return [2];
                }
            }
        });
    });

`;
    // misc condition
    const source4 = `
const insert = function () {
    return (0, n.__awaiter)(this, undefined, undefined, function () {
      let e;
      let t;
      let a;
      let l;
      let i;
      let o;
      let r;
      return (0, n.__generator)(this, function (n) {
        switch (n.label) {
          case 0: {
            e = this.store;
            return (t = e.selectedInsertRendererInfo)
              ? ((a = e.insertId),
                (l = e.insertRegion),
                (i = e.insertBeforeId),
                (o = t.scaffold || { type: t.type }),
                t.scaffoldForm ? [4, this.scaffold(t.scaffoldForm, o)] : [3, 2])
              : [2];
          }
          case 1: {
            o = n.sent();
            n.label = 2;
          }
          case 2: {
            if ((r = this.addChild(a, l, o, i, t))) {
              e.closeInsertPanel();
              setTimeout(() => {
                e.setActiveId(r.$$id);
              }, 100);
            }
            return [2];
          }
        }
      });
    });
  };
`;

    // if
    const source5 = `
const drop = function (e) {
    return (0, n.__awaiter)(this, undefined, undefined, function () {
      let e, t, a, i, o, r;
      return (0, n.__generator)(this, function (n) {
        switch (n.label) {
          case 0: {
            e = this.store;
            t = this.dndMode.getDropBeforeId();
            return "move" !== e.dragMode
              ? [3, 1]
              : (this.manager.move(e.dropId, e.dropRegion, e.dragId, t),
                [3, 4]);
          }
          case 1: {
            return "copy" !== e.dragMode
              ? [3, 4]
              : ((a = e.dragSchema),
                (i = e.dropId),
                (o = e.dropRegion),
                (r = undefined),
                "subrenderer" !== e.dragType
                  ? [3, 3]
                  : (
                      null ==
                      (r = (0, l.default)(
                        e.subRenderers,
                        ({ id }) => id === e.dragId,
                      ))
                        ? undefined
                        : r.scaffoldForm
                    )
                  ? [4, this.manager.scaffold(r.scaffoldForm, a)]
                  : [3, 3]);
          }
          case 2: {
            a = n.sent();
            n.label = 3;
          }
          case 3: {
            this.manager.addChild(i, o, a, t, r, {
              id: e.dragId,
              type: e.dragType,
              data: e.dragSchema,
            });
            n.label = 4;
          }
          case 4: {
            return [2];
          }
        }
      });
    });
}
`;

    // testTransformer(source, [fixAsyncAwait]);
    // testTransformer(source1, [fixAsyncAwait]);
    // testTransformer(source2, [fixAsyncAwait]);
    // testTransformer(source3, [fixAsyncAwait]);
    testTransformer(source5, [fixAsyncAwait]);
}
