var assert = require('assert');
var revaluate = require('..');

var result = [];
for (var i = 0; i < 10; i++) {
  var cls = revaluate([
    'class Class {',
    '  get value() {',
    '    return ' + i + ';',
    '  }',
    '}',
    'Class',
  ].join('\n'), __filename, function(output) {
    return eval(output.toString());
  });

  result.push(new cls());
  for (var j = 0; j < result.length; j++) {
    assert.equal(result[j].value, i);
  }
}
