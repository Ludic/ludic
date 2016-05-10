import Box2D from '../box2d/box2d';


var _config = {
  canvas: {
    fullscreen: false,
    fps: false
  },
  world: {
    gravity: {
      x: 0,
      y: 0,
    },
    drawAxes: false,
    drawDebug: false
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

      if(typeof arguments[i] === 'object'){
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
    this.configure();
  }

  static getConfig(){
    return _config;
  }

  static readConfig(scope, param, def){
    var params = param ? param.split('.') : [];

    var obj;

    try {
      obj = _config[scope];

      for(var i=0; i<params.length; i++){
        obj = obj[params[i]];
      }
    } catch (e) {
      obj = null;
      console.error(e);
    } finally {
      obj = obj || def;
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

    this.configure();
  }

  static configure(){
    this.configureConsole();
  }

  static configureConsole(){

    if(!_config.console.log){
      console._log = console.log;
      console.log = function(){};
    }
  }

  //to replace original C++ operator =
  static copyVec2(vec) {
      return new Box2D.b2Vec2(vec.get_x(), vec.get_y());
  }

  //to replace original C++ operator * (float)
  static scaleVec2(vec, scale) {
      vec.set_x( scale * vec.get_x() );
      vec.set_y( scale * vec.get_y() );
  }

  //to replace original C++ operator *= (float)
  static scaledVec2(vec, scale) {
      return new Box2D.b2Vec2(scale * vec.get_x(), scale * vec.get_y());
  }


  static generateGradient(color1, color2, ratio){
    var hex = function(x) {
      x = x.toString(16);
      return (x.length == 1) ? '0' + x : x;
    };
    var r = Math.ceil(parseInt(color1.substring(0,2), 16) * ratio + parseInt(color2.substring(0,2), 16) * (1-ratio));
    var g = Math.ceil(parseInt(color1.substring(2,4), 16) * ratio + parseInt(color2.substring(2,4), 16) * (1-ratio));
    var b = Math.ceil(parseInt(color1.substring(4,6), 16) * ratio + parseInt(color2.substring(4,6), 16) * (1-ratio));

    return  hex(r) + hex(g) + hex(b);
  }
}

export default Util;
