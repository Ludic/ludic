import { LudicOptions } from './app'

export interface CanvasDimensions {
  width: number
  height: number
}

export class Canvas {
  dimension: string
  element: HTMLCanvasElement
  context: CanvasRenderingContext2D

  constructor(el: LudicOptions['el'], dimension='2d') {
    this.dimension = dimension

    if(typeof el === 'string'){
      this.element = document.querySelector(el)
    } else if(el instanceof HTMLCanvasElement) {
      this.element = el
    }

    // window.addEventListener('resize', ()=>{
    //   this.element.width = window.innerWidth
    //   this.element.height = window.innerHeight
    // }, false)
  }

  getContext(dimension = this.dimension, options = {alpha: false}){
    return this.context || (this.context = <CanvasRenderingContext2D>this.element.getContext(dimension, options))
  }

  setDimensions(width: number = window.innerWidth, height: number = window.innerHeight): CanvasDimensions {
    this.element.width = width
    this.element.height = height
    return {width, height}
  }

  /**
   * Helper function to clear the current context at full width-height
   * @param {String} clearColor - color to clear the screen with
   */
  clear(clearColor = 'white', context = this.getContext()){
    context.fillStyle = clearColor
    context.clearRect(0, 0, this.element.width, this.element.height)
    context.fillRect(0, 0, this.element.width, this.element.height)
  }
}

export default Canvas
