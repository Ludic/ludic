import Asset from './asset'

class AudioAsset extends Asset {
  constructor(name, url, type, context, options) {
    super(name, url, type || 'audio', options)
    this.context = context
    this.data = new Array()
    this.promise = new Promise((resolve,reject)=>{
      this.data.onload = this.onload(resolve,reject)
    })
  }

  load(){
    let request = new XMLHttpRequest()
    request.open("GET", this.url, true)
    request.responseType = "arraybuffer"

    request.onload = () => {
      this.context.decodeAudioData(
        request.response,
        buffer =>  {
          if (!buffer) {
            console.error('AudioAsset: Error decoding file data: ' + this.url)
            return
          }
          this.data = buffer
          this.onload()
        }, error => {
          console.error('AudioAsset: decodeAudioData error', error)
        }
      )
    }

    request.onerror = () => {
      console.error('AudioAsset: XHR error')
    }

    request.send()
  }

  onload(resolve,reject){
    return () => {
      resolve(this)
    }
  }

  destroy(){

  }
}

export default AudioAsset
