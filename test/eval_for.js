var assert = require('assert');
var revaluate = require('..');

var result = revaluate([
    'var value = 0;',
    'for (var i = 0; i < 10; i++) {',
    '  value++;',
    '}',
    'value'
].join('\n'), __filename, function(output) {
  return eval(output.toString());
});

assert.equal(result, 10);
