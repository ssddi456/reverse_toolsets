import * as fs from 'fs-extra';
import path from 'path';
import * as prettier from "prettier";
import { source } from './consts';

// ts-node -T bin/dewebpack.ts prettier plugins/extension.js > log
// ts-node -T bin/dewebpack.ts prettier action.js > log
export async function doPretty(file: string) {
    const sourceFilePath = path.join(source, file);
    const fileContent = fs.readFileSync(sourceFilePath, 'utf-8');
    console.log('source file loaded', fileContent.length);
    const code = prettier.format(fileContent, {
        parser: 'babel',
        semi: true,
        singleQuote: true,
        trailingComma: 'es5',
    });
    console.log('formatted file', code.length);
    fs.outputFileSync(sourceFilePath, code);
}