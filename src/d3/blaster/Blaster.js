import PolygonEntity from '../../components/engine/PolygonEntity';
import Box2D from '../../components/box2d/box2d';

class Blaster extends PolygonEntity {
  constructor(body, image, options, world){
    super(body, image, options);
    this.world = world;
    this.color = "#ecf0f1";
  }


  draw(ctx, delta){

  }

  fire(){

  }

  canShoot(){
    if(this.needsCoolDown){
      return false;
    } else {
      this.needsCoolDown = true;
      setTimeout(function(){
        this.needsCoolDown = false;
      }.bind(this), 100);
      return true;
    }
  }
}

export default Blaster;
