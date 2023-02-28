const path = require('path');
const resolve = dir => path.resolve(__dirname, dir);

module.exports = {
  resolve: {
    alias: {
      '@src': resolve('lib'),
      '@app': resolve('lib/app'),
      '@assets': resolve('lib/assets')
    }
  },
  ignoreWarnings: [/Failed to parse source map/]
};
