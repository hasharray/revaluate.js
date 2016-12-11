var assert = require('assert');
var revaluate = require('..');

var cls = revaluate([
  '(class Class {',
  '})',
].join('\n'), __filename, function(output) {
  return eval(output.toString());
});

revaluate([
  '(class Class {',
  '  fn() {',
  '    return 0;',
  '  }',
  '})',
].join('\n'), __filename, function(output) {
  return eval(output.toString());
});

assert.ok(cls.prototype.fn);
