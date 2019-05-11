import ScreenManager from './screenManager'

export class Screen {
  $id!: number
  $manager!: ScreenManager

  options: any

  _isFinished: boolean
  _finalData: any

  constructor(options: any = {}) {
    this.options = options
  }

  // _step(delta,...rest){
  //   if(!this._isFinished){
  //     this.update.apply(this,arguments)
  //   }
  // }

  // override
  update(delta: any, ...args: any[]){}

  finish(data: any){
    if(!this._isFinished){
      this.onDestroy()
      this._finalData = data || {}
      this._isFinished = true
    }
  }

  onDestroy(){}
  /**
   * 
   * @param manager ScreenManager that called this.
   * @param finalData the final data from the previous screen
   */
  onAddedToManager(manager: ScreenManager, finalData?: any){}
  onRemovedFromManager(manager: ScreenManager){}

  // $mapMethods(component, mapping){
  //   for(let key in mapping){
  //     component.$on[mapping[key]] = this[key].bind(this)
  //   }
  //   return component
  // }
}

export default Screen