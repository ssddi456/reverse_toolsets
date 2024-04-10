import * as ts from 'typescript';
import { isParenthesizedNamedCallExpression, testTransformer } from '../utils';

export function fixSpreadArray(context: ts.TransformationContext) {
    const factory = context.factory;
    function _transformer(_node: ts.Node): ts.Node {
        const transformedNode = ts.visitEachChild(_node, _transformer, context);
        if (isParenthesizedNamedCallExpression('__spreadArray', transformedNode)) {
            return factory.createArrayLiteralExpression([
                ...(ts.isArrayLiteralExpression(transformedNode.arguments[0]) ? transformedNode.arguments[0].elements : [factory.createSpreadElement(transformedNode.arguments[0])]),
                ...(ts.isArrayLiteralExpression(transformedNode.arguments[1]) ? transformedNode.arguments[1].elements : [factory.createSpreadElement(transformedNode.arguments[1])]),
            ]);
        }
        return transformedNode;
    }

    return (_transformer as unknown) as ts.Transformer<ts.SourceFile>;
}

if (require.main === module) {
    const source = `
(0, n.__spreadArray)(
        (0, n.__spreadArray)([], s, true),
        [
            {
            visibleOn: 'data.type === "group"',
            type: "combo",
            name: "body",
            label: "分组内的控件",
            multiple: true,
            draggable: true,
            multiLine: true,
            items: (0, n.__spreadArray)([], s, true),
            },
        ],
        false,
);
(0, i.__spreadArray)(
    (0, i.__spreadArray)([], e, true),
    [
        {
            label: "设置方式",
            name: "disabled",
            type: "button-group-select",
            size: "xs",
            mode: "inline",
            className: "w-full",
            options: [
                { label: "静态设置", value: 1 },
                { label: "表达式", value: 2 },
            ],
            pipeIn(e) {
                return "boolean" == typeof e ? 1 : 2;
            },
            pipeOut(e) {
                return 1 !== e && "";
            },
        },
        {
            type: "switch",
            label: "禁用(disabled)",
            name: "disabled",
            visibleOn: 'typeof this.disabled === "boolean"',
            pipeIn(e, { hidden }) {
                return false !== e && !hidden;
            },
            mode: "inline",
            className: "w-full m-b-none",
            onChange(e, t, a, n) {
                return n.setValueByName("disabledOn", "");
            },
        },
        {
            name: "disabledOn",
            label: "禁用表达式(disabledOn)",
            placeholder: "如：this.type === 1",
            labelRemark: {
                trigger: "click",
                className: "m-l-xs",
                rootClose: true,
                content:
                '纯粹的 JS 语法，this 指向当前数据层。文档：<a href="https://baidu.github.io/amis/docs/concepts/expression">表达式语法</a>',
                placement: "left",
            },
            type: "input-text",
            visibleOn: 'typeof this.disabled !== "boolean"',
            className: "m-b-none",
        },
    ],
    false,
);

(0, i.__spreadArray)((0, i.__spreadArray)([a], b, true), [c], false);
(0, i.__spreadArray)((0, i.__spreadArray)([], b, true), [c], false);
(0, i.__spreadArray)([a], b, true);
`;

    testTransformer(source, [fixSpreadArray]);
}