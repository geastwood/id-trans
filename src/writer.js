'use strict';

var fs = require('fs'),
    baseUrl = __dirname,
    currentFolder = process.cwd(),
    parser = require(baseUrl + '/parser'),
    generator = require(baseUrl + '/generator'),

    targetFolder = currentFolder/* + '/translations/'*/,
    csvFileName = targetFolder + '/de_DE.csv',
    phpFileName = targetFolder + '/i18n.js',

writer = function(file, opts) {
    return {
        config: function() {},
        write: function() {

            // get a file list
            fs.readFile(file, 'utf8', function(err, data) {
                console.log('processing', file);
                if (err) {
                    throw err;
                }

                var rst = parser.parse(file, data, opts),
                    php = generator(rst, 'php'),
                    csv = generator(rst, 'csv');

                if (opts.print === true) {
                    console.log('PHP content:');
                    console.log(php);
                    console.log('CSV content:');
                    console.log(csv);
                } else {
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
                }
            });
        }
    };
};

module.exports = writer;
