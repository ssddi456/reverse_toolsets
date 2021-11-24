import * as fs from "fs-extra";
import * as path from "path";
import { distRoot, } from "./consts";
import { Project } from "ts-morph";

import { InMemoryFileSystemHost } from '@ts-morph/common';
import { default as optimizeDecompileCore, FileInfo, optimizeDecompileSourceFile } from './optimize_decompile';

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

    fs.writeFileSync(indexInfo.decompileName, code);
}
