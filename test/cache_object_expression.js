var assert = require('assert');
var revaluate = require('..');

var name = Date.now().toString(36) + '.js';
var result = [];

for (var i = 0; i < 10; i++) {
  var value = i;

  var obj = revaluate([
    '({})',
  ].join('\n'), name, function(output) {
    return eval(output.toString());
  });

  result.push(obj);
}

for (var i = 0; i < result.length; i++) {
  for (var j = 0; j < result.length; j++) {
    assert.equal(result[i], result[j]);
  }
}
