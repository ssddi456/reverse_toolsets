import * as fs from "fs-extra";
import * as path from "path";
import { distRoot, } from "./consts";
import { Project } from "ts-morph";

import { InMemoryFileSystemHost } from '@ts-morph/common';
import { default as optimizeDecompileCore, extractModuleInfo, FileInfo, optimizeDecompileSourceFile } from './optimize_decompile';

// ts-node -T bin\dewebpack.ts optimize_rollup_decompile index.min.js > log
export default async function optimizeDecompile(appName: string) {
    const fileInfos = await optimizeDecompileCore(appName);

    const distSubDir = path.join(distRoot, appName);
    const indexInfo: FileInfo = {
        tsName: '/index.ts',
        ifNumber: 'index',
        decompileName: path.join(distSubDir, `index_decompile.js`),
    };
    const ifs = new InMemoryFileSystemHost();
    ifs.writeFileSync(indexInfo.tsName, fs.readFileSync(path.join(distSubDir, 'index.js'), 'utf8'));

    const project = new Project({
        fileSystem: ifs,
    });
    project.resolveSourceFileDependencies();

    const sourceFile = project.addSourceFileAtPath(indexInfo.tsName)!;
    const code = optimizeDecompileSourceFile(sourceFile);
    indexInfo.extData = extractModuleInfo(sourceFile);
    fileInfos.push(indexInfo);

    fs.writeFileSync(indexInfo.decompileName, code);
    const pluginInfos: (FileInfo & { pluginName: string })[] = [];
    fileInfos.forEach(element => {
        if (element.extData.callAccess.some((x: string) => x.indexOf('registerEditorPlugin') != -1)) {
            const pluginName = element.extData.exports.find((x: string) => x.indexOf('Plugin') != -1);
            if (pluginName) {
                pluginInfos.push({
                    ...element,
                    pluginName: pluginName,
                });
            }
        }
    });
    fs.writeJSONSync(path.join(distSubDir, 'fileInfos.json'), { fileInfos, pluginInfos }, {
        spaces: 2
    });
}
