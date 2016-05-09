import PolygonEntity from 'src/components/engine/PolygonEntity';
import Util from 'src/components/util/util';

class Door extends PolygonEntity {
  constructor(body, color, scene, world) {
    var options = {
      scene: scene
    };
    super(body, null, options);
    this.color = "#ffffff";
    this.world = world;
    this.initContactListeners();
    this.zIndex = 2;
  }

  initContactListeners(){
    this.contactListener = this.world.newBodyContactListener(this.body, this.onContact.bind(this));
    this.world.registerBodyContactListener(this.contactListener);
  }

  onContact(begin, contactObject){
    if(contactObject && contactObject.entityData && contactObject.entityData.constructor.name === "Player"){
      this.needsDestroy = true;
      this.scene.finish({nextLevel: this.body.props.Destination.value});
    }
  }

  draw(ctx, delta, opacity){
    var pos = this.body.GetPosition();

    ctx.save();

    this.applyRotation(ctx);

    ctx.translate(pos.get_x(),pos.get_y());
    ctx.fillStyle = Util.convertHex(this.color, this.calculateOpacity());
    this.drawFixtures(ctx, delta,()=>{
      ctx.fill();
      ctx.strokeStyle = this.color;
      ctx.lineWidth = 0.04;
      ctx.lineJoin = 'bevel';
      ctx.lineCap = 'round';
      ctx.closePath();
      ctx.stroke();
    });
    ctx.restore();
  }

  activate(){
    this.active = true;
    this.body.SetActive(true);
  }

  deactivate(){
    this.active = false;
    this.body.SetActive(false);
  }
}

export default Door;
