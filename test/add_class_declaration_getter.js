var assert = require('assert');
var revaluate = require('..');

var cls = revaluate([
  'class Class {',
  '}',
  'Class',
].join('\n'), __filename, function(output) {
  return eval(output.toString());
});

revaluate([
  'class Class {',
  '  get value() {',
  '    return 0;',
  '  }',
  '}',
  'Class',
].join('\n'), __filename, function(output) {
  return eval(output.toString());
});

var obj = new cls();
assert.equal(obj.value, 0);
