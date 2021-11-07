import * as commander from 'commander';
import extract_modules from '../lib/extract_modules';
import lebab_module from '../lib/lebab_module';

const program = new commander.Command();
program.command('extract_modules')
    .action(() => {
        extract_modules()
    })
program.command('lebab_module')
    .action(() => {
        lebab_module()
    })
program.parse(process.argv);
