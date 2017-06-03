

class Asset {
  constructor(name, url, type, options) {
    this.name = name;
    this.url = url;
    this.type = type;
    this.options = options || {};

  }

  load(){
  }

  onload(resolve,reject){
    return () => {
      resolve(this);
    };
  }

  onAssetResolve(am){
  }

  onAssetReject(am){

  }

  destroy(){
    this.name = null;
    this.url = null;
    this.type = null;
    this.options = null;
    this.data = null;
  }
}

export default Asset;
