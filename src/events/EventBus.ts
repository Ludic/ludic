
export default class EventBus {

  private listeners: Map<string, Set<Function>>

  constructor(){
    this.listeners = new Map()
  }

  listen(name: string, fn: (data: any)=>any){
    const listeners = this.listeners.get(name) ?? this.listeners.set(name, new Set()).get(name)!
    listeners.add(fn)
    return ()=>{
      listeners.delete(fn)
    }
  }
  remove(name: string, fn: (data: any)=>any){
    this.listeners.get(name)?.delete(fn)
  }


  notify(name: string, data?: any, worker?: Worker|MessagePort){
    this.listeners.get(name)?.forEach((fn)=>{
      fn(data)
    })
    if(worker != null){
      worker.postMessage({ name, data, })
    }
  }
}