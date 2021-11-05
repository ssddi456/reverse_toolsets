import * as ts from 'typescript';
import * as fs from 'fs-extra';
import * as path from 'path';
import { findNodeWithTreeTypeChildren, } from './utils';
import { createSourceFile } from './compiler';

export default function () {

    const source = path.join(__dirname, '../source/test.js');
    const distRoot = path.join(__dirname, '../dist');

    fs.readFile(source, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return;
        }

        const { bindingTools, sourceFile } = createSourceFile({
            ...ts,
            tsAstViewer: {
                packageName: ts.version,
                cachedSourceFiles: {},
            }
        }, data, ts.ScriptTarget.ES2015, ts.ScriptKind.JS);

        const { typeChecker } = bindingTools();
        const printer = ts.createPrinter({});

        const nodes = findNodeWithTreeTypeChildren<ts.CallExpression>(sourceFile, [
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
            console.log(sourceFile);

            const code = printer.printNode(ts.EmitHint.Unspecified, element, sourceFile);

            fs.writeFile(path.join(distRoot, i + '.js'), code);
        });
        // nodes.forEach(
        //     (node) => ((node.arguments[1] as ts.CallExpression).arguments[0] as ts.ArrayLiteralExpression).elements
        //         .forEach((element, i) => {
        //             const code = printer.printNode(ts.EmitHint.Unspecified, element, sourceFile);
        //             fs.writeFile(path.join(distRoot, i + '.js'), code);
        //         }));
    });
}
