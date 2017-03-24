var path = require('path');
var fs = require('fs');

/*
* Ludic build config
*/

module.exports = function(env){
  return ['umd','this','window','global','amd','commonjs','commonjs2'].map(function(lib){
    return {
      entry: "./src/main.js",
      output: {
        libraryTarget: lib,
        library: 'Ludic',
        path: __dirname + '/dist',
        filename: "ludic."+lib+".js"
      },
      module: {
        loaders: [
          {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: "babel-loader",
            options: {
              presets: [
                ["es2015",{modules: false}],
                "stage-1",
              ]
            },
          },
          {
            test: /\.css$/,
            loader: "style!css",
          },
        ]
      },
      resolve: {
        alias: {
          src: path.resolve(__dirname, 'src/'),
          components: 'src/components',
        },
        extensions: ['.js', '.scss', '.json'],
      },
      devtool: '#source-map'
    }
  })
}
