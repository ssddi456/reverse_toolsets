import * as path from "path";
import fs from 'fs-extra';

export const source = path.join(__dirname, '../source');
export const distRoot = path.join(__dirname, '../dist');
export const repackRoot = path.join(__dirname, '../repack');
fs.ensureDirSync(source);
fs.ensureDirSync(distRoot);
fs.ensureDirSync(repackRoot);