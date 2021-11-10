import * as ts from 'typescript';
import * as fs from 'fs-extra';
import * as path from 'path';
import { source, distRoot } from './consts';
import { InMemoryFileSystemHost, SyntaxKind } from '@ts-morph/common';
import { Node, Project, PropertyAssignment } from 'ts-morph';

// ts-node -T bin\dewebpack.ts extract_rollup_module index.min.js > log
export default async function (appName: string) {
    const ifs = new InMemoryFileSystemHost();
    const tsName = `${appName}.ts`;
    const code = fs.readFileSync(path.join(source, appName), 'utf-8');
    const distSubRoot = path.join(distRoot, appName);
    fs.ensureDirSync(distSubRoot);

    ifs.writeFileSync(tsName, code);

    // initialize
    const project = new Project({
        fileSystem: ifs,
    });
    const sourceFile = project.addSourceFileAtPath(tsName)!;

    const block = sourceFile.getFirstDescendantByKind(SyntaxKind.ExpressionStatement)!
        .getFirstChildByKind(SyntaxKind.CallExpression)!
        .getFirstChildByKind(SyntaxKind.ParenthesizedExpression)!
        .getFirstChildByKind(SyntaxKind.ArrowFunction)!
        .getFirstChildByKindOrThrow(SyntaxKind.Block);

    const nodes = block.getStatements();
    let restNodes: Node[] = [];
    nodes.forEach((element, i) => {
        const kind = element.getKind();
        const kindName = element.getKindName();
        console.log(kindName);
        if (i == 0 && kind == SyntaxKind.ExpressionStatement) {
            if (element.getText() == `"use strict";`) {
                // ignore
            }
        }
        if (i == 1 && kind == SyntaxKind.VariableStatement) {
            const varList = element.getFirstChildByKindOrThrow(SyntaxKind.VariableDeclarationList)
                .getChildrenOfKind(SyntaxKind.VariableDeclaration);

            varList.slice(1).forEach(element => {
                restNodes.push(element);
            });

            const varNode = varList[0];
            const varName = varNode
                .getNameNode()
                .getText();

            console.log('varName', varName);

            const varProps = varNode.getInitializerIfKindOrThrow(SyntaxKind.ObjectLiteralExpression)!
                .getProperties();
            console.log('varProps', varProps.length);


            varProps.forEach((prop, i) => {
                if (!Node.isPropertyAssignment(prop)) {
                    throw new Error(`${prop.getKindName()} i is not PropertyAssignment`);
                }
                const propName = prop.getNameNode()!.getText();
                console.log(`${i} ${propName}`);
                fs.writeFileSync(path.join(distSubRoot, propName + '.js'), prop.getInitializerOrThrow().getText());
            });
        }
    });

    const main = fs.createWriteStream(path.join(distSubRoot, 'index.js'));
    main.write('() => {\n');
    restNodes.forEach((element, i) => {
        main.write('var ' + element.getText());
        main.write('\n');
    });
    nodes.slice(2).forEach(element => {
        main.write(element.getText());
        main.write('\n');
    });
    main.write('\n}\n');

}
