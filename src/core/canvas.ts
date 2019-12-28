import { LudicOptions } from './app'

export interface CanvasDimensions {
  width: number
  height: number
}

export class Canvas {
  element: HTMLCanvasElement|OffscreenCanvas
  _context: CanvasRenderingContext2D|OffscreenCanvasRenderingContext2D

  constructor(el: string|HTMLCanvasElement|OffscreenCanvas) {

    if(typeof el === 'string'){
      let node = document.querySelector(el as 'canvas')
      if(node != null){
        node.setAttribute('tabindex', "1")
        this.element = node
        this.setDimensions()
      }
    } else if(typeof HTMLCanvasElement !== 'undefined' && el instanceof HTMLCanvasElement) {
      el.setAttribute('tabindex', "1")
      this.element = el
      this.setDimensions()
    } else if(el instanceof OffscreenCanvas){
      this.element = el
    }
    // window.addEventListener('resize', ()=>{
    //   this.element.width = window.innerWidth
    //   this.element.height = window.innerHeight
    // }, false)
    
  }

  get context(){
    return this._context || (this._context = this.element.getContext('2d', {alpha: false, desynchronized: true})!)
  }

  setDimensions(width: number = self.innerWidth, height: number = self.innerHeight): CanvasDimensions {
    this.element.width = width
    this.element.height = height
    return {width, height}
  }

  transferControlToOffscreen(){
    if(this.element instanceof HTMLCanvasElement){
      return this.element.transferControlToOffscreen()
    }
    return this.element
  }

  /**
   * Helper function to clear the current context at full width-height
   * @param {String} clearColor - color to clear the screen with
   */
  clear(clearColor = 'white', context = this.context){
    // this.element.width = this.element.width
    context.fillStyle = clearColor
    context.clearRect(0, 0, this.element.width, this.element.height)
    context.fillRect(0, 0, this.element.width, this.element.height)
  }
}

export default Canvas
