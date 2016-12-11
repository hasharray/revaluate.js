var assert = require('assert');
var revaluate = require('..');

var result = [];
for (var i = 0; i < 10; i++) {
  var fn = revaluate([
    '(function() {',
    '  return 0;',
    '})',
  ].join('\n'), __filename, function(output) {
    return eval(output.toString());
  });

  assert.equal(fn(), 0);
}
