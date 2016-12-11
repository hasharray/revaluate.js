var assert = require('assert');
var revaluate = require('..');

for (var i = 0; i < 10; i++) {
  var fn = revaluate([
    'function fn() {',
    '  return 0;',
    '}',
    'fn',
  ].join('\n'), __filename, function(output) {
    return eval(output.toString());
  });

  assert.equal(fn(), 0);
}
