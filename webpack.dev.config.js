var merge = require('webpack-merge')
var base = require('./webpack.base.config.js')

/*
* Ludic dev config
*/

module.exports = function(env){
  return ['umd','commonjs','commonjs2'].map(function(lib){
    return merge(base, {
      entry: "./src/main.js",
      output: {
        libraryTarget: lib,
        path: __dirname + '/dist',
        filename: 'ludic.'+lib+'.js'
      },
    })
  })
}
