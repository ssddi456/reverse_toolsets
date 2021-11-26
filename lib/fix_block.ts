import * as ts from "typescript";
import { testTransformer } from "./utils";


export function transformFixBlock(context: ts.TransformationContext) {
    const factory = context.factory;
    function _transformer(_node: ts.Node) {
        const transformedNode: ts.Node = ts.visitEachChild(_node, _transformer, context);

        if (
            ts.isCaseClause(transformedNode)
            && (transformedNode.statements.length > 1
                || !ts.isBlock(transformedNode.statements[0])
            )
        ) {
            console.log("fix case block");
            return factory.updateCaseClause(transformedNode, transformedNode.expression, [
                factory.createBlock(transformedNode.statements, true)
            ]);
        } else if (
            ts.isIfStatement(transformedNode)
            && (!ts.isBlock(transformedNode.thenStatement)
                || (
                    transformedNode.elseStatement
                    && (!ts.isBlock(transformedNode.elseStatement) && !ts.isIfStatement(transformedNode.elseStatement))
                )
            )
        ) {
            console.log("fix if block");
            return factory.updateIfStatement(transformedNode, transformedNode.expression,
                ts.isBlock(transformedNode.thenStatement) ? transformedNode.thenStatement : factory.createBlock([transformedNode.thenStatement], true),
                transformedNode.elseStatement
                    ? (
                        (!ts.isBlock(transformedNode.elseStatement) && !ts.isIfStatement(transformedNode.elseStatement))
                            ? factory.createBlock([
                                transformedNode.elseStatement
                            ], true)
                            : transformedNode.elseStatement
                    ) : undefined);
        }

        return transformedNode;
    }
    return (_transformer as unknown) as ts.Transformer<ts.SourceFile>;
};

export function expandCommaExpression(node: ts.Expression, container: ts.Statement[], factory: ts.NodeFactory) {
    let currentNode: ts.Expression = node;
    while (
        currentNode
        && ts.isBinaryExpression(currentNode)
        && currentNode.operatorToken.kind === ts.SyntaxKind.CommaToken
    ) {
        container.unshift(

            factory.createExpressionStatement(currentNode.right)
        );


        currentNode = currentNode.left;
    }
    container.unshift(factory.createExpressionStatement(currentNode));
}

export function transformExpandComma(context: ts.TransformationContext) {
    const factory = context.factory;
    function _transformer(_node: ts.Node): ts.Node {
        let transformedNode = _node;

        if (
            ts.isBlock(transformedNode)
        ) {
            console.log("fix case block");
            transformedNode = factory.updateBlock(transformedNode,
                transformedNode.statements
                    .reduce((pre, s) => {
                        if (ts.isExpressionStatement(s)
                            && ts.isBinaryExpression(s.expression)
                            && s.expression.operatorToken.kind === ts.SyntaxKind.CommaToken
                        ) {
                            const temp: ts.Statement[] = [];
                            expandCommaExpression(s.expression, temp, factory);
                            pre.push(...temp);
                        } else if (ts.isReturnStatement(s)
                            && s.expression
                        ) {
                            if (
                                ts.isBinaryExpression(s.expression)
                                && s.expression.operatorToken.kind === ts.SyntaxKind.CommaToken
                            ) {
                                const temp: ts.Statement[] = [];
                                temp.unshift(
                                    factory.updateReturnStatement(s, s.expression.right)
                                );
                                expandCommaExpression(s.expression.left, temp, factory);
                                pre.push(...temp);
                            } else if (
                                ts.isParenthesizedExpression(s.expression)
                                && ts.isBinaryExpression(s.expression.expression)
                                && s.expression.expression.operatorToken.kind === ts.SyntaxKind.CommaToken
                            ) {
                                const temp: ts.Statement[] = [];
                                temp.unshift(
                                    factory.updateReturnStatement(s, s.expression.expression.right)
                                );
                                expandCommaExpression(s.expression.expression.left, temp, factory);
                                pre.push(...temp);
                            } else {
                                pre.push(s);
                            }
                        } else {
                            pre.push(s);
                        }
                        return pre;
                    },
                        [] as ts.Statement[]));
        }
        return ts.visitEachChild(transformedNode, _transformer, context);
    }
    return (_transformer as unknown) as ts.Transformer<ts.SourceFile>;
}

if (require.main === module) {
    const source1 = `
switch (n.label) {
    case 0:
        return (
            (e = this.store),
            (t = e.selectedInsertRendererInfo)
            ? ((a = e.insertId),
                (l = e.insertRegion),
                (i = e.insertBeforeId),
                (o = t.scaffold || { type: t.type }),
                t.scaffoldForm
                ? [4, this.scaffold(t.scaffoldForm, o)]
                : [3, 2])
            : [2]
        );
    case 1:
        (o = n.sent()), (n.label = 2);
    case 2:
        return (
            (r = this.addChild(a, l, o, i, t)) &&
            (e.closeInsertPanel(),
            setTimeout(() => {
                e.setActiveId(r.$$id);
            }, 100)),
            [2]
        );
}
if (some) console.log(1);
if (other) {console.log(2);} else console.log(3);
`;
    testTransformer(source1, [transformFixBlock, transformExpandComma]);
}
