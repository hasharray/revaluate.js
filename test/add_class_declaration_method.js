var assert = require('assert');
var revaluate = require('..');

var name = Date.now().toString(36) + '.js';
var result = [];

for (var i = 0; i < 10; i++) {
  var value = i;

  var cls = revaluate([
    'class Class {',
    '}',
    'Class',
  ].join('\n'), name, function(output) {
    return eval(output.toString());
  });

  result.push(cls);
}

revaluate([
  'class Class {',
  '  fn() {',
  '    return 0;',
  '  }',
  '}',
  'Class',
].join('\n'), name, function(output) {
  return eval(output.toString());
});

for (var i = 0; i < result.length; i++) {
  for (var j = 0; j < result.length; j++) {
    assert.ok(result[i].prototype.fn);
  }
}
