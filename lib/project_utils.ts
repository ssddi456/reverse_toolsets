import * as fs from "fs-extra";
import * as path from "path";
import { distRoot, } from "./consts";
import { Node, Project } from "ts-morph";
import { InMemoryFileSystemHost } from '@ts-morph/common';


export interface FileInfo {
    tsName: string;
    ifNumber: string;
    originName: string;
    lebabName: string;
    decompileName: string;
    modifiedName: string;
}

export function packageLoader(
    appName: string,
    { loadByName = 'originName' } = {} as { loadByName: keyof FileInfo }
) {
    const distSubDir = path.join(distRoot, appName);
    const ifs = new InMemoryFileSystemHost();

    function loadAllFiles() {
        const names: FileInfo[] = [];
        fs.readdirSync(distSubDir).forEach(file => {
            const ifNumber = file.match(/^(\d+)\.js$/)?.[1];
            if (ifNumber) {
                const tsName = `/${ifNumber}.ts`;
                const fileInfo: FileInfo = {
                    tsName,
                    ifNumber,
                    originName: path.join(distSubDir, file),
                    lebabName: path.join(distSubDir, `${ifNumber}_lebab.js`),
                    decompileName: path.join(distSubDir, `${ifNumber}_decompile.js`),
                    modifiedName: path.join(distSubDir, `${ifNumber}_modified.js`),
                };
                ifs.writeFileSync(tsName, fs.readFileSync(fileInfo[loadByName], 'utf-8'));
                names.push(fileInfo);
            }
        });
        return names;
    }

    function loadFile(fileBaseName: string) {
        const indexInfo: FileInfo = {
            tsName: `/${fileBaseName}.ts`,
            ifNumber: `${fileBaseName}`,
            originName: path.join(distSubDir, `${fileBaseName}.js`),
            lebabName: path.join(distSubDir, `${fileBaseName}_lebab.js`),
            decompileName: path.join(distSubDir, `${fileBaseName}_decompile.js`),
            modifiedName: path.join(distSubDir, `${fileBaseName}_modified.js`),
        };
        ifs.writeFileSync(indexInfo.tsName, fs.readFileSync(indexInfo[loadByName], 'utf8'));
        return indexInfo;
    }

    return {
        loadAllFiles,
        loadFile,
        fs: ifs,
        project: new Project({
            fileSystem: ifs,
        }),
        distSubDir
    };
}

export function visitAllNodes(root: Node, callback?: (node: Node) => Node | undefined) {
    try {
        root.forEachChild((node) => {
            // console.log('node.getKindName', node.getKindName());
            // if (node.getKindName() === 'VariableDeclaration') {
            //     console.log(node.getText());
            // }
            if (callback) {
                const nextNode = callback(node);
                if (nextNode) {
                    visitAllNodes(nextNode, callback);
                }
            } else {

                visitAllNodes(node, callback);
            }

        });
    } catch (error) {
        console.log(error);
    }
}
