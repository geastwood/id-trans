'use strict';

var util = require('./util'),

uniqueName = function(clsName, prop) {
    return clsName.replace(/\./g, '_') + util.string.capFirst(prop);
},

// Factory
factory = {
    csv: function(content) {
        var tpl = [];
        content.data.trs.forEach(function(line) {
            var tr = line.status && (uniqueName(content.data.clsName, line.prop) + ';' + line.translation);
            if (tr) {
                tpl.push(tr);
            }
        });
        return tpl;
    },
    php: function(content) {
        var tpl = ["IA.applyTranslations({"],
            data = content.data,
            protoCls = data.clsName ? data.clsName + '.prototype.tr' : data.clsName;

        tpl.push(util.pad('"' + protoCls + '": {', 1));

        data.trs.forEach(function(line, i) {
            var tr = line.status && ('\'' + line.prop + '\'' + ': \'<?php echo $this->jsTr(\"' +
                                    uniqueName(content.data.clsName, line.prop) + '\"); ?>\'');
            if (tr) {
                tpl.push(util.pad(tr, 2) + (data.trs.length === i + 1 ? '' : ","));
            }
        });

        tpl.push(util.pad("}", 1));
        tpl.push("});");
        return data.trs.length > 0 ? tpl : [];
    }
},

generator = function(data, type) {
    var rst = factory[type](data);
    return (rst.length > 0) ? (rst.join("\n") + "\n") : '';
};

module.exports = generator;
