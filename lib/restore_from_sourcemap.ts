import fs = require('fs-extra');
import { RawSourceMap } from "source-map";

export async function restoreFromSourceMap(filePath: string, sourceMapPath?: string): Promise<{ parsed: string, source: string }> {
    const source = await fs.readFile(filePath, 'utf8');

    const sourceMapData = await (async () => {
        return sourceMapPath ? await fs.readFile(sourceMapPath, 'utf8')
            : (source.split('\n')
                .find(line => line.includes('//# sourceMappingURL=')) || '');
    })();

    const [_, rawSourceMap] = source.split('//# sourceMappingURL=data:application/json;base64,');
    const sourceMapBuffer = Buffer.from(rawSourceMap, 'base64').toString('utf8');
    // console.log('sourceMapBuffer', sourceMapBuffer);

    const sourceMapObj = JSON.parse(sourceMapBuffer) as RawSourceMap;
    const parsed = (sourceMapObj.sourcesContent || []).join('');

    return { parsed, source: sourceMapObj.sources[0] };
}
