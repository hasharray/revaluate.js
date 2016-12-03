var assert = require('assert');
var revaluate = require('..');

var name = Date.now().toString(36) + '.js';
var result = [];

for (var i = 0; i < 10; i++) {
  var value = i;

  var fn = revaluate([
    '(function() {',
    '  return ' + value + ';',
    '})',
  ].join('\n'), name, function(output) {
    return eval(output.toString());
  });

  for (var j = 0; j < result.length; j++) {
    assert.equal(result[j](), value);
  }

  assert.equal(fn(), value);
  result.push(fn);
}

for (var i = 0; i < result.length; i++) {
  for (var j = 0; j < result.length; j++) {
    assert.equal(result[i](), result[j]());
  }
}

revaluate('', name, function(output) {
  return eval(output.toString());
});

for (var i = 0; i < result.length; i++) {
  assert.equal(result[i](), undefined);
}
