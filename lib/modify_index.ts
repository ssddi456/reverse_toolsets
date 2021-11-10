import * as fs from "fs-extra";
import * as path from "path";
import * as prettier from "prettier";
import { Node, NumericLiteral } from "ts-morph";
import { packageLoader, visitAllNodes } from './project_utils';


// ts-node -T bin\dewebpack.ts modify_index index.min.js > log
export default async function modifyIndex(appName: string) {
    const { project, loadFile, distSubDir } = packageLoader(appName, { loadByName: 'decompileName' });
    const { removableNames } = require(path.join(distSubDir, 'module_info.json'));
    const { tsName, modifiedName } = loadFile('index');

    const sourceFile = project.addSourceFileAtPath(tsName);

    visitAllNodes(sourceFile, (node) => {
        if (Node.isCallExpression(node)
            && node.getArguments().length === 1
            && Node.isNumericLiteral(node.getArguments()[0])
        ) {
            const value = (node.getArguments()[0] as NumericLiteral).getText();
            if (removableNames.includes(value)) {
                const parent = node.getParentOrThrow();
                if (Node.isExpressionStatement(parent)) {
                    parent.remove();
                } else {
                    console.log(`${parent.getText()} is not a statement`);
                }
                return;
            }
        }
        return node;
    });

    fs.writeFileSync(modifiedName,
        prettier.format(sourceFile.print()!, {
            parser: 'typescript',
            trailingComma: 'all'
        })
    );
}
