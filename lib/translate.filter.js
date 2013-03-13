#!/usr/bin/env node
/*jshint node:true, laxcomma:true, eqnull:true, indent:2, es5:true */

'use strict';

var clog = require('clog');

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
        
        return translated[ctx].translated;
      } else {
        clog.warn('Missing translation for {0}, source string will be used.'.format(ctx));
        
        translated[ctx] = {
          original: str,
          translated: str,
          fuzzy: true
        };
        
        return str;
      }
    } else {
      clog.error('Fatal: missing context for translation.');
      clog.debug('Current translation is ' + str);
      throw new Error('Missing context for translation');
    }
  };
};
