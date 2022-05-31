import { Pool } from '@ludic/ein'
// import { FullGamepadState, GamepadState, Vector2 } from '@src/main'

export class InputManager {
  inputControllers: InputController[] = []
  private inputActions: {
    [key: string]: InputAction<unknown>
  } = {}
  // private inputActions: {[key: string]: InputActionConfig} = {}
  actionsCache: {[action: string]: {[id: number|string]: any}} = {}
  active: boolean = true

  private mode: string = 'value'

  constructor(controllers: InputController[] = []) {
    controllers.forEach(c => this.addController(c))
  }

  update(time: number, delta: number){
    if(this.active){
      this.inputControllers.forEach((controller)=>{
        controller.update && controller.update(time, delta)
      })
      // update all of the actions
      // Object.values(this.inputActions).forEach((action)=>{
      //   action.update(this.mode, this)
      // })
    }
  }

  addController(controller: InputController){
    controller.install(this)
    this.inputControllers.push(controller)
  }

  // registerAction<V>(key: string, getter: InputActionGetter<any>): void
  // registerAction<V>(key: string, getter: InputActionGetter<V>, value: V): void
  registerAction<V>(name: string, config: InputActionConfig<V>){
    this.inputActions[name] = new InputAction(config)
  }
  // registerAction(key: string, config: InputActionConfig){
  //   this.inputActions[key] = config
  // }

  readAction<T>(name: string, id: number|string=0): T {
    // TODO: impl cache and reset cache every update
    // const cache = this.actionsCache[action] ?? (this.actionsCache[action] = {})
    // if(cache[id]){
    //   return cache[id]
    // }
    // const config: InputActionConfig<T> = this.inputActionConfigs[action]
    // const value = config.value
    // let newValue: T|undefined = undefined
    // if(typeof config.get === 'function'){
    //   newValue = config.get(this, value, id)
    // } else {
    //   Object.entries(config.get)
    // }
    // if(newValue !== undefined){
    //   config.value = newValue
    // }
    // return newValue !== undefined ? newValue : value
    return this.inputActions[name].compute(this.mode, this, id) as T
  }

  setMode(mode: string){
    this.mode = mode
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

// export interface InputActionGetter<V> extends Function {
//   (input: InputManager, value: V, id: number|string): V|void
// }
export type InputActionGetter<V> = (input: InputManager, value: V, id: number|string) => V|void
export interface InputActionGetterMap<V> {
  [key: string]: InputActionGetter<V>
}

export interface InputActionConfig<V> {
  value: V
  get: InputActionGetter<V>|InputActionGetterMap<V>
}

export class InputAction<V> {
  value: V
  private getters: InputActionGetterMap<V>
  constructor(config: InputActionConfig<V>){
    this.value = config.value
    if(typeof config.get === 'function'){
      this.getters = {
        value: config.get,
      }
    } else {
      this.getters = config.get
    }
  }

  compute(mode: string, input: InputManager, id: number|string){
    const value = this.getters[mode](input, this.value, id)
    if(value !== undefined){
      this.value = value
    }
    return this.value
  }

  // update(mode: string, input: InputManager){
  //   const value = this.getters[mode](input, this.value, 0)
  //   if(value !== undefined){
  //     this.value = value
  //   }
  // }
}

const getActionValue = function(type: string){
  if(type == 'Vector2'){
    return {x: 0, y: 0}
  } else if(type == 'Vector3'){
    return {x: 0, y: 0, z: 0}
  }
  return {value: 0}
}