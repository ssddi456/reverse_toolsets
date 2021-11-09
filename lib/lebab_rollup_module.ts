import * as fs from "fs";
import * as path from "path";
import { distRoot, } from "./consts";
import { Project } from "ts-morph";
import { InMemoryFileSystemHost } from '@ts-morph/common';
import lebab_module, { FileInfo, transformFile } from './lebab_module';

// ts-node -T bin\dewebpack.ts lebab_rollup_module index.min.js > log
export default async function lebab_rollup_module(appName: string): Promise<void> {

    await lebab_module(appName);
    const distSubDir = path.join(distRoot, appName);
    const indexInfo: FileInfo = {
        tsName: '/index.ts',
        ifNumber: 'index',
        lebabName: path.join(distSubDir, `index_lebab.js`),
    };
    const ifs = new InMemoryFileSystemHost();
    ifs.writeFileSync(indexInfo.tsName, fs.readFileSync(path.join(distSubDir, 'index.js'), 'utf8'));

    const project = new Project({
        fileSystem: ifs,
    });
    project.resolveSourceFileDependencies();

    const sourceFile = project.addSourceFileAtPath(indexInfo.tsName)!;
    const code = transformFile(sourceFile)
    fs.writeFileSync(indexInfo.lebabName, code);
}
