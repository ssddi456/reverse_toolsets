import * as fs from "fs-extra";
import * as path from "path";
import * as ts from "typescript";
import { InMemoryFileSystemHost, printNode } from 'ts-morph';
import { distRoot, repackRoot, } from "./consts";
import * as prettier from 'prettier';

// ts-node -T bin\dewebpack.ts repack_rollup_module index.min.js > log
export default async function repack_rollup_module(appName: string) {
    const ifs = new InMemoryFileSystemHost();

    fs.ensureDirSync(repackRoot,);
    function loadAllFiles() {
        const names: { tsName: string, ifNumber: string }[] = [];
        const distSubDir = path.join(distRoot, appName);
        fs.readdirSync(distSubDir).forEach(file => {
            const ifNumber = file.match(/^(\d+)\.js$/)?.[1];
            if (ifNumber) {
                const tsName = `/${ifNumber}.ts`;
                ifs.writeFileSync(tsName, fs.readFileSync(path.join(distSubDir, file), 'utf-8'));
                names.push({ tsName, ifNumber });
            }
        });
        return names;
    }

    const names = loadAllFiles();

    const factory = ts.factory;
    const properties = names.map(({ ifNumber }) => {
        return factory.createPropertyAssignment(
            factory.createNumericLiteral(ifNumber),
            factory.createCallExpression(
                factory.createIdentifier('ModulePlaceHolder'),
                undefined,
                factory.createNodeArray([
                    factory.createStringLiteral(ifNumber),
                ])
            ),
        );
    });
    const node = factory.createCallExpression(
        factory.createParenthesizedExpression(factory.createArrowFunction(
            undefined,
            undefined,
            [],
            undefined,
            factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
            factory.createBlock(
                [
                    factory.createVariableStatement(
                        undefined,
                        factory.createVariableDeclarationList(
                            [factory.createVariableDeclaration(
                                factory.createIdentifier("e"),
                                undefined,
                                undefined,
                                factory.createObjectLiteralExpression(
                                    properties,
                                    false
                                )
                            )],
                            ts.NodeFlags.None
                        )
                    ),
                    factory.createReturnStatement(
                        factory.createCallExpression(
                            factory.createParenthesizedExpression(
                                factory.createBinaryExpression(
                                    factory.createNumericLiteral(0),
                                    ts.SyntaxKind.CommaToken,
                                    factory.createIdentifier("indexContentPlaceHolder")
                                )
                            ),
                            undefined,
                            []
                        )
                    )
                ],
                true
            )
        )),
        undefined,
        []
    );

    //
    // packfiles

    const packedCode = prettier.format(printNode(node), {
        parser: 'typescript',
        trailingComma: 'all'
    });

    const replacedCode = packedCode.split('\n').map((line, index) => {
        return line
            .replace(/ModulePlaceHolder\("(\d+)"\)/, function ($, $1) {
                const tsName = names.find(({ ifNumber }) => ifNumber === $1)?.tsName;
                if (tsName) {
                    return ifs.readFileSync(tsName);
                }
                return $;
            })
            .replace('indexContentPlaceHolder', function () {
                return fs.readFileSync(path.join(distRoot, appName, 'index_modified.js'), 'utf-8');
            });
    }).join('\n');
    // write
    fs.writeFileSync(
        path.join(repackRoot, appName),
        replacedCode
    );
}
