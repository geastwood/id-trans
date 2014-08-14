'use strict';
var util = require('./util');
var template = {
    csv: function(data) {
        var tpl = [];
        data.csv().forEach(function(line) {
            if (line) {
                tpl.push(line);
            }
        });
        return tpl;
    },
    php: function(data) {
        var tpl = ["IA.applyTranslations({"];
        var lines = data.php();
        tpl.push(util.pad('"' + data.data.protoCls + '": {', 1));
        lines.forEach(function(line, i) {
            if (line) {
                tpl.push(util.pad(line, 2) + (lines.length === i + 1 ? '' : ","));
            }
        });
        tpl.push(util.pad("}", 1));
        tpl.push("});");
        return lines.length > 0 ? tpl : [];
    }
};
var generator = function(data, type) {
    var rst = template[type](data);
    return (rst.length > 0) ? (rst.join("\n") + "\n") : '';
};

module.exports = generator;
