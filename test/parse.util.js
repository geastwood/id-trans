var parser = require('../src/parser'),
    generator = require('../src/generator'),
    fs = require('fs');

exports.csv = function(test) {
    var csv, rst;
    test.expect(4);
    fs.readFile(__dirname + '/data/test.js', 'utf8', function(err, data) {

        if (err) {
            throw err;
        }

        rst = parser.parse('', data);

        csv = generator(rst, 'csv');
        console.log(csv);
        test.ok(csv.length > 10);
        test.ok(/('|")User('|")/.test(csv) === true);
        test.ok(/\\"data-qtip='\{0\}'\\"/.test(csv) === true);
        test.ok(/'\\"\{0\}\\" changed/.test(csv) === true);
        test.done();
    });
};

exports.quote = function(test) {
    var rst, csv;
    fs.readFile(__dirname + '/data/test1.js', 'utf8', function(err, data) {
        if (err) {
            throw err;
        }

        rst = parser.parse('', data);
        csv = generator(rst, 'csv');
        console.log(csv);
        test.done();
    });
};
