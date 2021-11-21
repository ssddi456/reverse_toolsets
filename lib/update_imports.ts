import * as fs from "fs-extra";
import * as path from "path";
import * as prettier from "prettier";
import { Node, NumericLiteral } from "ts-morph";
import { packageLoader, visitAllNodes } from './project_utils';
import { transformReactCreateElementToJsx, transformSpreadAssignmentCall } from "./utils";
import * as ts from 'typescript';

// ts-node -T bin\dewebpack.ts update_imports index.min.js > log
export default async function updateImports(appName: string) {
    const { project, loadAllFiles, distSubDir } = packageLoader(appName, { loadByName: 'decompileName', loadAsJsx: true, writeAsJsx: true });
    const { allModuleInfo } = require(path.join(distSubDir, 'module_info.json'));

    const externalImports: Record<string, string> = {};
    (allModuleInfo as { imports: string[], fileName: string }[])
        .filter(({ imports }: { imports: string[] }) => imports.length == 1 && imports[0][0] == '"')
        .forEach(({ imports, fileName }) => {
            externalImports[fileName.slice(1, -3)] = imports[0];
        });

    const allFiles = loadAllFiles();
    allFiles.forEach(({ tsName, decompileName }) => {
        const sourceFile = project.addSourceFileAtPath(tsName)!;

        visitAllNodes(sourceFile, (node) => {
            if (Node.isCallExpression(node)
                && node.getArguments().length == 1
                && Node.isNumericLiteral(node.getArguments()[0])
                && node.getExpression().getText() == '__require__'
            ) {
                const moduleName = (node.getArguments()[0] as NumericLiteral).getLiteralValue();
                if (externalImports[moduleName]) {
                    node.getArguments()[0].replaceWithText(externalImports[moduleName]);
                }
            }
            return node;
        });


        const transformed = ts.transform(sourceFile.compilerNode, [
            transformSpreadAssignmentCall,
            transformReactCreateElementToJsx
        ]);
        const printer = ts.createPrinter();

        fs.writeFileSync(decompileName,
            prettier.format(printer.printFile(transformed.transformed[0] as ts.SourceFile), {
                parser: 'typescript',
                trailingComma: 'all'
            })
        );
    });
}
