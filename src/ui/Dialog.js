import HUDElement from './HUDElement'

const valid_positions_x = ['center', 'left', 'right'];
const valid_positions_y = ['center', 'top', 'bottom'];

export default class Dialog extends HUDElement {
  constructor({
    // basic info, position and dimensions
    x = 0,
    y = 0,
    width = 100,
    height = 100,

    // used for calc based positioning
    position = '',
    positionX = '',
    positionY = '',
    offset = {x:0,y:0},
    offsetX = 0,
    offsetY = 0,

    // basic color info, background and text colors
    backgroundColor = 'black',
    textColor = 'white',
    title = '',

    // allow for instant show when added
    visible = false,

    // border info
    borderColor = 'blue',
    borderWidth = 0,

  } = {}) {
    super()

    this._x = x;
    this._y = y;
    this.width = width;
    this.height = height;
    this.backgroundColor = backgroundColor;

    // text vars
    this.textColor = textColor;
    this.title =  title;

    // calc positioning setup
    this.__calcPosition({position, positionX, positionY, offset, offsetX, offsetY});

    if(visible){
      this.show();
    }

    this.borderColor = borderColor;
    this.borderWidth = borderWidth;
  }

  render(delta, ctx){
    ctx.save();
    let pos = this.getPosition(ctx);

    // draw border
    this._drawBorder(ctx, pos);
    // draw the main background rect
    this._drawBackground(ctx, pos);

    // draw the title
    ctx.save();
    ctx.fillStyle = this.textColor;
    ctx.font = '22px serif';
    ctx.fillText(this.title, pos.x + 10, pos.y + 22 + 10);
    ctx.restore();

    ctx.restore();
  }

  _drawBorder(ctx, pos){
    if(this.borderWidth > 0){
      let bw = this.borderWidth - 1;
      // draw the border just outside the normal dimensions
      ctx.beginPath();
      ctx.strokeStyle = this.borderColor;
      ctx.lineWidth = this.borderWidth;
      ctx.moveTo(pos.x-bw, pos.y-bw);
      ctx.lineTo(pos.x+this.width+bw, pos.y-bw);
      ctx.lineTo(pos.x+this.width+bw, pos.y+this.height+bw);
      ctx.lineTo(pos.x-bw, pos.y+this.height+bw);
      ctx.closePath();
      ctx.stroke();
    }
  }

  _drawBackground(ctx, pos){
    ctx.fillStyle = this.backgroundColor;
    ctx.fillRect(pos.x, pos.y, this.width, this.height);
  }

  show(){
    this.visible = true;
  }
  hide(){
    this.visible = false;
  }
  toggle(){
    if(this.visible){
      this.hide();
    } else {
      this.show();
    }
  }

  getPosition(ctx){
    let position = {x: 0, y: 0}
    if(this._positionX && this._positionY && ctx){
      let c_width = ctx.canvas.width;
      let c_height = ctx.canvas.height;

      let x = this.__getXfromPositionX.call(this, this._positionX, c_width)
      let y = this.__getYfromPositionY.call(this, this._positionY, c_height)

      position = {x,y};
    } else if(!ctx) {
      console.warn("Canvas context was not passed into 'getPosition'.");
    } else {
      position = {x: this._x, y: this._y};
    }

    this.position = position;
    return this.position;
  }

  /** Helper Methods **/

  __validatePositionX(posX){
    if(valid_positions_x.indexOf(posX) > -1){
      return true;
    }
    console.warn('Unknown value for position x: ', posX, '. The valid positions are: ', valid_positions_x);
    return false
  }

  __validatePositionY(posY){
    if(valid_positions_y.indexOf(posY) > -1){
      return true;
    }
    console.warn('Unknown value for position y: ', posY, '. The valid positions are: ', valid_positions_y);
    return false;
  }

  __getXfromPositionX(posX, c_width){
    switch (posX) {
      case 'center':
        return (c_width/2) - (this.width/2) + this._offsetX;
      case 'left':
        return this._offsetX;
      case 'right':
        return (c_width) - (this.width) + this._offsetX;
        break;
      default:
        console.warn('Unknown value for position x: ', posX, '. The valid positions are: ', valid_positions_x);
        return 0;
    }
  }

  __getYfromPositionY(posY, c_height){
    switch (posY) {
      case 'center':
        return (c_height/2) - (this.height/2) + this._offsetY;
      case 'top':
        return this._offsetY;
      case 'bottom':
        return (c_height) - (this.height) + this._offsetY;
        break;
      default:
        console.warn('Unknown value for position y: ', posY, '. The valid positions are: ', valid_positions_y);
        return 0;
    }
  }

  __calcPosition({position, positionX, positionY, offset, offsetX, offsetY}){
    if(position){
      let positions = position.split(' ');
      if(positions.length == 1 && positions[0] === 'center'){
        positionX = positionY = positions[0];
      } else if(positions.length == 2 && this.__validatePositionX(positions[0]) && this.__validatePositionY(positions[1])){
        positionX = positions[0];
        positionY = positions[1];
      }
    }
    // should have positionX & positionY, either from above logic or as param
    if(positionX != null && positionY != null){
      this._positionX = positionX;
      this._positionY = positionY;
    }

    if(offset != null && offset.hasOwnProperty('x') && offset.hasOwnProperty('y')){
      offsetX = offset.x;
      offsetY = offset.y;
    }

    // should have offsetX & offsetY, either from above logic or as param
    if(offsetX != null && offsetY != null){
      this._offsetX = offsetX;
      this._offsetY = offsetY;
    }
  }

  /** Getters and Setters **/
  get offsetX(){
    return this._offsetX;
  }
  set offsetX(x){
    this._offsetX = x;
  }
  get offsetY(){
    return this._offsetY;
  }
  set offsetY(y){
    this._offsetY = y;
  }
}
