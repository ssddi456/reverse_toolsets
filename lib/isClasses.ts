import * as ts from "typescript";
import { isParenthesizedNamedCallExpression, makeTransformerFactory, testTransformer } from "./utils";


export function isClasses(node: ts.Node): node is ts.VariableStatement {
    if (ts.isVariableStatement(node)
        && node.declarationList.declarations.length === 1
        && node.declarationList.declarations[0].initializer
        && ts.isCallExpression(node.declarationList.declarations[0].initializer)
        && ts.isParenthesizedExpression(node.declarationList.declarations[0].initializer.expression)
        && ts.isArrowFunction(node.declarationList.declarations[0].initializer.expression.expression)) {
        const arrow = node.declarationList.declarations[0].initializer.expression.expression;
        const body = arrow.body;
        if (ts.isBlock(body)
            && ts.isFunctionDeclaration(body.statements[0])
            && ts.isExpressionStatement(body.statements[1])
            && isParenthesizedNamedCallExpression('__extends', body.statements[1].expression)) {
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
        const constructor = body.statements[0] as ts.FunctionDeclaration;
        const firstLine = constructor.body!.statements[0] as ts.ReturnStatement | ts.VariableStatement;

        function isSuperCallExpression(node: ts.Node) {
            if (ts.isBinaryExpression(node)
                && node.operatorToken.kind === ts.SyntaxKind.BarBarToken
                && node.right.kind == ts.SyntaxKind.ThisKeyword
            ) {

                if (ts.isParenthesizedExpression(node.left)) {
                    if (
                        ts.isBinaryExpression(node.left.expression)
                        && node.left.expression.operatorToken.kind === ts.SyntaxKind.AmpersandAmpersandToken
                        && ts.isCallExpression(node.left.expression.right)
                        && node.left.expression.right.arguments[0]?.kind === ts.SyntaxKind.ThisKeyword
                    ) {
                        return true;
                    }
                } else if (ts.isCallExpression(node.left)
                    && node.left.arguments[0]?.kind === ts.SyntaxKind.ThisKeyword
                ) {
                    return true;
                }
            }
            return false;
        }
        function isSuperCall(node: ts.Node) {
            if (ts.isReturnStatement(node) && node.expression) {
                return isSuperCallExpression(node.expression);
            } else if (ts.isVariableStatement(node)
                && node.declarationList.declarations.length === 1
                && node.declarationList.declarations[0].initializer
            ) {
                return isSuperCallExpression(node.declarationList.declarations[0].initializer);
            }
            return false;
        }

        function getSuperArguments(node: ts.BinaryExpression) {
            if (!ts.isBinaryExpression(node)) {
                return node;
            }
            if (node.operatorToken.kind === ts.SyntaxKind.BarBarToken) {
                if (
                    ts.isParenthesizedExpression(node.left)
                    && ts.isBinaryExpression(node.left.expression)
                    && node.left.expression.operatorToken.kind === ts.SyntaxKind.AmpersandAmpersandToken
                    && ts.isCallExpression(node.left.expression.right)
                ) {

                    const args = node.left.expression.right.arguments;

                    return factory.createExpressionStatement(
                        factory.createCallExpression(
                            factory.createSuper(),
                            undefined,
                            [factory.createSpreadElement(node.left.expression.right.arguments[1])]
                        )
                    );
                } else if (
                    ts.isCallExpression(node.left)
                    && ts.isPropertyAccessExpression(node.left.expression)
                    && (
                        node.left.expression.name.getText() === 'call'
                        || node.left.expression.name.getText() === 'apply'
                    )
                ) {
                    const method = node.left.expression.name.getText();
                    return factory.createExpressionStatement(
                        factory.createCallExpression(
                            factory.createSuper(),
                            undefined,
                            method == 'call'
                                ? node.left.arguments.slice(1)
                                : [factory.createSpreadElement(node.left.arguments[1])]
                        )
                    );
                }
            }

            throw new Error('unexpected');
        }

        function transformSuperCall(node: ts.Node) {

            if (ts.isReturnStatement(node)) {
                return [
                    getSuperArguments(node.expression as ts.BinaryExpression)
                ];
            } else if (ts.isVariableStatement(node)) {
                console.log('should create v and supercall');
                return [
                    getSuperArguments(node.declarationList.declarations[0].initializer as ts.BinaryExpression),
                    factory.createVariableStatement(
                        undefined,
                        factory.createVariableDeclarationList(
                            [factory.createVariableDeclaration(
                                node.declarationList.declarations[0].name,
                                node.declarationList.declarations[0].exclamationToken,
                                node.declarationList.declarations[0].type,
                                factory.createThis()
                            )],
                            node.declarationList.flags,
                        )
                    ),
                ];
            }
            return [] as ts.ReturnStatement[];
        };

        const block = factory.createBlock(
            (constructor.body!.statements || []).reduce((pre, cur) => {
                if (isSuperCall(cur)) {
                    return [...pre, ...transformSuperCall(cur)];
                }
                return [...pre, cur];
            }, [] as ts.Statement[])
        );

        return factory.createConstructorDeclaration(
            undefined,
            undefined,
            constructor.parameters,
            block,
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
                            );
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
                        && x.expression.arguments.length == 4) {
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
                            console.log('wtf?', expression.kind, ts.SyntaxKind[expression.kind], expression.getText());
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
        [constructor, ...members]
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
const d = ((e) => {
  function t(a) {
    const n = e.call(this, a) || this;
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
`;

    const source4 = `
const d = ((e) => {
  function t(...args) {
    const t = (null !== e && e.apply(this, args)) || this;
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
`;
    const source2 = `
const s = ((e) => {
    function t(...args) {
        const t = (null !== e && e.apply(this, args)) || this;
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
      return [];
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

    // testTransformer(source1, [transformClasses]);
    testTransformer(source2, [transformClasses]);
    // testTransformer(source4, [transformClasses]);
}
