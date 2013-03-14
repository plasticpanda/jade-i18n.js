/*jshint node:true, laxcomma:true, eqnull:true, indent:2, es5:true */

'use strict';

var jade = require('jade')
  , fs = require('fs')
  , clog = require('clog');


module.exports.init = function (transFile, force) {
  force = force || false;
  
  if (!force && fs.existsSync(transFile)) {
    clog.error('Refusing to overwrite an existing translation file.');
    throw new Error('File exists');
  } else {
    fs.writeFileSync(transFile, '{}');
    clog.info('Created empty translation file.');
  }
};


module.exports.compile = function (source, strings) {
  jade.filters.trans = require('./translate.filter')(strings);
  var compiled = jade.compile(source)();

  return [compiled, strings];
};

