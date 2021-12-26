import { LudicConstructor, LudicInstance } from '@src/main'

export default class LudicConfig<Store extends object=object> {
  private store: Store

  private instance: LudicConstructor
  private typeMapper: {
    [key: string]: (val: any)=>any
  } = {}

  constructor(instance: LudicConstructor, config?: Store){
    this.instance = instance
    Object.assign({}, this.store, config ?? {})
    this.parseTypes()
  }

  get<K extends keyof Store>(key: K): Store[K] {
    return this.store[key]
  }

  set(key: string, value: any){
    this.store[key] = key in this.typeMapper ? this.typeMapper[key](value) : value
    this.instance.events.notify(`ludic:config:set:${key}`, this.store[key])
  }

  on<K extends keyof Store>(key: K, fn: (val: Store[K])=>void){
    this.instance.events.listen(`ludic:config:set:${key}`, fn)
    fn(this.store[key])
  }

  private parseTypes(){
    Object.entries(this.store).forEach(([key, val])=>{
      if(typeof val === 'number'){
        this.typeMapper[key] = this.castNumber
      } else if(typeof val === 'boolean') {
        this.typeMapper[key] = this.castBoolean
      } else if(typeof val === 'string'){
        this.typeMapper[key] = this.castString
      }
    })
  }

  private castNumber(val: any): number {
    return parseFloat(val)
  }
  private castBoolean(val: any): boolean {
    return (val === '1' || val === 1 || val === true || val === 'true')
  }
  private castString(val: any): string {
    return String(val)
  }
}