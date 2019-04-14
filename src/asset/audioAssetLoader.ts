import AudioAsset from './audioAsset'
import AssetLoader from './assetLoader'

class AudioAssetLoader implements AssetLoader {
  context: AudioContext

  constructor() {
    this.context = new AudioContext()
  }

  load(name: string, url: string, type: string, options: any){
    return new AudioAsset(name, url, type, this.context, options)
  }
}

export default new AudioAssetLoader()
