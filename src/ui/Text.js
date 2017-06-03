import HUDElement from './HUDElement'

export default class Text extends HUDElement{
  constructor(text, x, y, {
    // default options for text
    fontFamily = 'serif',
    fontSize = 12,
    fontSizeUnit = 'px',
    color = 'black',
    drawStyle = 'fill',

    adjustOrigin = true,
    visible = true
  } = {}) {
    super();

    this.visible = true;

    this._adjustOrigin = true;
    this.drawStyle = drawStyle;

    this.fontFamily = fontFamily;
    this.setFontSize(fontSize, fontSizeUnit);

    // set the main attrs
    this.text = text;
    this.setPosition(x,y);
    this.color = color;
  }

  render(delta, ctx){
    ctx.save();
    ctx.font = `${this.__fontSize} ${this.fontFamily}`;

    if(this.drawStyle === 'stroke'){
      ctx.strokeStyle = this.color;
      ctx.strokeText(this.text, this.x, this._adjustOrigin ? this._y+this._fontSize : this._y);
    } else {
      ctx.fillStyle = this.color;
      ctx.fillText(this.text, this.x, this._adjustOrigin ? this._y+this._fontSize : this._y);
    }
    ctx.restore();
  }

  setPosition(x, y){
    // x can also be an object with .x/.y props
    if(typeof x === 'object' && y == null){
      let pos = x;
      this.setPositionX(pos.x);
      this.setPositionY(pos.y)
    } else if(typeof x === 'number' && typeof y === 'number'){
      this.setPositionX(x);
      this.setPositionY(y);
    } else {
      console.warn('Unknown parameters passed into "setPosition"', arguments);
    }
  }

  setPositionX(x){
    this.x = x;
  }
  setPositionY(y){
    this.y = y;
  }

  get y(){
    return parseFloat(this._y);
  }

  set y(y){
    y = parseFloat(y);
    this._y = y;
  }

  set fontSize(fontSize){
    this.setFontSize(fontSize);
  }

  get fontSize(){
    return this._fontSize;
  }

  setFontSize(fontSize, unit = this.fontSizeUnit){
    this.__fontSize = `${fontSize}${unit}`;
    this._fontSize = parseFloat(fontSize);
    this.fontSizeUnit = unit;
  }

}
