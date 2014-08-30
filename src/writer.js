'use strict';

var fs = require('fs'),
    baseUrl = __dirname,
    currentFolder = process.cwd(),
    parser = require(baseUrl + '/parser'),
    generator = require(baseUrl + '/generator');

var targetFolder = currentFolder/* + '/translations/'*/;
var csvFileName = targetFolder + '/de_DE.csv';
var phpFileName = targetFolder + '/i18n.js';

var writer = function(files, opts) {
    return {
        config: function() {},
        write: function() {

            files.forEach(function(file) {

                // get a file list
                fs.readFile(file, 'utf8', function(err, data) {
                    console.log('processing', file);
                    if (err) {
                        throw err;
                    }

                    var rst = parser.parse(file, data, opts),
                        php = generator(rst, 'php'),
                        csv = generator(rst, 'csv');

                    fs.writeFile(csvFileName, csv, {encoding: 'utf8', flag: 'a'}, function(err) {
                        if (err) {
                            throw err;
                        }
                    });
                    fs.writeFile(phpFileName, php, {encoding: 'utf8', flag: 'a'}, function(err) {
                        if (err) {
                            throw err;
                        }
                    });
                });
            });
        }
    };
};

module.exports = writer;
