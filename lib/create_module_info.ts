import * as fs from "fs-extra";
import * as path from "path";
import { distRoot, } from "./consts";
import * as uniq from 'lodash/uniq';
import { Block, CodeBlockWriter, ExpressionStatement, Node, Project, SourceFile, Statement, StatementedNode } from "ts-morph";

import { InMemoryFileSystemHost, SyntaxKind } from '@ts-morph/common';
import { FileInfo } from './optimize_decompile';
import { visitAllNodes, } from './project_utils';

// ts-node -T bin\dewebpack.ts create_module_info index.min.js > log
export default async function createModuleInfo(appName: string) {
    const distSubDir = path.join(distRoot, appName);
    const ifs = new InMemoryFileSystemHost();
    function loadAllFiles() {
        const names: FileInfo[] = [];
        fs.readdirSync(distSubDir).forEach(file => {
            const ifNumber = file.match(/^(\d+)_lebab\.js$/)?.[1];
            if (ifNumber) {
                const tsName = `/${ifNumber}.ts`;
                ifs.writeFileSync(tsName, fs.readFileSync(path.join(distSubDir, file), 'utf-8'));
                names.push({ tsName, ifNumber, decompileName: path.join(distSubDir, `${ifNumber}_decompile.jsx`) });
            }
        });
        return names;
    }

    const fileInfos = loadAllFiles();
    // initialize
    const project = new Project({
        fileSystem: ifs,
    });


    function transformFile(fileInfo: FileInfo) {
        const { tsName, decompileName } = fileInfo;
        const sourceFile = project.addSourceFileAtPath(tsName);
        if (!sourceFile) {
            throw new Error('source file not found');
        }
        const module = extractModuleInfo(sourceFile);
        return module;
    }

    const allModuleInfo = fileInfos/* .slice(1, 2) */.map(fileInfo => transformFile(fileInfo));
    const pluginInfos: ({ pluginName: string })[] = [];
    const removableNames: string[] = [];
    allModuleInfo.forEach(element => {
        if (element.callAccess.some((x: string) => x.indexOf('registerEditorPlugin') != -1)) {
            const pluginName = element.exports.find((x: string) => x.indexOf('Plugin') != -1);
            if (pluginName) {
                pluginInfos.push({
                    ...element,
                    pluginName: pluginName,
                });
            }
        }
        if (element.tags.length > 0) {
            removableNames.push(element.fileName.match(/^\/(\d+)\.ts$/)![1]);
        }
    });
    fs.writeJSONSync(path.join(distSubDir, 'module_info.json'), {
        allModuleInfo,
        removableNames
    }, {
        spaces: 2
    });
}


export function extractModuleInfo(sourceFile: SourceFile) {
    const fileName = sourceFile.getSourceFile().getFilePath();

    // 分析require call 和 exports assignment
    const info = {
        fileName,
        imports: [] as string[],
        exports: [] as string[],
        callAccess: [] as string[],
        rendererName: [] as string[],
        tags: [] as string[],
    };
    visitAllNodes(sourceFile, (node) => {
        if (Node.isCallExpression(node)) {
            const callee = node.getExpression();
            if (Node.isIdentifier(callee)) {
                if (
                    callee.getText() === 'require'
                    || callee.getText() === '__require__'
                ) {
                    const args = node.getArguments();
                    if (args.length === 1) {
                        const arg = args[0];
                        info.imports.push(arg.getText());
                    }
                }
            } else if (Node.isParenthesizedExpression(callee)) {
                const innerCallee = callee.getExpression();
                if (Node.isBinaryExpression(innerCallee)
                    && innerCallee.getOperatorToken().getText() === ','
                    && Node.isNumericLiteral(innerCallee.getLeft())
                ) {
                    const j = innerCallee.getRight();
                    info.callAccess.push(j.getText());
                }
            }
        } else if (Node.isBinaryExpression(node)) {
            if (node.getOperatorToken().getText() === '=') {
                const left = node.getLeft();
                if (Node.isPropertyAccessExpression(left)) {
                    if (left.getExpression().getText() === 'exports') {
                        const right = left.getName();
                        right && info.exports.push(right);
                    }
                }
            }
        } else if (Node.isIdentifier(node)
            && node.getText() === 'rendererName'
        ) {
            const parent = node.getParentIfKind(SyntaxKind.PropertyAccessExpression);
            if (parent) {
                const valueAsignment = parent.getParentIfKind(SyntaxKind.BinaryExpression);
                if (valueAsignment && valueAsignment.getOperatorToken().getText() === '=') {
                    const value = valueAsignment.getRight();
                    value && info.rendererName.push(value.getText());
                }
            }
        } else if (Node.isIdentifier(node)
            && node.getText() === 'tags'
        ) {
            const parent = node.getParentIfKind(SyntaxKind.PropertyAccessExpression);
            if (parent) {
                const valueAsignment = parent.getParentIfKind(SyntaxKind.BinaryExpression);
                if (valueAsignment && valueAsignment.getOperatorToken().getText() === '=') {
                    const value = valueAsignment.getRight();
                    if (Node.isArrayLiteralExpression(value)) {
                        const items = value.getElements();
                        items.forEach(item => {
                            info.tags.push(item.getText());
                        });
                    }
                }
            }
        }

        return node;
    });

    info.imports = uniq(info.imports);
    info.exports = uniq(info.exports);
    info.callAccess = uniq(info.callAccess);

    return info;
}
