// import ImageAsset from './imageAsset'
// import RubeAsset from './rubeAsset'
// import RubeImageAsset from './rubeImageAsset'
import ImageLoader from './imageAssetLoader'
import AudioLoader from './audioAssetLoader'

class AssetManager {
  constructor() {
    this.assets = {}

    this.loadQueue = []
    this.promiseQueue = []
    this.loaders = {}

    this.addLoader('image', ImageLoader)
    this.addLoader('audio', AudioLoader)
  }

  loadResource(name, url, type, options, overwrite){
    let promise = null
    // first check if we have the asset
    if(!this.assets[name] || overwrite){
      let asset = this.NewAsset(name, url, type, options)
      if(asset){
        this.loadQueue.push(asset)

        this.loading = true

        promise = asset.promise.then(this.onAssetResolve.bind(this), this.onAssetReject.bind(this))
      }
    }
    return promise
  }

  getAsset(name){
    return this.assets[name]
  }

  getImage(name){
    let asset = this.getAsset(name)

    switch (asset.type) {
      case 'image':
      case 'rubeImage':
        return asset.data
        break
      default:
        return null
    }
  }

  getData(name){
    return this.getAsset(name).data
  }

  onAssetResolve(asset){
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

  step(){
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
      this.promiseQueue.push(asset.promise)
      asset.load()
    }

  }

  assetsLoaded(){
    if(this.onAssetsLoadedCallback){
      this.onAssetsLoadedCallback(this)
    }
    this.loading = false
  }

  setOnAssetsLoadedCallback(callback){
    this.onAssetsLoadedCallback = callback
  }

  NewAsset(name, url, type, options){
    type = type || 'image'

    let loader = this.loaders[type]

    if(loader){
      return loader.load(name, url, type, options)
    } else {
      return null
    }
  }

  destroyAsset(asset){
    delete this.assets[asset.name]
    asset.destroy()
  }

  addLoader(fileTypes, loader){
    if(typeof fileTypes === 'string'){
      fileTypes = [fileTypes]
    }

    fileTypes.forEach((type)=>{
      this.loaders[type] = loader
    })
  }
}

export default new AssetManager()
