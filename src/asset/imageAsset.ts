import Asset, { OnLoadResolve, OnLoadReject } from './asset'

class ImageAsset extends Asset {

  constructor(name: string, url: string, type: string, options: any) {
    super(name, url, type || 'image', options)

    this.data = new Image()
    this.promise = new Promise((resolve,reject)=>{
      this.data.onload = this.onload(resolve,reject)
    })
  }

  load(){
    this.data.src = this.url
  }
}

export default ImageAsset
