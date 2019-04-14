
// let listeners = []
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
}

let gamepadMaps = {
  'Wireless Controller (STANDARD GAMEPAD Vendor: 054c Product: 05c4)':ps4Mapping // ps4 controller
}

let gamepadsAxisDeadZone = 0.08
let gamepadsConfig = {}

let mousePosPixel = {}
let prevMousePosPixel = {}
// let gamepadTypeMaps = [{id:'054c',type:'ps4'}]

// export class EventState<T> {
//   event: T
//   lastEvent: T
//   set(event: T){
//     // move current state to last state and set current
//     this.lastEvent = this.event
//     this.event = event
//   }
// }

interface IInputState<T> {
  get(key: string): T
}
export class InputState<T> {
  state: {[key: string]: T} = {}
  private _ctor: new ()=>T
  constructor(ctor: new ()=>T){
    this._ctor = ctor
  }
  get(key: string|number){
    let val = this.state[key]
    if(val == null) {
      val = this.set(key, Reflect.construct(this._ctor, []))
    }
    return val
  }
  set(key: string|number, val: T): T {
    return this.state[key] = val
  }
}

export interface InputController {
  install(inputManager: InputManager): void
  update?(time: number, delta: number): void
}

export class InputManager {
  inputControllers: InputController[] = []

  constructor(controllers: InputController[] = []) {
    controllers.forEach(c => this.addController(c))
  }

  addController(controller: InputController){
    controller.install(this)
    this.inputControllers.push(controller)
  }
  
  // initTouch(){
  //   // touch events
  //   this.canvas.addEventListener('touchstart', function(evt) {
  //     this.onMouseEvent('touchStart',this.canvas.el,evt)
  //   }.bind(this), false)
  
  //   this.canvas.addEventListener('touchend', function(evt) {
  //     this.onMouseEvent('touchEnd',this.canvas.el,evt)
  //   }.bind(this), false)
  
  //   this.canvas.addEventListener('touchmove', function(evt) {
  //     this.onMouseEvent('touchMove',this.canvas.el,evt)
  //   }.bind(this), false)
  
  //   this.canvas.addEventListener('touchcancel', function(evt) {
  //     this.onMouseEvent('touchCancel',this.canvas,evt)
  //   }.bind(this), false)    
  // }

  update(time: number, delta: number){
    this.inputControllers.forEach((controller)=>{
      controller.update && controller.update(time, delta)
    })
  }

}

export default InputManager
