import Asset, { OnLoadResolve, OnLoadReject } from './asset'

class AudioAsset extends Asset {
  context: AudioContext
  request: XMLHttpRequest

  constructor(name: string, url: string, type: string, options: any) {
    super(name, url, type || 'audio', options)
    this.context = new AudioContext()
    this.promise = new Promise((resolve,reject)=>{
      this.request = new XMLHttpRequest()
      this.request.open("GET", this.url, true)
      this.request.responseType = "arraybuffer"
      this.request.onreadystatechange = this.onload(resolve, reject)
    })
  }

  load(){
    this.request.send()
  }

  onload(resolve: OnLoadResolve, reject: OnLoadReject){
    return () => {
      if (this.request.readyState == XMLHttpRequest.DONE) {
        if(this.request.status == 200){
          this.context.decodeAudioData(
            this.request.response,
            (buffer) => {
              if (!buffer) {
                console.error('AudioAsset: Error decoding file data: ' + this.url)
                reject(this)
                return
              }
              this.data = buffer
              resolve(this)
            }, (error) => {
              console.error('AudioAsset: decodeAudioData error', error)
              reject(this)
            }
          )
        } else {
          console.error('AudioAsset: Request failure: ', this.request.status, this.request.statusText, this.request)
        }
      }
    }
  }
}

export default AudioAsset
