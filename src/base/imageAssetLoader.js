import ImageAsset from './imageAsset'

class ImageAssetLoader {
  constructor() {

  }

  load(name, url, type, options){
    return new ImageAsset(name, url, type, options)
  }
}

export default new ImageAssetLoader()
