#!/usr/bin/env node
var baseUrl = __dirname,
    currentFolder = process.cwd(),
    program = require('commander'),
    iterator = require(baseUrl + '/src/iterator'),
    writer = require(baseUrl + '/src/writer'),
    opts = {
        debug: false,
        print: false
    };

program
    .option('-d, --debug', 'use debug mode')
    .option('-p, --print', 'print output')
    .option('-f, --file [file]', 'specify a file')
    .parse(process.argv);

if (program.debug) {
    opts.debug = true;
}

if (program.print) {
    opts.print = true;
}

var fileFilter;

if (program.file) {
    fileFilter = '/' + program.file;
}

iterator(currentFolder, function(err, file) {

    if (err) {
        throw err;
    }

    var index = file.indexOf(fileFilter),
        applyFilter = index !== -1 && (index === (file.length - fileFilter.length));

    if (program.file) {
        if (applyFilter) {
            writer(file, opts).write();
        }
    } else {
        writer(file, opts).write();
    }

});
