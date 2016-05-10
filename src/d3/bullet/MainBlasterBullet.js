import Bullet from '../bullet/Bullet';
import Box2D from '../../components/box2d/box2d';

class MainBlasterBullet extends Bullet {
  constructor(body, image, options, world){
    super(body, image, options, world);
    this.world = world;
    this.gravityScale = 0;
    this.color = "#ffeb3b";
    this.body.entityData = this;
  }

  draw(ctx, delta){
    super.draw();

    ctx.save();

    var pos = this.getPosition();
    var fix = this.fixture;
    var radius = this.body.GetFixtureList().GetShape().get_m_radius();
    //var center = console.log(this.body.GetFixtureList().GetShape());
    ctx.fillStyle = 'yellow';

    this.applyRotation(ctx);
    ctx.translate(pos.get_x(), pos.get_y());
    // draw main circle
    ctx.beginPath();
    ctx.arc(0, 0,radius,0,2*Math.PI);
    ctx.fill();

    // draw a radius line to show rotation
    /* ctx.beginPath();
       ctx.moveTo(0, 0);
       ctx.lineTo(radius, 0);
       ctx.strokeStyle = 'red';
       ctx.stroke(); */

    ctx.restore();
  }

}

export default MainBlasterBullet;
