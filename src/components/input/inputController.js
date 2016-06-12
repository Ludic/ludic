import Util from '../util/util';
import KeyCodeMap from './keyCodeMap';

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
let mousePosWorld = {};
let prevMousePosPixel = {};
// let gamepadTypeMaps = [{id:'054c',type:'ps4'}];

class InputController {
  constructor(canvas, camera) {
    this.canvas = canvas;
    this.camera = camera;
    this.config = Util.readConfig('input');

    this.initKeys();
    this.initMouse();
    this.initGamepads();
  }

  // input methods

  addEventListener(listener){
    listeners.push(listener);
  }

  newEventListener(options, binder, alsoAdd){
    if(typeof alsoAdd === 'undefined' && typeof binder === 'boolean'){
      // alsoAdd was the second param, without binder
      alsoAdd = binder;
      binder = null;
    }
    var l = new InputEventListener(options, binder);
    if(alsoAdd){
      this.addEventListener(l);
    }
    return l;
  }

  removeEventListener(listener){
    var ix = listeners.indexOf(listener);
    if(ix>-1){
      console.log('remove event listener');
      listeners.splice(ix,1);
    }
  }

  //  -- keyboard
  initKeys() {
    this.canvas.addEventListener('keydown', function(evt) {
      // evt.preventDefault();
      // this.onKeyDown(this.canvas,evt);
      this.onKeyEvent(this.canvas,evt);
    }.bind(this), false);

    this.canvas.addEventListener('keyup', function(evt) {
      // evt.preventDefault();
      // this.onKeyUp(this.canvas,evt);
      this.onKeyEvent(this.canvas,evt);
    }.bind(this), false);
  }

  onKeyEvent(canvas, evt) {
    // console.log(evt);
    var l;
    let down = evt.type === 'keydown';
    let dir = down?'down':'up';

    if(this.config.logAllKeys){
      console.log(evt.keyCode);
    }
    for(var i=listeners.length-1; i>=0; i--){
      l = listeners[i];
      if(!l){ continue;}

      let cfg = l.keyConfig;
      let key = cfg[evt.keyCode];
      let binder = l.binder || l;
      if(key){
        if(typeof key === 'object' || Array.isArray(key)) {
          let keys;
          if(Array.isArray(key)){
            keys = key;
          } else {
            keys = [key];
          }

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

              // TODO: refactor this, has to move out of this loop to outer one
              if(b === true){
                return;
              }
            }
          }
        } else {
          console.warn(`InputController: Unsupported key config type '${key}'`);
        }
      }
      // else {
      //   console.log('no config for keycode', evt.keyCode, key);
      // }
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
    canvas.addEventListener('mousemove', function(evt) {
      this.onMouseEvent('mouseMove',canvas,evt);
    }.bind(this), false);

    canvas.addEventListener('mousedown', function(evt) {
      this.onMouseEvent('mouseDown',canvas,evt);
    }.bind(this), false);

    canvas.addEventListener('mouseup', function(evt) {
      this.onMouseEvent('mouseUp',canvas,evt);
    }.bind(this), false);

    canvas.addEventListener('mouseout', function(evt) {
      this.onMouseEvent('mouseOut',canvas,evt);
    }.bind(this), false);

    // touch events
    canvas.addEventListener('touchstart', function(evt) {
      this.onMouseEvent('touchStart',canvas,evt);
    }.bind(this), false);

    canvas.addEventListener('touchend', function(evt) {
      this.onMouseEvent('touchEnd',canvas,evt);
    }.bind(this), false);

    canvas.addEventListener('touchmove', function(evt) {
      this.onMouseEvent('touchMove',canvas,evt);
    }.bind(this), false);

    canvas.addEventListener('touchcancel', function(evt) {
      this.onMouseEvent('touchCancel',canvas,evt);
    }.bind(this), false);
  }

  onMouseEvent(key, canvas, evt){
    prevMousePosPixel = mousePosPixel;
    this.updateMousePos(canvas, evt);

    for(var i=listeners.length-1; i>=0; i--){
      let l = listeners[i];
      if(l){
        if(l.hasOwnProperty(key)){
          let bndr = l.binder || l;
          let b = l[key].call(bndr,mousePosPixel,mousePosWorld,evt);
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
    mousePosWorld = this.camera.getWorldPointFromPixelPoint(mousePosPixel);
  }

  //  -- gamepad
  initGamepads(){
    this.gamepads = {};
    this.lastGamepads = {};
    this.lastButtonStates = [
      [], // gamepad index 0
      [], // gamepad index 1
      [], // gamepad index 2
      []  // gamepad index 3
    ];
    this.lastAxisStates = [
      [], // gamepad index 0
      [], // gamepad index 1
      [], // gamepad index 2
      []  // gamepad index 3
    ];
    window.addEventListener("gamepadconnected", (e)=>{
      console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
        e.gamepad.index, e.gamepad.id,
        e.gamepad.buttons.length, e.gamepad.axes.length);
      console.log(e.gamepad);
      this.getGamepads();
    });
    window.addEventListener("gamepaddisconnected", (e)=>{
      console.log('Gamepad disconnected: ',e);
      this.getGamepads();
    });

    window.addEventListener('gamepadbuttondown', (e)=>{
      console.log('gamepad button down: ',e);
    });

    window.addEventListener('gamepadbuttonup', (e)=>{
      console.log('gamepad button up: ',e);
    });
    // console.log(navigator.getGamepads());

    // temp
    this.most = this.least = 0;
  }

  getGamepads(){
    var gps = navigator.getGamepads() || [];
    var gp;
    for(var i=0;i<gps.length;i++){
      gp = gps[i];
      if(gp){
        this.gamepads[gp.index] = gp;
      }
    }
    return this.gamepads;
  }

  step(){
    this._stepGamepads();
  }

  _stepGamepads(){
    var gps = this.getGamepads();
    var gp;
    for(var i in gps){
      gp = gps[i];
      if(gp){

        gp.buttons.forEach( (b,ix)=>{
          // console.log(b.pressed, b.value);
          var lastState = this.getLastState(i,ix);
          b.index = ix;

          if(b.pressed){
            // b.index = ix;
            this.gamepadButtonEvent(gp,b,true);
            this.setLastState(i,ix,true);
          } else {
            if(lastState) {

              if(lastState.pressed) {
                // console.log('button up: ', ix);
                this.gamepadButtonEvent(gp,b,false);
                // this.setLastState(i,ix,false);
              } else {
                // console.log('last state !pressed');
              }
            } else {

            }
            this.setLastState(i,ix,false);
          }



        });

        gp.axes.forEach( (value,axis)=>{
          var dz = this.getDeadZone(axis);
          var lastState = this.getLastAxisState(i,axis);

          if( value < -dz || value > dz ){
            // if(value > this.most){
            //   this.most = value;
            // }
            // if(value < this.least){
            //   this.least = value;
            // }
            // console.log(dz,this.least,this.most);
            this.gamepadAxisEvent(gp,axis,value,false);
            // this.setLastAxisState(i,axis,false);
          } else if(!lastState.zeroed){
            this.gamepadAxisEvent(gp,axis,0,true);
            // this.setLastAxisState(i,axis,true);
          }

        });
      } else {
        console.log('no gamepad!',i);
      }
    }
  }

  getLastAxisState(gpIndex,axis){
    var b = this.lastAxisStates[gpIndex][axis] || {zeroed:true};
    return b;
  }

  setLastAxisState(gpIndex,axis,state){
    this.lastAxisStates[gpIndex][axis] = {zeroed:state};
  }

  getDeadZone(gamepadIndex){
    if(gamepadsConfig.hasOwnProperty(gamepadIndex) && gamepadsConfig[gamepadIndex].hasOwnProperty(deadZone)){
      return gamepadsConfig[gamepadIndex].deadZone;
    }
    return gamepadsAxisDeadZone;
  }

  setDeadZone(deadZone,gamepadIndex){
    if(gamepadIndex !== null && gamepadIndex !== undefined){
      if(gamepadsConfig.hasOwnProperty(gamepadIndex)){
        gamepadsConfig[gamepadIndex].deadZone = deadZone;
      } else {
        gamepadsConfig[gamepadIndex] = {deadZone: deadZone};
      }
    } else {
      gamepadsAxisDeadZone = deadZone;
    }
  }

  getLastState(i,ix){
    var b = this.lastButtonStates[i][ix];
    return b;
  }

  setLastState(i,ix,state){
    this.lastButtonStates[i][ix] = {pressed:state};
  }

  gamepadButtonEvent(gamepad,button,down) {
    button.id = gamepadMaps[gamepad.id].buttons[button.index];
    if(button.id){
      // if(down){
      //   this.onGamepadDown(new GamepadButtonEvent(gamepad,button,down));
      // } else {
      //   this.onGamepadUp(new GamepadButtonEvent(gamepad,button,down));
      // }
      this.onGamepadButtonEvent(new GamepadButtonEvent(gamepad,button,down));
    } else {
      console.log(arguments);
    }
  }

  onGamepadButtonEvent(evt){
    var l;
    let down = evt.down;

    // if(this.config.logAllKeys){
    //   console.log(evt.keyCode,evt.keyIdentifier);
    // }
    for(let i=listeners.length-1; i>=0; i--){
      l = listeners[i];
      if(!l){
        continue;
      }
      let func = l[evt.keyIdentifier];
      if(!func){
        continue;
      }
      if(l.gamepadIndex >= 0 && l.gamepadIndex !== evt.gamepadIndex){
        continue;
      }

      let bndr = l.binder || l;
      let b = func.call(bndr,down,evt);
      if(b === true){
        return;
      }
    }
    // if(this.config.logUnmappedKeys){
    //   console.log(evt.keyCode,evt.keyIdentifier,evt.button.value, listeners.length===0?"No listeners":"");
    // }
  }

  getGamepadMap(gamepadId){
    return gamepadMaps[gamepadId] || {};
  }

  gamepadAxisEvent(gamepad,axisIndex,value,zeroed){
    this.setLastAxisState(gamepad.index,axisIndex,zeroed);
    var gpMap = this.getGamepadMap(gamepad.id);
    var axis = {};
    axis.id = gpMap.axes[axisIndex];
    axis.stick = gpMap.sticks[axis.id];
    axis.index = axisIndex;
    axis.value = value;
    axis.zeroed = zeroed;

    var evt = new GamepadAxisEvent(gamepad,axis);
    evt.values = {};
    if(axis.stick==='leftStick'){
      evt.values.x = gamepad.getValueByAxisId('lx');
      evt.values.y = gamepad.getValueByAxisId('ly');
    } else if(axis.stick==='rightStick'){
      evt.values.x = gamepad.getValueByAxisId('rx');
      evt.values.y = gamepad.getValueByAxisId('ry');
    }




    this.onGamepadAxis(evt);
  }

  onGamepadAxis(evt){
    var l;
    for(var i=listeners.length-1; i>=0; i--){
      l = listeners[i];
      if(!l){
        continue;
      }

      let func = l[evt.stick];
      if(!func){
        continue;
      }
      // only fire for correct gamepadIndex
      if(l.gamepadIndex >= 0 && l.gamepadIndex !== evt.gamepadIndex){
        continue;
      }

      let bndr = l.binder || l;
      if(func.call(bndr,evt.values.x,evt.values.y,evt) === false){
        continue;
      }
      return;
    }
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
    // this.keyConfig = Util.extend(keyConfig, defaultKeyConfig);
    this.keyConfig = importKeyConfig.call(this,keyConfig);
    this.options = options;
    this.binder = binder;
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

class GamepadButtonEvent {
  constructor(gamepad,button,down) {
    this.gamepad = gamepad;
    this.gamepadIndex = gamepad.index;
    this.button = button;
    this.down = down;
    this.type = 'gamepadButtonEvent';
    this.keyCode = button.index;
    this.keyIdentifier = button.id;
  }
}



class GamepadAxisEvent {
  constructor(gamepad,axis) {
    this.gamepad = gamepad;
    this.gamepadIndex = gamepad.index;
    this.axis = axis;
    this.stick = axis.stick;
    this.keyCode = 200+axis.index;
    this.keyIdentifier = axis.id;
    this.values = axis.values;
    this.type = 'gamepadAxisEvent';
  }
}

Gamepad.prototype.getValueByAxisId = function(axisId){
  var gp = gamepadMaps[this.id];
  var ix = gp.axes.indexOf(axisId);
  if(ix>-1){
    return this.axes[ix];
  }
  return;
}

export default InputController;
