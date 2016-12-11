var diff = require('fast-diff');
var reshift = require('reshift');

__cache = [];
__function = [];

module.exports = function revaluate(content, name, evaluate) {
  var context = revaluate.cache[name] = (revaluate.cache[name] || {
    entries: {},
    content: '',
  });

  var diffs = diff(context.content, content);

  var key = (function(diffs) {
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

    return function(node) {
      var start = indices[node.start];
      var end = indices[node.end];

      return start + ',' + end;
    };
  }(diffs));

  var range = function(node) {
    return node.start + ',' + node.end;
  };

  var entries = {};
  var output = reshift(content, function(node) {
    if (node.type == 'ClassDeclaration' || node.type == 'ClassExpression') {
      var entry = entries[range(node)] = (
        context.entries[key(node)] || entries[range(node)] || {}
      );

      entry.node = node;

      if (entry.index == undefined) {
        entry.index = __cache.length++;
      }

      var index = entry.index;
      var name = node.id ? node.id.name : '';
      var code = node.toString();

      if (index in __cache) {
        var target = __cache[index];

        Object.defineProperty(__cache, index, {
          get: function() {
            delete __cache[index];

            var source = eval(code);
            var prototype = false;
            do {
              var names = Object.getOwnPropertyNames(
                prototype ? target.prototype : target
              );

              for (var i = 0; i < names.length; i++) {
                var name = names[i];

                if ((prototype ? source.prototype : source).hasOwnProperty(name)) {
                  continue;
                }

                delete (prototype ? target.prototype : target)[name];
              }

              prototype = !prototype;
            } while (prototype);

            do {
              var names = Object.getOwnPropertyNames(
                prototype ? source.prototype : source
              );

              for (var i = 0; i < names.length; i++) {
                var name = names[i];

                if ((prototype ? target.prototype : target).hasOwnProperty(name)) {
                  continue;
                }

                var descriptor = Object.getOwnPropertyDescriptor(
                  prototype ? source.prototype : source,
                  name
                );

                Object.defineProperty(
                  prototype ? target.prototype : target, name, descriptor
                );
              }

              prototype = !prototype;
            } while (prototype);

            return (__cache[index] = target);
          }
        });
      }

      return [
        '($index in __cache ? __cache[$index] : __cache[$index] = $code)',
      ].join('\n')
        .replace(/^/, node.type == 'ClassDeclaration' ? 'var $name = ' : '')
        .replace(/\$name/g, name)
        .replace(/\$index/g, index)
        .replace(/\$code/g, code);
    }

    if (node.type == 'MethodDefinition') {
      var entry = entries[range(node)] = (
        context.entries[key(node)] || entries[range(node)] || {}
      );

      entry.node = node;

      if (entry.index == undefined) {
        entry.index = __cache.length++;
      }

      var index = entry.index;
      var signature = node.toString()
                          .replace(/^(.*)(\{[\s\S]*\}$)/g, '$1');

      var code = node.toString()
                     .replace(/^(.*)\(/, 'function (')

      __function[index] = '(' + code + ')';

      return [
        '$signature {',
        '  if (__function[$index].length > 0) {',
        '    __function[$index] = eval(__function[$index]);',
        '  }',
        '  return __function[$index].apply(this, arguments);',
        '}',
      ].join('\n')
        .replace(/\$index/g, index)
        .replace(/\$signature/g, signature);
    }

    if (node.type == 'FunctionExpression' || node.type == 'FunctionDeclaration') {
      if (node.parent.type == 'MethodDefinition') {
        return node.toString();
      }

      var entry = entries[range(node)] = (
        context.entries[key(node)] || entries[range(node)] || {}
      );

      entry.node = node;

      if (entry.index == undefined) {
        entry.index = __cache.length++;
      }

      var index = entry.index;
      var name = node.id ? node.id.name : '';
      var code = node.toString();

      if (name.length > 0) {
        code = code.replace(name, '');
      }

      __function[index] = '(' + code + ')';

      return [
        '(__cache[$index] = __cache[$index] || function $name() {',
        '  if (__function[$index].length > 0) {',
        '    __function[$index] = eval(__function[$index]);',
        '  }',
        '  return __function[$index].apply(this, arguments);',
        '})',
      ].join('\n')
        .replace(/^/, node.type == 'FunctionDeclaration' ? 'var $name = ' : '')
        .replace(/$/, node.type == 'FunctionDeclaration' ? ';' : '')
        .replace(/\$index/g, index)
        .replace(/\$name/g, name);
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

      entry.node = node;

      if (entry.index == undefined) {
        entry.index = __cache.length++;
      }

      var index = entry.index;
      var code = node.toString();

      if (index in __cache) {
        var target = __cache[index];

        Object.defineProperty(__cache, index, {
          get: function() {
            delete __cache[index];

            var source = eval('(' + code + ')');
            var names = Object.getOwnPropertyNames(target);
            for (var i = 0; i < names.length; i++) {
              var name = names[i];
              if (source.hasOwnProperty(name)) {
                continue;
              }

              delete target[name];
            }

            var names = Object.getOwnPropertyNames(source);
            for (var i = 0; i < names.length; i++) {
              var name = names[i];
              if (target.hasOwnProperty(name)) {
                continue;
              }

              var descriptor = Object.getOwnPropertyDescriptor(
                source,
                name
              );

              Object.defineProperty(target, name, descriptor);
            }

            return (__cache[index] = target);
          },
        })
      }

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

    if (node.type == 'MethodDefinition') {
      __function[entry.index] = '(function() { })';
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
