import { LudicConstructor, LudicInstance } from '@src/main'

export default class LudicConfig {
  private store: {
    [key: string]: any
  } = {}

  private instance: LudicConstructor
  private typeMapper: {
    [key: string]: (val: any)=>any
  } = {}

  constructor(instance: LudicConstructor, config: {[key: string]: any} = {}){
    this.instance = instance
    Object.assign(this.store, config)
    Object.entries(config).forEach(([key, val])=>this.createTypeMapper(key, val))
  }

  get<T=any>(key: string): T {
    return this.store[key] as T
  }

  set(key: string, value: any){
    this.store[key] = key in this.typeMapper ? this.typeMapper[key](value) : value
    this.instance.events.notify(`ludic:config:set:${key}`, this.store[key])
  }

  on(key: string, fn: (val: any)=>void){
    this.instance.events.listen(`ludic:config:set:${key}`, fn)
    fn(this.store[key])
  }

  private createTypeMapper(key, val){
    if(typeof val === 'number'){
      this.typeMapper[key] = (val: any)=>parseFloat(val)
    } else if(typeof val === 'boolean') {
      this.typeMapper[key] = (val: any)=>(val === '1' || val === 1 || val === true || val === 'true')
    } else if(typeof val === 'string'){
      this.typeMapper[key] = (val: any)=>val
    }
  }
}