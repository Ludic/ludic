import KeyCodeMap from './keyCodeMap';

import GamepadController from './gamepadController'

let listeners = [];
let defaultKeyConfig = {
  preventDefault: true
}
let ps4Mapping = {
  buttons: ['cross','circle','square','triangle','l1','r1','l2','r2','extra','start','l3','r3','up','down','left','right','home','select'],
  axes: ['lx','ly','rx','ry'],
  sticks: {
    lx:'leftStick',
    ly:'leftStick',
    rx:'rightStick',
    ry:'rightStick'
  }
};

let gamepadMaps = {
  'Wireless Controller (STANDARD GAMEPAD Vendor: 054c Product: 05c4)':ps4Mapping // ps4 controller
};

let gamepadsAxisDeadZone = 0.08;
let gamepadsConfig = {};

let mousePosPixel = {};
let prevMousePosPixel = {};
// let gamepadTypeMaps = [{id:'054c',type:'ps4'}];

class InputController {
  constructor(canvas) {
    this.canvas = canvas;
    // TODO: refactor config
    this.config = {};

    this.inputControllers = [];

    this.initKeys();
    this.initMouse();
    this.addInputController(new GamepadController())
    // this.initGamepads();
  }

  addInputController(inputController){
    inputController.install(this);
    this.inputControllers.push(inputController);
  }

  // input methods

  addInputListener(listener){
    listeners.push(listener);
  }

  /**
   * Instantiates and returns a new InputEventListener
   * @param {Object} options - passed along to new InputEventListener
   * @param {Binder} binder (optional) - passed along to new InputEventListener
   * @param {Boolean} alsoAdd (optional) - determines whether the returning InputEventListener should also be added to this
   *
   * @return {InputEventListener} - listener object used to attached handlers for input events
   */
  newInputListener(options, binder, alsoAdd){
    if(typeof alsoAdd === 'undefined' && typeof binder === 'boolean'){
      // alsoAdd was the second param, without binder
      alsoAdd = binder;
      binder = null;
    }
    // we can also set `alsoAdd` via options
    alsoAdd = alsoAdd != null ? alsoAdd : options.alsoAdd || false
    var l = new InputEventListener(options, binder);
    if(alsoAdd){
      this.addInputListener(l);
    }
    return l;
  }

  removeInputListener(listener){
    var ix = listeners.indexOf(listener);
    if(ix>-1){
      listeners.splice(ix,1);
    }
  }

  //  -- keyboard
  initKeys() {
    // object for all key states
    this.allKeys = {};

    let func = (evt)=>{
      // evt.preventDefault();
      // this.onKeyDown(this.canvas,evt);
      // this.onKeyEvent(evt);
      var l;
      let down = evt.type === 'keydown';
      let dir = down?'down':'up';

      // give the event a list of all keys states
      this.allKeys[evt.keyCode] = this.allKeys[evt.key] = down;
      evt.allKeys = this.allKeys;

      if(this.config.logAllKeys){
        console.log(evt.keyCode);
      }
      this.dispatchEvent(this,this.keyHandler,evt,down,dir)
    }

    this.canvas.addEventListener('keydown', func, false);
    this.canvas.addEventListener('keyup', func, false);
  }

  dispatchEvent(thisArg, handler, event, ...args){
    for(let listener, i=listeners.length-1; i>=0; i--){
      listener = listeners[i];
      if(!listener || !listener.enabled){ continue;}
      if(handler.call(thisArg,listener,event,...args) === true){
        break;
      }
    }
  }

  keyHandler(l,evt,down,dir){
    let cfg = l.keyConfig;
    let key = cfg[evt.keyCode];
    let binder = l.binder || l;
    if(key){
      if(typeof key === 'object' || Array.isArray(key)) {
        let keys;
        // make array out of single object, treat everything like an array
        if(Array.isArray(key)){
          keys = key;
        } else {
          keys = [key];
        }

        // loop through all key configs
        for(let key of keys){
          let modifiers = false;
          let direction = !key.hasOwnProperty('direction') || key.direction === dir || key.direction === 'both';
          let method = key.hasOwnProperty('method') && key.method;
          key._once = down?key._once:false;

          // logic for modifiers
          if(!!key.shiftKey == evt.shiftKey && !!key.altKey == evt.altKey && !!key.ctrlKey == evt.ctrlKey){
            modifiers = true;
          }

          if(method && modifiers && direction && !key._once){
            binder = key.binder || binder;
            var b = this._execCommand(l,method,binder,down,evt);
            key._once = key.once && down;
          }
        }
      } else {
        console.warn(`InputController: Unsupported key config type '${key}'`);
      }
    }
    // else {
    //   console.log('no config for keycode', evt.keyCode, key);
    // }

    // check for if listener wants the only control
    // if(l.stopPropagation){
    //   break;
    // }
  }

  onKeyEvent(evt) {
    // console.log(evt);
    var l;
    let down = evt.type === 'keydown';
    let dir = down?'down':'up';

    // give the event a list of all keys states
    this.allKeys[evt.keyCode] = this.allKeys[evt.key] = down;
    evt.allKeys = this.allKeys;

    if(this.config.logAllKeys){
      console.log(evt.keyCode);
    }
    for(var i=listeners.length-1; i>=0; i--){
      l = listeners[i];
      if(!l || !l.enabled){ continue;}


    }

  }

  _execCommand(listener, method, binder, ...args){
    if(typeof method === 'string'){
      return listener[method].call(binder,...args);
    } else if(typeof method === 'function'){
      return method.call(binder,...args);
    } else {
      return false;
    }
  }


  //  -- mouse
  initMouse(){
    this.canvas.addEventListener('mousemove', function(evt) {
      this.onMouseEvent('mouseMove',this.canvas.el,evt);
    }.bind(this), false);

    this.canvas.addEventListener('mousedown', function(evt) {
      this.onMouseEvent('mouseDown',this.canvas.el,evt);
    }.bind(this), false);

    this.canvas.addEventListener('mouseup', function(evt) {
      this.onMouseEvent('mouseUp',this.canvas.el,evt);
    }.bind(this), false);

    this.canvas.addEventListener('mouseout', function(evt) {
      this.onMouseEvent('mouseOut',this.canvas.el,evt);
    }.bind(this), false);

    this.canvas.addEventListener('mouseenter', function(evt) {
      this.onMouseEvent('mouseEnter',this.canvas.el,evt);
    }.bind(this), false);
    this.canvas.addEventListener('mouseleave', function(evt) {
      this.onMouseEvent('mouseLeave',this.canvas.el,evt);
    }.bind(this), false);

    // touch events
    this.canvas.addEventListener('touchstart', function(evt) {
      this.onMouseEvent('touchStart',this.canvas.el,evt);
    }.bind(this), false);

    this.canvas.addEventListener('touchend', function(evt) {
      this.onMouseEvent('touchEnd',this.canvas.el,evt);
    }.bind(this), false);

    this.canvas.addEventListener('touchmove', function(evt) {
      this.onMouseEvent('touchMove',this.canvas.el,evt);
    }.bind(this), false);

    this.canvas.addEventListener('touchcancel', function(evt) {
      this.onMouseEvent('touchCancel',this.canvas,evt);
    }.bind(this), false);
  }

  onMouseEvent(key, canvas, evt){
    prevMousePosPixel = mousePosPixel;
    this.updateMousePos(canvas, evt);

    for(var i=listeners.length-1; i>=0; i--){
      let l = listeners[i];
      if(l && l.enabled){
        if(l.hasOwnProperty(key)){
          let bndr = l.binder || l;
          let b = l[key].call(bndr,mousePosPixel,evt);
          if(b === true){
            return;
          }
        }
      }
    }
  }

  //    -- mouse helper function
  updateMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    mousePosPixel = {
      x: evt.clientX - rect.left,
      y: canvas.height - (evt.clientY - rect.top)
    };
  }

  //  -- gamepad


  update(...args){
    this.inputControllers.forEach((controller)=>{
      if(typeof controller.update === 'function'){
        controller.update(...args)
      }
    })
  }

}

let stripModifiers = function(key){
  let mods = key.split('.');
  key = mods[0];
  let ret = {key, config:{}};
  if(mods.length > 1){
    for(let i=1; i<mods.length; i++){
      let mod = mods[i];
      switch (mod) {
        case 'alt':
        case 'altKey':
          ret.config.altKey = true;
          break;
        case 'shift':
        case 'shiftKey':
          ret.config.shiftKey = true;
          break;
        case 'ctrl':
        case 'ctrlKey':
          ret.config.ctrlKey = true;
          break;
        case 'up':
          ret.config.direction = 'up';
          break;
        case 'down':
          ret.config.direction = 'down';
          break;
        case 'once':
          ret.config.once = true;
          break;
        default:
          break;
      }
    }
  }
  return ret;
}

let importKeyConfig = function(keyConfig){
  let config = {};
  for(let key in keyConfig){
    let mods = stripModifiers(key);
    let _key = key;
    let cfg = keyConfig[key];
    key = KeyCodeMap[mods.key] || mods.key;

    // everything needs to be an array of objects
    if(typeof cfg === 'string' || typeof cfg === 'function'){
      config[key] = [Object.assign({},{method:cfg},mods.config)];
    } else if(typeof cfg === 'object' && !Array.isArray(cfg)){
      config[key] = [Object.assign({},mods.config,cfg)];
    } else if(Array.isArray(cfg)){
      config[key] = cfg.map((conf)=>{
        return Object.assign({},mods.config,conf);
      });
    } else {
      console.warn(`InputController: Unsupported key config type '${typeof cfg}' for '${key}'`, cfg);
    }
  }
  return config;
}

class InputEventListener {
  constructor(options, binder) {
    let keyConfig = options;
    if(options.hasOwnProperty('keyConfig')){
      keyConfig = options.keyConfig;
    }
    if(options.hasOwnProperty('gamepadIndex')){
      this.gamepadIndex = options.gamepadIndex;
    } else {
      this.gamepadIndex = -1;
    }
    if(options.hasOwnProperty('binder')){
      binder = options.binder;
    }

    this.stopPropagation = options.stopPropagation;

    this.keyConfig = importKeyConfig.call(this,keyConfig);
    this.options = options;
    this.binder = binder;
    this.enabled = options.hasOwnProperty('enabled') ? options.enabled : true;

    if(options.hasOwnProperty('methods')){
      this._loadListener(options.methods);
    }
  }

  $enable(){
    this.enabled = true;
  }

  $disable(){
    this.enabled = false;
  }

  _loadListener(listener){
    let avail = ['start', 'select', 'home', 'extra', 'left', 'right', 'up', 'down',
      'l1', 'l2', 'l3', 'r1', 'r2', 'r3', 'triangle', 'square', 'circle', 'cross',
      'leftStick', 'rightStick', 'mouseMove', 'mouseDown', 'mouseUp', 'mouseOut', 'mouseEnter', 'mouseLeave',
      'touchStart', 'touchEnd', 'touchMove', 'touchCancel',
    ];

    for(let key of avail){
      if(key in listener){
        let method = listener[key];

        if(typeof method === 'function'){
          this[key] = method;
        } else if(typeof method === 'string'){
          console.log(this.keyConfig);
          let code = method;

          if(Number.isNaN(parseInt(code))){
            // need to convert char
            let _code = KeyCodeMap[code];
            if(_code){
              code = _code;
            } else {
              console.warn('There is no mapping for: ', method);
              continue;
            }
          }

          let arr = this.keyConfig[code];

          if(arr.length === 1){
            this[key] = arr[0].method
          } else {
            console.warn('multiple entries per keycode is not supported at this yet.', key, arr, method);
          }
        }
      }
    }
  }

  start(){
    return null;
  }

  select(){
    return null;
  }

  home(){  // ps/xb button
    return null;
  }

  left(){
    return null;
  }

  right(){
    return null;
  }

  up(){
    return null;
  }

  down(){
    return null;
  }

  l1(){
    return null;
  }

  l2(){
    return null;
  }

  l3(){
    return null;
  }

  r1(){
    return null;
  }

  r2(){
    return null;
  }

  r3(){
    return null;
  }

  triangle(){
    return null;
  }

  square(){
    return null;
  }

  circle(){
    return null;
  }

  cross(){
    return null;
  }

  extra(){
    return null;
  }

  leftStick(x,y,event){
    return null;
  }

  rightStick(x,y,event){
    return null;
  }
}
// assign the InputEventListener class as a static property on InputController
//  so it can be instantiated properly outside of this module
InputController.InputEventListener = InputEventListener;

export default InputController;
