'use strict';
var fs = require("fs"),

// General function
dive = function (dir, fn) {
    // Assert that it's a function
    if (typeof fn !== "function") {
        throw 'no callback specified';
    }

    fs.readdir(dir, function (err, list) {
        // Return the error if something went wrong
        if (err) {
            return fn(err);
        }

        list.forEach(function (file) {
            var path = dir + "/" + file;
            if (/^\./.test(path) === false) {
                fs.stat(path, function (err, stat) {
                    if (stat && stat.isDirectory()) {
                        dive(path, fn);
                    } else {
                        if (/\.js$/.test(path) === true) {
                            fn(null, path);
                        }
                    }
                });
            }
        });
    });
};

module.exports = dive;
