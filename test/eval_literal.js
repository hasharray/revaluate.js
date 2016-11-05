var assert = require('assert');
var revaluate = require('..');

var name = Date.now().toString(36) + '.js';
for (var index = 0; index < 10; index++) {
  var value = index;
  var result = revaluate([
    value,
  ].join('\n'), name, function(output) {
    return eval(output.toString());
  });

  assert.equal(result, value);
}
