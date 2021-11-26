import * as glob from 'glob';
import * as path from 'path';
import * as fs from 'fs-extra';

export async function walkDir({
    root = process.cwd(),
    output,
    pattern = '**',
    callback
}: {
    root?: string,
    output: string,
    pattern?: string,
    callback: (file: string) => { parsed: string, source: string } | Promise<{ parsed: string, source: string }>
}
) {
    const files = glob.sync(pattern, { cwd: root });
    for (let index = 0; index < files.length; index++) {

        const { parsed, source } = await callback(files[index]);
        const outfile = path.join(output, path.relative(root, source));
        console.log('element', files[index], path.dirname(outfile));
        fs.ensureDirSync(path.dirname(outfile));
        fs.writeFileSync(outfile, parsed);
    }
}