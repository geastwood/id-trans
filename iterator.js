'use strict';
var fs = require("fs");

function toCheck(path) {
    var rules = [function(path) {
        return /^\./.test(path) === false;
    }, function(path) {
        return /\.js$/.test(path) === true;
    }];

    return rules.every(function(rule) {
        return rule(path);
    });
}

// General function
var dive = function (dir, fn) {
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
            console.log(dir, file);
            if (toCheck(path)) {
                fs.stat(path, function (err, stat) {
                    if (stat && stat.isDirectory()) {
                        console.log('fff');
                        dive(path, fn);
                    } else {
                        fn(null, path);
                    }
                });
            }
        });
    });
};

module.exports = dive;
