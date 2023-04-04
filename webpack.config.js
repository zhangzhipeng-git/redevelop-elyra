const path = require('path');
const resolve = dir => path.resolve(__dirname, dir);
const options = {
  resolve: { alias: {} },
  ignoreWarnings: [/Failed to parse source map/]
};

const ENV = process.env.ENV;
if (ENV) options.mode = ENV;
options.resolve.alias['@src/config'] =
  ENV !== 'production'
    ? resolve('lib/config.dev.js')
    : resolve('lib/config.pro.js');
options.resolve.alias['@src'] = resolve('lib');

module.exports = options;
