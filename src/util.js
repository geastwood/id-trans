'use strict';

var string = {},

pad = function(str, indent) {

    /* jshint newcap: false */
    var padding = (indent) ? Array((indent * 4) + 1).join(' ') : '';
    return padding + str;
};

/**
 * Inject a substring to string at certain location
 */
string.inject = function(source, part, location) {

    if (typeof location === 'undefined') {
        location = 0;
    }

    return source.slice(0, location + 1) + part + source.slice(location + 1);
};

/**
 * Escape double quote
 */
string.escapeDoubleQuote = function(str) {
    return str.replace(/(?:^'|'$)/g, '"').replace(/"/g, function(a, b, c) {
        return (b === 0 || b === (c.length - 1)) ? '"' : '\\"';
    });
};

/**
 * Capitalize first letter
 */
string.capFirst = function(str) {
    return str.replace(/^\w/, function(s) {
        return s.toUpperCase();
    });
};

module.exports = {
    pad: pad,
    string: string
};
