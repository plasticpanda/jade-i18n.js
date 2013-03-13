#!/usr/bin/env node
/*jshint node:true, laxcomma:true, eqnull:true, indent:2, es5:true */

'use strict';

require('sugar');

var jade = require('jade')
  , fs = require('fs')
  , clog = require('clog')
  , optimist = require('optimist')
    .usage('Create HTML i18n templates.\nUsage: $0 tests/template.jade [--translated tests/locale/it.json] [--output tests/output]')
    .describe('translated', 'File with translated strings')
    .describe('output', 'Output directory (must exist)')
    .describe('h', 'Print this help')
    .describe('init', 'Create an initial translation file')
    .default({ translated: 'locale/' + process.env.LANG + '.json', output: '.' })
    .alias('t', 'translated')
    .alias('o', 'output')
    .alias('h', 'help')
  , argv = optimist.argv;


if (argv.h) {
  optimist.showHelp();
  process.exit(1);
}

if (argv.init) {
  fs.writeFileSync(argv.translated, '{}');
}

var translated = JSON.parse(fs.readFileSync(argv.translated))
  , source = fs.readFileSync(argv._[0]);


jade.filters.trans = function (str, params) {
  var ctx = params.context;
  
  if (translated[ctx] != null) {
    if (str !== translated[ctx].original) {
      translated[ctx].original = str;
      translated[ctx].fuzzy = true;
    }
    return translated[ctx].translated;
  } else {
    console.log('Missing translation for ' + str);
    translated[ctx] = {
      original: str,
      translated: str,
      fuzzy: true
    };
    return '';
  }
};

var page = jade.compile(source)();

fs.writeFileSync('output.html', page);
fs.writeFileSync(argv.translated, JSON.stringify(translated));
