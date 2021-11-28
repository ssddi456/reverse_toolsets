import * as ts from "typescript";
import { testTransformer } from "./utils";


export function fixKeywordShortcut (context: ts.TransformationContext) {
        const factory = context.factory;
        function _transformer(_node: ts.Node): ts.Node {
            let transformedNode = _node;

            if (
                ts.isVoidExpression(transformedNode)
            ) {
                transformedNode = factory.createIdentifier("undefined");
            } else if (
                ts.isPrefixUnaryExpression(transformedNode)
                && transformedNode.operator === ts.SyntaxKind.ExclamationToken
                && ts.isNumericLiteral(transformedNode.operand)
            ) {
                if (transformedNode.operand.text === '0') {
                    transformedNode = factory.createTrue();
                } else {
                    transformedNode = factory.createFalse();
                }
            }
            return ts.visitEachChild(transformedNode, _transformer, context);
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

t.previewSchema = {
    type: "plain",
    text: "这是纯文本",
    className: "text-center",
    inline: !1,
}
`;
    testTransformer(source, [fixKeywordShortcut]);
}