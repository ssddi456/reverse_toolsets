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
    try {
        await console.log(1);
    }
    catch (e){}
    finally {
        console.log(2);
    }
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
async function a() {
}
`;
let result = ts.transpileModule(source1, {
    compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        noEmitHelpers: false,
    }
});

console.log(result.outputText);
