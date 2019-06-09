import Canvas from './canvas'
import InputManager from '../input/manager'

export interface LudicPlugin {
  (app: any, opts?: any): void
}
export interface UpdateFunction {
  (time?: number, delta?: number): void
}

export interface LudicOptions {
  el: string | HTMLCanvasElement
  plugins?: Array<LudicPlugin>
}

export interface LudicConstructor {
  $instance: LudicInstance
  debug: boolean
  canvas: Canvas
  input: InputManager
  $running: boolean
  new (opts: LudicOptions): LudicInstance
  registerUpdateFunction(fn: UpdateFunction): void
}

class LudicInstance {
  static debug: boolean
  static $instance: LudicInstance
  static canvas: Canvas
  static input: InputManager = new InputManager()
  static $running: boolean = false

  private requestAnimationFrame: Window['requestAnimationFrame']
  private lastRunTime: number
  private updateFunctions: UpdateFunction[] = []

  static registerUpdateFunction(fn: UpdateFunction){
    this.$instance.updateFunctions.push(fn)
  }

  constructor(opts: LudicOptions){
    if(Ludic.$instance) return Ludic.$instance

    const {el, plugins = []} = opts

    Ludic.$instance = this
    Ludic.canvas = new Canvas(el)

    Ludic.registerUpdateFunction((time, delta) => Ludic.input.update(time, delta))

    plugins.forEach(p => this.install(p))
    this.requestAnimationFrame = (()=>{
      return  window.requestAnimationFrame       ||
              window.webkitRequestAnimationFrame ||
              window.mozRequestAnimationFrame    ||
              window.oRequestAnimationFrame      ||
              window.msRequestAnimationFrame
    })().bind(window)
    this.animate = this.animate.bind(this)
  }

  public start(): void {
    Ludic.$running = true
    this.lastRunTime = performance.now()
    this.requestAnimationFrame(this.animate)
  }

  private animate(time: number): void {
    this.requestAnimationFrame(this.animate)
    let now = performance.now()
    let delta = now - this.lastRunTime
    this.updateFunctions.forEach(fn => fn(time, delta))
    this.update(time, delta)
    this.lastRunTime = now
  }

  update(time: number, delta: number): void { }

  install(plugin: LudicPlugin){
    plugin(Ludic)
  }

}

export const Ludic: LudicConstructor = LudicInstance

export default Ludic
