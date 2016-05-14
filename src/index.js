// import Util from './components/util/util';
// import D3App from './d3/D3App';

import {DebugDraw} from 'box2d';
import {Box2D} from 'box2d';

console.log(DebugDraw);
console.log(Box2D);


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

// Util.setConfig(config);




// var app = new D3App();
// app.run();
