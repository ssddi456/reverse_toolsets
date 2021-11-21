import * as fs from "fs-extra";
import * as path from "path";
import { distRoot, } from "./consts";
import { Node, Project } from "ts-morph";
import { InMemoryFileSystemHost } from '@ts-morph/common';


export interface FileInfo {
    /** /1.ts */
    tsName: string;
    /** 1 */
    ifNumber: string;
    /** 1.js */
    originName: string;
    /** 1_lebab.js */
    lebabName: string;
    /** 1_decompile.jsx */
    decompileName: string;
    /** 1_modified.js */
    modifiedName: string;
}

export function packageLoader(
    appName: string,
    {
        loadByName = 'originName',
        loadAsJsx = false,
        writeAsJsx = false,
    } = {} as { loadByName: keyof FileInfo, loadAsJsx?: boolean, writeAsJsx?: boolean }
) {
    const distSubDir = path.join(distRoot, appName);
    const ifs = new InMemoryFileSystemHost();
    const surfix = loadAsJsx ? 'x' : '';
    const outSurfix = writeAsJsx ? 'x' : '';

    function loadAllFiles() {
        const names: FileInfo[] = [];
        fs.readdirSync(distSubDir).forEach(file => {
            const ifNumber = file.match(/^(\d+)\.js$/)?.[1];
            if (ifNumber) {
                const info = loadFile(ifNumber);
                names.push(info);
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
        const outputFileInfo = {} as FileInfo;

        for (const key in indexInfo) {
            const element = indexInfo[key as keyof FileInfo];
            outputFileInfo[key as keyof FileInfo] = element + (key == 'ifNumber' ? '' : outSurfix);
        }

        ifs.writeFileSync(indexInfo.tsName + surfix, fs.readFileSync(indexInfo[loadByName] + surfix, 'utf-8'));
        return outputFileInfo;
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
