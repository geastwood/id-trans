#!/usr/bin/env node
var baseUrl = __dirname,
    currentFolder = process.cwd(),
    fs = require('fs'),
    parser = require(baseUrl + '/src/parser'),
    iterator = require(baseUrl + '/src/iterator'),
    generator = require(baseUrl + '/src/generator'),
    opts = {
        debug: false
    };

// jscs:disable
var program = require('commander');
program.option('-d, --debug', 'use debug mode').parse(process.argv);
if (program.debug) {
    opts.debug = true;
}

var targetFolder = currentFolder + '/translations/';

if (fs.existsSync(targetFolder)) {
    fs.rmdirSync(targetFolder);
} else {
    fs.mkdirSync(targetFolder);
}

var csvFileName = targetFolder + '/de_DE.csv';
var phpFileName = targetFolder + '/i18n.js';

iterator(currentFolder, function(err, file) {
    if (err) {
        throw err;
    }
    fs.readFile(file, 'utf8', function(err, data) {
        console.log('processing', file);
        if (err) {
            throw err;
        }
        var rst = parser.parse(file, data, opts);
        var php = generator(rst, 'php');
        var csv = generator(rst, 'csv');
        //console.log(csv);

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
