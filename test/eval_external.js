var assert = require('assert');
var revaluate = require('..');

var name = Date.now().toString(36) + '.js';
var result = null;

for (var index = 0; index < 10; index++) {
  var value = index;

  revaluate([
    'result = ' + index + ';',
  ].join('\n'), name, function(output) {
    return eval(output.code);
  });

  assert.equal(result, value);
}
