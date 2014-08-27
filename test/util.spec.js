var util = require('../src/util');
exports.pad = function(test) {
    test.ok(util.pad('foo', 1) === '    foo', 'should pass');
    test.ok(util.pad('bar', 2) === '        bar', 'should pass');
    test.done();
};
exports.inject = function(test) {
    var source = '"this is a string"';
    var rst = util.string.inject(source, 'DE ', 0);
    var rst1 = util.string.inject(source, 'DE ', 2);
    var rst2 = util.string.inject(source, 'DE ', 5);
    test.equal(rst, '"DE this is a string"');
    test.equal(rst1, '"thDE is is a string"');
    test.equal(rst2, '"this DE is a string"');
    test.done();
};
exports.escapeDouble = function(test) {
    var source = '\'string in "double quote"\'';
    var rst = util.string.escapeDoubleQuote(source);
    test.strictEqual(rst, '"string in \\"double quote\\""');
    test.done();
};
exports.capFirst = function(test) {
    test.strictEqual(util.string.capFirst('string'), 'String');
    test.strictEqual(util.string.capFirst('String'), 'String');
    test.strictEqual(util.string.capFirst(' string'), ' string');
    test.strictEqual(util.string.capFirst('1string'), '1string');
    test.done();
};
