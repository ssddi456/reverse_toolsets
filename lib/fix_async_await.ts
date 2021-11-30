import { isParenthesizedExpression } from "@ts-morph/common/lib/typescript";
import * as ts from "typescript";
import { Node } from "./CompilerApi";
import { expandStatements } from "./fix_block";
import { isParenthesizedNamedCallExpression, testTransformer } from "./utils";

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

function makeStatementFromInstuction(node: Instruction, factory: ts.NodeFactory): ts.Statement[] {
    const instruction = node.expression.elements[0].getText();
    console.log('instruction', instruction);
    switch (instruction) {
        case '2':
            return [factory.createReturnStatement(node.expression.elements[1])];
        case '4': // yield
        case '5': // yield
            return [factory.createExpressionStatement(factory.createAwaitExpression(node.expression.elements[1]))];
        case '1': // break
        case '3': // break
        case '6':
        case '7':
            return [];
        default:
            throw new Error(`Unknown instruction ${instruction}`);
    }

}

function isSentStatement(s: ts.Node): s is ts.ExpressionStatement {
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

function isInstruction(s: ts.Node): s is ts.ReturnStatement {
    return ts.isReturnStatement(s)
        && !!s.expression
        && ts.isArrayLiteralExpression(s.expression)
        && s.expression.elements.length > 1
        && ts.isNumericLiteral(s.expression.elements[0])
}

function isBreakInstruction(s: ts.Node): s is ts.ReturnStatement {
    return isInstruction(s)
        && (s!.expression! as ts.ArrayLiteralExpression).elements![0].getText() === '3';
}

function isSectionFallthrough(s: ts.Node): s is ts.ExpressionStatement {
    return ts.isExpressionStatement(s)
        && ts.isBinaryExpression(s.expression)
        && s.expression.operatorToken.kind === ts.SyntaxKind.EqualsToken
        && ts.isNumericLiteral(s.expression.right)
        && ts.isPropertyAccessExpression(s.expression.left)
        && s.expression.left.name.getText() === "label";
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

interface AwaitSection {
    isBlank: boolean;
    index: string;
    tryCatch: number[]; // [try, catch, finally, next]
    hasBreak: boolean;
    hasReceiveAwait: boolean;
    hasYield: boolean;
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

            if (isParenthesizedNamedCallExpression('__generator', _node)) {
                const transFormed = ts.visitEachChild(_node, updateInstruction, context);
                return factory.updateCallExpression(transFormed,
                    transFormed.expression,
                    transFormed.typeArguments,
                    [
                        transFormed.arguments[0],
                        (factory as any).converters.convertToFunctionExpression(transFormed.arguments[1])
                    ]
                );

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
                } else if (ts.isConditionalExpression(_node.expression)) {
                    return factory.createIfStatement(_node.expression.condition,
                        factory.createBlock(
                            expandStatements([updateInstruction(factory.createReturnStatement(_node.expression.whenTrue)) as ts.ReturnStatement], factory)),
                        factory.createBlock(
                            expandStatements([updateInstruction(factory.createReturnStatement(_node.expression.whenFalse)) as ts.ReturnStatement], factory)
                        ),
                    );
                }
            }
            if (ts.isCaseClause(_node)) {
                // dont process recursive case clauses
                labels.push(_node.expression.getText());
                const sectionInfo = getLoadSectionInfo(_node);
                sections.push(sectionInfo);
            }
            return ts.visitEachChild(_node, updateInstruction, context);
        }

        function getLoadSectionInfo(node: ts.CaseClause) {
            const section = {} as AwaitSection;

            function loadSectionInfo(node: ts.Node): ts.Node {
                node = ts.visitEachChild(node, loadSectionInfo, context);

                if (ts.isCallExpression(node)
                    && ts.isPropertyAccessExpression(node.expression)
                    && node.expression.name.getText() === "sent"
                    && node.arguments.length == 0
                ) {
                    section.hasReceiveAwait = true;
                }

                if (ts.isReturnStatement(node)
                    && node.expression
                    && ts.isArrayLiteralExpression(node.expression)
                    && ts.isNumericLiteral(node.expression.elements[0])
                ) {
                    const instruction = getInstructionName(parseInt(node.expression.elements[0].text));
                    if (instruction === "yield") {
                        section.hasYield = true;
                    }
                    if (instruction === 'return') {
                        section.hasReturn = true;
                    }
                    if (instruction === 'break') {
                        section.hasBreak = true;
                    }
                }
                return node;
            }

            if (node.statements.length <= 2) {
                section.isBlank = !!node.statements.find(s => {
                    return !isSentStatement(s)
                        && !isBreakInstruction(s)
                        && !isSectionFallthrough(s);
                })
            }

            let trycatch: number[] = [];
            node.statements.find(s => {
                if (ts.isCallExpression(s)
                    && ts.isPropertyAccessExpression(s.expression)
                    && s.expression.name.getText() == 'push'
                    && ts.isPropertyAccessExpression(s.expression.expression)
                    && s.expression.expression.name.getText() == 'trys'
                ) {
                    trycatch = s.arguments.map(a => {
                        if (ts.isNumericLiteral(a)) {
                            return parseInt(a.text);
                        }
                        return -1;
                    });
                    return s;
                }
            });

            if (trycatch.length > 0) {
                section.tryCatch = trycatch;
            }

            section.statements = [...node.statements];
            ts.visitEachChild(node, loadSectionInfo, context);

            return section;
        }

        return {
            labels,
            sections,
            freeStatements,
            updateInstruction
        }
    }

    function isAwaiterBody(node: ts.Node): node is ts.CallExpression {
        return isParenthesizedNamedCallExpression('__awaiter', node)
            && node.arguments.length == 4
            && ts.isFunctionExpression(node.arguments[3])
            && node.arguments[3].body.statements.some(s => {
                return ts.isReturnStatement(s)
                    && s.expression
                    && isParenthesizedNamedCallExpression('__generator', s.expression)
            })
    }
    function getAwaiterBody(node: ts.CallExpression): ts.Statement[] {
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
                awaiterBody = getAwaiterBody(body.expression as ts.CallExpression);
                for (let index = 0; index < awaiterBody.length; index++) {
                    const element = awaiterBody[index];
                    if (!ts.isReturnStatement(element)) {
                        freeStatements.push(element);
                    }
                }
            } else {
                awaiterBody = getAwaiterBody(transformedNode.body as ts.CallExpression);
                for (let index = 0; index < awaiterBody.length; index++) {
                    const element = awaiterBody[index];
                    if (!ts.isReturnStatement(element)) {
                        freeStatements.push(element);
                    }
                }
            }

            const { labels, updateInstruction } = getUpdateInstruction();
            const asyncFunction = ts.visitEachChild(_node, updateInstruction, context);
            console.log('found labels ', labels);

            const body: ts.Statement[] = [];

            if (freeStatements.length > 0) {
                body.push(...freeStatements);
            }
            if (!labels.length) {
                const generateBody = getGenerateBody(awaiterBody, factory);
                console.log(
                    generateBody.length,
                    generateBody.map(s => ts.SyntaxKind[s.kind]),
                    isInstruction(generateBody[generateBody.length - 1])
                );
                body.push(
                    ...generateBody.slice(0, -1),
                    ...makeStatementFromInstuction(generateBody[generateBody.length - 1] as Instruction, factory)
                );
            }
            const modifiers = [
                ...(transformedNode.modifiers || []).filter(m => m.kind !== ts.SyntaxKind.AsyncKeyword),
                factory.createModifier(ts.SyntaxKind.AsyncKeyword),
            ];

            return asyncFunction;

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
    const source = `
// function openDebugForm(e, t) {
//     return (0, n.__awaiter)(this, undefined, undefined, function () {
//       let a;
//       return (0, n.__generator)(this, function (l) {
//         switch (l.label) {
//           case 0: {
//             return [
//               4,
//               this.manager.scaffold(
//                 {
//                   title: "上下文数据",
//                   body: [{ ...this.dataViewer, readOnly: !t }],
//                 },
//                 { ctx: e },
//               ),
//             ];
//           }
//           case 1: {
//             a = l.sent();
//             if (!(null == t)) {
//               t(a.ctx);
//             }
//             return [2];
//           }
//         }
//       });
//     });
//   }
// function handleConfirmClick() {
//     let e;
//     return (0, n.__awaiter)(this, undefined, undefined, function () {
//       let t, a, l, i;
//       return (0, n.__generator)(this, function (n) {
//         switch (n.label) {
//           case 0: {
//             if (
//               !(t =
//                 null === (e = this.amisScope) || undefined === e
//                   ? undefined
//                   : e.getComponents()[0])
//             ) {
//               return [2];
//             }
//             a = this.props.store;
//             n.label = 1;
//           }
//           case 1: {
//             n.trys.push([1, 3, 4, 5]);
//             a.setScaffoldBuzy(true);
//             return [4, t.doAction({ type: "submit" }, t.props.data, true)];
//           }
//           case 2: {
//             l = n.sent();
//             this.handleConfirm([l]);
//             return [3, 5];
//           }
//           case 3: {
//             i = n.sent();
//             console.log(i.stack);
//             a.setScaffoldError(i.message);
//             return [3, 5];
//           }
//           case 4: {
//             a.setScaffoldBuzy(false);
//             return [7];
//           }
//           case 5: {
//             return [2];
//           }
//         }
//       });
//     });
// }

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
    testTransformer(source, [fixAsyncAwait]);
}
