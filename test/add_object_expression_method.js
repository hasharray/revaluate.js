var assert = require('assert');
var revaluate = require('..');

var obj = revaluate([
  '({})',
].join('\n'), __filename, function(output) {
  return eval(output.toString());
});

revaluate([
  '({',
  '  fn: function() {}',
  '})',
].join('\n'), __filename, function(output) {
  return eval(output.toString());
});

assert.ok(obj.fn);
