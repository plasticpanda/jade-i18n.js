#!/usr/bin/env node
/*jshint node:true, laxcomma:true, eqnull:true, indent:2, es5:true */

'use strict';

var clog = require('clog')
  , fs = require('fs')
  , optimist = require('optimist')
    .usage('Create HTML i18n templates.\nUsage: $0 tests/template.jade [--translations tests/locale/it.json] [--output .]')
    .describe('translations', 'File with translations strings')
    .describe('output', 'Output directory (must exist)')
    .describe('init', 'Create an initial translation file')
    .describe('update', 'Update the translation file with new strings that may have been added')
    .describe('h', 'Print this help')
    .boolean('init')
    .boolean('update')
    .default({ translations: 'locale/' + process.env.LANG + '.json', output: 'output.html' })
    .alias('t', 'translations')
    .alias('o', 'output')
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


var source = fs.readFileSync(argv._[0])
  , strings = JSON.parse(fs.readFileSync(argv.translations))
  , res = i18n.compile(source, strings)
  , compiled = res[0]
  , strings_updated = res[1];


// Write compiled file
if (argv.output === '-') {
  process.stdout.write(compiled);
} else {
  fs.writeFileSync(argv.output, compiled);
}


// Update translation file
if (argv.update) {
  console.log('updating strings...');
  
} else {
  clog.info('If you have missing translations you can run this script with the --update flag.');
}
