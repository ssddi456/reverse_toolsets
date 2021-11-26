import * as fs from "fs-extra";
import * as path from "path";
import { distRoot, } from "./consts";
import { Block, CodeBlockWriter, ExpressionStatement, Node, Project, SourceFile, Statement, StatementedNode } from "ts-morph";

import { InMemoryFileSystemHost, SyntaxKind } from '@ts-morph/common';
import * as prettier from 'prettier';
import { visitAllNodes } from './project_utils';

export function expandCommaExpression(writer: CodeBlockWriter, node: Node) {
    const nodes = [];
    let currentNode: Node = node;
    while (
        currentNode
        && Node.isBinaryExpression(currentNode)
        && currentNode.getOperatorToken().getText() == ','
    ) {
        nodes.unshift(currentNode.getRight());
        currentNode = currentNode.getLeft();
    }
    nodes.unshift(currentNode);

    nodes.forEach((node) => {
        writer.writeLine(node.getText() + ';');
    });
}
export interface FileInfo {
    tsName: string;
    ifNumber: string;
    decompileName: string;
    extData?: any;
}
export default async function optimizeDecompile(appName: string) {
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
    project.resolveSourceFileDependencies();

    function transformFile(fileInfo: FileInfo) {
        const { tsName, decompileName } = fileInfo;
        const sourceFile = project.addSourceFileAtPath(tsName);
        if (!sourceFile) {
            throw new Error('source file not found');
        }
        const modifiedCode = optimizeDecompileSourceFile(sourceFile);

        fs.writeFileSync(decompileName, modifiedCode);
    }

    fileInfos/* .slice(1, 2) */.forEach(fileInfo => transformFile(fileInfo));
    // console.log(JSON.stringify(returnParents, null, 2));
    // console.log(JSON.stringify(blockFiles, null, 2));
    // console.log(JSON.stringify(ifFiles, null, 2));
    // console.log(JSON.stringify(caseFiles, null, 2));

    return fileInfos;
}

export function optimizeDecompileSourceFile(sourceFile: SourceFile) {
    const fileName = sourceFile.getSourceFile().getFilePath();

    visitAllNodes(sourceFile, (node) => {
        const parent = node.getParent();
        const parentKind = parent?.getKindName?.();
        const returnIndex = node.getChildIndex();

        // fix export function default => export default function
        if (Node.isFunctionDeclaration(node)
            && node.getName() == 'default'
            && node.getExportKeyword()
        ) {
            // 把这个节点改成 export default
            node.toggleModifier('default');
            node.removeName();
        }
        // resolve commaExpressions
        if (Node.isBinaryExpression(node)
            && node.getOperatorToken().getText() === ','
        ) {
            console.log('commaExpression', parentKind, fileName);
            switch (parentKind) {
                case 'ExpressionStatement':
                    console.log('commaExpression', parent?.getParent()?.getKindName?.());
                    const parentParent = parent?.getParent();
                    if (parentParent && (
                        Node.isBlock(parentParent)
                        || Node.isCaseClause(parentParent)
                        || Node.isSourceFile(parentParent)
                        // || Node.isIfStatement(parentParent)
                    )) {
                        parentParent!.insertStatements(parent!.getChildIndex(), (writer) => {
                            expandCommaExpression(writer, node);
                        });
                        (parent as ExpressionStatement).remove();
                        return;
                    }
                default:
                    break;
            }
        }
        if (Node.isReturnStatement(node)
        ) {
            const commaExpression = node.getExpressionIfKind(SyntaxKind.BinaryExpression);
            const isCommaExpression = commaExpression?.getOperatorToken()?.getText() === ',';
            if (isCommaExpression) {

                console.log(parentKind);

                switch (parentKind) {
                    case 'Block':
                        (parent as Block).insertStatements(returnIndex, (writer) => {
                            expandCommaExpression(writer, commaExpression.getLeft());
                            writer.writeLine(`return ${commaExpression.getRight().getText()};`);
                        });
                        node.remove();
                        break;
                    case 'IfStatement':
                        break;
                    case 'CaseClause':
                        break;
                    default:
                        break;
                }
                return;
            }
        }
        return node;
    });

    try {

        const modifiedCode = prettier.format(sourceFile.print()!, {
            parser: 'typescript',
            trailingComma: 'all'
        });
        return modifiedCode;
    } catch (error) {
        console.log('failed at file', fileName, error);
        throw error;
    }
}

