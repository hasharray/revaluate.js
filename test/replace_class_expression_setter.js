var assert = require('assert');
var revaluate = require('..');

var name = Date.now().toString(36) + '.js';
var objects = [];

for (var i = 0; i < 10; i++) {
  var key = i;
  var value = i;

  var result = revaluate([
    '(class Class {',
    '  set value(value) {',
    '    this[' + key + '] = ' + value + ';',
    '  }',
    '})',
  ].join('\n'), name, function(output) {
    return eval(output.toString());
  });

  var object = new result();
  objects.push(object);

  for (var j = 0; j < objects.length; j++) {
    objects[j].value = 1;
    assert.equal(objects[j][key], value);
  }
}
