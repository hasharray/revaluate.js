var diff = require('fast-diff');
var reshift = require('reshift');

__cache = [];
__closure = [];
__function = [];

module.exports = function revaluate(content, name, evaluate) {
  var context = revaluate.cache[name] = (revaluate.cache[name] || {
    entries: {},
    content: '',
  });

  var diffs = diff(context.content, content);

  var indices = [];
  var offset = 0;
  for (var i = 0; i < diffs.length; i++) {
    var type = diffs[i][0];
    var text = diffs[i][1];

    for (var j = 0; j < text.length; j++) {
      if (type == -1) {
        offset++;
      } else if (type == 0) {
        indices.push(offset);
        offset++;
      } else {
        indices.push(null);
      }
    }
  }

  var key = function(node) {
    var start = indices[node.start];
    var end = indices[node.end];

    return start + ',' + end;
  };

  var range = function(node) {
    return node.start + ',' + node.end;
  };

  var entries = {};
  var output = reshift(content, function(node) {
    if (node.type == 'Identifier') {
      if (node.parent.type == 'MemberExpression' && node.parent.object != node) {
        return node.toString();
      }

      var closure = (function next(node, name) {
        if (node.body) {
          var body = node.body;
          for (var i = 0; i < body.length; i++) {
            var child = body[i];

            if (child.type == 'VariableDeclaration') {
              var declarations = child.declarations;
              for (var j = 0; j < declarations.length; j++) {
                var declaration = declarations[j];

                var id = declaration.id;
                if (id.name == name) {
                  return node;
                }
              }
            }
          }
        }

        if (node.parent) {
          return next(node.parent, name);
        }
      }(node, node.name));

      if (closure) {
        var entry = entries[range(closure)] = (
          context.entries[key(closure)] || entries[range(closure)] || {}
        );

        if (entry.index == undefined) {
          entry.index = __closure.length++;
          __closure[entry.index] = {};
        }

        entry.node = closure;

        var name = node.name;
        var index = entry.index;

        return '__closure[' + index + '].' + name;
      }
    }

    if (node.type == 'VariableDeclaration') {
      var closure = (function walk(node, declaration) {
        if (node.type != 'BlockStatement' &&
            node.type != 'Program') {
          return walk(node.parent, name);
        }

        var body = node.body;
        for (var i = 0; i < body.length; i++) {
          var child = body[i];

          if (child == declaration) {
            if (child.kind != 'var') {
              return node;
            }

            return (function walk(node) {
              if (node.parent == null) {
                return node;
              }

              if (node.type == 'FunctionDeclaration' ||
                  node.type == 'FunctionExpression') {
                return node.body;
              }

              if (node.parent) {
                return walk(node.parent, name);
              }

              return node;
            }(node));
          }
        }

        if (node.parent) {
          return walk(node.parent, name);
        }
      }(node.parent, node));

      var entry = entries[range(closure)];
      var index = entry.index;

      var declarations = node.declarations;
      for (var i = 0; i < declarations.length; i++) {
        var declaration = declarations[i];

        var name = declaration.id.name;
        var code = declaration.toString();

        __closure[index].__defineGetter__(name, function() {
          delete __closure[index][name];
          eval(code);

          return __closure[index][name];
        });

        __closure[index].__defineSetter__(name, function(value) {
          delete __closure[index][name];
          __closure[index][name] = value;
        });
      }

      return node.toString()
        .replace(/var/, '');
    }

    if (node.type == 'FunctionExpression' || node.type == 'FunctionDeclaration') {
      var entry = entries[range(node)] = (
        context.entries[key(node)] || entries[range(node)] || {}
      );

      entry.node = node;

      if (entry.index == undefined) {
        entry.index = __function.length++;
      }

      var index = entry.index;
      var name = node.id ? node.id.name : '';
      var code = node.toString();

      if (name.length > 0) {
        code = code.replace(name, '');
      }

      __function[index] = '(' + code + ')';

      return [
        'function $name() {',
        '  if (__function[$index].length > 0) {',
        '    __function[$index] = eval(__function[$index]);',
        '  }',
        '  return __function[$index].apply(this, arguments);',
        '}',
      ].join('\n')
        .replace(/\$index/g, index)
        .replace(/\$name/g, name);
    }

    if (node.type == 'ObjectExpression') {
      var scope = (function next(node) {
        if (node.type == 'Program') {
          return node;
        }

        if (node.type == 'FunctionExpression' || node.type == 'FunctionDeclaration') {
          return node;
        }

        return next(node.parent);
      }(node.parent));

      if (scope.type != 'Program') {
        return node.toString();
      }

      var entry = entries[range(node)] = (
        context.entries[key(node)] || entries[range(node)] || {}
      );

      if (entry.index == undefined) {
        entry.index = __cache.length++;
      }

      entry.node = node;

      var index = entry.index;
      var code = node.toString();

      if (__cache[index]) {
        var target = __cache[index];
        var source = eval('(' + code + ')');

        __cache.__defineGetter(index, function() {
          delete __cache[index];
          __cache[index] = target;

          for (var name in source) {
            if (target.hasOwnProperty(name)) {
              continue;
            }

            target[name] = source[name];
          }

          return __cache[index];
        });
      }

      return [
        '($index in __cache ? __cache[$index] : __cache[$index] = $code)',
      ].join('\n')
        .replace(/\$index/g, index)
        .replace(/\$code/g, code);
    }

    if (node.type == 'CallExpression') {
      var scope = (function next(node) {
        if (node.type == 'Program') {
          return node;
        }

        if (node.type == 'FunctionExpression' || node.type == 'FunctionDeclaration') {
          return node;
        }

        return next(node.parent);
      }(node.parent));

      if (scope.type != 'Program') {
        return node.toString();
      }

      var entry = entries[range(node)] = (
        context.entries[key(node)] || entries[range(node)] || {}
      );

      entry.node = node;

      var signature = JSON.stringify(node, [
        'name',
        'arguments',
        'value',
      ]);

      if (entry.signature != signature) {
        entry.signature = signature;
        entry.index = __cache.length++;
      }

      var index = entry.index;
      var code = node.toString();

      return [
        '($index in __cache ? __cache[$index] : __cache[$index] = $code)',
      ].join('\n')
        .replace(/\$index/g, index)
        .replace(/\$code/g, code);
    }

    return node.toString();
  });

  for (var key in context.entries) {
    var entry = context.entries[key];
    var node = entry.node;
    var dead = true;

    for (var key in entries) {
      if (entry == entries[key]) {
        dead = false;
        break;
      }
    }

    if (node == null || dead == false) {
      continue;
    }

    if (node.type == 'FunctionExpression' || node.type == 'FunctionDeclaration') {
      __function[entry.index] = '(function() { })';
    }
  }

  for (var key in context.entries) {
    delete context.entries[key];
  }

  for (var key in entries) {
    context.entries[key] = entries[key];
  }

  context.content = content;

  return evaluate(output);
}

module.exports.cache = {};
