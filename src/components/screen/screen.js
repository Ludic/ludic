export default class Screen {
  constructor(camera, options) {
    this.camera = camera;
    this.options = options || {};
  }

  _step(ctx, delta){
    if(!this._isFinished){
      this.update.apply(this,arguments);
    }
  }

  update(ctx, delta){
  }

  finish(data){
    if(!this._isFinished){
      this.onDestroy();
      this._finalData = data || {};
      this._isFinished = true;
    }
  }

  onDestroy(){
  }
}
