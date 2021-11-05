
import * as ts from "typescript";
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
