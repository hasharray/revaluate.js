var assert = require('assert');
var revaluate = require('..');

var name = Date.now().toString(36) + '.js';
var objects = [];

for (var i = 0; i < 10; i++) {
  var value = i;
  var result = revaluate([
    '(class Class {',
    '  fn() {',
    '    return ' + value + ';',
    '  }',
    '})',
  ].join('\n'), name, function(output) {
    return eval(output.toString());
  });

  var object = new result();
  objects.push(object);

  for (var j = 0; j < objects.length; j++) {
    assert.equal(objects[j].fn(), value);
  }
}

for (var i = 0; i < objects.length; i++) {
  for (var j = 0; j < objects.length; j++) {
    assert.equal(objects[i].fn(), objects[j].fn());
  }
}
