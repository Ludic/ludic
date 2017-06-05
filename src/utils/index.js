export function convertHex(hex,opacity){
  hex = hex.replace('#','')
  var r = parseInt(hex.substring(0,2), 16)
  var g = parseInt(hex.substring(2,4), 16)
  var b = parseInt(hex.substring(4,6), 16)

  var result = 'rgba('+r+','+g+','+b+','+opacity+')'
  return result
}

export function round(val, places=0) {
  var c = 1
  for (var i = 0; i < places; i++){
    c *= 10
  }
  return Math.round(val*c)/c
}

export function using(self, ns, pattern, logNames, logValues){
  self = self || this
  if (pattern == undefined) {
      // import all
      for (var name in ns) {
          if(!logNames){
            self[name] = ns[name]
          } else {
            console.log(name, logValues ? ns[name] : '')
          }
      }
  } else {
      if (typeof(pattern) == 'string') {
          pattern = new RegExp(pattern)
      }
      // import only stuff matching given pattern
      for (var name in ns) {
          if (name.match(pattern)) {
            if(!logNames){
              self[name] = ns[name]
            } else {
              console.log(name, logValues ? ns[name] : '')
            }
          }
      }
  }
}

export function extend(...args) {
  for (var i = 1; i < args.length; i++){

    if(typeof args[i] === 'object' && !(args[i] instanceof HTMLElement)){
      for (var key in args[i]){
        if (args[i].hasOwnProperty(key)){
          args[0] = args[0] || {}
          var obj = this.extend(args[0][key], args[i][key])
          args[0][key] = obj
        }
      }
    } else {
      args[0] = args[i]
    }

  }
  return args[0]
}
