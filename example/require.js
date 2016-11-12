var fs = require('fs');
var revaluate = require('..');

require.extensions['.js'] = function(module, filename) {
  var content = fs.readFileSync(filename, 'utf8');

  revaluate(content, filename, function(output) {
    module._compile(output.toString(), filename);
  });

  fs.watchFile(filename, {
    interval: 1000,
    persistent: true,
  }, function() {
    var content = fs.readFileSync(filename, 'utf8');
    revaluate(content, filename, function(output) {
      module._compile(output.code, filename);
    });
  });
};
