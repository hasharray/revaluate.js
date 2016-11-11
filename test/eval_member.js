var assert = require('assert');
var revaluate = require('..');

var name = Date.now().toString(36) + '.js';

for (var i = 0; i < 10; i++) {
  var value = revaluate([
    'var now = Date.now();',
    'now',
  ].join('\n'), name, function(output) {
    return eval(output.toString());
  });

  assert.ok(value);
}
