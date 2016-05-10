import PolygonEntity from '../../components/engine/PolygonEntity';
import Util from '../../components/util/util';

class GroundEntity extends PolygonEntity {
  constructor(body, color, scene, world) {
    var options = {
      scene: scene
    };
    super(body, null, options);
    this.color = color;
    this.world = world;
    this.generateBodyImage();
    this.initContactListeners();

    this.config = Util.readConfig('GroundEntity');

    this.zIndex = 1;
  }

  initContactListeners(){
    this.contactListener = this.world.newBodyContactListener(this.body, this.onContact.bind(this));
    this.world.registerBodyContactListener(this.contactListener);
  }

  onContact(begin, contactObject){
    if(contactObject.entityData){
      //If It was hit by an object that inherited from the Bullet Class
      if(Object.getPrototypeOf(contactObject.entityData.constructor).name === "Bullet"){
        console.log("Fuck, I was shot");

        //If the object is Fazeable
        console.log(this);
        this.dimension = this.dimension.scene.dimensions[0];
      }

    }
  }



  draw(ctx, delta, opacity) {
    var pos = this.body.GetPosition();


    ctx.save();
    this.applyRotation(ctx);

    ctx.translate(pos.get_x(), pos.get_y());
    ctx.save();
    ctx.fillStyle = Util.convertHex(this.color, this.calculateOpacity());
    this.drawFixtures(ctx, delta, () => {
      if(this.active){
        ctx.shadowColor = 'black';
        ctx.shadowBlur = 20;
        ctx.shadowOffsetX = 10;
        ctx.shadowOffsetY = 10;
      }

      ctx.fill();
      ctx.strokeStyle = this.color;
      ctx.lineWidth = 0.04;
      ctx.lineJoin = 'bevel';
      ctx.lineCap = 'round';
      ctx.closePath();
      ctx.stroke();
    });
    ctx.restore();

    if(!this.config.disableTriangles){
      this.imageTriangles.forEach(function(poly) {
        ctx.fillStyle = Util.convertHex(poly[0], this.calculateOpacity());
        ctx.strokeStyle = poly[0];
        ctx.lineWidth = .05;
        ctx.beginPath();
        ctx.moveTo.apply(ctx, poly[1][0]);
        ctx.lineTo.apply(ctx, poly[1][1]);
        ctx.lineTo.apply(ctx, poly[1][2]);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'bevel';
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }.bind(this));
    }


    ctx.restore();
  }

  generateBodyImage() {
    this.area = this.calculateAreaOfPolygon(this.body);
    this.maxX = this.calculateMaxXOfPolygon(this.body.fixtures);
    this.minX = this.calculateMinXOfPolygon(this.body.fixtures);
    this.maxY = this.calculateMaxYOfPolygon(this.body.fixtures);
    this.minY = this.calculateMinYOfPolygon(this.body.fixtures);

    //Generate Verts for Delaunay Algo (body verts and random verts)
    this.generateImageVerts();

    //Apply Delaunay to Verts
    this.imageDelaunay = Delaunay(this.imageVerts);

    //Generate Triangles from Delaunay indices
    this.generateImageTriangles();

  }

  generateImageVerts() {
    this.imageVerts = [];
    for (var i = 0; i < this.body.fixtures.length; i++) {
      var verts = this.body.fixtures[i].verts;
      if (verts && verts.length > 0) {
        for (var i = 0; i < verts.length; i++) {
          this.imageVerts.push([verts[i].x, verts[i].y]);
        }
      }
    }
    this.imageVerts = this.imageVerts.concat(this.generateRandomVerts(this.minX, this.maxX, this.minY, this.maxY, Math.floor(this.area / 3)));
//    this.imageVerts = this.imageVerts.concat(this.generateRandomVerts(this.minX, this.maxX, this.minY, this.maxY, 2));
  }

  generateImageTriangles() {
    var geom_indices = this.imageDelaunay;
    this.imageTriangles = []
    var lookup_point = function(i) {
      return this.imageVerts[i];
    }.bind(this);
    for (var i = 0; i < geom_indices.length; i += 3) {
      var vertices = [geom_indices[i], geom_indices[i + 1], geom_indices[i + 2]].map(lookup_point);
      //var centroid = _centroid(vertices);
      //var color = gradient(norm_x(centroid.x), norm_y(centroid.y)).hex();
      var triangleColor = Util.generateGradient(this.color.substr(1), "ffffff", (1 / (geom_indices.length / i)));
      this.imageTriangles.push([this.color, vertices]);
    }
  }

  activate() {
    this.active = true;
    this.zIndex = 11;
    this.body.SetActive(true);
  }

  deactivate() {
    this.active = false;
    this.zIndex = 1;
    this.body.SetActive(false);
  }
}

export default GroundEntity;
