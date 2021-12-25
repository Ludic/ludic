import { LudicInstance, LudicWorker } from '../core/app'

export default class EventBus {

  private listeners: Map<string, Set<Function>>
  private instance: typeof LudicInstance

  constructor(instance: typeof LudicInstance){
    this.listeners = new Map()
    this.instance = instance
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


  notify(name: string, data?: any, worker?: Worker|MessagePort|string){
    this.listeners.get(name)?.forEach((fn)=>{
      fn(data)
    })
    if(worker != null){
      if(typeof worker === 'string'){
        if(this.instance.isWorker){
          (this.instance.workers?.[`$${worker}`] as unknown as LudicWorker).channel.port2.postMessage({ name, data, })
        } else {
          (this.instance.workers?.[`$${worker}`] as unknown as LudicWorker).channel.port1.postMessage({ name, data, })
        }
      } else {
        worker.postMessage({ name, data, })
      }
    }
  }
}