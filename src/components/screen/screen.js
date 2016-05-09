


class Screen {
  constructor(camera, options) {
    this.camera = camera;
    this.options = options || {};
  }

  _draw(ctx, delta){
    if(!this._isFinished){
      this.draw.apply(this,arguments);
    }
  }

  draw(ctx, delta){
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

export default Screen;
