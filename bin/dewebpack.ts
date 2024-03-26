#!/usr/bin/env node

import * as commander from 'commander';
import extract_modules from '../lib/extract_modules';
import extract_rollup_module from '../lib/extract_rollup_module';
import extract_named_modules from '../lib/extract_named_modules';
import lebab_module from '../lib/lebab_module';
import lebab_rollup_module from '../lib/lebab_rollup_module';
import optimize_decompile from '../lib/optimize_decompile';
import optimize_rollup_decompile from '../lib/optimize_rollup_decompile';
import repack_rollup_module from '../lib/repack_rollup_module';
import create_module_info from '../lib/create_module_info';
import modify_index from '../lib/modify_index';
import update_imports from '../lib/update_imports';
import { restoreFromSourceMap } from '../lib/restore_from_sourcemap';
import { walkDir } from '../lib/walk_dir';
import * as fs from 'fs-extra';

const program = new commander.Command();
program.command('extract_modules')
    .argument('<bundleName>', 'bundle file name')
    .action((appName) => {
        extract_modules(appName);
    });
program.command('extract_rollup_module')
    .argument('<bundleName>', 'bundle file name')
    .action((appName) => {
        extract_rollup_module(appName);
    });
program.command('extract_named_modules')
    .argument('<bundleName>', 'bundle file name')
    .action((appName) => {
        extract_named_modules(appName);
    });
program.command('lebab_rollup_module')
    .argument('<bundleName>', 'bundle file name')
    .action((appName) => {
        lebab_rollup_module(appName)
    });
program.command('lebab_module')
    .argument('<bundleName>', 'bundle file name')
    .argument('[config', 'config file name')
    .action((appName, config) => {
        if (config) {
            const fileMap = (() => {
                try {
                    return require(config);
                } catch (error) {
                    return fs.readJSONSync(config);
                }
            })();
            lebab_module(appName, fileMap);
        } else {
            lebab_module(appName)
        }
    });
program.command('optimize_decompile')
    .argument('<bundleName>', 'bundle file name')
    .action((appName) => {
        optimize_decompile(appName)
    });
program.command('optimize_rollup_decompile')
    .argument('<bundleName>', 'bundle file name')
    .action((appName) => {
        optimize_rollup_decompile(appName)
    });
program.command('repack_rollup_module')
    .argument('<bundleName>', 'bundle file name')
    .action((appName) => {
        repack_rollup_module(appName)
    });
program.command('create_module_info')
    .argument('<bundleName>', 'bundle file name')
    .action((appName) => {
        create_module_info(appName)
    });
program.command('modify_index')
    .argument('<bundleName>', 'bundle file name')
    .action((appName) => {
        modify_index(appName)
    });
program.command('update_imports')
    .argument('<bundleName>', 'bundle file name')
    .action((appName) => {
        update_imports(appName)
    });
program.command('all')
    .argument('<bundleName>', 'bundle file name')
    .action(async (appName) => {
        await extract_modules(appName);
        await lebab_module(appName);
        await optimize_decompile(appName);
    });
program.command('all_rollup')
    .argument('<bundleName>', 'bundle file name')
    .action(async (appName) => {
        await extract_rollup_module(appName);
        await lebab_rollup_module(appName);
        await optimize_rollup_decompile(appName);
    });

program.command('restore_from_sourcemap')
    .argument('<sourceMapFile>', 'sourcemap file name')
    .argument('<generatedFile>', 'generated file name')
    .action(async (sourceMapFile, generatedFile) => {
        restoreFromSourceMap(sourceMapFile, generatedFile);
    });

program.parse(process.argv);
