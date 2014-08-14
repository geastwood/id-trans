#!/usr/bin/env node

var baseUrl = __dirname;
var currentFolder = process.cwd();
var fs = require('fs');
var parser = require(baseUrl + '/parser');
var iterator = require(baseUrl + '/iterator');
var generator = require(baseUrl + '/generator');

var timestamp = (+Date.now());
var csvFileName = currentFolder + '/csv' + timestamp +'.csv';
var phpFileName = currentFolder + '/php' + timestamp +'.js';
iterator(currentFolder, function(err, file) {
    console.log('processing', file);
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
        fs.writeFile(phpFileName, php, {encoding: 'utf8', flag: 'a'});
    });
});

