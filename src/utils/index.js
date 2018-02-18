export function convertHex(hex, opacity = 1){
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

export function using(self, ns, pattern){
  self = self || this
  if (pattern == null) {
    // import all
    for (let name in ns) {
      self[name] = ns[name]
    }
  } else if (typeof pattern == 'string') {
    let regex = new RegExp(pattern)
    // import only stuff matching given pattern
    for (let name in ns) {
      if (name.match(regex)) {
        self[name] = ns[name]
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