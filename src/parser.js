'use strict';

var util = require('./util'),
    jsesc = require('jsesc'),
    targetRegex = /define\((?:'|")(.+[^'])(?:'|")(?:[\S\s]*tr:\s?{([\S\s]*?)},)?/;

function transformTr(str, opts) {

    var debugStr = opts && opts.debug ? 'DE ' : '';
    str = jsesc(str, {quotes: 'double', wrap: false});

    return util.string.inject(str, debugStr);
}

function getTrs(clsName, str, opts) {

    if (!str || !clsName) {
        return [];
    }

    // solve case when string concat in translation
    str = str.replace(/((?:'|")\s\+\n?\s*(?:'|"))/g, '');

    return str.trim().split(/\n/).map(function(line) {
        return line.trim().replace(/,$/, '');
    }).map(function(line) {
        // TODO: refactor
        var parts = line.trim().split(':'),
            prop = (parts[0] && parts[0].trim()) ? parts[0].trim() : '',
            translation = (parts[1] && parts[1].trim()) ? parts[1].trim() : '';

        return {
            status: (prop.length > 0 && translation.length > 0),
            prop: prop,
            uniqueName: translateCls(clsName) + util.string.capFirst(prop),
            translation: transformTr(translation, opts)
        };
    });
}
function translateCls(str) {
    return str.replace(/\./g, '_');
}

var parse = function(filename, content, opts) {

    // TODO: refactor
    var parts = targetRegex.exec(content),
        clsName = parts !== null ? parts[1].trim() : '',
        trs = parts !== null ? parts[2] : [],
        status = clsName && trs;

    return {
        status: status,
        filename: filename,
        data: {
            clsName: clsName,
            protoCls: clsName ? clsName + '.prototype.tr' : clsName,
            translatedClsName: translateCls(clsName),
            trs: getTrs(clsName, trs, opts)
        },
        php: function() {
            var trs = this.data.trs;
            return trs.map(function(tr) {
                return tr.status && ('\'' + tr.prop + '\'' + ': \'<?php echo $this->jsTr(\"' + tr.uniqueName + '\"); ?>\'');
            });
        },
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
