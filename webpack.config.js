const path = require('path');
const MineCssExtractPlugin = require('mini-css-extract-plugin');
const resolve = dir => path.resolve(__dirname, dir);

let mode;
const ENV = process.env.ENV || 'dev';

switch (ENV) {
  case 'zk': // 中堃开发环境
  case 'pro': // 数据胡生产
  case 'test': // 内网测试环境
    mode = 'production';
    break;
  default: // 本地
    mode = 'development';
    break;
}

module.exports = {
  mode,
  resolve: {
    alias: {
      '@src/config': resolve(`lib/config.${ENV}.js`),
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
      filename: '[name].[contenthash].css'
    })
  ],
  ignoreWarnings: [/Failed to parse source map/]
};
