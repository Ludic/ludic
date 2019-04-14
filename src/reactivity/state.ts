import Dep from './dep'

type Proxify<T> = {
  [P in keyof T]: T[P];
}

interface StateOptions<T> {
  exclude?: Array<keyof T>
}

const EXCLUDED_OBJECT_KEYS = Object.getOwnPropertyNames(Object.prototype)
const EXCLUDED_ARRAY_KEYS = Object.getOwnPropertyNames(Array.prototype)

class State<T extends object> {

  static create<T extends object>(value: T, opts: StateOptions<T> = {}): Proxify<T> {
    if(typeof value !== 'object' || value == null || value.hasOwnProperty('__state__')){
      console.log('break out', value, typeof value !== 'object', value == null, value.hasOwnProperty('__state__'))
      return value
    }
    return new State(value, opts) as Proxify<T>
  }

  private constructor(value: T, opts: StateOptions<T> = {}) {
    const depMap = new Map<string|number|symbol, Dep>()
    const getDep = (prop: string|number|symbol)=>{
      let dep = depMap.get(prop)
      if(dep) return dep
      dep = new Dep()
      depMap.set(prop, dep)
      return dep
    }
    
    const EXCLUDE_KEYS: Set<string|number|symbol> = new Set(opts.exclude||[])

    if(Array.isArray(value)){
      EXCLUDED_ARRAY_KEYS.forEach(k => EXCLUDE_KEYS.add(k))
    } else {
      EXCLUDED_OBJECT_KEYS.forEach(k => EXCLUDE_KEYS.add(k))
    }

    if(value != null){
      Object.defineProperty(value, '__state__', { value: this, enumerable: false, configurable: true, writable: true })
    }

    let proxy = new Proxy(value, {
      get(target, prop){
        const value = Reflect.get(target, prop)
        if(EXCLUDE_KEYS.has(prop)) return value
        console.log('get', prop, value)
        const dep = getDep(prop)
        if(Dep.lambda){
          dep.depend()
        }
        let v = State.create(value)
        console.log('v', v)
        return v
      },
      set(target, prop, newValue){
        console.log('set', prop, newValue)
        const value = Reflect.get(target, prop)
        if(EXCLUDE_KEYS.has(prop)){
          return Reflect.set(target, prop, newValue)
        }
        const dep = getDep(prop)
        if(value === newValue){
          return true
        }
        const didSet = Reflect.set(target, prop, State.create(newValue))
        dep.notify()
        return didSet
      }
    })
    return proxy
  }
}

export { State, State as default }