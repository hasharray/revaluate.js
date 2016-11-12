var assert = require('assert');
var revaluate = require('..');

var name = Date.now().toString(36) + '.js';
var result = [];

for (var i = 0; i < 10; i++) {
  var value = i;

  var Class = revaluate([
    '(class Class {',
    '  fn() {',
    '    return ' + value + ';',
    '  }',
    '})',
  ].join('\n'), name, function(output) {
    return eval(output.toString());
  });

  var object = new Class();
  result.push(object);

  for (var j = 0; j < result.length; j++) {
    assert.equal(result[j].fn(), value);
  }
}

for (var i = 0; i < result.length; i++) {
  for (var j = 0; j < result.length; j++) {
    assert.equal(result[i].fn(), result[j].fn());
  }
}

revaluate([
  '(class Class {',
  '})',
].join('\n'), name, function(output) {
  return eval(output.toString());
});

for (var i = 0; i < result.length; i++) {
  assert.equal(result[i].fn(), undefined);
}
