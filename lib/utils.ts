
import * as ts from "typescript";
import * as fs from "fs";
import { createSourceFile } from "./compiler";
import { VisitResult } from "typescript";
import { Node } from "./CompilerApi";

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


export function isParenthesizedNamedCallExpression(name: string, node: ts.Node): node is ts.CallExpression {
    if (ts.isCallExpression(node)) {
        const expression = node.expression;
        if (ts.isParenthesizedExpression(expression)
            && ts.isBinaryExpression(expression.expression)
            && expression.expression.operatorToken.kind === ts.SyntaxKind.CommaToken
            && ts.isPropertyAccessExpression(expression.expression.right)
            && expression.expression.right.name.getText() === name
        ) {
            return true;
        }
    }
    return false;
}


export function isParenthesizedAnyCallExpression(node: ts.Node): node is ts.CallExpression {
    if (ts.isCallExpression(node)) {
        const expression = node.expression;
        if (ts.isParenthesizedExpression(expression)
            && ts.isBinaryExpression(expression.expression)
            && expression.expression.operatorToken.kind === ts.SyntaxKind.CommaToken
            && ts.isPropertyAccessExpression(expression.expression.right)
        ) {
            return true;
        }
    }
    return false;
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

export function makeTransformerFactory<T extends ts.Node, F extends ts.Node>(testFunction: (node: ts.Node) => boolean, transformer: (node: T) => F) {
    return (context: ts.TransformationContext) => {
        function _transformer(node: ts.Node) {
            const transformedNode: ts.Node = ts.visitEachChild(node, _transformer, context);

            if (testFunction(transformedNode)) {
                return transformer(transformedNode as T);
            }

            return transformedNode;
        }
        return (_transformer as unknown) as ts.Transformer<ts.SourceFile>;
    };
}

export const transformReactCreateElementToJsx = makeTransformerFactory(isReactCreateElement, transformCreateElementToJsx);

export function isSpreadAssignmentCall(node: ts.Node): node is ts.CallExpression {
    return isParenthesizedNamedCallExpression('__assign', node);
}

export function transformSpreadAssignmentCallToSpreadAssignment(node: ts.CallExpression) {
    const factory = ts.factory;
    const container = node.arguments[0];
    const rest = node.arguments.slice(1);

    const properties = (() => {

        const properties = ts.isObjectLiteralExpression(container)
            ? [...container.properties]
            : [factory.createSpreadAssignment(container)];

        rest.forEach(x => {
            if (ts.isObjectLiteralExpression(x)) {
                properties.push(...x.properties);
            } else {
                properties.push(factory.createSpreadAssignment(x));
            }
        });

        return properties;
    })();

    return factory.createObjectLiteralExpression(properties);
}

export const transformSpreadAssignmentCall = makeTransformerFactory(isSpreadAssignmentCall, transformSpreadAssignmentCallToSpreadAssignment);


export function isClasses(node: ts.Node): node is ts.VariableStatement {
    if (ts.isVariableStatement(node)
        && node.declarationList.declarations.length === 1
        && node.declarationList.declarations[0].initializer
        && ts.isCallExpression(node.declarationList.declarations[0].initializer)
        && ts.isParenthesizedExpression(node.declarationList.declarations[0].initializer.expression)
        && ts.isArrowFunction(node.declarationList.declarations[0].initializer.expression.expression)
    ) {
        const arrow = node.declarationList.declarations[0].initializer.expression.expression;
        const body = arrow.body;
        if (ts.isBlock(body)
            && ts.isFunctionDeclaration(body.statements[0])
            && ts.isExpressionStatement(body.statements[1])
            && isParenthesizedNamedCallExpression('__extends', body.statements[1].expression)
        ) {
            return true;
        }
    }

    return false;
}

export function transformClassesToClassExpression(node: ts.VariableStatement) {
    const factory = ts.factory;
    console.assert(node!.declarationList!.declarations.length === 1);

    const declaration = node!.declarationList!.declarations![0]!;

    const extendsClasses = (() => {
        if ((declaration.initializer as ts.CallExpression)?.arguments?.[0]) {
            return [factory.createHeritageClause(
                ts.SyntaxKind.ExtendsKeyword,
                [factory.createExpressionWithTypeArguments(
                    (declaration.initializer as ts.CallExpression)!.arguments![0],
                    undefined
                )]
            )];
        }
    })();
    const body = (((node!.declarationList!.declarations![0]!
        .initializer as ts.CallExpression)!
        .expression as ts.ParenthesizedExpression)!
        .expression as ts.ArrowFunction)!
        .body as ts.Block;
    
    //TODO: update super(args)
    const constructor = (() => {
        return factory.createConstructorDeclaration(
            undefined,
            undefined,
            (body.statements[0] as ts.FunctionDeclaration).parameters,
            (body.statements[0] as ts.FunctionDeclaration).body
        );
    })();

    const classProperties: ts.ExpressionStatement[] = [];
    let classDecorator: ts.Decorator[] = [];
    const members = (() => {
        const propertyDecorators: Record<string, ts.Decorator[]> = {};
        const members = body.statements.slice(2).map((x) => {
            if (ts.isExpressionStatement(x)) {
                if (ts.isBinaryExpression(x.expression)) {

                    const name = x.expression.left as ts.PropertyAccessExpression;
                    const body = x.expression.right as ts.FunctionExpression | ts.ArrowFunction;
                    if (!ts.isFunctionExpression(body) && !ts.isArrowFunction(body)) {
                        classProperties.push(x);

                        if (ts.isIdentifier(name.expression)) {
                            return factory.createPropertyDeclaration(
                                undefined,
                                [
                                    factory.createModifier(ts.SyntaxKind.PublicKeyword),
                                    factory.createModifier(ts.SyntaxKind.StaticKeyword)
                                ],
                                name.name,
                                undefined,
                                undefined,
                                body
                            )
                        }

                    }
                    return factory.createMethodDeclaration(
                        undefined,
                        undefined,
                        undefined,
                        name.name,
                        undefined,
                        undefined,
                        body.parameters,
                        undefined,
                        ts.isBlock(body.body)
                            ? body.body
                            : factory.createBlock([
                                factory.createReturnStatement(body.body)
                            ])
                    );
                } else if (isParenthesizedNamedCallExpression('__decorate', x.expression)) {
                    // do somthings
                    const expression = x.expression.arguments[0];
                    if (ts.isArrayLiteralExpression(expression)
                        && expression.elements.length > 0
                        && x.expression.arguments.length == 4
                    ) {
                        const decoratorCall = expression.elements[0];
                        const propertyName = x.expression.arguments[2];
                        console.assert(ts.isStringLiteral(propertyName));
                        const nameText = (propertyName as ts.StringLiteral).text;
                        propertyDecorators[nameText] = propertyDecorators[nameText] || [];
                        propertyDecorators[nameText].push(
                            factory.createDecorator(
                                decoratorCall
                            )
                        );
                        return;
                    }
                }
            } else if (ts.isReturnStatement(x)) {
                // 这里补一下类装饰器
                if (x.expression) {
                    if (ts.isIdentifier(x.expression)) {
                        // ignore return class
                        return;
                    } else if (isParenthesizedNamedCallExpression('__decorate', x.expression)) {
                        // 类装饰器
                        const expression = x.expression.arguments[0];
                        if (ts.isArrayLiteralExpression(expression) && expression.elements.length > 0) {
                            const decoratorCall = expression.elements[0];
                            classDecorator.push(
                                factory.createDecorator(
                                    decoratorCall
                                )
                            );
                            return;
                        } else {
                            console.log('wtf?', expression.kind, ts.SyntaxKind[expression.kind], expression.getText(),);
                        }
                    }
                }
            }

            console.log('wtf?', x.kind, ts.SyntaxKind[x.kind], x.getText());

        }).filter(Boolean) as (ts.MethodDeclaration | ts.PropertyDeclaration)[];

        return members.map((member) => {
            const memberName = member.name.getText();
            const decorator = propertyDecorators[memberName];
            if (decorator) {
                if (ts.isMethodDeclaration(member)) {
                    return factory.updateMethodDeclaration(
                        member,
                        decorator,
                        member.modifiers,
                        member.asteriskToken,
                        member.name,
                        member.questionToken,
                        member.typeParameters,
                        member.parameters,
                        member.type,
                        member.body
                    );
                } else {
                    return factory.updatePropertyDeclaration(
                        member,
                        decorator,
                        member.modifiers,
                        member.name,
                        member.questionToken,
                        member.type,
                        member.initializer
                    );
                }
            }
            return member;
        });
    })();

    const classDeclaration = factory.createClassDeclaration(
        classDecorator,
        undefined,
        node?.declarationList?.declarations?.[0]?.name as ts.Identifier,
        undefined,
        extendsClasses,
        [constructor, ...members],
    );


    return classDeclaration;
}

export function prettierPrint(node: ts.Node) {
    const printer = ts.createPrinter();
    const prettier = require('prettier');
    return prettier.format(printer.printNode(ts.EmitHint.Unspecified, node, node.getSourceFile()), {
        parser: 'typescript',
        trailingComma: 'all'
    });
}

export const transformClasses = makeTransformerFactory(isClasses, transformClassesToClassExpression);

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

    const testTransformer = function (code: string, transformers: ts.TransformerFactory<ts.SourceFile>[]) {
        const sourceFile = ts.createSourceFile('test.tsx', code, ts.ScriptTarget.ES2015, true, ts.ScriptKind.TSX);

        const transformed = ts.transform(sourceFile, transformers);

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

    testTransformer(source2, [transformReactCreateElementToJsx, transformSpreadAssignmentCall, ]);
    const source3 = `
test = (0, n.__assign)((0, n.__assign)({}, t.scaffold), {
    format: "YYYY-MM-DD",
    value: Math.round(Date.now() / 1e3),
});
test = (0, n.__assign)(
    (0, n.__assign)((0, n.__assign)({}, l ? null : r), a),
    { $$id: t },
);
test = (0, n.__assign)(
    {},
    l,
    null == a ? void 0 : a.state,
    { $$editor: t },
    t.wrapperProps,
    { ref: this.refFn },
)
`;
    testTransformer(source3, [transformSpreadAssignmentCall]);
    const source4 = `
const d = ((e) => {
  function t(...args) {
    return t;
  }
  (0, n.__extends)(t, e);
  t.prototype.updateDropRegion = function ({ context }) {

  };
  t.prototype.buildMockData = () => ({
    id: 666,
    title: "假数据",
    description: "假数据",
    a: "假数据",
    b: "假数据",
  });
  t.defaultProps = {
  };

  (0, n.__decorate)(
    [
      i.autobind,
      (0, n.__metadata)("design:type", Function),
      (0, n.__metadata)("design:paramtypes", [Object, Object]),
      (0, n.__metadata)("design:returntype", void 0),
    ],
    e.prototype,
    "updateDropRegion",
    null,
  );
  return (0, n.__decorate)([l.observer], t)
})(i.BasePlugin);
const s = ((e) => {
    function t(...args) {
      return (null !== e && e.apply(this, args)) || this;
    }
    (0, n.__extends)(t, e);
    t.prototype.componentDidMount = function () {
      this.markDom(this.props.$$editor.id),
        this.props.$$node && requestAnimationFrame(() => {});
    };
    t.prototype.componentDidUpdate = function (e) {
      this.markDom(this.props.$$editor.id);
    };
    t.prototype.getWrappedInstance = function () {
      return this.ref;
    };
    t.prototype.refFn = function (e) {
      this.ref = e;
    };
    t.prototype.markDom = function (e) {
      let t;
      let a;
      const n = (0, o.findDOMNode)(this);
      if (n && e) {
        const l = this.props.$$editor,
          i = !1 !== this.props.$$visible && !0 !== this.props.$$hidden,
          r = l.wrapperResolve ? l.wrapperResolve(n) : n;
        (Array.isArray(r) ? r : r ? [r] : []).forEach((t) => {
          t.setAttribute("data-editor-id", e),
            t.setAttribute("data-visible", i ? "" : "false");
        }),
          null ===
            (a = null === (t = l.plugin) || void 0 === t ? void 0 : t.markDom) ||
            void 0 === a ||
            a.call(t, r, this.props);
      }
    };
    t.prototype.render = function () {
      const e = this.props;
      const t = e.$$editor;
      const a = e.$$node;
      let l = (0, n.__rest)(e, ["$$editor", "$$node"]);
      const o = t.renderer;
      return (
        t.filterProps && (l = t.filterProps.call(t.plugin, l, a)),
        t.renderRenderer
          ? t.renderRenderer.call(
              t.plugin,
              (0, n.__assign)(
                (0, n.__assign)(
                  (0, n.__assign)(
                    (0, n.__assign)(
                      (0, n.__assign)({}, l),
                      null == a ? void 0 : a.state,
                    ),
                    { $$editor: t },
                  ),
                  t.wrapperProps,
                ),
                { ref: this.refFn },
              ),
              t,
            )
          : i.default.createElement(
              o.component,
              (0, n.__assign)(
                {},
                l,
                null == a ? void 0 : a.state,
                { $$editor: t },
                t.wrapperProps,
                { ref: this.refFn },
              ),
            )
      );
    };
    (0, n.__decorate)(
      [
        r.autobind,
        (0, n.__metadata)("design:type", Function),
        (0, n.__metadata)("design:paramtypes", [Object]),
        (0, n.__metadata)("design:returntype", void 0),
      ],
      t.prototype,
      "refFn",
      null,
    );
    return (0, n.__decorate)([l.observer], t);
})(i.default.Component);
    `;

    // testTransformer(source4, [transformClasses]);

}
