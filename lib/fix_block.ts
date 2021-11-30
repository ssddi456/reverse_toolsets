import * as ts from "typescript";
import { fixOptionalChaining } from "./fix_optional_chaining";
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
            ts.isDefaultClause(transformedNode)
            && (transformedNode.statements.length > 1
                || !ts.isBlock(transformedNode.statements[0])
            )
        ) {
            console.log("fix case block");
            return factory.updateDefaultClause(transformedNode, [
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
    console.log('expandCommaExpression', ts.SyntaxKind[node.kind]);

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

export function expandStatements(statements: ts.Statement[], factory: ts.NodeFactory) {
    return statements
        .reduce((pre, s) => {
            if (ts.isExpressionStatement(s)) {
                console.log('expression', ts.SyntaxKind[s.expression.kind]);
                if (ts.isBinaryExpression(s.expression)
                    && s.expression.operatorToken.kind === ts.SyntaxKind.CommaToken
                ) {
                    console.log('binarry ,');

                    const temp: ts.Statement[] = [];
                    expandCommaExpression(s.expression, temp, factory);
                    pre.push(...expandStatements(temp, factory));
                } else if (ts.isBinaryExpression(s.expression)
                    && s.expression.operatorToken.kind === ts.SyntaxKind.AmpersandAmpersandToken
                ) {
                    console.log('binarry &&');

                    pre.push(
                        factory.createIfStatement(
                            s.expression.left,
                            factory.createBlock(expandStatements([
                                factory.createExpressionStatement(s.expression.right)
                            ], factory), true),
                            undefined
                        )
                    );
                } else if (ts.isBinaryExpression(s.expression)
                    && s.expression.operatorToken.kind === ts.SyntaxKind.BarBarToken
                ) {
                    console.log('binarry ||');
                    pre.push(
                        factory.createIfStatement(
                            factory.createLogicalNot(s.expression.left),
                            factory.createBlock(expandStatements([
                                factory.createExpressionStatement(s.expression.right)
                            ], factory), true),
                            undefined
                        )
                    );
                } else if (
                    s.expression
                    && ts.isParenthesizedExpression(s.expression)
                ) {
                    console.log('parenthesized');
                    const temp: ts.Statement[] = [];
                    expandCommaExpression(s.expression.expression, temp, factory);
                    console.log('temp', temp.length)
                    pre.push(...expandStatements(temp, factory));
                } else {
                    console.log('wtff??', ts.SyntaxKind[s.expression.kind]);
                    pre.push(s);
                }
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
                    pre.push(...(expandStatements(temp, factory)));
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
                    pre.push(...expandStatements(temp, factory));
                } else {
                    pre.push(s);
                }
            } else {
                pre.push(s);
            }

            return pre;
        },
            [] as ts.Statement[])
}

export function transformExpandStatement(context: ts.TransformationContext) {
    const factory = context.factory;
    function _transformer(_node: ts.Node): ts.Node {
        let transformedNode = _node;

        if (
            ts.isBlock(transformedNode)
            || ts.isSourceFile(transformedNode)
            || ts.isModuleBlock(transformedNode)
        ) {
            const statements = expandStatements([...transformedNode.statements], factory);

            if (ts.isBlock(transformedNode)) {
                transformedNode = factory.updateBlock(transformedNode, statements);
            } else if (ts.isSourceFile(transformedNode)) {
                transformedNode = factory.updateSourceFile(transformedNode,
                    statements,
                    transformedNode.isDeclarationFile,
                    transformedNode.referencedFiles,
                    transformedNode.typeReferenceDirectives,
                    transformedNode.hasNoDefaultLib,
                    transformedNode.libReferenceDirectives);
            } else if (ts.isModuleBlock(transformedNode)) {
                transformedNode = factory.updateModuleBlock(transformedNode, statements);
            }
        }

        if (ts.isArrowFunction(transformedNode)
        && ts.isParenthesizedExpression(transformedNode.body)
        && ts.isBinaryExpression(transformedNode.body.expression)
        && transformedNode.body.expression.operatorToken.kind === ts.SyntaxKind.CommaToken
        ) {
            const expression = transformedNode.body.expression;
            const body: ts.Statement[] = [];
            expandCommaExpression(expression.left, body, factory);
            body.push(...expandStatements(body, factory));
            body.push(factory.createReturnStatement(expression.right));
            transformedNode = factory.updateArrowFunction(transformedNode,
                transformedNode.modifiers,
                transformedNode.typeParameters,
                transformedNode.parameters,
                transformedNode.type,
                transformedNode.equalsGreaterThanToken,
                factory.createBlock(body, true),
            );
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

(r = this.addChild(a, l, o, i, t)) &&
    (e.closeInsertPanel(),
    setTimeout(() => {
        e.setActiveId(r.$$id);
    }, 100))

(n) => (
(t = []),
(
null ==
(i = rows || items)
    ? void 0
    : i.length
)
? (Object.keys(
        i[0]
    ).forEach((e) => {
        i[0][e],
            t.push({
                label: e,
                type:
                    "text",
                name: e,
            });
    }),
    formStore.setValues(
        { columns: t }
    ),
    formStore.setValues(
        {
            filterSettingSource: t.map(
                ({
                    name,
                }) =>
                    name
            ),
        }
    ))
: l.toast.warning(
        '   No data to display   '
    ),
[2]
)
`;
    testTransformer(source1, [transformFixBlock, transformExpandStatement, fixOptionalChaining]);
}
