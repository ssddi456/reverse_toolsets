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
    console.log(2222);
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

(row || col)?.length
l.default(e.subRenderers, ({ id }) => id === e.dragId)?.xxxx
`;

const source2 = `
[a, ...b, c];
[...b, c];
[a, ...b];
`;
const source3 = `
async function test () {
    let e, t, a;
    e = this.state;
    t = e.wrongSchema;
    a = e.value;
    t &&    ((await s.prompt([])) ? this.setState({
                    wrongSchema: "",
                    contents: JSON.stringify(a),
                  })
                : this.editor.focus());
    return;
}
async function test () {
    t? (some, await s.prompt([])): (22, await this.editor.focus());
}
`;
const source4 = `
async function test () {
    if (x) {
        console.log(1);
    } else if (y) {
        await console.log(2);
    } else {
        console.log(3);
    }
}
async function test () {
    if (x) {
        console.log(1);
    } else if (z){
        if (e.dragType == "subrenderer" ?? some){
            await console.log(3);
        } else {
            console.log(2);
        }
    } else {
        console.log(4)
    }
}

async function test () {
    if (x) {
        await console.log(1);
    }
}

async function test () {
    if (!x) {
        console.log(2);
    } else {
        await console.log(1);
    }
}
async function test () {
    if (!x) {
        await console.log(2);
    } else {
        console.log(1);
    }
}
    `;
let result = ts.transpileModule(source4, {
    compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        noEmitHelpers: true,
    }
});

console.log(result.outputText);
