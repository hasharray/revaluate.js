var assert = require('assert');
var revaluate = require('..');

var result = [];
for (var i = 0; i < 10; i++) {
  var obj = revaluate([
    '({',
    '  fn: function() {',
    '    return ' + i + ';',
    '  }',
    '})',
  ].join('\n'), __filename, function(output) {
    return eval(output.toString());
  });

  result.push(obj);

  for (var j = 0; j < result.length; j++) {
    assert.equal(result[j].fn(), i);
  }
}
