import Box2D from 'src/components/box2d/box2d';

class DebugDraw {
  constructor(canvas) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d');
    this.debugDraw = this.getCanvasDebugDraw();

    _using(this,this.debugDraw);
  }

  initBits(){
    this.e_shapeBit = 0x0001;
    this.e_jointBit = 0x0002;
    this.e_aabbBit = 0x0004;
    this.e_pairBit = 0x0008;
    this.e_centerOfMassBit = 0x0010;
  }

  drawAxes(ctx) {
      ctx.strokeStyle = 'rgb(192,0,0)';
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(1, 0);
      ctx.stroke();
      ctx.strokeStyle = 'rgb(0,192,0)';
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, 1);
      ctx.stroke();
  }

  setColorFromDebugDrawCallback(color) {
      var col = Box2D.wrapPointer(color, Box2D.b2Color);
      var red = (col.get_r() * 255)|0;
      var green = (col.get_g() * 255)|0;
      var blue = (col.get_b() * 255)|0;
      var colStr = red+","+green+","+blue;
      this.context.fillStyle = "rgba("+colStr+",0.5)";
      this.context.strokeStyle = "rgb("+colStr+")";
  }

  drawSegment(vert1, vert2) {
      var vert1V = Box2D.wrapPointer(vert1, Box2D.b2Vec2);
      var vert2V = Box2D.wrapPointer(vert2, Box2D.b2Vec2);
      this.context.beginPath();
      this.context.moveTo(vert1V.get_x(),vert1V.get_y());
      this.context.lineTo(vert2V.get_x(),vert2V.get_y());
      this.context.stroke();
  }

  drawPolygon(vertices, vertexCount, fill) {
      this.context.beginPath();
      for(var tmpI=0;tmpI<vertexCount;tmpI++) {
          var vert = Box2D.wrapPointer(vertices+(tmpI*8), Box2D.b2Vec2);
          if ( tmpI == 0 )
              this.context.moveTo(vert.get_x(),vert.get_y());
          else
              this.context.lineTo(vert.get_x(),vert.get_y());
      }
      this.context.closePath();
      if (fill)
          this.context.fill();
      this.context.stroke();
  }

  drawCircle(center, radius, axis, fill) {
      var centerV = Box2D.wrapPointer(center, Box2D.b2Vec2);
      var axisV = Box2D.wrapPointer(axis, Box2D.b2Vec2);

      this.context.beginPath();
      this.context.arc(centerV.get_x(),centerV.get_y(), radius, 0, 2 * Math.PI, false);
      if (fill)
          this.context.fill();
      this.context.stroke();

      if (fill) {
          //render axis marker
          var vert2V = copyVec2(centerV);
          vert2V.op_add( scaledVec2(axisV, radius) );
          this.context.beginPath();
          this.context.moveTo(centerV.get_x(),centerV.get_y());
          this.context.lineTo(vert2V.get_x(),vert2V.get_y());
          this.context.stroke();
      }
  }

  drawTransform(transform) {
      var trans = Box2D.wrapPointer(transform,Box2D.b2Transform);
      var pos = trans.get_p();
      var rot = trans.get_q();

      this.context.save();
      this.context.translate(pos.get_x(), pos.get_y());
      this.context.scale(0.5,0.5);
      this.context.rotate(rot.GetAngle());
      this.context.lineWidth *= 2;
      this.drawAxes(context);
      this.context.restore();
  }

  getCanvasDebugDraw() {
      var debugDraw = new Box2D.JSDraw();

      debugDraw.DrawSegment = function(vert1, vert2, color) {
          this.setColorFromDebugDrawCallback(color);
          this.drawSegment(vert1, vert2);
      }.bind(this);

      debugDraw.DrawPolygon = function(vertices, vertexCount, color) {
          this.setColorFromDebugDrawCallback(color);
          this.drawPolygon(vertices, vertexCount, false);
      }.bind(this);

      debugDraw.DrawSolidPolygon = function(vertices, vertexCount, color) {
          this.setColorFromDebugDrawCallback(color);
          this.drawPolygon(vertices, vertexCount, true);
      }.bind(this);

      debugDraw.DrawCircle = function(center, radius, color) {
          this.setColorFromDebugDrawCallback(color);
          var dummyAxis = Box2D.b2Vec2(0,0);
          this.drawCircle(center, radius, dummyAxis, false);
      }.bind(this);

      debugDraw.DrawSolidCircle = function(center, radius, axis, color) {
          this.setColorFromDebugDrawCallback(color);
          this.drawCircle(center, radius, axis, true);
      }.bind(this);

      debugDraw.DrawTransform = function(transform) {
          this.drawTransform(transform);
      }.bind(this);

      return debugDraw;
  }
  // TODO: implement better bit flag management
  // setShapeBit(bit){
  //   if(bit){
  //
  //   }
  // }

}

export default DebugDraw;
