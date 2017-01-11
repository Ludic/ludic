import Util from '../util/util';
import Vector2 from '../engine/Vector2';
import Canvas from 'components/canvas/canvas';
import Ludic from 'components/app/ludic';

var DEFAULT_PTM = 32;

const DEFAULTS = {
  inverseY: true,
  inverseX: false,
  x: 0,
  y: 0,
  ptm: DEFAULT_PTM,
}

class Camera {

  /**
   * `new Camera(options)`
   * @param {object} [options] - options object
   * @param {boolean} [options.inverseY=true] - make 'y' axis point up
   * @param {boolean} [options.inverseX=false] - make 'x' axis point left
   * @param {number} [options.x=0] - 'x' coordinate to start the camera
   * @param {number} [options.y=0] - 'y' coordinate to start the camera
   * @param {number} [options.width=Ludic.canvas.width()] - width of the camera view
   * @param {number} [options.height=Ludic.canvas.height()] - height of the camera view
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
  constructor(){
    let options = Object.assign({},DEFAULTS,{
      width: Ludic.canvas.width(),
      height: Ludic.canvas.height(),
    });
    if(arguments.length === 1){
      if(typeof arguments[0] === 'object'){
        if(arguments[0] instanceof Canvas){
          options.width = canvas.width();
          option.height = canva.height();
        } else {
          // options argument
          options = Object.assign(options, arguments[0])
        }
      } else if(typeof arguments[0] === 'number'){
        // arg is ptm
        options.ptm = arguments[0];
      } else {
        console.warn(`Camera::Unknown single argument '${typeof arguments[0]}'.`, arguments);
      }
    } else if(arguments.length === 2) {
      // width and height
      let [width, height] = arguments;
      options.width = width;
      options.height = height;
    } else if(arguments.length === 4){
      // x,y,width,height
      let [x,y,width,height] = arguments;
      options.x = x;
      options.y = y;
      options.width = width;
      options.height = height;
    } else if(arguments.length !== 0) {
      console.warn(`Camera::Unknown arguments.`, arguments);
    }

    // apply the options
    this.x = options.x;
    this.y = options.y;
    this.width = options.width;
    this.height = options.height;
    this.inverseX = options.inverseX;
    this.inverseY = options.inverseY;
    this.ptm = options.ptm;

    // setup variables
    this.viewCenterPixel = {
      x: 0,
      y: 0
    };
    this.singleWorldPoint = {
      x:0,
      y:0
    };
    this.singlePixelPoint = {
      x:0,
      y:0
    };
    this.offset = {
      x:0,
      y:0
    };
    this.futurePos = new Vector2(0,0);

    this.updateEnvironmentVariables();
    window.addEventListener('resize', this.updateEnvironmentVariables.bind(this), false);

    window.camera = this;
  }

  getCanvas(){
    return this.canvas;
  }


  draw(ctx){

    this.setTransform(ctx);

  }

  drawAxes(ctx) {
    ctx.strokeStyle = 'rgb(192,0,0)';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(1, 0);
    ctx.stroke();
    ctx.strokeStyle = 'rgb(0,192,0)';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, 1);
    ctx.stroke();
  }

  setChaseEntity(ent,chaseMethod){
    this.chaseEntity = ent;
    this.chaseMethod = chaseMethod;
  }

  setChaseMethod(chaseMethod){
    this.chaseMethod = chaseMethod;
  }

  getWorldPointFromPixelPoint(pixelPoint) {
    this.singleWorldPoint.x = this._getWorldPointFromPixelPoint_x(pixelPoint.x)
    this.singleWorldPoint.y = this._getWorldPointFromPixelPoint_y(pixelPoint.y);
    return this.singleWorldPoint;
  }

  _getWorldPointFromPixelPoint_x(x){
    // let inv = (this.offset.x - x) / this.ptm;
    // let reg = (x - this.offset.x) / this.ptm;
    return (this.inverseX ? (this.offset.x - x) : (x - this.offset.x)) / this.ptm
  }

  _getWorldPointFromPixelPoint_y(y){
    // let inv = (y - (this.height - this.offset.y)) / this.ptm;
    // let reg = ((this.height - this.offset.y) - y) / this.ptm;
    return (this.inverseY ? (y - (this.height - this.offset.y)) : ((this.height - this.offset.y) - y)) / this.ptm
  }

  getPixelPointFromWorldPoint(worldPoint){
    this.singlePixelPoint.x = this._getPixelPointFromWorldPoint_x(worldPoint.x);
    this.singlePixelPoint.y = this._getPixelPointFromWorldPoint_y(worldPoint.y);
    return this.singlePixelPoint;
  }

  _getPixelPointFromWorldPoint_x(x){
    // let reg = (x*this.ptm) + this.offset.x;
    // let inv = this.offset.x - (x*this.ptm);
    return this.inverseX ? (this.offset.x - (x*this.ptm)) : ((x*this.ptm) + this.offset.x);
  }

  _getPixelPointFromWorldPoint_y(y){
    // let inv = (y*this.ptm) + (this.height - this.offset.y);
    // let reg = (this.height - this.offset.y) - (y*this.ptm);
    return this.inverseY ? ((y*this.ptm) + (this.height - this.offset.y)) : ((this.height - this.offset.y) - (y*this.ptm));
  }

  setViewCenterWorld(vector2, instantaneous, fraction) {
    var currentViewCenterWorld = this.getViewCenterWorld();
    var toMove = {};
    toMove.x = vector2.get_x() - currentViewCenterWorld.x;
    toMove.y = vector2.get_y() - currentViewCenterWorld.y;
    this.moveCenterBy(toMove, instantaneous, fraction);
  }

  centerWorldToCamera(){
    // this.setViewCenterWorld(new Vector2(), true);
    this.setOffset(this.viewCenterPixel);
  }

  centerWorldToTopLeft(){
    this.setViewCenterWorld(new Vector2(), true);
  }

  getViewCenterWorld(){
    return this.getWorldPointFromPixelPoint( this.viewCenterPixel );
  }

  moveCenterBy(toMove,instantaneous, fraction){
    fraction = fraction || instantaneous ? 1 : 0.25;
    this.offset.x -= Util.myRound(fraction * toMove.x * this.ptm, 0);
    this.offset.y += Util.myRound(fraction * toMove.y * this.ptm, 0);
  }

  updateEnvironmentVariables(){
    this.viewCenterPixel = {
      x: this.width / 2,
      y: this.height / 2
    };
  }

  getViewCenterPixel(){
    return this.viewCenterPixel
  }

  getViewportBounds(){
    var bounds = {
      x: this._getWorldPointFromPixelPoint_x(0),
      y: this._getWorldPointFromPixelPoint_y(0),
      w: this._getWorldPointFromPixelPoint_x(this.width),
      h: this._getWorldPointFromPixelPoint_y(this.height),
    }
    return bounds;
  }

  getPTM(){
    return this.ptm;
  }

  setPTM(ptm){
    this.ptm = ptm;
  }

  getOffset(){
    return this.offset;
  }

  getOffsetX(){
    return this.offset.x;
  }

  getOffsetY(){
    return this.offset.y;
  }

  setOffset(obj, y){
    if(typeof obj === 'object' && !y){
      this.offset.x = obj['x'] || 0;
      this.offset.y = obj['y'] || 0;
    } else if(typeof obj === 'number' && typeof y === 'number'){
      this.offset.x = obj;
      this.offset.y = y;
    }
  }

  setTransform(ctx){
    ctx.translate(this.getOffsetX(), this.getOffsetY());
    let ptm = this.getPTM();
    // apply the scaling factor and inverses
    ctx.scale(this.inverseX ? -ptm : ptm, this.inverseY ? -ptm : ptm);
    ctx.lineWidth /= ptm;
  }

  resetTransform(ctx){
    let ptm = this.getPTM();
    // ctx.scale(1 / this.getPTM(),1 / this.getPTM());
    ctx.scale(this.inverseX ? (-1 / ptm) : (1 / ptm), this.inverseY ? (-1 / ptm) : (1 / ptm));
    ctx.lineWidth *= ptm;
    ctx.translate(-this.getOffsetX(), -this.getOffsetY());
  }
}


export default Camera;
