import BaseSystem from './BaseSystem'

export default class ClearSystem extends BaseSystem {
  constructor(canvas, active, priority){
    super(active, priority);
    this.canvas = canvas;
    this.ctx = canvas.getContext();
  }

  //Overide
  onEntityAdded(manager){
  }

  onEntityRemoved(manager){
  }

  //Overide
  update(delta){
    this.ctx.restore();
    this.ctx.fillStyle = "black";
    this.ctx.clearRect(0, 0, this.canvas.width(), this.canvas.height() );
    this.ctx.fillRect(0, 0, this.canvas.width(), this.canvas.height() );
    this.ctx.save();
  }
};
