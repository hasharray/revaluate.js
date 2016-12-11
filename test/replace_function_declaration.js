var assert = require('assert');
var revaluate = require('..');

var result = [];
for (var i = 0; i < 10; i++) {
  var fn = revaluate([
    'function fn() {',
    '  return ' + i + ';',
    '}',
    'fn',
  ].join('\n'), __filename, function(output) {
    return eval(output.toString());
  });

  result.push(fn);
  for (var j = 0; j < result.length; j++) {
    assert.equal(result[j](), i);
  }
}
