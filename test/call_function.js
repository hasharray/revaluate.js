var assert = require('assert');
var revaluate = require('..');

var name = Date.now().toString(36) + '.js';
for (var index = 0; index < 10; index++) {
  var value = revaluate([
    'Math.max(-1, ' + index + ');',
  ].join('\n'), name, function(output) {
    return eval(output.toString());
  });

  assert.equal(value, index);
}

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

var result = [];
for (var i = 0; i < 10; i++) {
  var value = revaluate([
    'Math.random();',
  ].join('\n'), name, function(output) {
    return eval(output.toString());
  });

  result.push(value);
}

for (var i = 0; i < result.length; i++) {
  for (var j = 0; j < result.length; j++) {
    assert.equal(result[i], result[j]);
  }
}
