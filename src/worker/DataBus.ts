import { LudicConstructor, LudicPluginClass, LudicPluginFunction, LudicWorker } from '../core/app'
import { isRef, reactive, ref, toRef, effect, Ref, ToRef, UnwrapRef } from '@vue/reactivity'

export interface DataBusSyncEvent {
  key: string
  value: any
}

type Refify<P> = {[K in keyof P]: ToRef<P[K]>}

export class DataBus<Store extends object={[key: string]: any}> implements LudicPluginClass {

  public store: Refify<Store>

  private workerName: string|undefined
  private delayedWatchers

  constructor(workerName?: string){
    this.workerName = workerName
  }

  watch<K extends keyof Store>(prop: K, cb: (val: UnwrapRef<Store[K]>)=>void){
    // @ts-ignore
    const value: Ref<any> = this.store[prop] ?? ((this.store[prop] = null) || this.store[prop])
    const e = effect(()=>{
      return value.value
    }, {
      lazy: false,
      scheduler: ()=>{
        cb(value.value)
      }
    })
  }

  set(obj: {[key: string]: any}): Refify<Store>
  set(key: string, value: any): Refify<Store>
  set(arg0: any, value?: Ref): Refify<Store> {
    if(typeof arg0 === 'string'){
      this.store[arg0] = value
    } else {
      Object.entries(arg0).forEach(([key, val])=>{
        this.store[key] = val
      })
    }
    return this.store
  }

  install(app: LudicConstructor&{data: any}) {
    let syncing = false

    if(!app.isWorker && this.workerName == null){
      console.warn('ludic: data bus needs a worker name')
    }
    const worker = this.workerName ?? app.$instance.workerPort

    this.store = new Proxy({}, {
      set(target, prop, value, receiver){
        const val: Ref<any> = isRef(value) ? value : ref(value)

        const e = effect(()=>{
          return val.value
        }, {
          scheduler(...args){
            if(!syncing){
              app.events.notify('ludic:data:sync', {
                key: prop,
                value: val.value,
              } as DataBusSyncEvent, worker)
            }
            // app.events.notify('gui:sync:test', 'helo', 'main')
          },
          // onTrack(event){
          //   console.log('on track', event)
          // },
          // onTrigger(event){
          //   console.log('on trigger', event)
          // },
        })

        // initial value
        if(!syncing){
          app.events.notify('ludic:data:sync', {
            key: prop,
            value: val.value,
          } as DataBusSyncEvent, worker)
        }

        return Reflect.set(target, prop, val, receiver)
      },
      get(target, prop, receiver){
        const val = Reflect.get(target, prop, receiver)
        return val
      },
    }) as Refify<Store>


    app.events.listen('ludic:data:sync', (event: DataBusSyncEvent)=>{
      syncing = true
      if(!(event.key in this.store)){
        this.store[event.key] = event.value
      }
      this.store[event.key].value = event.value
      syncing = false
    })

    app.data = this
  }

}

// const watch = (source, fn) => {
//   const getter = isRef(source)
//     ? () => source.value
//     : source

//   const runner = effect(getter, {
//     lazy: false,
//     scheduler(...args){
//       console.log('scheduler', args)
//       fn()
//     },
//     onTrack(event){
//       console.log('on track', event)
//     },
//     onTrigger(event){
//       console.log('on trigger', event)
//     },
//   })
//   // runner()

//   return () => runner.effect.stop()
// }
