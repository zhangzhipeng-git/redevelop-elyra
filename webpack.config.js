const path = require('path');
const resolve = dir => path.resolve(__dirname, dir);

module.exports = {
  resolve: {
    alias: {
      '@app': resolve('lib/app')
    }
  },
  ignoreWarnings: [/Failed to parse source map/],
};
