import Util from '../util/util';
import $ from 'jquery';

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

    var body = $('body');
    var container = $(`#${ludicContainerId}`);

    // setup fps
    // this.$fps = $('#fps');
    // (this.$fps.length && fps) ? this.$fps.show(): this.$fps.hide();

    // create ludic container if no container was found
    if(!container.length){
      container = $(`<div id=${ludicContainerId}></div>`).appendTo(body);
    }

    if(fullscreen){
      // add correct divs
      var canvas = $('<canvas id="'+canvasId+'" tabindex="1"></canvas>').appendTo(container);

      this.set$Element(canvas);

      window.addEventListener('resize', this.resize.bind(this), false);
      this.resize();
    } else {
      var wrapper = $('<div style="text-align:center"></div>').appendTo(container);
      var canvasWrapper = $('<div style="margin:auto;width:640px;padding:2px;border:1px solid #888;text-align:left"></div>').appendTo(wrapper);
      var canvas = $('<canvas id="'+canvasId+'" width="640" height="480" tabindex="1"></canvas>').appendTo(canvasWrapper);

      this.set$Element(canvas);
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

  set$Element(canvas){
    this.$el = canvas;
    this.el = this.$el[0];
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
