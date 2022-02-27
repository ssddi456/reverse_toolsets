import * as fs from "fs";
import * as path from "path";
import { distRoot, } from "./consts";
import { FunctionDeclaration, Node, Project, SourceFile, SyntaxKind, ts } from "ts-morph";
import { transform } from 'lebab';

import { InMemoryFileSystemHost } from '@ts-morph/common';

export interface FileInfo {
    tsName: string;
    ifNumber: string;
    lebabName: string;
}
export const lebabTypes = {
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

// ts-node -T bin\dewebpack.ts lebab_module public-worker-da0b9f6764.js dist\public-worker-da0b9f6764.js\moduleMap.json > log
// ts-node -T bin\dewebpack.ts lebab_module pc-spread-sheet-pc-ee22693e11.js dist\pc-spread-sheet-pc-ee22693e11.js\moduleMap.json > log
// ts-node -T bin\dewebpack.ts lebab_module pc-bundle_pc_view_lazy_module1-bdb3925bb9.js dist\pc-bundle_pc_view_lazy_module1-bdb3925bb9.js\moduleMap.json > log
export default async function lebab_module(appName: string, fileMap?: Record<string, string>): Promise<void> {
    const distSubDir = path.join(distRoot, appName);
    const ifs = new InMemoryFileSystemHost();
    function loadAllFiles() {
        const names: FileInfo[] = [];
        fs.readdirSync(distSubDir).forEach(file => {
            const ifNumber = file.match(/^(\d+)\.js$/)?.[1];
            if (ifNumber) {
                const tsName = `/${ifNumber}.ts`;
                ifs.writeFileSync(tsName, fs.readFileSync(path.join(distSubDir, file), 'utf-8'));
                names.push({ tsName, ifNumber, lebabName: path.join(distSubDir, `${ifNumber}_lebab.js`) });
            }
        });
        return names;
    }
    function loadAllFilesFromConfig(config: Record<string, string>): FileInfo[] {
        const ret: FileInfo[] = [];
        for (const [tsName, sourceFileName] of Object.entries(config)) {
            const realTsName = tsName.replace(/\.(js|json)$/, '.ts');
            ifs.writeFileSync(realTsName, fs.readFileSync(sourceFileName, 'utf-8'));
            const ifNumber = path.join(path.dirname(sourceFileName), path.basename(sourceFileName, path.extname(sourceFileName)));
            ret.push({
                tsName: realTsName,
                ifNumber,
                lebabName: `${ifNumber}_lebab.js`,
            });
        }
        return ret;
    }
    const fileInfos = fileMap ? loadAllFilesFromConfig(fileMap) : loadAllFiles();
    // initialize
    const project = new Project({
        fileSystem: ifs,
    });
    project.resolveSourceFileDependencies();

    fileInfos.forEach(fileInfo => {
        const { tsName, lebabName } = fileInfo;
        const sourceFile = project.addSourceFileAtPath(tsName);
        if (!sourceFile) {
            throw new Error('source file not found');
        }
        try {
            const lebabedCode = transformFile(sourceFile);
            fs.writeFileSync(lebabName, lebabedCode);
        } catch (error) {
            if (error) {
                console.error(fileInfo, error);
            }
        }
    });
}

export function transformFile(sourceFile: SourceFile, { noLebab = false } = {}) {

    const moduleFunction = (() => {
        try {
            const firstChild = sourceFile.getFirstDescendantByKindOrThrow(SyntaxKind.ExpressionStatement)
                .getFirstChild();
            if (!firstChild) {
                throw new Error('module function not found');
            }
            if (Node.isArrowFunction(firstChild)
                || Node.isFunctionDeclaration(firstChild)
            ) {
                return firstChild;
            }
            throw new Error('module function not found');
        } catch (error) {
            const firstChild = sourceFile.getFirstDescendantByKindOrThrow(SyntaxKind.FunctionDeclaration);
            console.log('module function not found, use function declaration instead');
            return firstChild;
        }
    })();
    if (!moduleFunction) {
        throw new Error('module function not found');
    }
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
        thirdParams.rename('__require__');
    }
    const modifiedCode = moduleFunction.getBodyText()!;
    if (noLebab) {
        return modifiedCode;
    }
    const { code, warnings } = transform(modifiedCode, Object.keys(lebabTypes));
    return code;
}
