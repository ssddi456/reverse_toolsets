import * as ts from 'typescript';
import * as fs from 'fs-extra';
import * as path from 'path';
import { doCompile, findNodeWithTreeTypeChildren, loadSourceCode, renameModuleWrapper, } from './utils';
import { source, distRoot } from './consts';

// ts-node -T bin/dewebpack.ts extract_array_modules sidePanel.js > log
// ts-node -T bin/dewebpack.ts extract_array_modules src_modules_symbol-lib_webview_index.js > log
export default async function (appName: string) {

    const { sourceFile } = await doCompile(path.join(source, appName));
    const distSubRoot = path.join(distRoot, appName);
    fs.ensureDirSync(distSubRoot);

    const printer = ts.createPrinter({});

    const nodes = findNodeWithTreeTypeChildren<ts.CallExpression>(sourceFile, [
        {
            test: (node) => {
                // => xxx([a, b, c])
                const ret = ts.isCallExpression(node)
                    && node.arguments.length == 1
                    && ts.isArrayLiteralExpression(node.arguments[0]);
                
                if (ret) {
                    const arrayLiteral = node.arguments[0] as ts.ArrayLiteralExpression;
                    if (arrayLiteral.elements.length > 1) {
                        // every element is a function expression with most 3 arguments
                        // or is undefined

                        let isAllFunction = true;
                        for (const element of arrayLiteral.elements) {
                            // if element is typeof undefined
                            if (ts.isIdentifier(element) && element.escapedText === 'undefined') {
                                continue;
                            }
                            if (ts.isOmittedExpression(element)) {
                                continue;
                            }

                            if (!ts.isFunctionExpression(element)) {
                                isAllFunction = false;
                                break;
                            }

                            if ((element as ts.FunctionExpression).parameters.length > 3) {
                                isAllFunction = false;
                                break;
                            }
                        }
                    }
                }
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

        const newSource = loadSourceCode(i + '.ts', code);
        renameModuleWrapper(newSource);

        fs.writeFile(path.join(distSubRoot, i + '.js'), newSource.getFullText());
    });

}
