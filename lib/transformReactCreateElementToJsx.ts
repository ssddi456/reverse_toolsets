import * as ts from "typescript";
import { makeTransformerFactory, testTransformer } from "./utils";



export function isReactCreateElement(node: ts.Node): node is ts.CallExpression {
    if (ts.isCallExpression(node)) {
        const expression = node.expression;
        if (ts.isPropertyAccessExpression(expression)
            && ts.isIdentifier(expression.name)
            && expression.name.getText() == 'createElement') {
            return true;
        }
    }
    return false;
}

export function transformCreateElementToJsx(node: ts.CallExpression) {
    const factory = ts.factory;
    const args = node.arguments;
    const tagName = (() => {
        const node = args[0];
        if (ts.isIdentifier(node)) {
            return node;
        }
        if (ts.isStringLiteral(node)) {
            return ts.factory.createIdentifier(node.text);
        }

        return node as ts.JsxTagNamePropertyAccess;
    })();
    const attributes = (() => {
        const attrs = args[1];
        if (!attrs) {
            return ts.factory.createJsxAttributes([]);
        }
        if (ts.isObjectLiteralExpression(attrs)) {
            return factory.createJsxAttributes(
                (attrs.properties).map((p) => {
                    if (ts.isPropertyAssignment(p)) {
                        const name = ts.isStringLiteral(p.name) ? p.name.text : p.name.getText();
                        const attr = factory.createJsxAttribute(
                            ts.factory.createIdentifier(name),
                            factory.createJsxExpression(undefined, (p as any).initializer as ts.Expression)
                        );
                        return attr;
                    }
                    if (ts.isMethodDeclaration(p)) {
                        ts.isMethodDeclaration;
                        return factory.createJsxAttribute(
                            p.name as ts.Identifier,
                            factory.createJsxExpression(undefined,
                                factory.createFunctionExpression(
                                    p.modifiers,
                                    p.asteriskToken,
                                    undefined,
                                    p.typeParameters,
                                    p.parameters,
                                    p.type,
                                    p.body!
                                )
                            )
                        );
                    }
                    if (ts.isShorthandPropertyAssignment(p)) {
                        return factory.createJsxAttribute(
                            p.name as ts.Identifier,
                            factory.createJsxExpression(undefined, (p as any).name as ts.Identifier)
                        );
                    }
                    if (ts.isSpreadAssignment(p)) {
                        return factory.createJsxSpreadAttribute(
                            factory.createJsxExpression(undefined, (p as any).expression as ts.Expression)
                        );
                    }
                    return factory.createJsxAttribute(
                        p.name as ts.Identifier,
                        factory.createJsxExpression(undefined, (p as any).initializer as ts.Expression)
                    );
                })
            );
        }
        if (attrs.kind === ts.SyntaxKind.NullKeyword) {
            return factory.createJsxAttributes([]);
        }
        return factory.createJsxAttributes([
            factory.createJsxSpreadAttribute(attrs)
        ]);
    })();
    const children = args.slice(2).map(x => {
        if (ts.isJsxElement(x)) {
            return x;
        }
        return factory.createJsxExpression(undefined, x as ts.Expression);
    }) as any;
    const jsx = children.length
        ? factory.createJsxElement(
            factory.createJsxOpeningElement(tagName, undefined, attributes),
            children,
            factory.createJsxClosingElement(tagName)
        )
        : factory.createJsxSelfClosingElement(tagName, undefined, attributes);

    return jsx;
}


export const transformReactCreateElementToJsx = makeTransformerFactory(isReactCreateElement, transformCreateElementToJsx);

if (require.main === module) {


    const source1 = `
const someItem = a?o.default.createElement(
    "div",
    { className: "aeDataChain" },
    o.default.createElement(
        "div",
        { className: "aeDataChain-aside" },
        o.default.createElement(
            "ul",
            null,
            p.map((e, t) =>
                o.default.createElement(
                    "li",
                    {
                        className: t === i ? "is-active" : "",
                        key: t,
                        onClick() {
                            return s(t);
                        },
                    },
                    0 === t ? "当前" : 1 === t ? "上层" : \`上\${t}层\`,
                ),
            ),
        ),
    ),
    o.default.createElement(
        "div",
        { className: "aeDataChain-main" },
        o.default.createElement(r.default, {
            name: !1,
            src: p[i],
            "data-value": 1,
            enableClipboard: !1,
            iconStyle: "square",
            onAdd: 0 === i && !n && c,
            onEdit: 0 === i && !n && c,
            onDelete: 0 === i && !n && c,
            collapsed: 2,
        }),
    ),
) : null;
`;
    const source2 = `
o.default.createElement(
    "div",
    { className: "aeDataChain" },
    o.default.createElement(
        "div",
        { className: "aeDataChain-aside" },
        o.default.createElement(
            "ul",
            null,
            p.map((e, t) =>
                o.default.createElement(
                    "li",
                    {
                        className: t === i ? "is-active" : "",
                        key: t,
                        onClick() {
                            return s(t);
                        },
                    },
                    0 === t ? "当前" : 1 === t ? "上层" : \`上\${t}层\`,
                ),
            ),
        ),
    ),
);
i.default.createElement(
    o.component,
    (0, n.__assign)(
      {},
      l,
      null == a ? void 0 : a.state,
      { $$editor: t },
      t.wrapperProps,
      { ref: this.refFn },
    ),
);
`;


    testTransformer(source2, [transformReactCreateElementToJsx,]);
}