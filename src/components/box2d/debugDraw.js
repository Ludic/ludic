import Box2D from './box2d';
import Util from '../util/util';

class DebugDraw {
  constructor(canvas) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d');
    this.debugDraw = this.getCanvasDebugDraw();
    // console.log(Util.using);
    Util.using(this,this.debugDraw,true);
  }

  static newDebugger(canvas) {
    var d = new DebugDraw(canvas);
    return d.getCanvasDebugDraw();
  }

  initBits(){
    this.e_shapeBit = 0x0001;
    this.e_jointBit = 0x0002;
    this.e_aabbBit = 0x0004;
    this.e_pairBit = 0x0008;
    this.e_centerOfMassBit = 0x0010;
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
          var vert2V = Util.copyVec2(centerV);
          vert2V.op_add( Util.scaledVec2(axisV, radius) );
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

  // solid polygon: rgba(127, 127, 76, 0.498039215686275)
  // solid polygon: rgba(127, 127, 76, 0.498039215686275)
  // solid circle: rgba(229, 178, 178, 0.498039215686275)

  saveContext(type){
    var ctx = this.context;
    this.obj = this.obj || {};

    if(!this.obj.hasOwnProperty(ctx.fillStyle)){
      var arr = this.obj[ctx.fillStyle] = this.obj[ctx.fillStyle] || [];
      arr.push(type);

      // console.log(this.obj);
    }

  }

  getCanvasDebugDraw() {
      var debugDraw = new Box2D.JSDraw();

      var self = this;
      debugDraw.DrawSegment = function(vert1, vert2, color) {
          self.setColorFromDebugDrawCallback(color);
          self.saveContext('draw segment');
          self.drawSegment(vert1, vert2);
      };

      debugDraw.DrawPolygon = function(vertices, vertexCount, color) {
          self.setColorFromDebugDrawCallback(color);
          self.saveContext('draw polygon');
          self.drawPolygon(vertices, vertexCount, false);
      };

      debugDraw.DrawSolidPolygon = function(vertices, vertexCount, color) {
          self.setColorFromDebugDrawCallback(color);
          self.saveContext('draw solid polygon');
          self.drawPolygon(vertices, vertexCount, true);
      };

      debugDraw.DrawCircle = function(center, radius, color) {
          self.setColorFromDebugDrawCallback(color);
          self.saveContext('draw circle');
          var dummyAxis = Box2D.b2Vec2(0,0);
          self.drawCircle(center, radius, dummyAxis, false);
      };

      debugDraw.DrawSolidCircle = function(center, radius, axis, color) {
          self.setColorFromDebugDrawCallback(color);
          self.saveContext('draw solid circle');
          self.drawCircle(center, radius, axis, true);
      };

      debugDraw.DrawTransform = function(transform) {
          self.drawTransform(transform);
      };

      return debugDraw;
  }

  getDebugDraw(){
    return this.debugDraw;
  }

  // TODO: implement better bit flag management
  // setShapeBit(bit){
  //   if(bit){
  //
  //   }
  // }

  destroy(){
    this.debugDraw = null;
  }
}

DebugDraw.e_shapeBit = 0x0001;
DebugDraw.e_jointBit = 0x0002;
DebugDraw.e_aabbBit = 0x0004;
DebugDraw.e_pairBit = 0x0008;
DebugDraw.e_centerOfMassBit = 0x0010;

export default DebugDraw;
