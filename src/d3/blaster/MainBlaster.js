import Blaster from './Blaster';
import MainBlasterBullet from '../bullet/MainBlasterBullet';
import Box2D from '../../components/box2d/box2d';
import EntityManager from '../../components/engine/EntityManager';

const RIGHT = 10;
const LEFT  = 11;


class MainBlaster extends Blaster {
  constructor(world, player){
    super();
    this.world = world;
    this.player = player;
    this.allDim = true;
  }

  // draw(ctx, delta){
  //   var pos = this.player.body.GetPosition();
  //   ctx.save();
  //   this.applyRotation(ctx);
  //
  //   ctx.translate(pos.get_x(),pos.get_y());
  //
  //   // draw gun
  //   ctx.strokeStyle = 'red';
  //   ctx.fillStyle   = 'red';
  //   ctx.beginPath();
  //   switch (this.player.looking) {
  //     case RIGHT:
  //       ctx.translate(-0.1,0);
  //       ctx.moveTo(0.2,0.8);
  //       ctx.lineTo(1.2,0.8);
  //       ctx.lineTo(1.2,0.6);
  //       ctx.lineTo(0.5,0.6);
  //       ctx.lineTo(0.5,0.2);
  //       ctx.lineTo(0.2,0.2);
  //       break;
  //     case LEFT:
  //       ctx.moveTo(-0.2,0.8);
  //       ctx.lineTo(-1.2,0.8);
  //       ctx.lineTo(-1.2,0.6);
  //       ctx.lineTo(-0.5,0.6);
  //       ctx.lineTo(-0.5,0.2);
  //       ctx.lineTo(-0.2,0.2);
  //       break;
  //     default:
  //       break;
  //   }
  //   ctx.closePath();
  //   ctx.stroke();
  //   ctx.fill();
  //
  //   ctx.restore();
  // }

  destroy(){


  }

  fire(){
    if(this.canShoot()){
      super.fire();
      //Create Bullet
      var bd = new Box2D.b2BodyDef();
      bd.set_type(Box2D.b2_dynamicBody);
      bd.set_gravityScale(0);
      bd.set_fixedRotation(true);

      var playerPos = this.player.body.GetPosition();
      var center;

      if(this.player.looking === RIGHT){
        bd.set_linearVelocity(new Box2D.b2Vec2(50, 0));
        center =  new Box2D.b2Vec2(playerPos.get_x() + .7 , playerPos.get_y() + .6);
      } else {
        bd.set_linearVelocity(new Box2D.b2Vec2(-50, 0));
        center =  new Box2D.b2Vec2(playerPos.get_x() - .7 , playerPos.get_y() + .6);
      }

      bd.set_bullet(true);
      bd.set_position(center);

      var body = this.world.CreateBody(bd);
      body.SetBullet(true);

      var fd = new Box2D.b2FixtureDef();
      var shape = new Box2D.b2CircleShape();
      var radius = .1;

      shape.set_m_radius(radius);
      fd.set_shape(shape);

      var fixture = body.CreateFixture(fd);
      var bullet = new MainBlasterBullet(body, null, null, this.world);
      bullet.fixture = fixture;
      EntityManager.addEntity(bullet);
    } else {

    }
  }
}

export default MainBlaster;
