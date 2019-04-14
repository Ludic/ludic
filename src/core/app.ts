import Canvas from './canvas'
import InputManager from 'src/input/manager'

export interface LudicOptions {
  el: string | HTMLCanvasElement
}

export class Ludic {
  static $instance: Ludic
  static canvas: Canvas
  static input: InputManager = new InputManager()
  static $running: boolean = false
  
  private requestAnimationFrame: Window['requestAnimationFrame']
  private lastRunTime: number

  constructor(opts: LudicOptions){
    if(Ludic.$instance) return Ludic.$instance

    const {el} = opts

    Ludic.$instance = this
    Ludic.canvas = new Canvas(el)

    this.requestAnimationFrame = (()=>{
      return  window.requestAnimationFrame       ||
              window.webkitRequestAnimationFrame ||
              window.mozRequestAnimationFrame    ||
              window.oRequestAnimationFrame      ||
              window.msRequestAnimationFrame
    })().bind(window)
    this.animate = this.animate.bind(this)
  }

  start():void {
    Ludic.$running = true
    this.lastRunTime = performance.now()
    this.requestAnimationFrame(this.animate)
  }

  private animate(time: number):void {
    this.requestAnimationFrame(this.animate)
    let now = performance.now()
    let delta = now - this.lastRunTime
    this.update(time, delta)
    this.lastRunTime = now
  }

  update(time: number, delta: number): void {
    // console.log(time, delta)
  }

  
}

export default Ludic