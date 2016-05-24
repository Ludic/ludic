import BaseSystem from './BaseSystem'

export default class ClearSystem extends BaseSystem {
  constructor(canvas, color = "black", active = true, priority = -1){
    super(active, priority);
    this.color = color;
    this.canvas = canvas;
    this.ctx = canvas.getContext();
  }

  //Overide
  onEntityAdded(manager){}

  //Overide
  onEntityRemoved(manager){}

  //Overide
  update(delta){
    this.ctx.restore();
    this.ctx.fillStyle = this.color;
    this.ctx.clearRect(0, 0, this.canvas.width(), this.canvas.height());
    this.ctx.fillRect(0, 0, this.canvas.width(), this.canvas.height());
    this.ctx.save();
  }
};
