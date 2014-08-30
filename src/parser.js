'use strict';

var util = require('./util'),
    targetRegex = /define\((?:'|")(.+[^'])(?:'|")(?:[\S\s]*tr:\s?{([\S\s]*?)},)?/;

// TODO consider renaming the function
function defaults(line) {
    var parts = line.trim().split(':');
    return function(index) {
        return (parts[index] && parts[index].trim()) ? parts[index].trim() : '';
    };
}

function getTrs(str, opts) {

    var debugStr = opts && opts.debug ? 'DE ' : '';

    // solve case when string concat in translation
    str = str.replace(/((?:'|")\s\+\n?\s*(?:'|"))/g, '');

    return str.trim().split(/\n/).map(function(line) {
        return line.trim().replace(/,$/, ''); // 1) trim, 2) remove tailing `,`
    }).map(function(line) {
        var parts = defaults(line),
            prop = parts(0),
            translation = parts(1);

        return {
            status: (prop.length > 0 && translation.length > 0),
            prop: prop,
            translation: util.string.inject(translation, debugStr)
        };
    });
}

var parse = function(filename, content, opts) {

    var parts = targetRegex.exec(content),
        clsName = parts !== null ? parts[1].trim() : '',
        trs = (parts !== null && parts[2]) ? parts[2] : '',
        status = (clsName && clsName.length > 0) && (trs && trs.length > 0);

    return {
        status: status,
        filename: filename,
        data: {
            clsName: clsName,
            trs: getTrs(trs, opts)
        }
    };
};

module.exports = {
    parse: parse
};
