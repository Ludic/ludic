import Util from '../util/util';

class Canvas {
  constructor() {
    this.setupFullscreen();
    this.config = Util.readConfig('canvas');
    this.focus();

  }

  setupFullscreen(){
    var ludicContainerId = Util.readConfig('ludic','id', 'ludic'); // get or use default container id for ludic canvas
    var canvasId = Util.readConfig('canvas','id', 'ludic-canvas');
    var fullscreen = Util.readConfig('canvas', 'fullscreen', false);
    var fps = Util.readConfig('camera', 'fps');

    var body = document.querySelector('body');
    var container = document.querySelector(`#${ludicContainerId}`);

    // create ludic container if no container was found
    if(!container){
      container = document.createElement('div');
      container.id = `${ludicContainerId}`;
      body.appendChild(container);
    }

    if(fullscreen){
      // add correct divs
      var canvas = document.createElement('canvas');
      canvas.id = canvasId;
      canvas.setAttribute('tabindex', 1);
      container.appendChild(canvas);

      this.setElement(canvas);

      window.addEventListener('resize', this.resize.bind(this), false);
      this.resize();
    } else {
      var wrapper = document.createElement('div');
      wrapper.setAttribute('style', 'text-align:center');
      container.appendChild(wrapper);

      var canvasWrapper = document.createElement('div');
      canvasWrapper.setAttribute('style', 'margin:auto;width:640px;padding:2px;border:1px solid #888;text-align:left');
      container.appendChild(canvasWrapper);

      var canvas = document.createElement('canvas');
      canvas.id = canvasId;
      canvas.setAttribute('width', 640);
      canvas.setAttribute('height', 480);
      canvas.setAttribute('tabindex', 1);
      canvasWrapper.appendChild(canvas);

      this.setElement(canvas);
    }
  }

  resize(){
    this.el.width = window.innerWidth;
    this.el.height = window.innerHeight;
  }

  focus(){
    this.el.focus();
  }

  getElement() {
    return this.el;
  }

  setElement(canvas){
    this.el = canvas;
  }

  addEventListener(){
    this.el.addEventListener.apply(this.el, arguments);
  }

  removeEventListener(){
    this.el.removeEventListener.apply(this.el, arguments);
  }

  getContext(dimension){
    dimension = dimension || '2d';
    return this.el.getContext(dimension);
  }

  height(){
    return this.el.height;
  }

  width(){
    return this.el.width;
  }
}

export default Canvas;
