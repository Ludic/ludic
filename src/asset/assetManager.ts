// import ImageAsset from './imageAsset'
// import RubeAsset from './rubeAsset'
// import RubeImageAsset from './rubeImageAsset'
import ImageLoader from './imageAssetLoader'
import AudioLoader from './audioAssetLoader'
import Asset from './asset'
import AssetLoader from './assetLoader'

export type AssetsLoadedCallback = (manager: AssetManager)=>void

class AssetManager {
  assets: {[key: string]: Asset}
  loadQueue: Asset[]
  promiseQueue: Promise<any>[]
  loaders: {[key: string]: AssetLoader}
  loading: boolean
  
  private finalPromise: Promise<any>|null
  private onAssetsLoadedCallback: AssetsLoadedCallback

  constructor() {
    this.assets = {}

    this.loadQueue = []
    this.promiseQueue = []
    this.loaders = {}


    this.addLoader('image', ImageLoader)
    this.addLoader('audio', AudioLoader)
  }

  loadResource(name: string, url: string, type: string, options: any, overwrite: boolean){
    let promise: Promise<any> = Promise.resolve()
    // first check if we have the asset
    if(!this.assets[name] || overwrite){
      let asset = this.NewAsset(name, url, type, options)
      if(asset != null){
        this.loadQueue.push(asset)

        this.loading = true

        promise = asset.promise.then(this.onAssetResolve.bind(this), this.onAssetReject.bind(this))
      }
    }
    return promise
  }

  getAsset(name: string){
    return this.assets[name]
  }

  getImage(name: string){
    let asset = this.getAsset(name)

    switch (asset.type) {
      case 'image':
      case 'rubeImage':
        return asset.data
      default:
        return null
    }
  }

  getData(name: string){
    return this.getAsset(name).data
  }

  onAssetResolve(asset: Asset){
    this.assets[asset.name] = asset
    asset.onAssetResolve(this)
    return asset
  }

  onAssetReject(){
    console.log('rejected: ',arguments)
    return Promise.reject({
      reason: 'onAssetReject'
    })
  }

  isLoading(){
    return this.loading
  }

  update(){
    if(this.loadQueue.length==0){
      if(!this.finalPromise){
        this.finalPromise = Promise.all(this.promiseQueue).then(()=>{
          if(this.finalPromise){ // [tries to*] assures that this is not called prematurely if an asset is added late
            this.assetsLoaded.apply(this, arguments)
            this.promiseQueue = [] // reset promise queue to free objects
          }
        })
      }
    } else {
      this.finalPromise = null
      let asset = this.loadQueue.shift()
      if(asset){
        this.promiseQueue.push(asset.promise)
        asset.load()
      }
    }

  }

  assetsLoaded(){
    if(this.onAssetsLoadedCallback){
      this.onAssetsLoadedCallback(this)
    }
    this.loading = false
  }

  setOnAssetsLoadedCallback(callback: AssetsLoadedCallback){
    this.onAssetsLoadedCallback = callback
  }

  NewAsset(name: string, url: string, type: string, options: any): Asset | null {
    type = type || 'image'

    let loader = this.loaders[type]

    if(loader){
      return loader.load(name, url, type, options)
    } else {
      return null
    }
  }

  destroyAsset(asset: Asset){
    delete this.assets[asset.name]
    asset.destroy()
  }

  addLoader(fileTypes: string|string[], loader: AssetLoader){
    if(typeof fileTypes === 'string'){
      fileTypes = [fileTypes]
    }

    fileTypes.forEach((type)=>{
      this.loaders[type] = loader
    })
  }
}

export { AssetManager }
export default new AssetManager()
