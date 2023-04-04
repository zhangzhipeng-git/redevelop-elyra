const path = require('path');
const MineCssExtractPlugin = require('mini-css-extract-plugin');
const resolve = dir => path.resolve(__dirname, dir);

const ENV = process.env.ENV;
module.exports = {
  ...(ENV ? { mode: ENV } : {}),
  resolve: {
    alias: {
      '@src/config':
        ENV !== 'production'
          ? resolve('lib/config.dev.js')
          : resolve('lib/config.pro.js'),
      '@src': resolve('lib')
    }
  },
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        exclude: /node_modules|bower_components/,
        use: [MineCssExtractPlugin.loader, 'css-loader', 'sass-loader']
      }
    ]
  },
  plugins: [
    new MineCssExtractPlugin({
      filename: '[name].css'
    })
  ],
  ignoreWarnings: [/Failed to parse source map/]
};
