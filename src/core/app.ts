import Canvas from './canvas'
import InputManager from '../input/manager'

export interface LudicPlugin {
  (app: any, opts?: any): void
}
export interface UpdateFunction {
  (time: number, delta: number): void
}

export interface LudicWorker {
  worker: Worker
  passCanvas?: boolean
  value?: any
}

export interface LudicOptions {
  el?: string | HTMLCanvasElement
  plugins?: Array<LudicPlugin> | undefined
  worker?: boolean
  workers?: {[name: string]: LudicWorker},
  update?: UpdateFunction
  start?: boolean
}

// export type LudicOptions = ConstructorArgs

export interface LudicConstructor {
  $instance: LudicInstance
  running: boolean
  debug: boolean
  canvas: Canvas
  input: InputManager
  workers: {[name: string]: any}
  new (opts: LudicOptions): LudicInstance
  registerUpdateFunction(fn: UpdateFunction): void
}

class LudicInstance {
  static $instance: LudicInstance
  static running: boolean = false
  static debug: boolean
  static canvas: Canvas
  static input: InputManager = new InputManager()
  static workers: {[name: string]: any}
  
  private lastRunTime: number
  private delta: number
  private updateFunctions: UpdateFunction[] = []
  private readyPromise: Promise<boolean>
  observer: PerformanceObserver

  static registerUpdateFunction(fn: UpdateFunction){
    this.$instance.updateFunctions.push(fn)
  }

  constructor(opts: LudicOptions){
    if(Ludic.$instance) return Ludic.$instance
    Ludic.$instance = this

    let {el, plugins=[]} = opts

    if(el != null){
      Ludic.canvas = new Canvas(el)
    }

    Ludic.registerUpdateFunction((time, delta) => Ludic.input.update(time, delta))

    plugins.forEach(p => this.install(p))
    // this.requestAnimationFrame = (()=>{
    //   return  window.requestAnimationFrame       ||
    //           window.webkitRequestAnimationFrame ||
    //           window.mozRequestAnimationFrame    ||
    //           window.oRequestAnimationFrame      ||
    //           window.msRequestAnimationFrame
    // })().bind(window)

    const workers = opts.workers || {}

    Ludic.workers = new Proxy(workers, {
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

    if(opts.workers){
      Object.values(opts.workers).forEach(w => {
        if(w.passCanvas){
          const canvas = Ludic.canvas.transferControlToOffscreen()
          w.worker.postMessage({
            name: 'ludic:canvas',
            data: {
              canvas,
            }
          }, [canvas])
        }
      })
    }

    if(opts.worker && typeof self === 'object'){
      let resolve;
      this.readyPromise = new Promise((res)=>{
        resolve = res
      })
      self.addEventListener('message', ({data})=>{
        if(data){
          if(data.name === 'ludic:canvas'){
            Ludic.canvas = new Canvas(data.data.canvas)
            resolve(true)
          }
        }
      })
    } else {
      this.readyPromise = Promise.resolve(true)
    }

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
    this.init()

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
    plugin(Ludic)
  }

}

export const Ludic: LudicConstructor = LudicInstance
export {LudicInstance as LudicApp}
export default Ludic
