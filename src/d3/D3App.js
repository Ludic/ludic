import BaseApp from 'src/components/app/BaseApp';
import LoadingScreen from 'src/d3/LoadingScreen';
import DebugDraw from 'src/components/box2d/debugDraw';
import GameScreen from 'src/d3/screens/GameScreen';
import App from 'src/components/app/app';

class D3App extends BaseApp {
  constructor() {
    super();

    this.debugDraw = DebugDraw.newDebugger(this.canvas);
    this.setDebugDraw(this.debugDraw);
    this.debugDraw.SetFlags(DebugDraw.e_shapeBit);

    this.resetCount = 0;

    this.camera.setViewCenterWorld(new App.b2d.b2Vec2(0,0), true);

    this.screenListener = this.screenManager.newListener(true);

    this.util.setParam('GroundEntity', 'disableTriangles', true);


    // TODO: implement some sort of level management (screen);
    this.currentLevel = "1.1.1";

    this.screenListener.onScreenFinished = (screen, manager, data)=>{
      if(screen === this.loadingScreen){
        console.log('loading screen is done:',this.resetCount++);
        this.doneLoading = true;
        this.gameScreen = new GameScreen(this.camera, screen.world);
        this.screenManager.addScreen(this.gameScreen, true);
      } else if(screen === this.gameScreen && this.doneLoading){
        if(data.reset){
          this.startLoading(true);
        } else if(data.done) {
          this.currentLevel = data.nextLevel;
          // console.log('idk what you want to do here: ', this.currentLevel);

          this.startLoading(true, {level:this.currentLevel});
        }
      }
    };




    this.startLoading(false, {level:this.currentLevel});
  }

  startLoading(reset, options){
    options = options || {};
    this.doneLoading = false;
    if(!options.level){
      options.level = this.currentLevel;
    }
    this.loadingScreen = new LoadingScreen(this.camera,options);
    this.screenManager.addScreen(this.loadingScreen,reset);
  }
}


export default D3App;
