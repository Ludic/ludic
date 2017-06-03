import AssetManager from '../base/assetManager';

const RIGHT = 10;
const LEFT  = 11;

class BaseSprite {
  constructor(image, framesX, framesY, offsetX, offsetY) {

    if(typeof image === 'string'){
      this.image = AssetManager.getImage(image);
    } else {
      this.image = image;
    }

    if(!this.image){
      console.warn('Sprite created without an image', this);
      return;
    }

    this.width = this.image.width;
    this.height = this.image.height;

    this.frames = [];
    this.framesX = framesX;
    this.framesY = framesY;
    this.frameWidth = this.width / this.framesX;
    this.frameHeight = this.height / this.framesY;
    this.totalFrames = this.framesX * this.framesY;

    this.scaleToWidth(1);

    this.setOffset(offsetX || 0, offsetY || 0);

    this.currentFrameIndex = 0;

    this.direction = RIGHT;

    this.parseSpriteSheet();

    this.setFrame();
  }

  parseSpriteSheet(){
    for(var y = 0; y < this.framesY; y++){
      for(var x = 0; x < this.framesX; x++){
        var frame = {};
        frame.sx = x * this.frameWidth;
        frame.sy = y * this.frameHeight;

        this.frames.push(frame);
      }
    }



    console.log(this.frames);
  }

  animate(){
    this.currentFrameIndex = (this.currentFrameIndex + 1) % this.frames.length;
    this.setFrame();
  }

  setFrame(frameIndex){
    frameIndex = frameIndex===undefined ? this.currentFrameIndex : frameIndex;
    this.frame = this.frames[frameIndex];
  }

  setPosition(pos){
    this.pos = pos;
  }

  setOffset(offset, offsetY){
    if(typeof offset === 'object'){
      this.offset = offset;
    } else if(offsetY !== undefined){
      this.offset = {
        x: offset,
        y: offsetY
      }
    }
  }

  setUseShadow(use){
    this.useShadow = use;
  }

  setDirection(dir){
    this.direction = dir;
  }

  scaleToWidth(w){
    var h = w / this.frameWidth;
    this.drawWidth = w;
    this.drawHeight = h * this.frameHeight;
  }

  scaleToHeight(h){
    var w = h / this.frameHeight;
    this.drawWidth = w * this.frameWidth;
    this.drawHeight = h;
  }

  scale(scale){
    this.drawWidth *= scale;
    this.drawHeight *= scale;
  }

  draw(ctx){

    ctx.save();
    if(this.direction === RIGHT){
      ctx.scale(1,-1); // flip the y
      ctx.translate(-this.offset.x,-this.offset.y); //  [ -(w/2) , -(?) ]
      ctx.translate(this.pos.x,-this.pos.y);
    } else {
      ctx.scale(-1,-1); // flip the x & y
      ctx.translate(-this.offset.x,-this.offset.y); //  [ -(w/2) , -(?) ]
      ctx.translate(-this.pos.x,-this.pos.y);
    }

    if(this.useShadow){
      ctx.shadowColor = 'black';
      ctx.shadowBlur = 20;
      ctx.shadowOffsetX = 5;
      ctx.shadowOffsetY = 10;
    }

    ctx.drawImage(this.image, this.frame.sx, this.frame.sy, this.frameWidth, this.frameHeight, 0, 0, this.drawWidth, this.drawHeight);

    ctx.restore();
  }
}

export default BaseSprite;
