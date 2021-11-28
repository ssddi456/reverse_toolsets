import * as ts from "typescript";

const source = `
let x: string  = 'string';
const b = { a: 1, b: 2 };
if (b?.a?.c) {
    console.log(b?.a?.c);
}
b?.a
a?.a()
a.a?.()
a?.a(1)
a??1
a?.()
l.props.envCreator?.(l.props)
`;

const source1 = `
const a = async (a) => {
    switch (await a) {
        case 1: {
            await a;
        }
        break;
        case 2: {
            const e = 1;
            await ac;
        }
        break;
        default: {
            return b;
        }
    }

    const m = 3;
    return 1;
}
`;
let result = ts.transpileModule(source1, { compilerOptions: { module: ts.ModuleKind.CommonJS } });

console.log(result.outputText);