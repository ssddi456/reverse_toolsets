import * as ts from "typescript";
import * as tsMorph from "ts-morph";
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

export function testTransformer(code: string, transformers: ts.TransformerFactory<ts.SourceFile>[]) {
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

export function replaceExpression(root: ts.Node, testFunction: (node: ts.Node) => boolean, replaceWith: ts.Node, context: ts.TransformationContext) {
    function visiter(node: ts.Node): ts.Node {
        if (testFunction(node)) {
            return replaceWith;
        }
        return ts.visitEachChild(node, visiter, context);
    }
    return ts.visitEachChild(root, visiter, context);
}

export function isBlockLike(node: ts.Node): node is ts.BlockLike {
    return ts.isBlock(node)
        || ts.isSourceFile(node)
        || ts.isModuleBlock(node)
        || ts.isCaseOrDefaultClause(node)
}

export function updateBlocklike(node: ts.BlockLike, statements: ts.Statement[], factory: ts.NodeFactory): ts.BlockLike {
    if (ts.isBlock(node)) {
        return factory.updateBlock(node, statements);
    } else if (ts.isSourceFile(node)) {
        return factory.updateSourceFile(
            node,
            statements,
            node.isDeclarationFile,
            node.referencedFiles,
            node.typeReferenceDirectives,
            node.hasNoDefaultLib,
            node.libReferenceDirectives,
        );
    } else if (ts.isModuleBlock(node)) {
        return factory.updateModuleBlock(node, statements);
    } else if (ts.isCaseClause(node)) {
        return factory.updateCaseClause(node, node.expression, statements);
    } else if (ts.isDefaultClause(node)) {
        return factory.updateDefaultClause(node, statements);
    } else {
        throw new Error('unexpected node type');
    }
}

export function makeRemoveExpressionOfType(test: (node: ts.Node) => boolean) {
    return (node: ts.Node, context: ts.TransformationContext) => {
        const factory = context.factory
        function _transformer(node: ts.Node) {
            const transformedNode: ts.Node = ts.visitEachChild(node, _transformer, context);

            if (test(transformedNode)) {
                return factory.createEmptyStatement();
            }

            return transformedNode;
        }
        return ts.visitEachChild(node, _transformer, context);
    };
}

export function createExpressPatternFromCode (code: string) {
    const project = new tsMorph.Project({
        useInMemoryFileSystem: true,
    });
    const sourceFile = project.createSourceFile('test.ts', code);
    const expression = sourceFile.getChildren()[0];

    return expression!;
}

export function matchExpressionWithPattern (pattern:  tsMorph.Node, expression:  tsMorph.Node) {
    // travisal expression to match pattern. check if node type is same, and check children node type is same

    // console.log('pattern', pattern.getKindName(), 'expression', expression.getKindName());
    if (pattern.getKind() !== expression.getKind()) {
        return false;
    }

    // console.log('pattern', pattern.getChildCount(), 'expression', expression.getChildCount());
    // console.log('pattern', pattern.getDescendants().length, 'expression', expression.getDescendants().length);

    const patternChildren = pattern.getDescendants();
    const expressionChildren = expression.getDescendants();
    if (patternChildren.length !== expressionChildren.length) {
        return false;
    }

    for (let i = 0; i < patternChildren.length; i++) {
        const patternChild = patternChildren[i];
        const expressionChild = expressionChildren[i];

        if (!matchExpressionWithPattern(patternChild, expressionChild)) {
            return false;
        }
    }
    return true;
}

export function loadSourceCode(filename: string, code: string) {
    const project = new tsMorph.Project({
        useInMemoryFileSystem: true,
    });
    const sourceFile = project.createSourceFile(filename, code);

    return sourceFile;
}

export function renameModuleWrapper(sourceFile: tsMorph.SourceFile) {
    const topFunction = sourceFile.getFirstDescendantByKind(tsMorph.SyntaxKind.FunctionDeclaration);
    if (topFunction) {
        const params = topFunction.getParameters();
        if (params[0]) {
            const e = params[0];
            e.rename('module');
        }
        if (params[1]) {
            const t = params[1];
            t.rename('exports');
        }
        if (params[2]) {
            const n = params[2];
            n.rename('require');
        }
    }
}
