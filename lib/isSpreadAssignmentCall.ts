import * as ts from "typescript";
import { isParenthesizedNamedCallExpression, makeTransformerFactory, testTransformer } from "./utils";


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

if (require.main === module) {

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
}