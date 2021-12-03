// Error.stackTraceLimit = Infinity;

import { log } from 'console';
import * as ts from "typescript";
import { isBlockLike, isParenthesizedNamedCallExpression, replaceExpression, testTransformer, updateBlocklike } from "./utils";

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

function makeStatementFromInstuction(node: InstructionNode<string>, factory: ts.NodeFactory): ts.Statement[] {
    const instruction = node.expression.elements[0].text;
    console.log('instruction', instruction);
    switch (instruction) {
        case '2':
            if (node.expression.elements.length === 2) {
                return [
                    factory.createReturnStatement(node.expression.elements[1])
                ];
            } else {
                return [
                    factory.createReturnStatement()
                ];
            }
        case '4': // yield
        case '5': // yield
            return [factory.createExpressionStatement(factory.createAwaitExpression(node.expression.elements[1]))];
        case '1': // break
        case '3': // break
        case '6':
        case '7':
            console.log('instruction', instruction, getInstructionName(parseInt(instruction)));
            return [];
        default:
            throw new Error(`Unknown instruction ${instruction}`);
    }

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
        && node.expression.name.getText() === "sent";
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
        && s.expression.elements.length > 1
        && ts.isNumericLiteral(s.expression.elements[0])
}

function isBreakInstruction(s: ts.Node): s is InstructionNode<'3'> {
    return isInstruction(s)
        && s.expression.elements![0].text === '3';
}
function isYieldInstruction(s: ts.Node): s is InstructionNode<'4' | '5'> {
    return isInstruction(s)
        && (
            s.expression.elements![0].text === '4'
            || s.expression.elements![0].text === '5'
        );
}

function isSectionFallthrough(s: ts.Node): s is ts.ExpressionStatement {
    return ts.isExpressionStatement(s)
        && ts.isBinaryExpression(s.expression)
        && s.expression.operatorToken.kind === ts.SyntaxKind.EqualsToken
        && ts.isNumericLiteral(s.expression.right)
        && ts.isPropertyAccessExpression(s.expression.left)
        && s.expression.left.name.text === "label";
}


function getGenerateBody(statments: ts.Statement[], factory: ts.NodeFactory): ts.Statement[] {
    return statments.map(x => {
        if (ts.isReturnStatement(x)
            && x.expression
            && isParenthesizedNamedCallExpression('__generator', x.expression)
        ) {
            const generateBody = (x.expression.arguments[1] as ts.FunctionLikeDeclaration).body!;
            console.log('generateBody', ts.SyntaxKind[generateBody.kind]);
            if (ts.isArrayLiteralExpression(generateBody)) {
                console.log('??--')
                return factory.createReturnStatement(generateBody);
            }
            if (ts.isBlock(generateBody)) {
                console.log('????');
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
    hasBreak: boolean;
    hasReceiveAwait: boolean;
    hasReturn: boolean;
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
                console.log('!!! ');
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
                console.log('check for labels !!!', labels);
                const transFormed: typeof _node = ts.visitEachChild(_node, updateInstruction, context);
                const statements = transFormed.statements.reduce((pre, x) => {
                    if (ts.isReturnStatement(x)
                        && x.expression
                        && ts.isConditionalExpression(x.expression)
                    ) {
                        pre.push(
                            factory.createIfStatement(
                                x.expression.condition,
                                factory.createBlock([
                                    factory.createReturnStatement(x.expression.whenTrue),
                                ])
                            ),
                            factory.createReturnStatement(
                                x.expression.whenFalse
                            )
                        );
                        return pre;
                    }
                    pre.push(x);
                    return pre;
                }, [] as ts.Statement[]);
                return factory.updateBlock(transFormed as typeof _node, statements)
            }

            if (ts.isReturnStatement(_node)
                && _node.expression
            ) {
                console.log("isReturnStatement", ts.SyntaxKind[_node.expression.kind]);
                if (ts.isArrayLiteralExpression(_node.expression)) {
                    if (ts.isNumericLiteral(_node.expression.elements[0])) {
                        const instruction = getInstructionName(parseInt(_node.expression.elements[0].text));
                        console.log('instruction', instruction);
                        // ts.addSyntheticTrailingComment(_node.expression.elements[0],
                        //     ts.SyntaxKind.MultiLineCommentTrivia,
                        //     getInstructionName(Number(_node.expression.elements[0].getText())), false);
                    }
                }
            }
            if (ts.isCaseClause(_node)) {
                console.log('case', labels);
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
                        section.topYield = section.yieldContainer == sectionRoot;
                        console.log('yield container', !!node.parent);
                    }
                    if (instruction === 'return') {
                        section.hasReturn = true;
                    }
                    if (instruction === 'break') {
                        section.hasBreak = true;
                        const breakLabel = node.expression.elements[1].getText();
                        console.log('===> section.index', parseInt(section.index), parseInt(breakLabel), parseInt(breakLabel) < parseInt(section.index));
                        if (parseInt(breakLabel) < parseInt(section.index)) {
                            console.log('is breakback');
                        }
                        if (parseInt(breakLabel) > parseInt(section.index) + 1) {
                            console.log('is breakforward');
                        }
                    }
                }

                if (ts.isCallExpression(node)
                    && ts.isPropertyAccessExpression(node.expression)
                    && node.expression.name.getText() == 'push'
                    && ts.isPropertyAccessExpression(node.expression.expression)
                    && node.expression.expression.name.getText() == 'trys'
                    && ts.isArrayLiteralExpression(node.arguments[0])
                ) {
                    trycatch = node.arguments[0].elements.map(a => {
                        if (ts.isNumericLiteral(a)) {
                            return parseInt(a.text);
                        }
                        return -1;
                    });
                    console.log('found trys', trycatch);
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

            console.log('trycatch', trycatch);
            if (trycatch.length > 0) {
                section.tryCatch = trycatch;
            }
            return section;
        }


        function joinYields(sections: AwaitSection[]) {
            return sections.reduce((pre, current, index) => {
                if (current.merged) {
                    console.log('skip merged block');
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
                    console.log('lastExpresion', ts.SyntaxKind[lastExpresion.kind]);
                    console.assert(isInstruction(lastExpresion), `code ${ts.createPrinter().printNode(ts.EmitHint.Unspecified, lastExpresion, factory.createSourceFile(
                        current.statements,
                        factory.createToken(ts.SyntaxKind.EndOfFileToken),
                        ts.NodeFlags.None,
                    )
                    )}`);

                    console.log('current.tryCatch, next.tryCatch', current.tryCatch, next.tryCatch);
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
                        console.log('current.yieldContainer',
                            ts.SyntaxKind[current.yieldContainer.kind],
                            !!current.yieldContainer.parent,
                        );

                        pre.push({
                            ...current,
                            hasYield: false,
                            isBlank: false,
                            tryCatch: current.tryCatch || next.tryCatch,
                            statements: [
                                ...current.statements.map(s => {
                                    return replaceExpression(s, (node) => node === current.yieldContainer,
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
            console.log('before join trys', sections.length);

            return sections.reduce((pre, current, index) => {
                if (current.merged) {
                    console.log('skip merged block');
                    return pre;
                }
                console.log('trycatch', current.tryCatch);
                if (current.tryCatch && current.tryCatch.length > 0) {
                    const tryBlock = sections.filter(s => (parseInt(s.index) >= current.tryCatch![0]) && (parseInt(s.index) < current!.tryCatch![1]));
                    const catchBlock = sections.filter(s => (parseInt(s.index) >= current.tryCatch![1] && parseInt(s.index) < (current!.tryCatch![2] || current!.tryCatch![3])));
                    const finallyBlock = current.tryCatch![2] ? sections.filter(s => (parseInt(s.index) >= current.tryCatch![2] && parseInt(s.index) < current!.tryCatch![3])) : [];

                    tryBlock.slice(1).forEach(t => {
                        t.merged = true;
                    });
                    catchBlock.forEach(c => {
                        c.merged = true;
                    });
                    finallyBlock.forEach(f => {
                        f.merged = true;
                    });

                    pre.push({
                        ...current,
                        tryCatch: undefined,
                        statements: [
                            factory.createTryStatement(
                                factory.createBlock(
                                    tryBlock.reduce((pre, s) => pre.concat(s.statements), [] as ts.Statement[]),
                                ),
                                factory.createCatchClause(
                                    factory.createVariableDeclaration(
                                        factory.createIdentifier('e'),
                                        undefined,
                                        undefined,
                                    ),
                                    factory.createBlock(
                                        catchBlock.reduce((pre, s) => pre.concat(s.statements), [] as ts.Statement[]),
                                    ),
                                ),
                                finallyBlock.length > 0 ? factory.createBlock(
                                    finallyBlock.map(f => f.statements[0]),
                                ) : undefined,
                            )
                        ] as ts.Statement[],
                    });

                } else {
                    pre.push(current);
                }
                return pre;
            }, [] as AwaitSection[]);
        }

        function joinSections() {
            console.log('before joinSections', sections.length);
            sections.map(s => {
                console.log('section', s.index, s.tryCatch);
            });
            const noYields = joinYields(sections);
            return joinTry(noYields);
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
            console.log('found labels ', labels);

            const body: ts.Statement[] = [];

            if (freeStatements.length > 0) {
                body.push(...freeStatements);
            }
            if (!labels.length) {
                const generateBody = getGenerateBody(awaiterBody, factory);
                body.push(
                    ...generateBody.slice(0, -1),
                    ...makeStatementFromInstuction(generateBody[generateBody.length - 1] as InstructionNode<string>, factory)
                );
            } else {
                const sections = joinSections();
                console.log('after join sections', sections.length);

                sections.forEach(s => {
                    console.log('section.statements', s.statements.length, body.length, s.index);
                    body.push(...s.statements.reduce((pre, s) => {
                        if (isInstruction(s)) {
                            pre.push(...makeStatementFromInstuction(s, factory));
                        } else {
                            pre.push(s);
                        }
                        return pre;
                    }, [] as ts.Statement[]));
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

            if (ts.isFunctionDeclaration(transformedNode)) {
                return factory.createFunctionDeclaration(
                    transformedNode.decorators,
                    modifiers,
                    transformedNode.asteriskToken,
                    transformedNode.name,
                    transformedNode.typeParameters,
                    transformedNode.parameters,
                    transformedNode.type,
                    factory.createBlock(body)
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
                    factory.createBlock(body)
                );
            }
            if (ts.isArrowFunction(transformedNode)) {
                return factory.createArrowFunction(
                    modifiers,
                    transformedNode.typeParameters,
                    transformedNode.parameters,
                    transformedNode.type,
                    transformedNode.equalsGreaterThanToken,
                    factory.createBlock(body)
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
                    factory.createBlock(body)
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
    testTransformer(source1, [fixAsyncAwait]);
}
