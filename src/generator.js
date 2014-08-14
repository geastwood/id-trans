'use strict';
var pushWithPadding = function(str, indent) {
    var padding = (indent) ? Array(indent * 4).join(' ') : '';
    return padding + str;
};
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
        tpl.push(pushWithPadding('"' + data.data.clsName + '": {', 1));
        lines.forEach(function(line) {
            if (line) {
                tpl.push(pushWithPadding(line, 2));
            }
        });
        tpl.push(pushWithPadding("}", 1));
        tpl.push("});");
        return lines.length > 0 ? tpl : [];
    }
};
var generator = function(data, type) {
    return template[type](data).join("\n");
};

module.exports = generator;
