import Util from '../util/util';
import Box2D from 'box2d';

var PTM = 32;

var viewCenterPixel = {
  x: 0,
  y: 0
};
var singleWorldPoint = {
  x:0,
  y:0
};
var singlePixelPoint = {
  x:0,
  y:0
};
var offset = {
  x:0,
  y:0
};

var futurePos = new Box2D.b2Vec2(0,0);

var average;
var averageArray = [];
var timeTotal = 0;
var averageCount = 60;

var _frames = 0;

class Camera {

  constructor(canvas) {
    this.canvas = canvas;
    this.context = this.canvas.getContext();
    this.config = Util.readConfig('camera');
    PTM = Util.readConfig('camera', 'ptm', 32);

    // this.fpsWorker = new Worker('src/components/base/fps.js');
    // this.fpsWorker.onmessage = this.onFPS.bind(this);

    this.updateEnvironmentVariables();
    window.addEventListener('resize', this.updateEnvironmentVariables.bind(this), false);
  }

  getCanvas(){
    return this.canvas;
  }

  update(ctx, delta){
    this.setTransform(ctx);
    if(this.chaseEntity){
      if(this.chaseMethod){
        this.chaseMethod(this.chaseEntity,this);
      } else {
        futurePos = this.chaseEntity.getPosition();
        // var vel = this.chaseEntity.GetLinearVelocity();
        // futurePos.set_x( pos.get_x() + 0.15 * vel.get_x() );
        // futurePos.set_y( pos.get_y() + 0.15 * vel.get_y() );
        this.setViewCenterWorld( futurePos );
      }

    }

    if(this.config.fps){
      // this.fpsWorker.postMessage(delta);
      // console.log('draw fps');
      this.calculateFPS(delta);
      this.canvas.$fps.html(this.fps);
    }

    if(this.config.extras){
      this.drawExtras();
    }
  }

  drawExtras(ctx){
    ctx = this.context;


    if(ctx && this.config.extras.axes){
      this.drawAxes(ctx);
    }

    // not ready yet
    // if(ctx && this.config.extras.grid){
    //   this.drawGrid(ctx);
    // }
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

  drawGrid(ctx){
    var bounds = this.getViewportBounds();
    ctx.strokeStyle = 'rgb(0,192,0)';
    ctx.beginPath();
    ctx.moveTo(bounds.w/2, 0);
    ctx.lineTo(bounds.w/2, bounds.h);
    ctx.stroke();
    // ctx.strokeStyle = 'rgb(0,192,0)';
    // ctx.beginPath();
    // ctx.moveTo(0, 0);
    // ctx.lineTo(0, 1);
    // ctx.stroke();
  }

  onFPS(event){
    this.canvas.$fps.html(Math.ceil(event.data));
  }

  setChaseEntity(ent,chaseMethod){
    this.chaseEntity = ent;
    this.chaseMethod = chaseMethod;
  }

  setChaseMethod(chaseMethod){
    this.chaseMethod = chaseMethod;
  }

  getWorldPointFromPixelPoint(pixelPoint) {
    singleWorldPoint.x = this._getWorldPointFromPixelPoint_x(pixelPoint.x)
    singleWorldPoint.y = this._getWorldPointFromPixelPoint_y(pixelPoint.y);
    return singleWorldPoint;
  }

  _getWorldPointFromPixelPoint_x(x){
    return (x - offset.x) / PTM;
  }

  _getWorldPointFromPixelPoint_y(y){
    return (y - (this.canvas.height() - offset.y)) / PTM;
  }

  getPixelPointFromWorldPoint(worldPoint){
    singlePixelPoint.x = this._getPixelPointFromWorldPoint_x(worldPoint.x);
    singlePixelPoint.y = this._getPixelPointFromWorldPoint_y(worldPoint.y);
    return singlePixelPoint;
  }

  _getPixelPointFromWorldPoint_x(x){
    return (x*PTM)+offset.x;
  }

  _getPixelPointFromWorldPoint_y(y){
    return (y*PTM) + (this.canvas.height() - offset.y);
  }

  setViewCenterWorld(b2vecpos, instantaneous, fraction) {
    var currentViewCenterWorld = this.getViewCenterWorld();
    var toMove = {};
    toMove.x = b2vecpos.get_x() - currentViewCenterWorld.x;
    toMove.y = b2vecpos.get_y() - currentViewCenterWorld.y;
    this.moveCenterBy(toMove, instantaneous, fraction);
  }

  getViewCenterWorld(){
    return this.getWorldPointFromPixelPoint( viewCenterPixel );
  }

  moveCenterBy(toMove,instantaneous, fraction){
    fraction = fraction || instantaneous ? 1 : 0.25;
    offset.x -= Util.myRound(fraction * toMove.x * PTM, 0);
    offset.y += Util.myRound(fraction * toMove.y * PTM, 0);
  }

  updateEnvironmentVariables(){
    viewCenterPixel = {
      x: this.canvas.width() / 2,
      y: this.canvas.height() / 2
    };
  }

  getViewportBounds(){
    var bounds = {
      x: this._getWorldPointFromPixelPoint_x(0),
      y: this._getWorldPointFromPixelPoint_y(0),
      w: this._getWorldPointFromPixelPoint_x(this.canvas.width()),
      h: this._getWorldPointFromPixelPoint_y(this.canvas.height()),
    }
    return bounds;
  }

  getPTM(){
    return PTM;
  }

  setPTM(ptm){
    PTM = ptm;
  }

  getOffset(){
    return offset;
  }

  getOffsetX(){
    return offset.x;
  }

  getOffsetY(){
    return offset.y;
  }

  setOffset(obj, y){
    if(typeof obj === 'object' && !y){
      offset.x = obj['x'] || 0;
      offset.y = obj['y'] || 0;
    } else if(typeof obj === 'number' && typeof y === 'number'){
      offset.x = obj;
      offset.y = y;
    }
  }

  calculateFPS(timestamp){
    timeTotal += timestamp;
    // averageArray.push(timestamp);
    //
    // if(averageArray.length>averageCount){
    //   timeTotal -= averageArray.shift();
    //   average = timeTotal / averageCount;
    //   return 1 / average;
    // }
    // return 0;

    if(timeTotal >= 1.0){
      this.fps = _frames;
      timeTotal = 0;
      _frames = 0;
    }
    _frames++;
  }

  setTransform(ctx){
    ctx.translate(this.getOffsetX(), this.getOffsetY());
    ctx.scale(1,-1);
    ctx.scale(this.getPTM(),this.getPTM());
    ctx.lineWidth /= this.getPTM();
  }
}


export default Camera;
