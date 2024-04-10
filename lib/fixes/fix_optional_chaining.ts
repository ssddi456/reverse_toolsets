import * as ts from "typescript";
import { testTransformer } from "../utils";


export function fixOptionalChaining(context: ts.TransformationContext) {
    const factory = context.factory;
    function _transformer(_node: ts.Node): ts.Node {
        let transformedNode = ts.visitEachChild(_node, _transformer, context);
        // (null === x || void 0 === x ? void 0 : x
        if (ts.isConditionalExpression(transformedNode)

            && ts.isVoidExpression(transformedNode.whenTrue)

            && ts.isBinaryExpression(transformedNode.condition)
            && transformedNode.condition.operatorToken.kind === ts.SyntaxKind.BarBarToken

            && ts.isBinaryExpression(transformedNode.condition.left)
            && transformedNode.condition.left.operatorToken.kind === ts.SyntaxKind.EqualsEqualsEqualsToken
            && transformedNode.condition.left.left.kind === ts.SyntaxKind.NullKeyword

            && ts.isBinaryExpression(transformedNode.condition.right)
            && transformedNode.condition.right.operatorToken.kind === ts.SyntaxKind.EqualsEqualsEqualsToken
            && ts.isVoidExpression(transformedNode.condition.right.left)
        ) {

            if (ts.isPropertyAccessExpression(transformedNode.whenFalse)) {
                const expression = (() => {
                    if (ts.isIdentifier(transformedNode.condition.left.right)) {
                        return transformedNode.condition.left.right;
                    } 
                    // ( = )
                    if (ts.isParenthesizedExpression(transformedNode.condition.left.right)
                        && ts.isBinaryExpression(transformedNode.condition.left.right.expression)
                        && transformedNode.condition.left.right.expression.operatorToken.kind === ts.SyntaxKind.EqualsToken
                    ) {
                        return transformedNode.condition.left.right.expression.right;
                    }
                    
                    return transformedNode.condition.left.right;
                })();

                return factory.createPropertyAccessChain(
                    expression,
                    factory.createToken(ts.SyntaxKind.QuestionDotToken),
                    (transformedNode.whenFalse as ts.PropertyAccessExpression).name
                )
            } else if (ts.isCallExpression(transformedNode.whenFalse)) {
                let _arguments = [...(transformedNode.whenFalse.arguments)];
                const callExpression = transformedNode.whenFalse;
                const expressionNode = transformedNode.condition.left.right;
                const callExpressionMethod = callExpression.expression;

                if (ts.isIdentifier(callExpressionMethod)) {
                    return factory.createCallChain(
                        callExpressionMethod,
                        factory.createToken(ts.SyntaxKind.QuestionDotToken),
                        undefined,
                        _arguments,
                    );
                }

                const expression = (() => {
                    // (x = b)
                    if (ts.isParenthesizedExpression(expressionNode)
                        && ts.isBinaryExpression(expressionNode.expression)
                        && expressionNode.expression.operatorToken.kind === ts.SyntaxKind.EqualsToken
                    ) {
                        // (x = b).x
                        if (ts.isPropertyAccessExpression(expressionNode.expression.right)
                            && ts.isParenthesizedExpression(expressionNode.expression.right.expression)
                            && ts.isBinaryExpression(expressionNode.expression.right.expression.expression)
                            && expressionNode.expression.right.expression.expression.operatorToken.kind === ts.SyntaxKind.EqualsToken
                        ) {
                            return factory.createPropertyAccessExpression(
                                expressionNode.expression.right.expression.expression.right,
                                expressionNode.expression.right.name
                            );
                        }
                        return expressionNode.expression.right;
                    }
                    return expressionNode;
                })();

                if (ts.isPropertyAccessExpression(callExpressionMethod)) {

                    if (ts.isIdentifier(callExpressionMethod.name)
                        && callExpressionMethod.name.text === "call"
                    ) {
                        return factory.createCallChain(
                            expression,
                            factory.createToken(ts.SyntaxKind.QuestionDotToken),
                            undefined,
                            _arguments.slice(1),
                        );
                    } else {
                        return factory.createCallChain(
                            factory.createPropertyAccessChain(
                                expression,
                                factory.createToken(ts.SyntaxKind.QuestionDotToken),
                                callExpressionMethod.name,
                            ),
                            undefined,
                            undefined,
                            _arguments
                        );
                    }

                }
            }
        }

        return transformedNode;
    }
    return (_transformer as unknown) as ts.Transformer<ts.SourceFile>;
}

if (require.main === module) {
    const source = `
i &&
((null ===
(a = null === (t = i.info) || void 0 === t ? void 0 : t.plugin) ||
void 0 === a
? void 0
: a.popOverBody) ||
(null ===
    (l = null === (n = i.info) || void 0 === n ? void 0 : n.plugin) ||
void 0 === l
    ? void 0
    : l.popOverBodyCreator))

null === (a = (t = l.props).envCreator) || void 0 === a
    ? void 0
    : a.call(t, l.props)

null === a || void 0 === a ? void 0 : a.a(1);
null === a || void 0 === a ? void 0 : a(1);
null === (i = (rows || items)) || void 0 === i? void 0 : i.length;
`;
    testTransformer(source, [fixOptionalChaining]);
}