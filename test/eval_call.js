var assert = require('assert');
var revaluate = require('..');

var name = Date.now().toString(36) + '.js';
for (var index = 0; index < 10; index++) {
  var value = revaluate([
    'function factory() {',
    '  return Math.max(-1, ' + index + ');',
    '}',
    'factory()',
  ].join('\n'), name, function(output) {
    return eval(output.toString());
  });

  assert.equal(value, index);
}
