import Canvas from './canvas'
import InputManager from '../input/manager'

export interface LudicPlugin {
  (app: typeof Ludic): void
}

export interface LudicOptions {
  el: string | HTMLCanvasElement
  plugins?: Array<LudicPlugin>
}

export class Ludic {
  static debug: boolean
  static $instance: Ludic
  static canvas: Canvas
  static input: InputManager = new InputManager()
  static $running: boolean = false

  private requestAnimationFrame: Window['requestAnimationFrame']
  private lastRunTime: number

  constructor(opts: LudicOptions){
    if(Ludic.$instance) return Ludic.$instance

    const {el, plugins = []} = opts

    Ludic.$instance = this
    Ludic.canvas = new Canvas(el)

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
    this.update(time, delta)
    this.lastRunTime = now
  }

  update(time: number, delta: number): void {
    Ludic.input.update(time, delta)
  }

  install(plugin: LudicPlugin){
    plugin(Ludic)
  }

}

export default Ludic
