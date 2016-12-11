var assert = require('assert');
var revaluate = require('..');

result = null;
for (var i = 0; i < 10; i++) {
  revaluate([
    'result = ' + i + ';',
  ].join('\n'), __filename, function(output) {
    return eval(output.toString());
  });

  assert.equal(result, i);
}
