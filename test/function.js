var test = require('tape');
var revaluate = require('..');

test('replace function definition', function(assert) {
  var name = Date.now();
  var result = [];

  for (var i = 0; i < 10; i++) {
    var value = i;

    var code = [
      'var fn = (function() {',
      '  return $value;',
      '})',
      'fn',
    ].join('\n')
      .replace(/\$value/, value);

    var fn = revaluate(code, name, function(output) {
      return eval(output.code);
    });

    for (var j = 0; j < result.length; j++) {
      assert.equal(result[j](), value);
    }

    assert.equal(fn(), value);
    result.push(fn);
  }

  for (var i = 0; i < result.length; i++) {
    for (var j = 0; j < result.length; j++) {
      assert.equal(result[i](), result[j]());
    }
  }

  revaluate('', name, function(output) {
    return eval(output.code);
  });

  for (var i = 0; i < result.length; i++) {
    assert.equal(result[i](), undefined);
  }

  assert.end();
});
