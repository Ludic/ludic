import Util from '../util/util';

class Canvas {
  constructor() {
    this.setupCanvas();
    this.config = Util.readConfig('canvas');
    this.focus();

  }

  setupCanvas(){
    let canvasConfig = Util.readConfig('el')
    let canvas;

    if(typeof canvasConfig === 'string'){
      canvas = document.querySelector(canvasConfig)
    } else if(canvasConfig instanceof HTMLElement){
      canvas = canvasConfig
    } else {
      console.warn(`Ludic::Canvas: Unknown property type passed as 'el'.`, canvasConfig);
    }

    if(canvas != null){
      // make sure canvas has 'tabindex' attr for key binding
      canvas.setAttribute('tabindex', canvas.getAttribute('tabindex') || '1');
      this.setElement(canvas);
    } else {
      console.warn(`Ludic::Canvas: Ludic does not have a canvas to bind to. Please supply one with the 'el' config property.`);
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

  getContext(dimension = this.config.dimension){
    return this.el.getContext(dimension);
  }

  height(){
    return this.el.height;
  }

  width(){
    return this.el.width;
  }

  /**
   * Helper function to clear the current context at full width-height
   * @param {String} clearColor - color to clear the screen with
   */
  clear(clearColor = 'white', context = this.getContext()){
    context.fillStyle = clearColor
    context.clearRect(0, 0, this.width(), this.height())
    context.fillRect(0, 0, this.width(), this.height())
  }
}

export default Canvas;
