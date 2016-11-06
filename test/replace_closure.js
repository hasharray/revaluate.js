var assert = require('assert');
var revaluate = require('..');

var name = Date.now().toString(36) + '.js';

var result = [];
for (var i = 0; i < 10; i++) {
  var fn = revaluate([
    '(function() {',
    '  return function() {',
    '    return value;',
    '  }',
    '})',
  ].join('\n'), name, function(output) {
    return eval(output.toString());
  });

  result.push(fn);
}

for (var i = 0; i < result.length; i++) {
  var fn = result[i];
  result[i] = fn();
}

for (var i = 0; i < 10; i++) {
  var value = Math.random();
  revaluate([
    '(function() {',
    '  var value = ' + value +';',
    '  return function() {',
    '    return value;',
    '  }',
    '})',
  ].join('\n'), name, function(output) {
    return eval(output.toString());
  });

  for (var i = 0; i < result.length; i++) {
    var fn = result[i];
    assert.equal(fn(), value);
  }
}
