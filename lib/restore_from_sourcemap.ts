import fs = require('fs-extra');
import * as path from 'path';
import { SourceMapConsumer, RawSourceMap } from "source-map";

export async function restoreFromSourceMap(filePath: string, sourceMapPath?: string): string {
    const source = await fs.readFile(filePath, 'utf8');

    const sourceMapData = await (async () => {
        return sourceMapPath ? await fs.readFile(sourceMapPath, 'utf8')
            : (source.split('\n')
                .find(line => line.includes('//# sourceMappingURL=')) || '');
    })();

    const rawSourceMap = sourceMapData.split('//# sourceMappingURL=data:application/json;base64,')[1]；
    const sourceMapBuffer = Buffer.from(rawSourceMap, 'base64').toString('ascii');
    const parsed = new SourceMapConsumer(JSON.parse(sourceMapBuffer) as RawSourceMap);

    fs.writeFile(path.basename(filePath) + '.ts', parsed.sourceContentFor(source), function (err) {
        if (err) return console.log(err);
    });
}
