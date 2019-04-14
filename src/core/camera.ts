import Canvas from './canvas'
import Vector2 from '../utils/vector2'

// PTM: Pixels to Meters ratio
const DEFAULT_PTM = 32

const DEFAULTS: CameraOptions = {
  inverseY: true,
  inverseX: false,
  x: 0,
  y: 0,
  pixelsToMeters: DEFAULT_PTM,
  width: 300,
  height: 150,
}

export interface CameraOptions {
  inverseY: boolean
  inverseX: boolean
  x: number
  y: number
  pixelsToMeters: number
  width: number
  height: number
}

export interface CameraBounds {
  x: number
  y: number
  width: number
  height: number
}
export interface ViewportBounds {
  x: number
  y: number
  w: number
  h: number
}

export type RenderingContext2D = CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D

export class Camera {

  x: number
  y: number
  width: number
  height: number
  inverseX: boolean
  inverseY: boolean
  pixelsToMeters: number

  viewCenterPixel: Vector2 = new Vector2(0,0)
  singleWorldPoint: Vector2 = new Vector2(0,0)
  singlePixelPoint: Vector2 = new Vector2(0,0)
  offset: Vector2 = new Vector2(0,0)
  futurePos: Vector2 = new Vector2(0,0)

  /**
   * `new Camera(options)`
   * @param {object} [options] - options object
   * @param {boolean} [options.inverseY=true] - make 'y' axis point up
   * @param {boolean} [options.inverseX=false] - make 'x' axis point left
   * @param {number} [options.x=0] - 'x' coordinate to start the camera
   * @param {number} [options.y=0] - 'y' coordinate to start the camera
   * @param {number} [options.width=app.canvas.width()] - width of the camera view
   * @param {number} [options.height=app.canvas.height()] - height of the camera view
   *
   * `new Camera({Canvas})`
   * @param {Canvas} [canvas] - optional canvas to provide dimensions
   *
   * `new Camera(ptm)` - assumes fill canvas width/height
   * @param {number} [ptm] - pixels to meters scaling factor
   *
   * `new Camera(width,height)`
   * @param {number} [width] - width of the camera view
   * @param {number} [height] - height of the camera view
   *
   * `new Camera(x,y,width,height)`
   * @param {number} [x] - 'x' coordinate to start the camera
   * @param {number} [y] - 'y' coordinate to start the camera
   * @param {number} [width] - width of the camera view
   * @param {number} [height] - height of the camera view
   */
  constructor(canvas: Canvas)
  constructor(pixelsToMeters: number)
  constructor(width: number, height: number)
  constructor(x: number, y: number, width: number, height: number)
  constructor(...args: any[]){
    let options = Object.assign({},DEFAULTS)
    if(args.length === 1){
      const arg0 = args[0]
      if(typeof arg0 === 'object'){
        if(arg0 instanceof Canvas){
          options.width = arg0.element.width
          options.height = arg0.element.height
          console.log('set w h', arg0.element.width, arg0.element.height)
        } else {
          // options argument
          options = Object.assign(options, arg0)
        }
      } else if(typeof arg0 === 'number'){
        // arg is ptm
        options.pixelsToMeters = arg0
      } else {
        console.warn(`Camera::Unknown single argument '${typeof arg0}'.`, args)
      }
    } else if(args.length === 2) {
      // width and height
      let [width, height] = args
      options.width = width
      options.height = height
    } else if(args.length === 4){
      // x,y,width,height
      let [x,y,width,height] = args
      options.x = x
      options.y = y
      options.width = width
      options.height = height
    } else if(args.length === 0) {
      console.warn(`Camera::Initialized without any args.`, args)
    } else if(args.length !== 0) {
      console.warn(`Camera::Unknown args.`, args)
    }

    // apply the options
    this.x = options.x
    this.y = options.y
    this.width = options.width
    this.height = options.height
    this.inverseX = options.inverseX
    this.inverseY = options.inverseY
    this.pixelsToMeters = options.pixelsToMeters

    this.updateEnvironmentVariables()
  }

  draw(ctx: RenderingContext2D){
    this.setTransform(ctx)
  }

  drawAxes(ctx: RenderingContext2D) {
    ctx.save()
    ctx.lineWidth = 1/this.pixelsToMeters
    ctx.strokeStyle = 'rgb(192,0,0)'
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(1, 0)
    ctx.stroke()
    ctx.strokeStyle = 'rgb(0,192,0)'
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(0, 1)
    ctx.stroke()
    ctx.restore()
  }

  drawBounds(ctx: RenderingContext2D, color='red'){
    let br = this.getViewportBounds()
    ctx.save()
    ctx.strokeStyle = color
    ctx.lineWidth = 1/this.pixelsToMeters
    ctx.strokeRect(br.x, br.y, br.w-br.x, br.h-br.y)
    ctx.restore()
  }

  // setChaseEntity(ent,chaseMethod){
  //   this.chaseEntity = ent
  //   this.chaseMethod = chaseMethod
  // }

  // setChaseMethod(chaseMethod){
  //   this.chaseMethod = chaseMethod
  // }

  getWorldPointFromPixelPoint(pixelPoint: Vector2) {
    this.singleWorldPoint.x = this._getWorldPointFromPixelPoint_x(pixelPoint.x)
    this.singleWorldPoint.y = this._getWorldPointFromPixelPoint_y(pixelPoint.y)
    return this.singleWorldPoint
  }

  private _getWorldPointFromPixelPoint_x(x: number){
    return (this.inverseX ? (this.offset.x - x) : (x - this.offset.x)) / this.pixelsToMeters
  }

  private _getWorldPointFromPixelPoint_y(y: number){
    return (this.inverseY ? (y - (this.height - this.offset.y)) : ((this.height - this.offset.y) - y)) / this.pixelsToMeters
  }

  getPixelPointFromWorldPoint(worldPoint: Vector2){
    this.singlePixelPoint.x = this._getPixelPointFromWorldPoint_x(worldPoint.x)
    this.singlePixelPoint.y = this._getPixelPointFromWorldPoint_y(worldPoint.y)
    return this.singlePixelPoint
  }

  private _getPixelPointFromWorldPoint_x(x: number){
    return this.inverseX ? (this.offset.x - (x*this.pixelsToMeters)) : ((x*this.pixelsToMeters) + this.offset.x)
  }

  private _getPixelPointFromWorldPoint_y(y: number){
    return this.inverseY ? ((y*this.pixelsToMeters) + (this.height - this.offset.y)) : ((this.height - this.offset.y) - (y*this.pixelsToMeters))
  }

  setViewCenterWorld(vector2: Vector2, instantaneous: boolean, fraction: number = 0) {
    let currentViewCenterWorld = this.getViewCenterWorld()
    let toMove = new Vector2()
    toMove.x = vector2.get_x() - currentViewCenterWorld.x
    toMove.y = vector2.get_y() - currentViewCenterWorld.y
    this.moveCenterBy(toMove, instantaneous, fraction)
  }

  centerWorldToCamera(){
    // this.setViewCenterWorld(new Vector2(), true)
    this.setOffset(this.viewCenterPixel)
  }

  centerWorldToTopLeft(){
    this.setViewCenterWorld(new Vector2(), true)
  }

  getViewCenterWorld(){
    return this.getWorldPointFromPixelPoint( this.viewCenterPixel )
  }

  moveCenterBy(toMove: Vector2, instantaneous: boolean, fraction: number){
    fraction = fraction || (instantaneous ? 1 : 0.25)
    this.offset.x -= round(fraction * toMove.x * this.pixelsToMeters, 0)
    this.offset.y += round(fraction * toMove.y * this.pixelsToMeters, 0)
  }

  updateEnvironmentVariables(){
    this.viewCenterPixel.set_x(this.width / 2)
    this.viewCenterPixel.set_y(this.height / 2)
  }

  getViewCenterPixel(){
    return this.viewCenterPixel
  }

  getViewportBounds(): ViewportBounds {
    let bounds = {
      x: this._getWorldPointFromPixelPoint_x(this.x),
      y: this._getWorldPointFromPixelPoint_y(this.y),
      w: this._getWorldPointFromPixelPoint_x(this.width),
      h: this._getWorldPointFromPixelPoint_y(this.height),
    }
    return bounds
  }

  setCameraBounds(x: number, y: number, width: number, height: number): CameraBounds
  setCameraBounds(bounds:  Partial<CameraBounds>): CameraBounds
  setCameraBounds(...args: any[]): CameraBounds {
    if(args.length === 1){
      const {x=this.x, y=this.y, width=this.width, height=this.height} = args[0] as CameraBounds
      this.x = x
      this.y = y
      this.width = width
      this.height = height
    } else if (args.length === 4){
      const [x=this.x, y=this.y, width=this.width, height=this.height] = args
      this.x = x
      this.y = y
      this.width = width
      this.height = height
    }
    return {x: this.x, y: this.y, width: this.width, height: this.height}
  }

  getOffset(){
    return this.offset
  }

  getOffsetX(){
    return this.offset.x
  }

  getOffsetY(){
    return this.offset.y
  }

  setOffset(vec: Vector2): void
  setOffset(x: number, y: number): void
  setOffset(...args: any[]): void {
    if(args.length === 1){
      this.offset.x = args[0].x || 0
      this.offset.y = args[0].y || 0
    } else if(args.length === 2){
      this.offset.x = args[0]
      this.offset.y = args[1]
    }
  }

  setTransform(ctx: RenderingContext2D){
    ctx.translate(this.getOffsetX(), this.getOffsetY())
    // apply the scaling factor and inverses
    ctx.scale(this.inverseX ? -this.pixelsToMeters : this.pixelsToMeters, this.inverseY ? -this.pixelsToMeters : this.pixelsToMeters)
    // ctx.lineWidth /= this.pixelsToMeters
  }

  resetTransform(ctx: RenderingContext2D){
    // ctx.scale(1 / this.getPTM(),1 / this.getPTM())
    ctx.scale(this.inverseX ? (-1 / this.pixelsToMeters) : (1 / this.pixelsToMeters), this.inverseY ? (-1 / this.pixelsToMeters) : (1 / this.pixelsToMeters))
    // ctx.lineWidth *= this.pixelsToMeters
    ctx.translate(-this.getOffsetX(), -this.getOffsetY())
  }

  isPointInBounds(x: number, y: number, ctx: RenderingContext2D){
    let inBounds = false
    ctx.save()
    ctx.resetTransform()
    this._generateViewportRect(ctx)
    inBounds = ctx.isPointInPath(x, y)
    ctx.restore()
    return inBounds
  }

  private _generateViewportRect(ctx: RenderingContext2D){
    let br = this.getViewportBounds()
    ctx.beginPath()
    ctx.moveTo(br.x,br.y)
    ctx.lineTo(br.w,br.y)
    ctx.lineTo(br.w,br.h)
    ctx.lineTo(br.x,br.h)
    ctx.closePath()
  }
}
export default Camera

function round(val: number, places: number = 0): number {
  let c = 1
  for (let i = 0; i < places; i++){
    c *= 10
  }
  return Math.round(val*c)/c
}
