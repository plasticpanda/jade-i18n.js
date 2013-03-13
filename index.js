#!/usr/bin/env node
/*jshint node:true, laxcomma:true, eqnull:true, indent:2, es5:true */

'use strict';

var clog = require('clog')
  , fs = require('fs')
  , optimist = require('optimist')
    .usage('Create HTML i18n templates.\nUsage: $0 tests/template.jade [--translations tests/locale/it.json]')
    .describe('translations', 'File with translations strings')
    .describe('init', 'Create an initial translation file')
    .describe('update', 'Update the translation file with new strings that may have been added')
    .describe('h', 'Print this help')
    .boolean('init')
    .boolean('update')
    .default({ translations: 'locale/' + process.env.LANG + '.json', update: false })
    .alias('t', 'translations')
    .alias('h', 'help')
  , argv = optimist.argv
  , i18n = require('./lib/i18n.js');


// - Print help
if (argv.h) {
  optimist.showHelp();
  process.exit(1);
}

// - Create translation file if requested
if (argv.init) {
  i18n.init(argv.translations);
}


var sourceFile = argv._[0]
  , source = fs.readFileSync(sourceFile)
  , strings = JSON.parse(fs.readFileSync(argv.translations))
  , res = i18n.compile(source, strings)
  , compiled = res[0]
  , strings_updated = res[1];


// Update translation file
if (argv.update) {
  fs.writeFileSync(argv.translations, JSON.stringify(strings_updated));
  clog.debug('Translations file updated.');
} else {
  clog.info('If you have missing translations you can run this script with the --update flag.');
}


process.stdout.write(compiled + '\n');
clog.info('OK');
