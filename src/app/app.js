import Canvas from '../canvas/canvas';
import Camera from '../base/camera';
import * as Utils from '../utils';
import ScreenManager from '../screen/screenManager';
import InputController from '../input/inputController';

export class LudicApp {
  constructor(config, appContext) {
    this.$appContext = appContext
    // TODO: Create better config system
    this.$appContext.config = config;
    this.$appContext.canvas = new Canvas(config.el);
    this.$appContext.context = this.$appContext.canvas.getContext();
    this.$appContext.input = new InputController(this.$appContext.canvas);
    this.$appContext.utils = Utils;

    //Put the app context on the window in devmode
    if(this.$appContext.devmode){
      window.$ludicAppContext = this.$appContext;
    }

    this.running = false;
    this.lastTime = Date.now();

    this._requestAnimFrame = (()=>{
      return  window.requestAnimationFrame       ||
              window.webkitRequestAnimationFrame ||
              window.mozRequestAnimationFrame    ||
              window.oRequestAnimationFrame      ||
              window.msRequestAnimationFrame     ||
              (function(){
                console.warn('LudicApp: falling back to basic requestAnimationFrame');
                return false;
              })()                               ||
              function( callback ){
                window.setTimeout(callback, 1000 / 60);
              };
    })();

    // do some binding
    this._requestAnimFrame = this._requestAnimFrame.bind(window);
    this._animate = this._animate.bind(this);
  }

  // override
  update(delta,time) {}

  _animate(time) {
    if(this.running){
      this._requestAnimFrame(this._animate);

      var delta = (time - this.lastTime) / 1000;
      this.lastTime = this.$appContext._time = time;

      if(!Number.isNaN(delta)){
        this.$appContext.context.save();
        this.update(delta,time);
        this.$appContext.context.restore();
      }
    }
  }

  pause() {
    this.running = !this.running;
    if (this.running)
      this._animate();
  }

  run(updateFunction){
    this.running = true;
    if(updateFunction != null){
      this.update = updateFunction;
    }
    this._animate();
  }

}

export default function app(config){
  return new LudicApp(config, app)
}
