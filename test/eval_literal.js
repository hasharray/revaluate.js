var assert = require('assert');
var revaluate = require('..');

for (var i = 0; i < 10; i++) {
  var j = revaluate([
    '' + i + '',
  ].join('\n'), __filename, function(output) {
    return eval(output.toString());
  });

  assert.equal(i, j);
}
