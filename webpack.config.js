const path = require('path')
const merge = require('webpack-merge')

const base = {
  mode: "development",
  // Enable sourcemaps for debugging webpack's output.
  devtool: "source-map",
  entry: "./src/main.ts",
  resolve: {
    alias: {
      "src": path.resolve(__dirname, 'src'),
    },
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: [".ts", ".tsx", ".js", ".json"]
  },
  module: {
    rules: [
      // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
      {
        test: /\.tsx?$/,
        loader: "awesome-typescript-loader"
      },
      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      {
        enforce: "pre",
        test: /\.js$/,
        loader: "source-map-loader"
      }
    ]
  },
}

module.exports = function(env){
  return ['umd','commonjs','commonjs2'].map(function(lib){
    return merge(base, {
      output: {
        libraryTarget: lib,
        library: 'Ludic',
        path: __dirname + '/dist',
        filename: "ludic."+lib+".js"
      },
    })
  })
}
