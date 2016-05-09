import Screen from 'src/components/screen/screen';
import AssetManager from 'src/components/base/assetManager';
import World from 'src/components/world/world';
import App from 'src/components/app/app';

class LoadingScreen extends Screen {
  constructor(camera, options) {
    super(camera, options);

    if(this.options.delay !== undefined && this.options.delay !== null){
      this._usesDelay = true;
    }

    this._loadingArray = ['Loading'];
    this._loadingCount = 0;
    this._loadingFreq = this.options.loadingFrequency || 10;
    this._loadingFreqMax = this._loadingFreq*4;


    this._timeout = 0;

    this.world = new World();

    camera.setViewCenterWorld(new App.b2d.b2Vec2(10,10),true);

    //Parse level from options (passed all the way from Previous Door contact listener);
    //Just parse out and load the level for now
    var level = "level_" + options.level.split(".")[0];
    console.log(level);

    // load some assets
    var options = {
      world: this.world,
      level: options.level
    }
    AssetManager.loadResource('level','src/rubeScenes/'+ level +'.json', 'rube', options);
    AssetManager.loadResource('background1','src/images/background1.png');
    AssetManager.loadResource('ground1','src/images/ground/ground1.png');
    AssetManager.loadResource('playerSpriteSheet','src/images/player.png');
    AssetManager.loadResource('megaman','src/images/megaman3.png');
    AssetManager.setOnAssetsLoadedCallback(this.onAssetsLoaded.bind(this));
  }

  draw(ctx, delta){
    ctx.save();

    this.camera.update(ctx,delta);

    ctx.scale(1,-1);
    ctx.fillStyle = 'green';
    ctx.font = "5px serif";
    var text = ctx.measureText('Loading.');
    ctx.fillText(this._loadingArray.join(''), -(text.width/2), 0);

    AssetManager.step();

    ctx.restore();


    if(this._usesDelay){
      this._timeout += delta;
      if(this._timeout >= this.options.delay){
        this._delayDone = true;
        this._evalDone();
      }
    }

    this._loadingCount++;
    if(this._loadingCount%this._loadingFreq===0){
      this._loadingArray.push('.');
    }
    if(this._loadingCount%this._loadingFreqMax===0){
      this._loadingArray.splice(1,999);
    }


  }

  onAssetsLoaded(){
    this._assetsLoaded = true;
    this._evalDone();
  }

  _evalDone(){
    if(this._usesDelay){
      if(this._assetsLoaded && this._delayDone){
        this.finish();
      }
    } else if(this._assetsLoaded){
      this.finish();
    }
  }
}

export default LoadingScreen;
