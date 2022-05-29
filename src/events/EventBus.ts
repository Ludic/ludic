import { LudicInstance, LudicWorker } from '../core/app'
import { trackHandler } from '@ludic/ein'

export default class EventBus {

  private listeners: Map<string, Set<Function>>
  private instance: typeof LudicInstance

  constructor(instance: typeof LudicInstance){
    this.listeners = new Map()
    this.instance = instance
  }

  /**
   * Adds a handler function for a given event name.
   * 
   * @param name event name
   * @param fn event handler
   * @returns function that removes the event handler
   */
  listen(name: string, fn: (data: any)=>any): EventRemoveFn {
    const listeners = this.listeners.get(name) ?? this.listeners.set(name, new Set()).get(name)!
    listeners.add(fn)
    const handler = ()=>{
      listeners.delete(fn)
    }
    trackHandler(handler)
    return handler
  }

  /**
   * Removes a specific listener for a given event
   * 
   * @param name event name
   * @param fn event handler
   */
  remove(name: string, fn: (data: any)=>any){
    this.listeners.get(name)?.delete(fn)
  }

  /**
   * 
   * @param name event name
   * @param data event data
   * @param worker optionally send this event to a worker
   */
  notify<D=any>(name: string, data?: D, worker?: Worker|MessagePort|string){
    this.listeners.get(name)?.forEach((fn)=>{
      fn(data)
    })
    if(worker != null){
      try {
        if(typeof worker === 'string'){
          if(this.instance.isWorker){
            if(worker == 'main'){
              this.instance.$instance.workerPort.postMessage({name, data})
            } else {
              (this.instance.workers?.[`$${worker}`] as unknown as LudicWorker).channel.port2.postMessage({ name, data, })
            }
          } else {
            (this.instance.workers?.[`$${worker}`] as unknown as LudicWorker).channel.port1.postMessage({ name, data, })
          }
        } else {
          worker.postMessage({ name, data, })
        }
      } catch (error) {
        console.error(name, error)
      }
    }
  }
}

export type EventRemoveFn = ()=>void
