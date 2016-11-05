var test = require('tape');
var revaluate = require('..');

test('call expression', function(assert) {
  var name = Date.now();

  for (var index = 0; index < 10; index++) {
    var code = [
      'var value = Math.max(-1, $index)',
      'value',
    ].join('\n')
      .replace(/\$index/g, index);

    var value = revaluate(code, name, function(output) {
      return eval(output.code);
    });

    assert.equal(value, index);
  }

  assert.end();
});

test('call expression inside function', function(assert) {
  var name = Date.now();

  for (var index = 0; index < 10; index++) {
    var code = [
      'function value() {',
      '  return Math.max(-1, $index);',
      '}',
      'value()',
    ].join('\n')
      .replace(/\$index/g, index);

    var value = revaluate(code, name, function(output) {
      return eval(output.code);
    });

    assert.equal(value, index);
  }

  assert.end();
});

test('call module expression once', function(assert) {
  var name = Date.now();
  var result = [];

  for (var i = 0; i < 10; i++) {
    var code = [
      'var value = Math.random()',
      'value',
    ].join('\n');

    var value = revaluate(code, name, function(output) {
      return eval(output.code);
    });

    result.push(value);
  }

  for (var i = 0; i < result.length; i++) {
    for (var j = 0; j < result.length; j++) {
      assert.equal(result[i], result[j]);
    }
  }

  assert.end();
});
