var path = require('path');

/*
* Ludic base config
*/

module.exports = {
  entry: "./src/main.js",
  output: {
    libraryTarget: 'umd',
    path: __dirname + '/dist',
    filename: 'ludic.js'
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
