import * as ts from 'typescript';
import * as fs from 'fs-extra';
import * as path from 'path';
import { source, distRoot } from './consts';
import { InMemoryFileSystemHost, SyntaxKind } from '@ts-morph/common';
import { Node, ObjectLiteralExpression, Project, PropertyAssignment } from 'ts-morph';

// ts-node -T bin\dewebpack.ts extract_named_modules public-worker-da0b9f6764.js > log
// ts-node -T bin\dewebpack.ts extract_named_modules pc-spread-sheet-pc-ee22693e11.js > log
// ts-node -T bin\dewebpack.ts extract_named_modules pc-bundle_pc_view_lazy_module1-bdb3925bb9.js > log
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
    /* 
    (self.window = self),
    (function (e) {
        
    })({});
     */
    const callNode = sourceFile.getFirstDescendantByKind(SyntaxKind.ExpressionStatement)!
        .getFirstDescendantByKind(SyntaxKind.CallExpression)!;

    const args = callNode.getArguments();
    const arg0 = args[0];
    const moduleMapNode = (() => {
        if (Node.isObjectLiteralExpression(arg0)) {
            return arg0;
        }
        if (Node.isArrayLiteralExpression(arg0) && Node.isObjectLiteralExpression(arg0.getElements()[1])) {
            return arg0.getElements()[1] as ObjectLiteralExpression;
        }
        throw new Error('modulemap not found');
    })();


    const nodes = moduleMapNode.getProperties();
    const names = nodes.map((prop, i) => {

        if (!Node.isPropertyAssignment(prop)) {
            throw new Error(`${prop.getKindName()} i is not PropertyAssignment`);
        }
        const propName = prop.getNameNode()!.getText().replace(/^['"]|['"]$/g, '');
        return propName;
    });
    const NameCharBlackReg = /[?\/*"'<>|]/;


    console.log(JSON.stringify(names, null, 2));

    const dirs = [...Array(names.reduce((pre, name) => {
        const sep = name.split('/');
        let count = 0;
        while (sep[0] === '..') {
            count++;
            sep.shift();
        }
        console.log(`${name} ${count} ${pre}`);
        
        return Math.max(pre, count);
    }, 0))].map(() => path.basename(appName, path.extname(appName)));

    const moduleMap = nodes.reduce((pre, prop, i) => {

        if (!Node.isPropertyAssignment(prop)) {
            throw new Error(`${prop.getKindName()} i is not PropertyAssignment`);
        }
        const propName = prop.getNameNode()!.getText().replace(/^['"]|['"]$/g, '');
        console.log(`${i} ${propName}`);
        const moduleName = propName.split('/').map(dir => {
            if (dir.match(NameCharBlackReg)) {
                console.log(`${dir} is not valid name ${encodeEx(dir)}`);

                return encodeEx(dir);
            }
            return dir
        }).join('/');
        if (propName.indexOf('/node_modules/') >= 0) { 
            console.log('skip node_modules');
            return pre;
        }
        const filepath = path.join(distSubRoot, ...dirs, moduleName);
        const dirName = path.dirname(filepath);
        fs.ensureDirSync(dirName);
        fs.writeFileSync(filepath, prop.getInitializerOrThrow().getText());
        pre[propName] = filepath;
        return pre;
    }, {} as Record<string, string>);
    
    fs.writeJSONSync(path.join(distSubRoot, 'moduleMap.json'), moduleMap);
    // const main = fs.createWriteStream(path.join(distSubRoot, 'index.js'));
    // main.write('() => {\n');
    // restNodes.forEach((element, i) => {
    //     main.write('var ' + element.getText());
    //     main.write('\n');
    // });
    // nodes.slice(2).forEach(element => {
    //     main.write(element.getText());
    //     main.write('\n');
    // });
    // main.write('\n}\n');

}

function encodeEx(str: string): string {
    return str.replace(/\//g, '%2F')
        .replace(/\?/g, '%3F')
        .replace(/\:/g, '%3A')
        .replace(/\*/g, '%2A')
        .replace(/\@/g, '%40')
        .replace(/\#/g, '%23')
        .replace(/\$/g, '%24')
        .replace(/\&/g, '%26')
        .replace(/\=/g, '%3D')
        .replace(/\+/g, '%2B')
        .replace(/\,/g, '%2C')
        .replace(/\;/g, '%3B')
        .replace(/\%/g, '%25')
        .replace(/\'/g, '%27')
        .replace(/\"/g, '%22')
        .replace(/\</g, '%3C')
        .replace(/\>/g, '%3E')
        .replace(/\|/g, '%7C');
}
