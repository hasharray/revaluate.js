var assert = require('assert');
var revaluate = require('..');

var obj = revaluate([
  '({',
  '  fn() {}',
  '})',
].join('\n'), __filename, function(output) {
  return eval(output.toString());
});

assert.ok(obj.fn);

revaluate([
  '({})',
].join('\n'), __filename, function(output) {
  return eval(output.toString());
});

assert.equal(obj.fn, undefined);
