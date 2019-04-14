import ImageAsset from './imageAsset'
import AssetLoader from './assetLoader'

class ImageAssetLoader implements AssetLoader {

  load(name: string, url: string, type: string, options: any): ImageAsset {
    return new ImageAsset(name, url, type, options)
  }
}

export default new ImageAssetLoader()
