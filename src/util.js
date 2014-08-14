'use strict';

/**
 * Padding
 */
var pad = function(str, indent) {
    /* jshint newcap: false */
    var padding = (indent) ? Array(indent * 4).join(' ') : '';
    return padding + str;
};

module.exports = {
    pad: pad
};
