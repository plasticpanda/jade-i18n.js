#!/usr/bin/env node
/*jshint node:true, laxcomma:true, eqnull:true, indent:2, es5:true */

'use strict';

var clog = require('clog')
  , marked = require('marked');

require('sugar');
require('string-format');


module.exports = function (translated) {
  return function (str, params) {
    if (params.context && typeof params.context === 'string' && !params.context.isBlank()) {
      var ctx = params.context.toUpperCase();
      
      if (translated[ctx] != null) {
        if (str !== translated[ctx].original) {
          clog.info('Translation for {0} needs to be updated.'.format(ctx));
          
          translated[ctx].original = str;
          translated[ctx].fuzzy = true;
        }
        
        if (translated[ctx].fuzzy === true) {
          clog.warn('Using fuzzy translation for {0}: please translate it or remove the fuzzy marker.'.format(ctx));
        }
        
        if (params.markdown === 'no') {
          return translated[ctx].translated.replace(/\\/g, '\\\\').replace(/\n/g, '\\n');
        } else {
          return marked(translated[ctx].translated).replace(/\\/g, '\\\\').replace(/\n/g, '\\n');
        }
      } else {
        clog.warn('Missing translation for {0}, source string will be used.'.format(ctx));
        
        translated[ctx] = {
          original: str,
          translated: str,
          fuzzy: true
        };
        
        if (params.markdown === 'no') {
          return str.replace(/\\/g, '\\\\').replace(/\n/g, '\\n');
        } else {
          return marked(str).replace(/\\/g, '\\\\').replace(/\n/g, '\\n');
        }
      }
    } else {
      clog.error('Fatal: missing context for translation.');
      clog.debug('Current translation is ' + str);
      throw new Error('Missing context for translation');
    }
  };
};
