import * as fs from "fs-extra";
import * as path from "path";
import * as prettier from "prettier";
import { Node, NumericLiteral } from "ts-morph";
import { packageLoader, visitAllNodes } from './project_utils';
import { transformClasses } from "./isClasses";
import { transformSpreadAssignmentCall } from "./isSpreadAssignmentCall";
import { transformReactCreateElementToJsx } from "./transformReactCreateElementToJsx";
import * as ts from 'typescript';
import { transformFixBlock, transformExpandStatement } from "./fix_block";
import { fixKeywordShortcut } from "./fix_keyword_shortcut";
import { fixAsyncAwait } from "./fix_async_await";
import { fixOptionalChaining } from "./fix_optional_chaining";

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
        console.log(`start tsName ${tsName}`);

        visitAllNodes(sourceFile, (node) => {
            if (Node.isCallExpression(node)
                && node.getArguments().length == 1
                && Node.isNumericLiteral(node.getArguments()[0])
                && node.getExpression().getText() == '__require__'
            ) {
                const moduleName = (node.getArguments()[0] as NumericLiteral).getLiteralValue();
                if (externalImports[moduleName]) {
                    node.getExpression().replaceWithText('require');
                    node.getArguments()[0].replaceWithText(externalImports[moduleName]);
                }
            }
            return node;
        });

        console.log(`start transformClasses ${tsName}`);

        const transformed = ts.transform(sourceFile.compilerNode, [
            transformReactCreateElementToJsx,
            transformSpreadAssignmentCall,
            fixOptionalChaining,
            transformClasses,
            transformFixBlock,
            fixOptionalChaining,
            transformExpandStatement,
            fixKeywordShortcut,
            // fixAsyncAwait,
        ]);
        const printer = ts.createPrinter();

        fs.writeFileSync(decompileName,
            prettier.format(printer.printFile(transformed.transformed[0] as ts.SourceFile), {
                parser: 'typescript',
                trailingComma: 'all',
            })
        );
        console.log(`all end ${tsName}`);
    });
}
