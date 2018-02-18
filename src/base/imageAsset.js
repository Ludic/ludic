import Asset from './asset'

class ImageAsset extends Asset {
  constructor(name, url, type, options) {
    super(name, url, type || 'image', options)

    this.data = new Image()
    this.promise = new Promise((resolve,reject)=>{
      this.data.onload = this.onload(resolve,reject)
    })

  }

  load(){
    this.data.src = this.url
  }

  onload(resolve,reject){
    return () => {
      resolve(this)
    }
  }

  destroy(){

  }
}

export default ImageAsset
