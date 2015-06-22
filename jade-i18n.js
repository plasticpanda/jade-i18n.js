#!/usr/bin/env node
/*jshint node:true, laxcomma:true, eqnull:true, indent:2, es5:true */

'use strict';

require('sugar');
require('string-format');

var clog = require('clog')
  , fs = require('fs')
  , mkdirp = require('mkdirp')
  , optimist = require('optimist')
    .usage('Create HTML i18n templates.\nUsage: $0 tests/template.jade [-L locale/] -l it,en [-o ./] [--init] [--update]')
    .describe('locale-dir', 'Directory where to find translated files')
    .describe('locales', 'Locales to use')
    .describe('output', 'Output directory if --compile (must exist). Use a trailing slash.')
    .describe('no-compile', 'Wheter to compile jade to html (if set only json locale files will be created)')
    .describe('init', 'Create missing locale files')
    .describe('update', 'Update (overwrites) the locale files')
    .describe('help', 'Print this help')
    .alias('L', 'locale-dir')
    .alias('l', 'locales')
    .alias('o', 'output')
    .alias('n', 'no-compile')
    .alias('h', 'help')
    .boolean('init')
    .boolean('update')
    .boolean('compile')
    .default({ 'locale-dir': 'locale/', update: false, output: './' })
    .demand(['locales'])
  , argv = optimist.argv
  , i18n = require('./lib/i18n.js');


// - Print help
if (argv.h) {
  optimist.showHelp();
  process.exit(1);
}


// // - Create translation file if requested
// if (argv.init) {
//   i18n.init(argv.output);
// }


var _compile = function (sourceFile, locale) {
  var source = fs.readFileSync(sourceFile)
    , outputFileName = argv.output + locale + '/' + sourceFile.replace('.jade', '.html')
    , transFileName = argv['locale-dir'] + locale + '.json'
    , strings
    , res
    , compiled
    , strings_updated;

  clog.info('');
  clog.info('Compiling `{0}` with locale `{1}`...'.format(sourceFile, transFileName));
  
  try {
    strings = fs.readFileSync(transFileName);
    strings = JSON.parse(strings);
  } catch (err) {
    clog.warn('Translation file `{0}` does not exists or is not a valid JSON file.'.format(transFileName));
    
    if (argv.init) {
      clog.warn('Creating empty translation file for `{0}`'.format(transFileName));
      i18n.init(transFileName, true);
      strings = fs.readFileSync(transFileName);
      strings = JSON.parse(strings);
    } else {
      clog.error('Aborting due to previous warning. Run with --init to create or overwrite this file.');
      throw err;
    }
  }
  
  res = i18n.compile(source, strings, {
    filename: sourceFile,
    rootpath: sourceFile.to(sourceFile.lastIndexOf('/'))
  });
  compiled = res[0];
  strings_updated = res[1];

  // Update translation file
  if (argv.update) {
    fs.writeFileSync(transFileName, JSON.stringify(strings_updated, null, 2));
    clog.info('Updated locale file `{0}`.'.format(transFileName));
  } else {
    clog.info('If you have missing translations you can run this script with the --update flag.');
  }
  
  if (!argv['no-compile']) {
    if (!fs.existsSync(outputFileName.to(outputFileName.lastIndexOf('/')))) {
      mkdirp.sync(outputFileName.to(outputFileName.lastIndexOf('/')));
    }
    
    fs.writeFileSync(outputFileName, compiled + '\n');
    clog.info('Written `{0}`.'.format(outputFileName));
  }
};


var _compileMany = function (locale) {
  argv._.forEach(function (source) {
    _compile(source, locale);
  });
};


if (argv.locales.indexOf(',') > -1) {
  argv.locales.split(',').forEach(_compileMany);
} else {
  _compileMany(argv.locales);
}


clog.info('OK');
