var assert = require('assert');
var revaluate = require('..');

var name = Date.now().toString(36) + '.js';
var result = [];

for (var i = 0; i < 10; i++) {
  var fn = revaluate([
    'var value = 0;',
    'function fn() {',
    '  return value;',
    '}',
    'fn',
  ].join('\n'), name, function(output) {
    return eval(output.toString());
  });

  assert.equal(fn(), 0);
}
