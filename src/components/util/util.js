
var _config = {
  canvas: {
    dimension: '2d',
  },
  console: {
    log: true
  }
};

class Util {

  static convertHex(hex,opacity){
    hex = hex.replace('#','');
    var r = parseInt(hex.substring(0,2), 16);
    var g = parseInt(hex.substring(2,4), 16);
    var b = parseInt(hex.substring(4,6), 16);

    var result = 'rgba('+r+','+g+','+b+','+opacity+')';
    return result;
  }

  static myRound(val,places) {
    var c = 1;
    for (var i = 0; i < places; i++)
      c *= 10;
    return Math.round(val*c)/c;
  }

  static using(self, ns, pattern, logNames, logValues){
    self = self || this;
    if (pattern == undefined) {
        // import all
        for (var name in ns) {
            if(!logNames){
              self[name] = ns[name];
            } else {
              console.log(name, logValues?ns[name]:'');
            }
        }
    } else {
        if (typeof(pattern) == 'string') {
            pattern = new RegExp(pattern);
        }
        // import only stuff matching given pattern
        for (var name in ns) {
            if (name.match(pattern)) {
              if(!logNames){
                self[name] = ns[name];
              } else {
                console.log(name, logValues?ns[name]:'');
              }
            }
        }
    }
  }

  static extend() {
    for (var i = 1; i < arguments.length; i++){

      if(typeof arguments[i] === 'object' && !(arguments[i] instanceof HTMLElement)){
        for (var key in arguments[i]){
          if (arguments[i].hasOwnProperty(key)){
            arguments[0] = arguments[0] || {};
            var obj = this.extend(arguments[0][key], arguments[i][key]);
            arguments[0][key] = obj;
          }
        }
      } else {
        arguments[0] = arguments[i];
      }

    }
    return arguments[0];
  }

  static setConfig(config){
    _config = this.extend(_config, config);
  }

  static getConfig(){
    return _config;
  }

  static readConfig(scope, param = '', def = undefined){
    let params = param ? param.split('.') : [];
    let obj = _config[scope];

    obj = Object.resolve(param, obj)
    if(obj==null){
      obj = def
    }
    return obj;
  }

  static setParam(scope, param, value){
    var params = param.split('.');

    var obj;

    try {
      obj = _config[scope] = _config[scope] || {};

      for(var i=0,l=params.length; i<l; i++){
        // obj = obj[params[i]];
        var prop = params[i];
        obj = obj[prop] = obj[prop] || (i==l-1) ? value : {};
      }
    } catch (e) {
      obj = null;
    }
    console.log('update');
  }

}

export default Util;
