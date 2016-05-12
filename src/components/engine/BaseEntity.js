import Box2D from 'box2d';
import AssetManager from '../base/assetManager';

var imageTypes = ['HTMLImageElement', 'HTMLVideoElement', 'HTMLCanvasElement', 'ImageBitmap'];

class BaseEntity {
  constructor(body, image, options){
    this.body = body;
    this.setImage(image);
    this.options = options;

    if(options && options.scene){
      this.scene = options.scene;
    }

    if(this.body){
      this.body.entityData = this;
    }

    this.zIndex = 0;
  }

  activate(){
    this.active = true;
    if(this.body){
      this.body.SetActive(true);
    }
  }

  deactivate(){
    this.active = false;
    if(this.body){
      this.body.SetActive(false);
    }
  }

  draw(ctx, delta){
    /* ctx.save();
       ctx.restore(); */
  }

  calculateOpacity(){
    return this.dimension.opacity;
  }

  setImage(image){
    var img = false;
    if(image){
      if(typeof image === 'string'){
        // use asset manager to get image
        img = AssetManager.getImage(image);
      } else if(imageTypes.indexOf(image.constructor.name) >= 0){
        // we have image set it
        img = image;
      }
    }
    this.image = img;
  }

  getPosition(easyRead){
    var pos;

    this.pos = this.body.GetPosition();

    if(easyRead){
      pos = {
        x:this.pos.get_x(),
        y:this.pos.get_y()
      };
    } else {
      pos = this.pos;
    }

    return pos;
  }

  getAngle(){
    return this.angle = this.body.GetAngle();
  }

  involvedInContact(contactPtr){
    var contact = Box2D.wrapPointer(contactPtr, Box2D.b2Contact);
    var bodyA = contact.GetFixtureA().GetBody();
    var bodyB = contact.GetFixtureB().GetBody();
    if(bodyA == this.body){
      return bodyB;
    } else if(bodyB == this.body){
      return bodyA;
    } else {
      return false;
    }
  }

  applyRotation(ctx,delta,pos){
    if(this.body){
      pos = pos || this.body.GetPosition();
      ctx.translate(pos.get_x(),pos.get_y()); // center
      ctx.rotate(this.body.GetAngle()); // rotate about center
      ctx.translate(-pos.get_x(),-pos.get_y()); // translate back, keeping rotation
    }
  }
  destroy(){
    if(this.body){
      this.body.entityData = null;
    }
  }
}

export default BaseEntity;
