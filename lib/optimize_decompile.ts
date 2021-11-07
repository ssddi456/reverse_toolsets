import * as fs from "fs";
import * as path from "path";
import { distRoot, } from "./consts";
import { Block, CodeBlockWriter, ExpressionStatement, Node, Project, Statement, StatementedNode } from "ts-morph";

import { InMemoryFileSystemHost, SyntaxKind } from '@ts-morph/common';
import * as prettier from 'prettier';

function expandCommaExpression(writer: CodeBlockWriter, node: Node) {
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
        writer.writeLine(node.getText());
    });
}
export default function optimizeDecompile() {
    interface FileInfo {
        tsName: string;
        ifNumber: string;
        decompileName: string;
    }
    const ifs = new InMemoryFileSystemHost();
    function loadAllFiles() {
        const names: FileInfo[] = [];
        fs.readdirSync(distRoot).forEach(file => {
            const ifNumber = file.match(/^(\d+)_lebab\.js$/)?.[1];
            if (ifNumber) {
                const tsName = `/${ifNumber}.ts`;
                ifs.writeFileSync(tsName, fs.readFileSync(path.join(distRoot, file), 'utf-8'));
                names.push({ tsName, ifNumber, decompileName: path.join(distRoot, `${ifNumber}_decompile.jsx`) });
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
    const returnParents: Record<string, number> = {};
    const blockFiles: Record<string, number> = {};
    const ifFiles: Record<string, number> = {};
    const caseFiles: Record<string, number> = {};
    function transformFile({ tsName, decompileName }: FileInfo) {
        const sourceFile = project.addSourceFileAtPath(tsName);
        if (!sourceFile) {
            throw new Error('source file not found');
        }

        visitAllNodes(sourceFile, (node) => {
            const parent = node.getParent();
            const parentKind = parent?.getKindName?.();
            const fileName = node.getSourceFile().getFilePath();
            const returnIndex = node.getChildIndex();

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
                            blockFiles[fileName] = 1;
                            break;
                        case 'IfStatement':
                            ifFiles[fileName] = 1;
                            break;
                        case 'CaseClause':
                            caseFiles[fileName] = 1;
                            break;
                        default:
                            break;
                    }
                    returnParents[parentKind || ''] = (returnParents[parentKind || ''] || 0) + 1;
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
    
            fs.writeFileSync(decompileName, modifiedCode);
        } catch (error) {
            console.log('failed at file', tsName, error);
        }
    }

    fileInfos/* .slice(1, 2) */.forEach(fileInfo => transformFile(fileInfo));
    // console.log(JSON.stringify(returnParents, null, 2));
    // console.log(JSON.stringify(blockFiles, null, 2));
    // console.log(JSON.stringify(ifFiles, null, 2));
    // console.log(JSON.stringify(caseFiles, null, 2));

}

function visitAllNodes(root: Node, callback?: (node: Node) => Node | undefined) {
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

if (require.main === module) {
    optimizeDecompile();
}