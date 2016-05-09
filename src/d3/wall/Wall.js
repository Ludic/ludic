import PolygonEntity from 'src/components/engine/PolygonEntity';

class Wall extends PolygonEntity {
  constructor(body, image, options){
    super(body, image, options);
    this.color = "34495E";

  }

  draw(ctx,delta){

    var pos = this.body.GetPosition();

    ctx.save();
    ctx.translate(pos.get_x(),pos.get_y());
    ctx.fillStyle = '#' + this.color;
    this.drawVerts(ctx);
    ctx.fill();
    ctx.restore();
  }
}

export default Wall;
