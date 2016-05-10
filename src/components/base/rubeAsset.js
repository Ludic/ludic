import Asset from './asset';
import RubeLoader from '../rube/RubeLoader';

class RubeAsset extends Asset {
  constructor(name, url, type, options) {
    super(name,url,type,options);
    this.world = this.options.world;
    if(!this.world){
      console.warn('RubeAsset has no world.', this);
    }

    this._promises = [];
    this._loadJSON();
  }

  _loadRube(){

  }

  _loadJSON() {
    this.promise = new Promise((resolve,reject)=>{
      this._resolve = resolve;
      this._reject = reject;
      this.xobj = new XMLHttpRequest();
      this.xobj.overrideMimeType("application/json");
      this.xobj.open('GET', this.url, true);
      this.xobj.onreadystatechange = this.onload(resolve,reject);
    });
  }

  load(){
    this.xobj.send(null);
  }

  onload(resolve,reject){
    return () => {
      if (this.xobj.readyState == 4 && this.xobj.status == "200") {
        var sceneJson = JSON.parse(this.xobj.responseText);
        this.data = RubeLoader.loadSceneIntoWorld(sceneJson, this.world);
        if(this.data._success){
          resolve(this);
        } else {
          reject(this);
        }
      }
    };
  }

  onAssetResolve(am){
    if(this.data._json.image){
      this.loadImages(this.data._json.image, am);
    }
  }

  loadImages(images, am){
    var img;
    for(var i=0; i<images.length; i++){
      img = images[i];
      am.loadResource(img.name,img.file,'rubeImage',{img:img,scene:this.data});
    }
  }

  destroy(){
    this.world = null;
    this.promise = null;
    this._promises = null;
    this.xobj = null;
    this.data.destroy();
    this.data = null;
    this.options = null;
  }
}

export default RubeAsset;
