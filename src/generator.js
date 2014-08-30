'use strict';

var util = require('./util'),

// Factory
factory = {
    util: function(content) {
        var data = this.content || content;

        return {
            trs: function() {
                return data.data.trs;
            },
            uniqueName: function(prop) {
                return this.getClsName().replace(/\./g, '_') + util.string.capFirst(prop);
            },
            getClsName: function() {
                return data.data.clsName;
            },
            getProtoCls: function() {
                var clsName = this.getClsName();
                return clsName ? clsName + '.prototype.tr' : clsName;
            }
        };
    },
    csv: function(content) {
        var tpl = [], data = this.util(content);

        data.trs().forEach(function(line) {
            var tr = line.status && (data.uniqueName(line.prop) + ';' + line.translation);
            if (tr) {
                tpl.push(tr);
            }
        });
        return tpl;
    },
    php: function(content) {
        var tpl = ["IA.applyTranslations({"],
            data = this.util(content),
            trs = data.trs();

        tpl.push(util.pad('"' + data.getProtoCls() + '": {', 1));

        trs.forEach(function(line, i) {
            var tr = line.status && ('\'' + line.prop + '\'' + ': \'<?php echo $this->jsTr(\"' +
                                    data.uniqueName(line.prop) + '\"); ?>\'');
            if (tr) {
                tpl.push(util.pad(tr, 2) + (trs.length === i + 1 ? '' : ","));
            }
        });

        tpl.push(util.pad("}", 1));
        tpl.push("});");

        return trs.length > 0 ? tpl : [];
    }
},

generator = function(data, type) {
    var rst = factory[type](data);
    return (rst.length > 0) ? (rst.join("\n") + "\n") : '';
};

module.exports = generator;
