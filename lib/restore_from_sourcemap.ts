import fs from 'fs-extra';
import path from 'path';
import { MappingItem, SourceMapConsumer } from "source-map";
import * as prettier from "prettier";
import { distRoot } from './consts';

// ts-node -T bin/dewebpack.ts restore_from_sourcemap source/copilot-extension.js.map > log
export async function restoreFromSourceMap(filePath: string, generatedFile: string): Promise<void> {
    let source = await fs.readFile(filePath, 'utf8');
    if (source.includes('//# sourceMappingURL=data:application/json;base64,')) {
        const [_, rawSourceMap] = source.split('//# sourceMappingURL=data:application/json;base64,');
        source = Buffer.from(rawSourceMap, 'base64').toString('utf8');
    }
    let generatedFileContent = await fs.readFile(generatedFile, 'utf8');
    let generatedFileContentLines = generatedFileContent.split('\n');

    const consumer = await new SourceMapConsumer(source);
    consumer.computeColumnSpans();
    const allFileName = consumer.sources;
    const {
        normalizedRoot,
    } = flattenDirTree(allFileName);

    if (!consumer.hasContentsOfAllSources()) {
        console.warn('not all sources are available');
    }
    fs.ensureDirSync('./' + normalizedRoot);
    const getOutputFile = (fileName: string) => path.join(distRoot, './' + normalizedRoot, fileName);

    let currentSource = '';
    let currentSourceInfo: {
        outfilePath: string;
        currentOriginalLine: number;
        startToken: MappingItem | null;
        lastToken: MappingItem | null;
    } | null = null;


    const filterForFileName = {
        '../node_modules/source-map-support/register.js': 1
    }

    const writeedFiles = new Set<string>();

    const outputSource = (nextToken?: MappingItem) => {
        if (!currentSourceInfo) {
            return;
        }
        if (!(currentSourceInfo.startToken!.source in filterForFileName)) {
            return;
        }
        
        console.log(
            'startToken', currentSourceInfo.startToken,
            'lastToken', currentSourceInfo.lastToken,
            'nextToken', nextToken,
        );

        const startLine = currentSourceInfo.startToken!.generatedLine;
        const startColumn = currentSourceInfo.startToken!.generatedColumn;
        const endLine = currentSourceInfo.lastToken!.generatedLine;
        const endColumn = (currentSourceInfo.lastToken as any)!.lastGeneratedColumn;
        console.log('startLine', startLine, 'startColumn', startColumn, 'endLine', endLine, 'endColumn', endColumn);
        let oldContent = '';
        if (writeedFiles.has(currentSourceInfo.outfilePath)) {
            oldContent = fs.readFileSync(currentSourceInfo.outfilePath, 'utf8');
        }
        writeedFiles.add(currentSourceInfo.outfilePath);

        if (startLine === endLine) {
            const content = generatedFileContentLines[startLine - 1].slice(startColumn - 1, endColumn);
            if (oldContent && oldContent !== content) {
                console.log('rewrite oldContent ', currentSourceInfo.outfilePath);
                console.log(oldContent);
            }
            fs.outputFileSync(currentSourceInfo.outfilePath, content);
        } else {
            const prefixLine = generatedFileContentLines[startLine - 1];
            const prefixContent = prefixLine.slice(startColumn - 1);
            const middleContent = (startLine) !== (endLine - 1)
                ? generatedFileContentLines.slice(startLine, endLine - 1)
                : [];
            const suffixLine = generatedFileContentLines[endLine - 1];
            const suffixContent = suffixLine.slice(0, endColumn);
            console.log(
                startLine - 1, '-', startLine, '-', endLine - 1, '-',
                endLine - 1 - startLine, ':',  middleContent.length,
            );

            console.log('suffixContent', suffixLine.slice(endColumn - 20, endColumn + 20));
            const content = [
                prefixContent,
                ...middleContent,
                suffixContent,
            ];
            if (oldContent && oldContent !== content.join('\n')) {
                console.log('rewrite', currentSourceInfo.outfilePath);
            }
            fs.outputFileSync(currentSourceInfo.outfilePath, content.join('\n'));
        }
    }

    consumer.eachMapping((m) => {

        // console.log(m.source, m.name, m);
        let outfilePath: string;
        if (m.source !== currentSource) {
            if (currentSourceInfo) {
                outputSource(m);
            }
            outfilePath = getOutputFile(m.source);
            currentSource = m.source;
            currentSourceInfo = {
                outfilePath,
                currentOriginalLine: 0,
                startToken: m,
                lastToken: null,
            };
        } else {
            outfilePath = currentSourceInfo!.outfilePath;
        }

        currentSourceInfo!.lastToken = m;
    });
    outputSource();
}

function flattenDirTree(allFileName: string[]) {
    interface DirInfo {
        [key: string]: string | DirInfo;
    }

    let dirTree: DirInfo = { '.': {} };
    allFileName.forEach(fileName => fileName.split('/')
        .reduce((parentDir: DirInfo, next: string, i) => {
            // create dir tree
            if (!parentDir[next]) {
                if (i == fileName.length - 1) {
                    parentDir[next] = fileName;
                } else {
                    parentDir[next] = { '.': {} };
                }
            }

            return parentDir[next] as DirInfo;
        }, dirTree));

    const root = [];
    // normalize dir tree
    if (dirTree['..']) {
        let needExpandParent = true;
        while (needExpandParent) {
            root.push('child');
            if (!(typeof dirTree['..'] === 'string')) {
                const oldCurrent = dirTree['.'];
                dirTree = {
                    '.': {
                        ...dirTree['..'],
                    }
                };
                if (oldCurrent) {
                    (dirTree['.'] as DirInfo)['child'] = oldCurrent;
                }
                needExpandParent = !!(dirTree['.'] as DirInfo)?.['..'];
            } else {
                dirTree = {
                    '.': {
                        [dirTree['..']]: dirTree['..'],
                        'child': dirTree['.']
                    }
                };
            }
        }
    }
    return {
        normalizedRoot: root.join('/'),
    }
}
