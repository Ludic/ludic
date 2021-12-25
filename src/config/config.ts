export default class LudicConfig {
  private store: {
    [key: string]: any
  } = {}

  get<T=any>(key: string): T {
    return this.store[key] as T
  }

  set(key: string, value: any){
    this.store[key] = value
  }
}