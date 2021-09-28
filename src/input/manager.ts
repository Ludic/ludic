import { Pool } from '@ludic/ein'


export class InputState<T extends object> {
  state: {[key: string]: T} = {}
  private _ctor: new ()=>T
  private pool?: Pool<T>
  
  constructor(state: {[key: string]: T})
  constructor(ctor: new ()=>T, pool?: Pool<T>)
  constructor(...args: any[]){
    if(args.length == 2){
      const [ctor, pool] = args
      this._ctor = ctor
      this.pool = pool
    } else {
      this.state = args[0]
    }
  }
  get(key: string|number){
    let val = this.state[key]
    if(this._ctor != null){
      if(val == null) {
        val = this.set(key, this.pool ? this.pool.get() : Reflect.construct(this._ctor, []))
      }
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
  transferToWorker?(worker: Worker): void
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
