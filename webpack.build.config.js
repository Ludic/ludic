var merge = require('webpack-merge')
var base = require('./webpack.base.config.js')

/*
* Ludic build config
*/

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
