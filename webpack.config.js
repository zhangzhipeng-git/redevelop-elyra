/* eslint-disable no-undef */

module.exports = {
  //   module: {
  //     rules: [
  //       {
  //         test: [/\.(js|ts|tsx)$/],
  //         enforce: 'pre',
  //         exclude: [/node_modules/],
  //         use: [
  //           {
  //             loader: 'source-map-loader',
  //             options: {
  //               filterSourceMappingUrl: (url, resourcePath) => {
  //                 if (/.*\/node_modules\/.*/.test(url)) {
  //                   return false;
  //                 }
  //                 if (/.*\/node_modules\/.*/.test(resourcePath)) {
  //                   return false;
  //                 }
  //                 return true;
  //               }
  //             }
  //           }
  //         ]
  //       }
  //     ]
  //   }
  ignoreWarnings: [/Failed to parse source map/]
};
