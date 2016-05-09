import Asset from 'src/components/base/asset';


// TODO: get this from some config
var baseUrl = 'src';

class RubeImageAsset extends Asset {
  constructor(name, url, type, options) {
    super(name, url, type || 'image', options);

    this.img = options.img;
    this.scene = options.scene;

    // do some string manipulation on url
    this.url = this.fixRubeUrl(this.url);

    this.data = new Image();
    this.promise = new Promise((resolve,reject)=>{
      this.data.onload = this.onload(resolve,reject);
    });

  }

  load(){
    // this.calculateSize();
    this.data.src = this.url;
  }

  onload(resolve,reject){
    return () => {
      resolve(this);
    };
  }

  onAssetResolve(am){
    this.scene.bodies[this.img.body].imageInfo = this.img;
  }

  fixRubeUrl(url){
    var components = url.split('/');
    components.splice(0,1,baseUrl);
    url = components.join('/');
    this.options.path = url;
    return url;
  }

  calculateSize(){
    // var verts = this.img.glVertexPointer;
    var verts = [];
    for(var i=0; i<this.img.corners.x.length; i++){
      var p = {
        x:this.img.corners.x[i],
        y:this.img.corners.y[i]
      };
      verts.push(p);
    }
    this.img.verts = verts;

    var a = verts[1].x - verts[0].x;
    var b = verts[1].y - verts[0].y;

    // console.log(a,b);
    // var width = Math.sqrt( Math.pow() );
  }

  destroy(){
    super.destroy();
    this.img = null;
    this.scene = null;
  }
}

export default RubeImageAsset;
