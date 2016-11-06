import Canvas from '../canvas/canvas';
import Camera from '../base/camera';
import Util from '../util/util';
import ScreenManager from '../screen/screenManager';
import Ludic from './ludic';
import InputController from '../input/inputController';

export default class LudicApp {
  constructor(config) {
    Util.setConfig(config);
    Ludic.config = config;
    Ludic.canvas = new Canvas();
    Ludic.context = Ludic.canvas.getContext();
    Ludic.camera = new Camera(Ludic.canvas);
    Ludic.screenManager = new ScreenManager();
    Ludic.input = new InputController(Ludic.canvas, Ludic.camera);
    Ludic.util = Util;

    //Put Ludic on the window in devmode
    if(Ludic.devmode){
      window.Ludic = Ludic;
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

  update(delta) {
  }

  _animate(time) {
    if(this.running){
      this._requestAnimFrame(this._animate);

      var delta = (time - this.lastTime) / 1000;
      this.lastTime = Ludic._time = time;

      if(!Number.isNaN(delta)){
        Ludic.context.save();
        this.update(delta,time);
        Ludic.context.restore();
      }
    }
  }

  pause() {
    this.running = !this.running;
    if (this.running)
      this._animate();
  }

  run(){
    this.running = true;
    this._animate();
  }

}
