import Canvas from './canvas'
import InputManager from '../input/manager'
import { InputController } from '../input/manager'
import EventBus from '../events/EventBus'

export type LudicPlugin = LudicPluginFunction|LudicPluginClass
export interface LudicPluginFunction {
  (app: LudicConstructor, opts?: any): void
}
export interface LudicPluginClass {
  install(app: LudicConstructor)
}
export interface TestInt {
  property: string
}
export interface UpdateFunction {
  (time: number, delta: number): void
}

export interface LudicWorker {
  worker: Worker
  transferCanvas?: boolean
  transferInput?: boolean
  value?: any
  start?: boolean
  channel: MessageChannel
}

type LudicWorkerOpts = Omit<LudicWorker, 'channel'>

export interface LudicOptions {
  el?: string | HTMLCanvasElement
  plugins?: Array<LudicPlugin> | undefined
  worker?: boolean
  workers?: {[name: string]: LudicWorkerOpts},
  inputControllers?: InputController[]
  globals?: LudicGlobals
  update?: UpdateFunction
  start?: boolean
}

// export type LudicOptions = ConstructorArgs

export interface LudicGlobals {
  [key: string]: any
}

export interface LudicWorkers {
  [key: string]: Worker
}

export interface LudicWorkersProp {
  [key: `$${keyof LudicWorkers}`]: LudicWorker
}

export interface LudicConstructor {
  $instance: LudicInstance
  running: boolean
  debug: boolean
  canvas: Canvas
  input: InputManager
  events: EventBus
  globals: LudicGlobals
  workers: LudicWorkers
  isWorker: boolean
  new (opts: LudicOptions): LudicInstance
  registerUpdateFunction(fn: UpdateFunction): void
}

class LudicInstance {
  static $instance: LudicInstance
  static running: boolean = false
  static debug: boolean
  static canvas: Canvas
  static input: InputManager
  static events: EventBus
  static globals: LudicGlobals
  static workers: LudicWorkers
  static isWorker: boolean
  
  private lastRunTime: number
  private delta: number
  private updateFunctions: UpdateFunction[] = []
  private readyPromise: Promise<boolean>
  observer: PerformanceObserver
  protected workerPort: MessagePort

  static registerUpdateFunction(fn: UpdateFunction){
    this.$instance.updateFunctions.push(fn)
  }

  constructor(opts: LudicOptions){
    if(Ludic.$instance) return Ludic.$instance
    Ludic.$instance = this

    let {el, plugins=[], inputControllers=[], globals={}, worker=false} = opts

    if(el != null){
      Ludic.canvas = new Canvas(el)
    }

    LudicInstance.isWorker = worker
    LudicInstance.input = new InputManager(inputControllers)
    LudicInstance.events = new EventBus()
    LudicInstance.globals = globals

    Ludic.registerUpdateFunction((time, delta) => Ludic.input.update(time, delta))

    const workers = opts.workers || {}

    const _workers: {[key: string]: LudicWorker} = Object.fromEntries(Object.entries(opts.workers ?? {}).map(([key, w]) => {
      const worker: LudicWorker = {
        ...w,
        channel: new MessageChannel(),
      }
      if(w.transferCanvas){
        const canvas = Ludic.canvas.transferControlToOffscreen()
        w.worker.postMessage({
          name: 'ludic:canvas',
          data: {
            canvas,
          }
        }, [canvas])
        w.worker.postMessage({
          name: 'ludic:worker:init',
          data: {
            port: worker.channel.port2,
          }
        }, [worker.channel.port2])
      }
      if(w.transferInput){
        Ludic.input.inputControllers.forEach(controller => {
          controller.transferToWorker?.(w.worker)
        })
      }
      return [key, worker]
    }))

    // setup a proxy that wraps the workers object
    // so that when we access a worker by keyname
    // from Ludic.workers we get the actual worker
    // and not the worker options passed into this
    // constructor. If we do want the options we can
    // prepend the key with $.
    // ie. key => WorkerOptions.worker; $key => WorkerOptions
    // @ts-ignore
    Ludic.workers = new Proxy(_workers, {
      get(target, prop){
        if(typeof prop === 'string'){
          if(prop[0] === '$'){
            return Reflect.get(target, prop.substring(1))
          } else {
            const worker: LudicWorker = Reflect.get(target, prop)
            if(worker){
              return worker.value || worker.worker
            }
          }
        }
        return undefined
      }
    })

    // If this instance is a worker then setup some message
    // listeners for initialization and data transfer.
    if(opts.worker && typeof self === 'object'){
      let resolve;
      this.readyPromise = new Promise((res)=>{
        resolve = res
      })
      self.addEventListener('message', ({data})=>{
        if(data){
          if(data.name === 'ludic:canvas'){
            Ludic.canvas = new Canvas(data.data.canvas)
            console.log('load canvas')
            resolve(true)
          } else if (data.name === 'ludic:worker:init'){
            this.workerPort = data.data.port
          }
        }
      })
    } else {
      this.readyPromise = Promise.resolve(true)
    }

    plugins.forEach(p => this.install(p))

    if(opts.update){
      this.update = opts.update
    }

    this.update = this.update.bind(this)

    this.animate = this.animate.bind(this)

    this.observer = new PerformanceObserver(function(list) {
      list.getEntriesByName('frame').forEach((perf)=>{
        // Process slow-frame notifications:
        // - adapt processing and rendering logic
        // - aggregate and report back for analytics and monitoring
        // - ...
        if(perf.duration > (1000.0 / 60.0)){
          console.log("Uh oh, slow frame: ", perf.duration);
        }
      })
     });
    this.observer.observe({entryTypes: ['measure']});

    // initialize everything
    this.readyPromise.then(()=>{
      this.init()
    })

    if(opts.start){
      this.start()
    }
  }

  protected init(){ }

  public start(): this {
    this.readyPromise.then(()=>{
      Ludic.running = true
      this.lastRunTime = performance.now()
      this.animate(this.lastRunTime)
    })
    return this
  }

  animate(time: number): void {
    requestAnimationFrame(this.animate)
    this.delta = time - this.lastRunTime
    // if(this.delta > (1000.0 / 60.0)){
    //   console.log('FAIL', this.delta)
    // }
    
    // performance.mark('begin-update-functions')
    this.updateFunctions.forEach(fn => fn(time, this.delta))
    // performance.mark('begin-update')
    // console.log(time, this)
    this.update(time, this.delta)
    // performance.mark('end-update')
    // let a=0
    // for(let i=0; i<4000000; i++){
    //   a+=i
    // }
    // performance.mark('end-work')
    // Ludic.canvas.context.fillRect(0,0,1,1)


    // performance.measure('update-functions', 'begin-update-functions', 'begin-update')
    // performance.measure('update', 'begin-update', 'end-update')
    // performance.measure('frame', 'begin-update-functions', 'end-update')
    // performance.measure('work', 'end-update', 'end-work')
    // performance.clearMarks()
    // performance.clearMeasures()

    this.lastRunTime = time
  }

  update(time: number, delta: number): void { }

  install(plugin: LudicPlugin){
    if(plugin instanceof Function){
      plugin(Ludic)
    } else {
      plugin.install(Ludic)
    }
  }

}

export const Ludic: LudicConstructor = LudicInstance
export {LudicInstance as LudicApp}
export default Ludic
