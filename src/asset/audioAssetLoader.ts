import AudioAsset from './audioAsset'
import AssetLoader from './assetLoader'

class AudioAssetLoader implements AssetLoader {

  load(name: string, url: string, type: string, options: any){
    return new AudioAsset(name, url, type, options)
  }
}

export default new AudioAssetLoader()
