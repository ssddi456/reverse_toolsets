import { SourceFile } from './../lib/CompilerApi';
import * as ts from 'typescript';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as tsMorph from 'ts-morph';
import { createExpressPatternFromCode, loadSourceCode, matchExpressionWithPattern } from '../lib/utils';
import { extractModuleInfo } from '../lib/create_module_info';
import { intersection } from 'lodash';

const ext_source_module_template_code = `function(e, t, n) {
    e.exports = n.p + "318dcae1cdcd4733986a93e7a5fab7b8.js"
}`

const ext_source_module_pattern = createExpressPatternFromCode(ext_source_module_template_code);

const source = path.join(__dirname, '../dist/plugins/umi.js');
const filteredFileName: string[] = ['zsMm'];

async function removeExternalResource() {
    const files = await fs.readdir(source);
    for (let index = 0; index < files.length; index++) {
        const element = files[index];
        // if (!filteredFileName.includes(element)) {
        //     continue;
        // }
        const code = fs.readFileSync(path.join(source, element), 'utf-8');
        const sourcefile = createExpressPatternFromCode(code);
        const result = matchExpressionWithPattern(sourcefile, ext_source_module_pattern);
        if (result) {
            console.log(path.join(source, element), result);
            fs.removeSync(path.join(source, element));
        }
    }
}

async function removeAceModules() {
    const files = await fs.readdir(source);
    for (let index = 0; index < files.length; index++) {
        const element = files[index];
        // if (!filteredFileName.includes(element)) {
        //     continue;
        // }
        const code = fs.readFileSync(path.join(source, element), 'utf-8');
        
        const result = code.match(/ace.define\("ace/)
        if (result) {
            console.log(path.join(source, element));
            fs.removeSync(path.join(source, element));
        }
    }
}

async function renameTopLevelSymbols() {
    const files = await fs.readdir(source);
    for (let index = 0; index < files.length; index++) {
        const element = files[index];
        // if (!filteredFileName.includes(element)) {
        //     continue;
        // }
        const code = fs.readFileSync(path.join(source, element), 'utf-8');
        
        const sourceFile = loadSourceCode('temp.ts', code);
        const topFunction = sourceFile.getFirstDescendantByKind(tsMorph.SyntaxKind.FunctionDeclaration);
        if (topFunction) {
            const params = topFunction.getParameters();
            if (params[0] && params[0].getName() === 'e') {
                const e = params[0];
                e.rename('module');
            }
            if (params[1] && params[1].getName() === 't') {
                const t = params[1];
                t.rename('exports');
            }
            if (params[2] && params[2].getName() === 'n') {
                const n = params[2];
                n.rename('require');
            }

            fs.writeFileSync(path.join(source, element), sourceFile.getFullText());
        }
    }
}



async function depsAnalyzer() {
    const files = await fs.readdir(source);
    const depsMap: Record<string, any> = {};
    for (let index = 0; index < files.length; index++) {
        const element = files[index];
        if (element.endsWith('.json')) {
            continue;
        }
        // if (!filteredFileName.includes(element)) {
        //     continue;
        // }
        const code = fs.readFileSync(path.join(source, element), 'utf-8');
        
        const sourceFile = loadSourceCode(element + '.ts', code);
        
        const info = extractModuleInfo(sourceFile);
        depsMap[element] = info;
    }
    
    // calculate deps
    for (const key in depsMap) {
        const realModule = depsMap[key];
        const moduleKey = decodeURIComponent(key);
        realModule.imports.forEach((importName: string) => {
            const normalizeImportName = importName.replace(/^"|"$/g, '');
            const importModule = depsMap[normalizeImportName];
            if (importModule) {
                importModule.dependentBy = importModule.dependentBy || [];
                importModule.dependentBy.push(moduleKey);
            }
            return importModule;
        });
    }
    // calculate deps
    console.log(path.join(source, 'deps.json'));
    
    fs.outputJSONSync(path.join(source, 'deps.json'), depsMap, {
        spaces: 4,
    });
}

async function replaceKeyModuleName() {
    const modules: Record<string, string[]> = { react: ['viRO', 'q1tI']};
    const files = await fs.readdir(source);
    const depsMap = fs.readJSONSync(path.join(source, 'deps.json'));
    
    for (const moduleKey in depsMap) {
        if (Object.prototype.hasOwnProperty.call(depsMap, moduleKey)) {
            const element = depsMap[moduleKey];
            if (element.imports.length === 0) {
                continue;
            }
            for (const key in modules) {
                if (Object.prototype.hasOwnProperty.call(modules, key)) {
                    const replaceFrom = modules[key];
                    if (intersection((element.imports as string[]).map(x => x.replace(/^"|"$/g, '')), replaceFrom).length > 0) {
                        
                        const sourceFile = loadSourceCode(moduleKey + '.ts', fs.readFileSync(path.join(source, moduleKey), 'utf-8'));
                        // find all require call
                        const requireCalls = sourceFile.getDescendantsOfKind(tsMorph.SyntaxKind.CallExpression).filter(x => x.getText().startsWith('require('));
                        requireCalls.forEach(call => {
                            const args = call.getArguments();
                            if (args.length > 0) {
                                const requirePath = args[0].getText().replace(/^"|"$/g, '');
                                if (replaceFrom.includes(requirePath)) {
                                    args[0].replaceWithText(`"${key}"`);
                                }
                            }
                        });

                        fs.writeFileSync(path.join(source, key), sourceFile.getFullText());
                    }
                }
            }
        }
    }
}

async function decodeUnicodeString() {
    const files = await fs.readdir(source);
    for (let index = 0; index < files.length; index++) {
        const element = files[index];
        console.log(index, '/', files.length, path.join(source, element));
        const code = fs.readFileSync(path.join(source, element), 'utf-8');
        const sourceFile = loadSourceCode(element + '.ts', code);
        const regHasUnicode = /\\u/;
        if (!regHasUnicode.test(code)) {
            continue;
        }
        const stringLiterals = sourceFile.getDescendantsOfKind(tsMorph.SyntaxKind.StringLiteral);
        if (stringLiterals.length === 0) {
            continue;
        }
        let hasUnicode = false;
        if (stringLiterals.length > 1000) {
            continue;
        }
        stringLiterals.forEach(literal => {
            if (literal.getText().includes('\\u')) {
                try {
                    const decoded = JSON.parse(`"${literal.getLiteralValue()}"`);
                    literal.replaceWithText(JSON.stringify(decoded));
                    hasUnicode = true;
                } catch (error) {
                    console.log(path.join(source, element), literal.getLiteralValue());
                }
            }
        });
        if (hasUnicode) {
            fs.writeFileSync(path.join(source, element), sourceFile.getFullText());
        }
    }
}


async function findStr(snippet: string) {
    const files = await fs.readdir(source);
    for (let index = 0; index < files.length; index++) {
        const element = files[index];
        const code = fs.readFileSync(path.join(source, element), 'utf-8');
        if (code.includes(snippet)) {
            console.log(path.join(source, element));
        }
    }
}



(async () => {
    // await removeExternalResource();
    // await removeAceModules();
    // await renameTopLevelSymbols();
    // await depsAnalyzer();
    // await replaceKeyModuleName();
    // await decodeUnicodeString();
    await findStr(`.wasm`);
})();