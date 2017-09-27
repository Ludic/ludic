
export default class Screen {
  constructor(options) {
    this.options = options || {}
  }

  _step(delta,...rest){
    if(!this._isFinished){
      this.update.apply(this,arguments)
    }
  }

  // override
  update(delta,...rest){}

  finish(data){
    if(!this._isFinished){
      this.onDestroy()
      this._finalData = data || {}
      this._isFinished = true
    }
  }

  onDestroy(){}
  onAddedToManager(manager){}
  onRemovedFromManager(manager){}
}
