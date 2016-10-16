var fs = require('fs');
var reval = require('reval');

require.extensions['.js'] = function(module, filename) {
  reval(content, filename, function(output) {
    module._compile(output.code, filename);
  });
};
