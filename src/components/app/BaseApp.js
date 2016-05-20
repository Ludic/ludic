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
    this.canvas = new Canvas();
    this.context = this.canvas.getContext();
    // this.world = new World();
    this.camera = new Camera(this.canvas);
    this.running = false;
    this.lastTime = Date.now();
    this.screenManager = new ScreenManager();
    this.backgroundColor = 'black';

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

    Ludic.input = this.input = new InputController(this.canvas,this.camera);
    Ludic.camera = this.camera;
    Ludic.canvas = this.canvas;
    Ludic.context = this.context;
    Ludic.config = this.config;
    Ludic.util = this.util = Util;
    if(Ludic.devmode){
      window.ludic = Ludic;
    }
  }

  step(delta) {
    this.screenManager.step(this.context, delta);
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
