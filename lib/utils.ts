
import * as ts from "typescript";
import * as fs from "fs";
import { createSourceFile } from "./compiler";
import { VisitResult } from "typescript";

export function findNeareastParentWithType(
    target: ts.Node,
    test: (node: ts.Node) => boolean
): ts.Node | undefined {
    while (target.parent) {
        if (test(target.parent)) {
            return target.parent;
        }
        target = target.parent;
    }
    return undefined;
}

export function findFareastParentWithType(
    target: ts.Node,
    test: (node: ts.Node) => boolean
): ts.Node | undefined {
    let found: ts.Node | undefined;
    while (target.parent) {
        if (test(target.parent)) {
            found = target.parent;
        }
        target = target.parent;
    }
    return found;
}

// 这里是不是第一个存疑
export function findDescendantWithType(
    target: ts.Node,
    test: (node: ts.Node) => boolean
): ts.Node | undefined {
    let found: ts.Node | undefined;
    ts.transform(target, [function (context: ts.TransformationContext) {
        return function (node) {
            function visit(node: ts.Node): ts.Node | undefined {
                if (test(node)) {
                    found = node;
                    return;
                }
                return ts.visitEachChild(node, visit, context);
            }
            return ts.visitEachChild(node, visit, context);
        };
    }]);
    return found;
}

export function findAllDescendantWithType(
    target: ts.Node,
    test: (node: ts.Node) => boolean
) {
    let founds: ts.Node[] = [];
    ts.transform(target, [function (context: ts.TransformationContext) {
        return function (node) {
            function visit(node: ts.Node): ts.Node {
                if (test(node)) {
                    founds.push(node);
                }
                return ts.visitEachChild(node, visit, context);
            }
            return ts.visitEachChild(node, visit, context);
        };
    }]);
    return founds;
}

export const makeFindNodeWithTreeType = (returnRoot = true) => <T extends ts.Node>(
    target: ts.Node,
    tests: Array<
        ((node: ts.Node) => boolean)
        | {
            test: (node: ts.Node) => boolean,
            getChildren(node: ts.Node): ts.Node[],
        }
    >,
    options: {
        onError?: (node: ts.Node | undefined, e: any) => void;
    } = {}
): T[] => {
    let founds: T[] = []

    const tryVisitEachChild: typeof ts.visitEachChild = function (node, visit, context) {
        try {
            return ts.visitEachChild(node, visit, context);
        } catch (e) {
            options.onError?.(node, e);
        }
    }
    function MakeVisitorWithIdx(
        i: number,
        context: ts.TransformationContext,
        startNode?: ts.Node
    ): ts.Visitor {

        const test = tests[i];
        const doTest = function (node: ts.Node) {
            if (typeof test == 'object') {
                return test.test(node);
            }
            return test(node);
        }
        const doGetChildren = function (node: ts.Node) {
            if (typeof test == 'object') {
                const list = test.getChildren(node);
                return list.map(t => ts.factory.createParenthesizedExpression(t as ts.Expression));
            }
            return [node];
        }
        const doGetOriginChildren = function (node: ts.Node) {
            if (typeof test == 'object') {
                const list = test.getChildren(node);
                return list;
            }
            return [node];
        }
        let visit: ts.Visitor;
        if (i == tests.length - 1) {
            // console.log('last visitor', i);

            visit = function (node: ts.Node): VisitResult<ts.Node> {
                if (node && node.kind && doTest(node)) {
                    // console.log('last hit', !!startNode);
                    if (returnRoot) {
                        founds.push(startNode as T);
                    } else {
                        doGetOriginChildren(node).forEach(t => founds.push(t as T));
                    }
                    return;
                }
                return tryVisitEachChild(node, visit, context);
            };
        } else if (i == 0) {
            // console.log('start visitor');
            visit = function (node: ts.Node) {
                if (node && node.kind && doTest(node)) {
                    // console.log('start hit !');
                    doGetChildren(node).forEach(
                        child => tryVisitEachChild(
                            child,
                            MakeVisitorWithIdx(i + 1, context, node),
                            context
                        )
                    );
                } else {
                    return tryVisitEachChild(node, visit, context);
                }
            };
        } else {
            // console.log('process visitor', i);
            visit = function (node: ts.Node) {
                if (node && node.kind && doTest(node)) {
                    // console.log('process hit', i);
                    doGetChildren(node).forEach(
                        child => tryVisitEachChild(
                            child,
                            MakeVisitorWithIdx(i + 1, context, startNode),
                            context
                        )
                    );
                } else {
                    return tryVisitEachChild(node, visit, context);
                }
            };
        }
        return visit;
    }
    ts.transform(target, [function (context: ts.TransformationContext) {
        return function (node) {
            return ts.visitEachChild(node,
                MakeVisitorWithIdx(0, context),
                context);
        };
    }]);
    return founds;
}


export const findNodeWithTreeTypeChildren = makeFindNodeWithTreeType(false);
export const findNodeWithTreeType = makeFindNodeWithTreeType();

export function logSyntaxKind(node: ts.Node) {
    return ts.SyntaxKind[node.kind];
}


export async function doCompile(source: string) {
    return new Promise<ReturnType<typeof createSourceFile>>(resolve => {

        fs.readFile(source, 'utf8', (err, data) => {
            if (err) {
                throw err;
            }

            resolve(createSourceFile({
                ...ts,
                tsAstViewer: {
                    packageName: ts.version,
                    cachedSourceFiles: {},
                }
            }, data, ts.ScriptTarget.ES2015, ts.ScriptKind.JS));
        })
    });
}


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
                        ts.isMethodDeclaration
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
                        )
                    }
                    if (ts.isSpreadAssignment(p)) {
                        return factory.createJsxSpreadAttribute(
                            factory.createJsxExpression(undefined, (p as any).expression as ts.Expression)
                        )
                    }
                    return factory.createJsxAttribute(
                        p.name as ts.Identifier,
                        factory.createJsxExpression(undefined, (p as any).initializer as ts.Expression)
                    )
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
`;
    const sourceFile = ts.createSourceFile('test.tsx', source1, ts.ScriptTarget.ES2015, true, ts.ScriptKind.TSX);


    const transformed = ts.transform(sourceFile, [function (context) {
        function transformer(node: ts.Node) {
            const transformedNode: ts.Node = ts.visitEachChild(node, transformer, context);

            if (isReactCreateElement(transformedNode)) {
                return transformCreateElementToJsx(transformedNode);
            }

            return transformedNode;
        }

        return transformer;
    }]);


    const printer = ts.createPrinter();
    const prettier = require('prettier');
    console.log(
        // printer.printFile(sourceNode)
        prettier.format(printer.printFile(transformed.transformed[0] as ts.SourceFile), {
            parser: 'typescript',
            trailingComma: 'all'
        })
    );
}