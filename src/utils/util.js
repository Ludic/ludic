
var _config = {
  canvas: {
    dimension: '2d',
  },
  console: {
    log: true
  }
};

class Util {

  

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
