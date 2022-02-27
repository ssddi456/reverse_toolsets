import * as ts from 'typescript';
import * as fs from 'fs-extra';
import * as path from 'path';
import { doCompile, findNodeWithTreeTypeChildren, } from './utils';
import { source, distRoot } from './consts';

export default async function (appName: string) {

    const { sourceFile } = await doCompile(path.join(source, appName));
    const distSubRoot = path.join(distRoot, appName);
    fs.ensureDirSync(distSubRoot);

    const printer = ts.createPrinter({});

    const nodes = findNodeWithTreeTypeChildren<ts.CallExpression>(sourceFile, [
        // !()
        (node) => ts.isPrefixUnaryExpression(node)
            && node.operator === ts.SyntaxKind.ExclamationToken
            && ts.isExpressionStatement(node.parent)
            && ts.isSourceFile(node.parent.parent),
        {
            test: (node) => {
                const ret = ts.isCallExpression(node)
                    && node.arguments.length === 2
                    && ts.isPrefixUnaryExpression(node.parent);
                return ret;
            },
            getChildren: (node: ts.CallExpression) => [node.arguments[1]]
        },
        {
            test: (node) => {
                const ret = ts.isCallExpression(node)
                    && ts.isCallExpression(node.parent)
                    && node.arguments.length == 1
                    && ts.isArrayLiteralExpression(node.arguments[0]);
                return ret;
            },
            getChildren: (node: ts.CallExpression) => [...(node.arguments[0] as ts.ArrayLiteralExpression).elements]
        },
    ], {
        onError: (node, error) => {
            // node && console.log(printer.printNode(ts.EmitHint.Unspecified, node, sourceFile));
            console.log(error);
        }
    });

    nodes.forEach((element, i) => {
        if (!ts.isFunctionExpression(element)) {
            console.log('wtf???', i);
        }

        // 这里可以做一下rename 
        // typeChecker.findReferences(element).getName();

        const code = printer.printNode(ts.EmitHint.Unspecified, element, sourceFile);

        fs.writeFile(path.join(distSubRoot, i + '.js'), code);
    });

}
