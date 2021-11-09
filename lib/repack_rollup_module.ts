import * as fs from "fs-extra";
import * as path from "path";
import * as ts from "typescript";
import { InMemoryFileSystemHost, Project, ExpressionStatement, printNode } from 'ts-morph';
import { distRoot, repackRoot, } from "./consts";


export interface FileInfo {
    tsName: string;
    ifNumber: string;
    decompileName: string;
}
// ts-node -T bin\dewebpack.ts repack_rollup_module index.min.js > log
export default async function repack_rollup_module(appName: string) {
    const ifs = new InMemoryFileSystemHost();

    fs.ensureDirSync(repackRoot,);
    function loadAllFiles() {
        const names: FileInfo[] = [];
        const distSubDir = path.join(distRoot, appName);
        fs.readdirSync(distSubDir).forEach(file => {
            const ifNumber = file.match(/^(\d+)\.js$/)?.[1];
            if (ifNumber) {
                const tsName = `/${ifNumber}.ts`;
                ifs.writeFileSync(tsName, fs.readFileSync(path.join(distSubDir, file), 'utf-8'));
                names.push({ tsName, ifNumber, decompileName: path.join(distSubDir, `${ifNumber}_decompile.js`) });
            }
        });
        return names;
    }

    const names = loadAllFiles();
    const project = new Project({
        fileSystem: ifs,
    });
    const factory = ts.factory;
    const properties = names.map(({ ifNumber, tsName }) => {
        const sourceFile = project.addSourceFileAtPath(tsName);
        const body = (sourceFile.getStatements()[0] as ExpressionStatement).getExpression().compilerNode;
        return factory.createPropertyAssignment(
            factory.createNumericLiteral(ifNumber),
            body as any /* 还不如直接拼字符串 */
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
                [factory.createVariableStatement(
                    undefined,
                    factory.createVariableDeclarationList(
                        [factory.createVariableDeclaration(
                            factory.createIdentifier("t"),
                            undefined,
                            undefined,
                            factory.createObjectLiteralExpression(
                                properties,
                                false
                            )
                        )],
                        ts.NodeFlags.None
                    )
                )],
                true
            )
        )),
        undefined,
        []
    );

    //
    // packfiles

    // write
    fs.writeFileSync(path.join(repackRoot, appName), printNode(node));
}
