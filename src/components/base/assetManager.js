import ImageAsset from 'src/components/base/imageAsset';
import RubeAsset from 'src/components/base/rubeAsset';
import RubeImageAsset from 'src/components/base/rubeImageAsset';

class AssetManager {
  constructor() {
    this.assets = {};

    this.loadQueue = [];
    this.promiseQueue = [];
  }

  loadResource(name, url, type, options, overwrite){
    // first check if we have the asset
    if(!this.assets[name] || overwrite){
      var asset = this.NewAsset(name, url, type, options);
      if(asset){
        this.loadQueue.push(asset);

        this.loading = true;

        asset.promise.then(this.onAssetResolve.bind(this), this.onAssetReject.bind(this));
      }
    }

  }

  getAsset(name){
    return this.assets[name];
  }

  getImage(name){
    var asset = this.getAsset(name);

    switch (asset.type) {
      case 'image':
      case 'rubeImage':
        return asset.data;
        break;
      default:
        return null;
    }
  }

  getData(name){
    return this.getAsset(name).data;
  }

  onAssetResolve(asset){
    this.assets[asset.name] = asset;
    asset.onAssetResolve(this);
  }

  onAssetReject(){
    console.log('rejected: ',arguments);
  }

  isLoading(){
    return this.loading;
  }

  step(){

    if(this.loadQueue.length==0){
      if(!this.finalPromise){
        this.finalPromise = Promise.all(this.promiseQueue).then(()=>{
          if(this.finalPromise){ // [tries to*] assures that this is not called prematurely if an asset is added late
            this.assetsLoaded.apply(this, arguments);
            this.promiseQueue = []; // reset promise queue to free objects;
          }
        });
      }
    } else {
      this.finalPromise = null;
      var asset = this.loadQueue.shift();
      this.promiseQueue.push(asset.promise);
      asset.load();
    }

  }

  assetsLoaded(){
    // console.log('all assets loaded: ',arguments);
    if(this.onAssetsLoadedCallback){
      this.onAssetsLoadedCallback(this);
    }
    this.loading = false;
  }

  setOnAssetsLoadedCallback(callback){
    this.onAssetsLoadedCallback = callback;
  }

  NewAsset(name, url, type, options){
    type = type || 'image';
    switch (type) {
      case 'image':
        return new ImageAsset(name, url, type, options);
        break;
      case 'rube':
        return new RubeAsset(name, url, type, options);
        break;
      case 'rubeImage':
        return new RubeImageAsset(name, url, type, options);
        break;
      default:
        return null;
    }
  }

  destroyAsset(asset){
    delete this.assets[asset.name];
    asset.destroy();
  }
}

export default new AssetManager();
