import Dep from './dep'

type Proxify<T> = {
  [P in keyof T]: T[P];
}

interface StateOptions<T> {
  exclude?: Array<keyof T>
  dep?: Dep
}

const EXCLUDED_OBJECT_KEYS = Object.getOwnPropertyNames(Object.prototype)
const EXCLUDED_ARRAY_KEYS = Object.getOwnPropertyNames(Array.prototype)

const DEP_MAP = new WeakMap()

class State<T extends object> {

  static create<T extends object>(value: T, opts: StateOptions<T> = {}): Proxify<T> {
    if(typeof value !== 'object' || value == null || value.hasOwnProperty('__state__')){
      return value
    }
    return new State(value, opts) as Proxify<T>
  }
  static dep<T extends object>(state: State<T>): Dep {
    return DEP_MAP.get(state)
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

    const {
      exclude = [],
      dep,
    } = opts
    
    const EXCLUDE_KEYS: Set<string|number|symbol> = new Set(exclude)

    if(Array.isArray(value)){
      EXCLUDED_ARRAY_KEYS.forEach(k => EXCLUDE_KEYS.add(k))
      value = ReactiveArray.create(value)
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
        const dep = getDep(prop)
        if(Dep.lambda){
          dep.depend()
        }
        return State.create(value, {dep})
      },
      set(target, prop, newValue){
        const value = Reflect.get(target, prop)
        if(EXCLUDE_KEYS.has(prop)){
          return Reflect.set(target, prop, newValue)
        }
        const dep = getDep(prop)
        if(value === newValue){
          return true
        }
        const didSet = Reflect.set(target, prop, State.create(newValue, {dep}))
        dep.notify()
        return didSet
      }
    })
    if(!DEP_MAP.has(proxy) && dep != null){
      DEP_MAP.set(proxy, dep)
    }
    return proxy
  }
}

export { State, State as default }

class ReactiveArray<T> extends Array<T> {
  private constructor(...args: any[]) {
    super(...args)
    Object.setPrototypeOf(this, Object.create(ReactiveArray.prototype))
  }
  static create<V>(value: V): V {
    return new ReactiveArray(value) as unknown as V
  }
  static notify<T>(arr: ReactiveArray<T>){
    const dep = State.dep(arr)
    dep && dep.notify()
  }
  // static from(...args: any[]){
  //   let arr = super.from.apply(super, args)
    
  // }

  push(...items: T[]){
    const res = Array.prototype.push.call(this, ...items)
    ReactiveArray.notify(this)
    return res
  }
  pop(){
    const res = super.pop()
    ReactiveArray.notify(this)
    return res
  }
  shift(){
    const res = super.shift()
    ReactiveArray.notify(this)
    return res
  }
  unshift(...items: T[]){
    const res = super.unshift(...items)
    ReactiveArray.notify(this)
    return res
  }
  splice(start: number, deleteCount: number, ...items: T[]){
    const res = super.splice(start, deleteCount, ...items)
    ReactiveArray.notify(this)
    return res
  }
  sort(compareFn?: (a: T, b: T) => number){
    const res = super.sort(compareFn)
    ReactiveArray.notify(this)
    return res
  }
  reverse(){
    const res = super.reverse()
    ReactiveArray.notify(this)
    return res
  }
}
