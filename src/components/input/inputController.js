import Util from 'src/components/util/util';

let listeners = [];
let defaultKeyConfig = {
  options: {
    preventDefault: true
  }
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

  newEventListener(keyConfig, alsoAdd){
    var l = new InputEventListener(keyConfig);
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
      this.onKeyDown(this.canvas,evt);
    }.bind(this), false);

    this.canvas.addEventListener('keyup', function(evt) {
      // evt.preventDefault();
      this.onKeyUp(this.canvas,evt);
    }.bind(this), false);
  }

  onKeyDown(canvas, evt) {
    // console.log(evt);
    var l;

    if(this.config.logAllKeys){
      console.log(evt.keyCode);
    }
    for(var i=listeners.length-1; i>=0; i--){
      l = listeners[i];
      if(!l){ continue;}

      var cfg = l.keyConfig;
      var key = cfg[evt.keyCode];
      if(key){
        var b = l[key].call(l,true,evt)
        if(b === true){
          return;
        }
      }
      // else {
      //   if(this.config.logUnmappedKeys){
      //     console.log(evt.keyCode);
      //   }
      // }
    }

  }

  onKeyUp(canvas, evt) {
    // console.log(evt.keyCode);
    var l;
    for(var i=listeners.length-1; i>=0; i--){
      l = listeners[i];
      if(l){
        var cfg = l.keyConfig;
        var key = cfg[evt.keyCode];
        if(key){
          var b = l[key].call(l,false,evt);
          if(b === true){
            return;
          }
        }
      }
    }
  }



  //  -- mouse
  initMouse(){
    canvas.addEventListener('mousemove', function(evt) {
      this.onMouseMove(canvas,evt);
    }.bind(this), false);

    // canvas.addEventListener('mousedown', function(evt) {
    //   this.onMouseDown(canvas,evt);
    // }.bind(this), false);
    //
    // canvas.addEventListener('mouseup', function(evt) {
    //   this.onMouseUp(canvas,evt);
    // }.bind(this), false);
    //
    // canvas.addEventListener('mouseout', function(evt) {
    //   this.onMouseOut(canvas,evt);
    // }.bind(this), false);
  }

  onMouseMove(canvas, evt) {
    prevMousePosPixel = mousePosPixel;
    this.updateMousePos(canvas, evt);

    console.log(mousePosPixel, mousePosWorld);
    // updateStats();
    // if ( shiftDown ) {
    //   canvasOffset.x += (mousePosPixel.x - prevMousePosPixel.x);
    //   canvasOffset.y -= (mousePosPixel.y - prevMousePosPixel.y);
    //   draw();
    // }
    // else if ( mouseDown && mouseJoint != null ) {
    //   mouseJoint.SetTarget( new Box2D.b2Vec2(mousePosWorld.x, mousePosWorld.y) );
    // }
  }

  onMouseDown(canvas, evt) {
    updateMousePos(canvas, evt);
    if ( !mouseDown )
      startMouseJoint();
    mouseDown = true;
    updateStats();
  }

  onMouseUp(canvas, evt) {
    mouseDown = false;
    updateMousePos(canvas, evt);
    updateStats();
    if ( mouseJoint != null ) {
      world.DestroyJoint(mouseJoint);
      mouseJoint = null;
    }
  }

  onMouseOut(canvas, evt) {
    onMouseUp(canvas,evt);
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
    var gps = this.getGamepads();
    var gp;
    for(var i in gps){
      gp = gps[i];
      if(gp){

        if(gp.timestamp!=this.lastTimestamp){
          // console.log(gp.timestamp);

          this.lastTimestamp = gp.timestamp;
        }

        if(!this.__gp){
          this.__gp = gp;
          console.log(gp);
        } else {

          // console.log(this.__gp.buttons[0].pressed);
        }

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
      if(down){
        this.onGamepadDown(new GamepadButtonEvent(gamepad,button,down));
      } else {
        this.onGamepadUp(new GamepadButtonEvent(gamepad,button,down));
      }
    } else {
      console.log(arguments);
    }
  }

  onGamepadDown(evt){
    var l;

    if(this.config.logAllKeys){
      console.log(evt.keyCode,evt.keyIdentifier);
    }
    for(var i=listeners.length-1; i>=0; i--){
      l = listeners[i];
      if(!l){ continue;}
      var func = l[evt.keyIdentifier];
      if(!func){ continue;}
      var b = func.call(l,true,evt);
      if(b === true){
        return;
      }
    }
    // if(this.config.logUnmappedKeys){
    //   console.log(evt.keyCode,evt.keyIdentifier,evt.button.value, listeners.length===0?"No listeners":"");
    // }
  }

  onGamepadUp(evt){
    var l;
    for(var i=listeners.length-1; i>=0; i--){
      l = listeners[i];
      if(!l){ continue;}
      var func = l[evt.keyIdentifier];
      if(!func){ continue;}
      if(func.call(l,false,evt) === true){
        return;
      }
    }
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
      if(!l){ continue;}
      var func = l[evt.stick];
      if(!func){ continue;}
      if(func.call(l,evt.values.x,evt.values.y,evt) === false){
        continue;
      }
      return;
    }
  }

}

class InputEventListener {
  constructor(keyConfig) {
    this.keyConfig = Util.extend(keyConfig, defaultKeyConfig);
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
