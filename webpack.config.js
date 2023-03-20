const path = require('path');
const resolve = dir => path.resolve(__dirname, dir);

module.exports = {
  resolve: {
    alias: {
      '@src': resolve('lib')
    }
  },
  ignoreWarnings: [/Failed to parse source map/]
};
