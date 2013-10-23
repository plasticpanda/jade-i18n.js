/*jshint node:true, laxcomma:true, eqnull:true, indent:2 */

'use strict';

var jade = require('jade')
  , clog = require('clog')
  , swallow = require('node-swallow')
  , async = require('async')
  , fs = require('fs')
  , path = require('path')
  ;


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


var compile = module.exports.compile = function (source, strings, options) {
  jade.filters.trans = require('./translate.filter')(strings);
  var compiled = jade.compile(source, options)(options);

  return [compiled, strings];
};


var readTranslations = module.exports.readTranslations = function (lang, json_path, callback) {
  var transFileName = json_path || path.join(process.cwd(), 'locale', lang + '.json');
  fs.readFile(transFileName, { encoding: 'utf8' }, function (err, content) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, JSON.parse(content));
    }
  });
};


module.exports.renderToStrings = function (templateFile, locals, langs, callback) {
  var res = [];
    
  fs.readFile(templateFile, { encoding: 'utf8' }, function (err, jade) {
    if (err) throw err;
    console.log('=> template=' + templateFile);
    
    async.eachSeries(langs, function (lang, iterateNext) {
      console.log('==> Using lang=' + lang);
      
      readTranslations(lang, null, function (err, strings) {
        if (err) throw err;
        console.log('===> read', Object.keys(strings).length, 'translations');
          
        locals.filename = templateFile;
        locals.filename_ = templateFile;
        locals.rootpath = templateFile.to(templateFile.lastIndexOf('/'));
        locals.i18n_language = lang;
        res[lang] = compile(jade, strings, locals)[0];
        iterateNext();
      });
    }, function _completed(err) {
      callback(err, res);
    });
  });
};
