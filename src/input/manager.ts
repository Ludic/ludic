import { Pool } from '@ludic/ein'
import { FullGamepadState, GamepadState, Vector2 } from '@src/main'

export class InputManager {
  inputControllers: InputController[] = []
  private inputActionConfigs: {
    [key: string]: InputActionConfig<any>
  } = {}
  // private inputActions: {[key: string]: InputActionConfig} = {}
  actionsCache: {[action: string]: {[id: number|string]: any}} = {}
  active: boolean = true

  constructor(controllers: InputController[] = []) {
    controllers.forEach(c => this.addController(c))
  }

  addController(controller: InputController){
    controller.install(this)
    this.inputControllers.push(controller)
  }

  // registerAction<V>(key: string, getter: InputActionGetter<any>): void
  // registerAction<V>(key: string, getter: InputActionGetter<V>, value: V): void
  registerAction<V>(action: string, config: InputActionConfig<V>){
    this.inputActionConfigs[action] = config
  }
  // registerAction(key: string, config: InputActionConfig){
  //   this.inputActions[key] = config
  // }

  readAction<T>(action: string, id: number|string=0): T {
    // TODO: impl cache and reset cache every update
    // const cache = this.actionsCache[action] ?? (this.actionsCache[action] = {})
    // if(cache[id]){
    //   return cache[id]
    // }
    const value = this.inputActionConfigs[action].value
    const retVal = this.inputActionConfigs[action].get(this, value, id)
    return retVal !== undefined ? retVal : value
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
    if(this.active){
      this.inputControllers.forEach((controller)=>{
        controller.update && controller.update(time, delta)
      })
      // Object.entries(this.inputActionConfigs).forEach(([key, config])=>{
      //   const value = config.get(this, value)
      //   this.actions[key] = getter(this, value)
      // })
    }
    // Object.entries(this.inputActions).forEach(([key, config])=>{
    //   const state: InputState<any>|undefined = this[config.binding]
    //   const value = getActionValue(config.type)
    //   if(state != null && value != null){
    //     Object.entries(config.values).forEach(([valueKey, btn])=>{
    //       const button = state.get(btn.button)
    //       // const valueKey = btn.value ?? 'value'
    //       const val = button[btn.action]
    //       // console.log(btn.button, button, btn.action, val)
    //       if(btn.button == 'KeyW'){
    //         console.log(val)
    //         if(typeof val === 'boolean'){
    //           value[valueKey] = val === true ? 1 : 0
    //         }
    //         console.log(value)
    //       }

    //       // if(btn.negative){
    //       //   value[valueKey] = -value[valueKey]
    //       // }
    //     })
    //   }
    //   this.actions[key] = value
    // })
  }

}

export default InputManager

export class InputState<T extends object> {
  state: {[key: string]: T} = {}
  private _ctor: new ()=>T
  protected pool?: Pool<T>
  
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
  set(key: string|number, val: T|boolean): T {
    return this.state[key] = (val as T)
  }
}

export interface InputController {
  active: boolean
  install(inputManager: InputManager): void
  update?(time: number, delta: number): void
  transferToWorker?(worker: Worker): void
}

export interface InputActionGetter<V> {
  (input: InputManager, value: V, id: number|string): V|void
}

export interface InputActionConfig<V> {
  value: V
  get: InputActionGetter<V>
}

const getActionValue = function(type: string){
  if(type == 'Vector2'){
    return {x: 0, y: 0}
  } else if(type == 'Vector3'){
    return {x: 0, y: 0, z: 0}
  }
  return {value: 0}
}