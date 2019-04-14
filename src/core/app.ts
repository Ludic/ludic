import Canvas from './canvas'
import InputManager from 'src/input/manager'

export interface LudicAppOptions {
  el: string | HTMLCanvasElement
}

export class LudicApp {
  $canvas: Canvas
  $input: InputManager = new InputManager()
  requestAnimationFrame: Window['requestAnimationFrame']
  running: boolean = false
  lastRunTime: number

  constructor(opts: LudicAppOptions){
    const {el} = opts
    
    this.$canvas = new Canvas(el)

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
    this.running = true
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

export default LudicApp