import { LudicConstructor, LudicPluginClass, LudicPluginFunction, LudicWorker } from '../core/app'
import { isRef, toRaw, ref, effect, Ref, ToRef, ToRefs, UnwrapRef, TrackOpTypes } from '@ludic/ein'

export interface DataBusSyncEvent {
  key: string
  value: any
}

export interface DataBusOptions {
  reactivity?: {
    ref: typeof ref,
    effect: typeof effect,
    toRaw: typeof toRaw,
  }
}

export class DataBus<Store extends object={[key: string]: any}> implements LudicPluginClass {

  public store: ToRefs<Store>

  private workerName: string|undefined
  private delayedWatchers

  private reactivity: DataBusOptions['reactivity']|undefined

  constructor(workerName?: string, options?: DataBusOptions){
    this.workerName = workerName
    // TODO: move this reactivity pass in to a more general ludic plugin
    this.reactivity = options?.reactivity
  }

  // reactivity abstractions
  private get ref(): typeof ref {
    return this.reactivity?.ref || ref
  }
  private get effect(): typeof effect {
    console.log('using effect from', this.reactivity?.effect ? 'reactivity' : 'import')
    return this.reactivity?.effect || effect
  }
  private get toRaw(): typeof toRaw {
    console.log('using toRaw from', this.reactivity?.toRaw ? 'reactivity' : 'import')
    return this.reactivity?.toRaw || toRaw
  }

  watch<K extends keyof Store>(prop: K, cb: (val: UnwrapRef<Store[K]>)=>void){
    // @ts-ignore
    const value: Ref<any> = this.store[prop] ?? ((this.store[prop] = null) || this.store[prop])

    const e = this.effect(()=>{
      return value.value
    }, {
      lazy: false,
      scheduler: ()=>{
        cb(value.value)
      }
    })
  }

  set(obj: {[key: string]: any}): ToRefs<Store>
  set(key: string, value: any): ToRefs<Store>
  set(arg0: any, value?: Ref): ToRefs<Store> {
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
    const getWorker = ()=>app.isWorker ? app.$instance.workerPort : this.workerName
    const bus = this

    this.store = new Proxy({}, {
      set(this: undefined, target, prop, value, receiver){
        const _isRef = isRef(value)
        const val: Ref<any> = _isRef
          ? value
          : bus.ref(value)

        const e = bus.effect(()=>{
          console.log('getter', app.isWorker ? 'worker' : 'main', prop)
          return val.value
        }, {
          scheduler(...args){
            if(!syncing){
              app.events.notify('ludic:data:sync', {
                key: prop,
                value: val.value,
              } as DataBusSyncEvent, getWorker())
            }
          },
          onTrack(event){
            console.log('on track from', app.isWorker ? 'worker' : 'main', prop, val.value, event)
          },
          onTrigger(event){
            console.log('on trigger from', app.isWorker ? 'worker' : 'main', prop, val.value, event)
          },
        })

        // set the value
        const ret = Reflect.set(target, prop, val, receiver)

        // initial value
        if(!syncing){
          console.log('notify', prop, bus.toRaw(val.value))
          app.events.notify('ludic:data:sync', {
            key: prop,
            value: bus.toRaw(val.value),
            // value: val.value,
          } as DataBusSyncEvent, getWorker())
        }

        return ret
      },
      get(target, prop, receiver){
        const val = Reflect.get(target, prop, receiver)
        return val
      },
    }) as ToRefs<Store>


    app.events.listen('ludic:data:sync', (event: DataBusSyncEvent)=>{
      syncing = true
      if(!(event.key in this.store)){
        this.store[event.key] = event.value
      }
      if(event.value !== undefined){
        this.store[event.key].value = event.value
      }
      syncing = false
    })

    app.data = this
  }

}
