import Util from 'src/components/util/util';
import D3App from 'src/d3/D3App';


var config = {
  canvas: {
    fullscreen: true
  },
  camera: {
    fps: true,
    extras: {
      axes: true,
      grid: false
    },
    ptm: 25
  },
  world: {
    gravity: {
      x: 0,
      y: -10
    },
    drawDebug: true
  },
  input: {
    logAllKeys:false,
    logUnmappedKeys:true,
  }
};

Util.setConfig(config);




var app = new D3App();
app.run();
