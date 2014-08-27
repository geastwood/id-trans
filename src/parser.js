'use strict';

var contentReg = /define\((?:'|")(.+[^'])(?:'|")(?:[\S\s]*tr:\s?{([\S\s]*?)},)?/;

function transformTr(str, opts) {

    var debugStr = opts && opts.debug ? 'DE ' : '';

    str = str.replace(/(?:^'|'$)/g, '"').replace(/"/g, function(a, b, c) {
        return (b === 0 || b === (c.length - 1)) ? '"' : '\\"';
    });

    str = str.slice(0, 1) + debugStr + str.slice(1);

    return str;
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
        var parts = line.trim().split(':');
        var prop = parts[0] && parts[0].trim();
        var translation = parts[1] && parts[1].trim();
        return {
            status: (prop.length > 0 && translation.length > 0),
            prop: prop,
            uniqueName: translateCls(clsName) + prop.replace(/^\w/, function(s) {return s.toUpperCase(); }),
            translation: transformTr(translation, opts)
        };
    });
}
function translateCls(str) {
    return str.replace(/\./g, '_');
}
var parse = function(filename, content, opts) {

    var parts = contentReg.exec(content);
    var clsName = parts !== null ? parts[1].trim() : '';
    var trs = parts !== null ? parts[2] : [];
    var status = clsName && trs;

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
