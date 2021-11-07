import * as fs from "fs";
import * as path from "path";
import { distRoot, } from "./consts";
import { Project, ts } from "ts-morph";
import { transform } from 'lebab';

import { InMemoryFileSystemHost } from '@ts-morph/common';

export interface FileInfo {
    tsName: string;
    ifNumber: string;
    lebabName: string;
}
const lebabTypes = {
    'class': 1,
    'template': 1,
    'arrow': 1,
    'arrow-return': 1,
    'let': 1,
    'default-param': 1,
    'destruct-param': 1,
    'arg-spread': 1,
    'arg-rest': 1,
    'obj-method': 1,
    'obj-shorthand': 1,
    'no-strict': 1,
    'commonjs': 1,
    'exponent': 1,
    'multi-var': 1,
    'for-of': 1,
    'for-each': 1,
    'includes': 1,
};

export default async function lebab_module(): Promise<void> {
    const ifs = new InMemoryFileSystemHost();
    function loadAllFiles() {
        const names: FileInfo[] = [];
        fs.readdirSync(distRoot).forEach(file => {
            const ifNumber = file.match(/^(\d+)\.js$/)?.[1];
            if (ifNumber) {
                const tsName = `/${ifNumber}.ts`;
                ifs.writeFileSync(tsName, fs.readFileSync(path.join(distRoot, file), 'utf-8'));
                names.push({ tsName, ifNumber, lebabName: path.join(distRoot, `${ifNumber}_lebab.js`) });
            }
        });
        return names;
    }

    const fileInfos = loadAllFiles();
    // initialize
    const project = new Project({
        fileSystem: ifs,
    });
    project.resolveSourceFileDependencies();

    function transformFile({ tsName, lebabName }: FileInfo) {
        const sourceFile = project.addSourceFileAtPath(tsName);
        if (!sourceFile) {
            throw new Error('source file not found');
        }

        const moduleFunction = sourceFile.getFirstDescendantByKind(ts.SyntaxKind.FunctionDeclaration)!;
        const allParams = moduleFunction.getParameters();

        const firstParams = allParams[0];
        const secondParams = allParams[1];
        const thirdParams = allParams[2];

        if (firstParams) {
            firstParams.rename('module');
        }
        if (secondParams) {
            secondParams.rename('exports');
        }
        if (thirdParams) {
            thirdParams.rename('require');
        }
        const modifiedCode = moduleFunction.getBodyText()!;
        const { code: lebabedCode, warnings } = transform(modifiedCode, Object.keys(lebabTypes));

        fs.writeFileSync(lebabName, lebabedCode);
    }

    fileInfos.forEach(fileInfo => transformFile(fileInfo));

}

if (require.main === module) {
    lebab_module();
}