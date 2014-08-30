#!/usr/bin/env node
var baseUrl = __dirname,
    currentFolder = process.cwd(),
    fs = require('fs'),
    iterator = require(baseUrl + '/src/iterator'),
    writer = require(baseUrl + '/src/writer'),
    opts = {
        debug: false,
        print: false
    };

var program = require('commander');

program
    .option('-d, --debug', 'use debug mode')
    .option('p, --print, print output')
    .parse(process.argv);

if (program.debug) {
    opts.debug = true;
}
if (program.print) {
    opts.print = true;
}

iterator(currentFolder, function(err, file) {
    if (err) {
        throw err;
    }

    var files = [];
    files.push(file);

    writer(files, opts).write();

});
