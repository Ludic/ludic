let axesLength = 100;

export default class HUD {
  constructor(camera) {
    this.camera = camera;
    this.ctx = this.camera.context;

    this.$refs = {};
    this.elements = [];
  }

  update(delta){
    this.ctx.save();
    this.camera.resetTransform(this.ctx);

    // draw the axis for the hud system
    this.drawAxes(delta);

    for(let el of this.elements){
      el.render(delta, this.ctx);
    }

    this.ctx.restore();
  }

  drawAxes(delta){
    this.ctx.save();
    // this is to allow the axes to be seen
    this.ctx.translate(this.ctx.lineWidth,this.ctx.lineWidth)
    this.ctx.strokeStyle = 'rgb(192,0,0)';
    this.ctx.beginPath();
    this.ctx.moveTo(0, 0);
    this.ctx.lineTo(axesLength, 0);
    this.ctx.stroke();
    this.ctx.strokeStyle = 'rgb(0,192,0)';
    this.ctx.beginPath();
    this.ctx.moveTo(0, 0);
    this.ctx.lineTo(0, axesLength);
    this.ctx.stroke();
    this.ctx.restore();
  }

  addElement(element, ref){
    this.elements.push(element);
    if(ref){
      this.$refs[ref] = element;
    }
    return this;
  }
}
