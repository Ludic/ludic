class RubeScene {
  constructor(sceneJson, world) {
    this._json = sceneJson;
    this.world = world;
  }

  destroy(){
    // this.world = null;
    // this.bodies = null;
    // this.joints = null;
    // this.objects = null;
    for(let key in this){
      this[key] = null;
    }
  }

  finish(opts){
    this.data = opts;
    this._isFinished = true;
  }
}

export default RubeScene;
