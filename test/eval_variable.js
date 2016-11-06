var assert = require('assert');
var revaluate = require('..');

var name = Date.now().toString(36) + '.js';

for (var i = 0; i < 10; i++) {
  var value = revaluate([
    'var value = ' + i + ';',
    'value',
  ].join('\n'), name, function(output) {
    return eval(output.toString());
  });

  assert.equal(value, i);
}
