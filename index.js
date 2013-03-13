/*jshint node:true, laxcomma:true, eqnull:true, indent:2 */

'use strict';

var jade = require('jade')
  , fs = require('fs');


var map = {
  h1: {
    original: 'It\'s me,',
    translated: 'Sono io,'
  },
  p1: {
    original: 'Foo!',
    translated: 'Pippo!'
  },
  fanculo: {
    original: 'fucsia!',
    translated: 'Gina'
  }
};


jade.filters.trans = function (str, params) {
  var ctx = params.context;
  
  if (map[ctx] != null) {
    if (str !== map[ctx].original) {
      map[ctx].original = str;
      map[ctx].fuzzy = true;
    }
    return map[ctx].translated;
  } else {
    console.log('Missing translation for ' + str);
    map[ctx] = {
      original: str,
      translated: str,
      fuzzy: true
    };
    return '';
  }
};

var page = jade.compile(fs.readFileSync('tests/index.jade'))();
console.log(page);
console.log('map', map);
