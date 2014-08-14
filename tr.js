#!/usr/bin/env node

var baseUrl = __dirname;
var currentFolder = process.cwd();
var fs = require('fs');
var parser = require(baseUrl + '/src/parser');
var iterator = require(baseUrl + '/src/iterator');
var generator = require(baseUrl + '/src/generator');

//var timestamp = (+Date.now());

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
        var rst = parser.parse(file, data);
        var php = generator(rst, 'php');
        var csv = generator(rst, 'csv');

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

