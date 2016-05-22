import Canvas from '../canvas/canvas';
import Camera from '../base/camera';
import Util from '../util/util';
import ScreenManager from '../screen/screenManager';
import Ludic from './ludic';
import InputController from '../input/inputController';

// master record; all systems report actions to parent manager for master record of all entities:entity/system
class BaseApp {
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

    window._requestAnimFrame = (function(){
      return  window.requestAnimationFrame       ||
              window.webkitRequestAnimationFrame ||
              window.mozRequestAnimationFrame    ||
              window.oRequestAnimationFrame      ||
              window.msRequestAnimationFrame     ||
              (function(){
                console.log('falling back to basic requestAnimationFrame');
                return false;
              })()                               ||
              function( callback ){
                window.setTimeout(callback, 1000 / 60);
              };
    })();

    this._animate = this._animate.bind(this);
  }

  step(delta) {
    this.screenManager.step(Ludic.context, delta);
  }

  _animate() {
    if(this.running){
      window._requestAnimFrame(this._animate);

      var dateNow = Date.now(),
          delta = (dateNow - this.lastTime) / 1000;

      this.lastTime = dateNow;
      this.step(delta);
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

export default BaseApp;
