
class WorldConfig {

  static PTM : 32;

  canvasOffset : {
    x: 0,
    y: 0
  }

  mousePosPixel : {
    x: 0,
    y: 0
  }

  constructor(canvas) {
    this.canvas = canvas;
  }

  getWorldPointFromPixelPoint(pixelPoint) {
    return {
      x: (pixelPoint.x - this.canvasOffset.x)/PTM,
      y: (pixelPoint.y - (canvas.height - canvasOffset.y))/PTM
    };
  }

  updateMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    this.mousePosPixel = {
      x: evt.clientX - rect.left,
      y: canvas.height - (evt.clientY - rect.top)
    };
    this.mousePosWorld = this.getWorldPointFromPixelPoint(this.mousePosPixel);
  }
}

export default new WorldConfig();
