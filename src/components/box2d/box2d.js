// var Box2D = require('../../libs/box2d/2.3.1/Box2D_v2.3.1_min.js');
// import { Box2D } from '../../libs/box2d/2.3.1/Box2D_v2.3.1_min.js';
let Module = {};
// if (!Box2D) Box2D = (typeof Box2D !== 'undefined' ? Box2D : null) || Module;
import Box2D from 'box2d';
console.log(Box2D);

export default Box2D;
