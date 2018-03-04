import AudioAsset from './audioAsset'

class AudioAssetLoader {
  constructor() {
    this.context = new AudioContext()
  }

  load(name, url, type, options){
    return new AudioAsset(name, url, type, this.context, options)
  }
}

export default new AudioAssetLoader()
