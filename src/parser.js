'use strict';

var util = require('./util'),
    jsesc = require('jsesc'),
    targetRegex = /define\((?:'|")(.+[^'])(?:'|")(?:[\S\s]*tr:\s?{([\S\s]*?)},)?/;

function transformTr(str, opts) {

    var debugStr = opts && opts.debug ? 'DE ' : '';
    str = jsesc(str, {quotes: 'double', wrap: false});

    return util.string.inject(str, debugStr);
}

// TODO consider renaming the function
function defaults(line) {
    var parts = line.trim().split(':');
    return function(index) {
        return (parts[index] && parts[index].trim()) ? parts[index].trim() : '';
    };
}
function getTrs(clsName, str, opts) {

    // TODO: remove checking from here
    if (!str || !clsName) {
        return [];
    }

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
            // TODO remove
            uniqueName: translateCls(clsName) + util.string.capFirst(prop),
            translation: transformTr(translation, opts)
        };
    });
}

// TODO must weg
function translateCls(str) {
    return str.replace(/\./g, '_');
}

var parse = function(filename, content, opts) {

    var parts = targetRegex.exec(content),
        clsName = parts !== null ? parts[1].trim() : '',
        trs = parts !== null ? parts[2] : [],
        // status flag only `true` when there is a `class name` and `translation`
        status = clsName && trs;

    return {
        status: status,
        filename: filename,
        data: {
            clsName: clsName,
            // TODO must weg: doesn't belong here
            protoCls: clsName ? clsName + '.prototype.tr' : clsName,
            // TODO must weg: no need to translate here
            translatedClsName: translateCls(clsName),
            trs: getTrs(clsName, trs, opts)
        },
        // TODO must weg: doesn't belong here
        php: function() {
            var trs = this.data.trs;
            return trs.map(function(tr) {
                return tr.status && ('\'' + tr.prop + '\'' + ': \'<?php echo $this->jsTr(\"' + tr.uniqueName + '\"); ?>\'');
            });
        },
        // TODO must weg: doesn't belong here
        csv: function(separator) {
            var trs = this.data.trs;
            separator = separator || ';';
            return trs.map(function(tr) {
                return tr.status && (tr.uniqueName + ';' + tr.translation);
            });
        }
    };
};

module.exports = {
    parse: parse
};
