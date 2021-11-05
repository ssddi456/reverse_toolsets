import * as commander from 'commander';
import extract_modules from '../lib/extract_modules';

const program = new commander.Command();
program.command('extract_modules')
    .action(() => {
        extract_modules()
    })
program.parse(process.argv);
