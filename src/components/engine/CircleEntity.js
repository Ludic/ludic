import BaseEntity from 'src/components/engine/BaseEntity';
import AssetManager from 'src/components/base/assetManager';
import Util from 'src/components/util/util';

class CircleEntity extends BaseEntity {

  constructor(body, image, options) {
    super(body,image,options);

  }

  draw(ctx, delta){
    if(this.image){
      this.getPosition();
      this.getSize();

      ctx.save();
      // this.camera.setTransform(ctx);
      ctx.translate(this.pos.get_x(), this.pos.get_y());
      ctx.rotate(this.getAngle());
      ctx.drawImage(this.image, -this.rad, -this.rad, this.size, this.size);
      ctx.restore();
    }
  }



  getRadius(){
    return this.rad = this.body.GetFixtureList().GetShape().get_m_radius();
  }

  getSize(){
    return this.size = (this.getRadius() * 2);
  }


}

export default CircleEntity;
