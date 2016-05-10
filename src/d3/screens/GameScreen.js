import Screen from '../../components/screen/screen';
import AssetManager from '../../components/base/assetManager';
import Level1 from '../levels/level1';
import RubeLoader from '../../components/rube/RubeLoader';
import DebugDraw from '../../components/box2d/debugDraw';
import Box2D from '../../components/box2d/box2d';
import Ludic from '../../components/app/ludic';
import Level from '../levels/Level';

class GameScreen extends Screen {
  constructor(camera, world, options) {
    super(camera, options);

    this.world = world;

    this.debugDraw = DebugDraw.newDebugger(this.camera.canvas);
    this.world.SetDebugDraw(this.debugDraw);
    this.debugDraw.SetFlags(DebugDraw.e_shapeBit);

    this.levelAsset = AssetManager.getAsset('level');
    this.scene = this.levelAsset.data;

    this.backgroundAsset = AssetManager.getImage('background1');

    //this.camera.setPTM(34);
    this.camera.setViewCenterWorld(new Box2D.b2Vec2(15,0),true);
    console.log(this.levelAsset);
    this.level = new Level(this.scene, this.world, this.levelAsset.options);

    this.inputListener = Ludic.input.newEventListener({
      '27':'home'
    },true);

    this.inputListener.home = (down,evt)=>{
      if(!down){
        this.finish({reset:true});
        console.log('reset');
      }
    };
  }

  draw(ctx, delta){
    if(this.scene._isFinished){
      // TODO: better implement level switching
      this.finish({done:true, nextLevel: this.scene.data.nextLevel});
    } else {

      this.translateBackground(ctx);

      ctx.save();

      this.world.step(1/60, 3, 2);
      this.camera.update(ctx,delta);
      // this.world.drawDebug();

      // draw the level
      this.level.draw(ctx, delta);

      ctx.restore();
    }
  }

  translateBackground(ctx){
    ctx.save();
    var x = this.camera.getViewCenterWorld().x * 5;
    var y = this.camera.getViewCenterWorld().y * 5;
    ctx.translate(-x, y);
    ctx.drawImage(this.backgroundAsset, -200, -1000);
    ctx.restore();
  }

  onDestroy(){
    console.log('destroy world');
    Ludic.input.removeEventListener(this.inputListener);
    AssetManager.destroyAsset(this.levelAsset);
    this.level.destroy();
    this.world.destroy();
  }
}

export default GameScreen;
