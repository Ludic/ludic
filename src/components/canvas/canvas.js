import Util from '../util/util';

class Canvas {
  constructor() {
    this.setupFullscreen();
    this.config = Util.readConfig('canvas');
    this.focus();

  }

  setupFullscreen(){
    var id = Util.readConfig('canvas','id', 'canvas');
    var fullscreen = Util.readConfig('canvas', 'fullscreen', false);
    var fps = Util.readConfig('camera', 'fps');

    var container = $('#container');
    this.$fps = $('#fps');
    fps ? this.$fps.show(): this.$fps.hide();

    if(fullscreen){
      // add correct divs
      var canvas = $('<canvas id="'+id+'" tabindex="1"></canvas>').appendTo(container);

      this.set$Element(canvas);

      window.addEventListener('resize', this.resize.bind(this), false);
      this.resize();
    } else {
      var wrapper = $('<div style="text-align:center"></div>').appendTo(container);
      var canvasWrapper = $('<div style="margin:auto;width:640px;padding:2px;border:1px solid #888;text-align:left"></div>').appendTo(wrapper);
      var canvas = $('<canvas id="'+id+'" width="640" height="480" tabindex="1"></canvas>').appendTo(canvasWrapper);

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
