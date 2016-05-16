expart default class Screen {
  constructor(camera, options) {
    this.camera = camera;
    this.options = options || {};
  }

  _step(ctx, delta){
    if(!this._isFinished){
      this.step.apply(this,arguments);
    }
  }

  step(ctx, delta){
    this.camera.update(ctx,delta);
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
