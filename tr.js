#!/usr/bin/env node
console.log('this is the entry point for tr');
/**
 * description
 * if there is no tr, rst[2] will be null
 */
var fs = require('fs');
//var trReg = /define\((?:'|")(.+[^'])(?:'|")[\S\s]*tr:\s?{([\S\s]*?)},/;
var trReg = /define\((?:'|")(.+[^'])(?:'|")(:?[\S\s]*tr:\s?{([\S\s]*?)},)?/;
function getTrs(str) {
    var rst;

    if (typeof str === 'undefined') {
        return [];
    }

    var strArray = str.trim().split(/\n/).map(function(line) {
        return line.trim().replace(/,$/, '');
    });

    console.log(typeof strArray);
    return rst;
}
/*
fs.readFile('test.js', 'utf-8', function(err, data) {
    var rst = trReg.exec(data);
    getTrs(rst[2]);
});
*/
fs.readFile('test1.js', 'utf-8', function(err, data) {
    var rst = trReg.exec(data);
    getTrs(rst[2]);
});
