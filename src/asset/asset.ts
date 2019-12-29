import { AssetManager } from './assetManager';

export type OnLoadResolve = (value?: Asset) => void
export type OnLoadReject = (reason?: any) => void

abstract class Asset {

  name: string
  url: string
  type: string
  options: object
  data: any
  promise: Promise<any>
  
  constructor(name: string, url: string, type: string, options: object = {}) {
    this.name = name
    this.url = url
    this.type = type
    this.options = options
  }

  /**
   * Initializes the loading of this assets data.
   * ie. An ImageAsset would set the image src to kick of the loading.
   */
  load(){
  }

  /**
   * Used by promise to resolve the asset's data after loading is complete
   * 
   * @param resolve promise resolve
   * @param reject promise reject
   */
  onload(resolve: OnLoadResolve, reject: OnLoadReject): ()=>void {
    return () => {
      resolve(this)
    }
  }

  onAssetResolve(manager: AssetManager){
  }

  onAssetReject(manager: AssetManager){

  }

  destroy(){
    this.data = null
  }
}

export default Asset
