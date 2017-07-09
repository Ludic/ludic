import Canvas from '../canvas/canvas';
import Camera from '../base/camera';
import * as Utils from '../utils';
import ScreenManager from '../screen/screenManager';
import InputController from '../input/inputController';

export class LudicApp {
  constructor(config, $app = {}) {
    this.$app = $app
    // TODO: Create better config system
    this.$app.config = config;
    this.$app.canvas = new Canvas(config.el);
    this.$app.context = this.$app.canvas.getContext();
    this.$app.input = new InputController(this.$app.canvas);
    this.$app.utils = Utils;

    //Put the app context on the window in devmode
    if(this.$app.devmode){
      window.$ludicAppContext = this.$app;
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
      this.lastTime = this.$app._time = time;

      if(!Number.isNaN(delta)){
        this.$app.context.save();
        this.update(delta,time);
        this.$app.context.restore();
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
