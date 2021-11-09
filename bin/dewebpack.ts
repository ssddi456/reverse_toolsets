import * as commander from 'commander';
import extract_modules from '../lib/extract_modules';
import extract_rollup_modules from '../lib/extract_rollup_module';
import lebab_module from '../lib/lebab_module';
import lebab_rollup_module from '../lib/lebab_rollup_module';
import optimize_decompile from '../lib/optimize_decompile';
import optimize_rollup_decompile from '../lib/optimize_rollup_decompile';

const program = new commander.Command();
program.command('extract_modules [appName]')
    .action((appName) => {
        extract_modules(appName);
    });
program.command('extract_rollup_module [appName]')
    .action((appName) => {
        extract_rollup_modules(appName);
    });
program.command('lebab_rollup_module [appName]')
    .action((appName) => {
        lebab_rollup_module(appName)
    });
program.command('lebab_module [appName]')
    .action((appName) => {
        lebab_module(appName)
    });
program.command('optimize_decompile [appName]')
    .action((appName) => {
        optimize_decompile(appName)
    });
program.command('optimize_rollup_decompile [appName]')
    .action((appName) => {
        optimize_rollup_decompile(appName)
    });
program.command('all [appName]')
    .action(async (appName) => {
        await extract_modules(appName);
        await lebab_module(appName);
        await optimize_decompile(appName);
    });
program.command('all_rollup [appName]')
    .action(async (appName) => {
        await extract_rollup_modules(appName);
        await lebab_rollup_module(appName);
        await optimize_rollup_decompile(appName);
    });
program.parse(process.argv);
