import * as fs from "fs-extra";
import * as path from "path";
import { InMemoryFileSystemHost } from 'ts-morph';
import { distRoot, repackRoot, } from "./consts";


export interface FileInfo {
    tsName: string;
    ifNumber: string;
    decompileName: string;
}
// ts-node -T repack_rollup_module index.min.js > log
export async function repack_rollup_module(appName: string) {
    const ifs = new InMemoryFileSystemHost();

    fs.ensureDirSync(repackRoot,);
    function loadAllFiles() {
        const names: FileInfo[] = [];
        const distSubDir = path.join(distRoot, appName);
        fs.readdirSync(distSubDir).forEach(file => {
            const ifNumber = file.match(/^(\d+)\.js$/)?.[1];
            if (ifNumber) {
                const tsName = `/${ifNumber}.ts`;
                ifs.writeFileSync(tsName, fs.readFileSync(path.join(distSubDir, file), 'utf-8'));
                names.push({ tsName, ifNumber, decompileName: path.join(distSubDir, `${ifNumber}_decompile.js`) });
            }
        });
        return names;
    }

    loadAllFiles();
    //
    // packfiles

    // write
    fs.writeFileSync(path.join(repackRoot, appName), '');
}
