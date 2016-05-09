import canvas from 'src/components/canvas/canvas';
import DebugDraw from 'src/libs/embox2d-html5canvas-debugDraw';
import embox2dTest_car from 'src/car';
import World from 'src/components/world/world';

var e_shapeBit = 0x0001;
var e_jointBit = 0x0002;
var e_aabbBit = 0x0004;
var e_pairBit = 0x0008;
var e_centerOfMassBit = 0x0010;

var PTM = 32;

// var world = null;
var mouseJointGroundBody;
// var canvas;
var context;
var myDebugDraw;
var myQueryCallback;
var mouseJoint = null;
var run = true;
var frameTime60 = 0;
var statusUpdateCounter = 0;
var showStats = false;
var mouseDown = false;
var shiftDown = false;
var mousePosPixel = {
  x: 0,
  y: 0
};
var prevMousePosPixel = {
  x: 0,
  y: 0
};
var mousePosWorld = {
  x: 0,
  y: 0
};
var canvasOffset = {
  x: 0,
  y: 0
};
var viewCenterPixel = {
  x:320,
  y:240
};
var currentTest = null;

class HTML5CanvasTestBed {
  constructor() {
  }

  // moved to Util
  // static myRound(val,places) {
  //   var c = 1;
  //   for (var i = 0; i < places; i++)
  //     c *= 10;
  //   return Math.round(val*c)/c;
  // }

  // moved to World
  // static getWorldPointFromPixelPoint(pixelPoint) {
  //   return {
  //     x: (pixelPoint.x - canvasOffset.x)/PTM,
  //     y: (pixelPoint.y - (canvas.height - canvasOffset.y))/PTM
  //   };
  // }

  static updateMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    mousePosPixel = {
      x: evt.clientX - rect.left,
      y: canvas.height - (evt.clientY - rect.top)
    };
    mousePosWorld = this.getWorldPointFromPixelPoint(mousePosPixel);
  }

  // moved to World
  // static setViewCenterWorld(b2vecpos, instantaneous) {
  //   var currentViewCenterWorld = this.getWorldPointFromPixelPoint( viewCenterPixel );
  //   var toMoveX = b2vecpos.get_x() - currentViewCenterWorld.x;
  //   var toMoveY = b2vecpos.get_y() - currentViewCenterWorld.y;
  //   var fraction = instantaneous ? 1 : 0.25;
  //   canvasOffset.x -= this.myRound(fraction * toMoveX * PTM, 0);
  //   canvasOffset.y += this.myRound(fraction * toMoveY * PTM, 0);
  // }

  static onMouseMove(canvas, evt) {
    prevMousePosPixel = mousePosPixel;
    this.updateMousePos(canvas, evt);
    this.updateStats();
    if ( shiftDown ) {
      canvasOffset.x += (mousePosPixel.x - prevMousePosPixel.x);
      canvasOffset.y -= (mousePosPixel.y - prevMousePosPixel.y);
      this.draw();
    }
    else if ( mouseDown && mouseJoint != null ) {
      mouseJoint.SetTarget( new Box2D.b2Vec2(mousePosWorld.x, mousePosWorld.y) );
    }
  }

  static startMouseJoint() {

    if ( mouseJoint != null )
      return;

    // Make a small box.
    var aabb = new Box2D.b2AABB();
    var d = 0.001;
    aabb.set_lowerBound(new b2Vec2(mousePosWorld.x - d, mousePosWorld.y - d));
    aabb.set_upperBound(new b2Vec2(mousePosWorld.x + d, mousePosWorld.y + d));

    // Query the world for overlapping shapes.
    myQueryCallback.m_fixture = null;
    myQueryCallback.m_point = new Box2D.b2Vec2(mousePosWorld.x, mousePosWorld.y);
    World.world.QueryAABB(myQueryCallback, aabb);

    if (myQueryCallback.m_fixture)
    {
      var body = myQueryCallback.m_fixture.GetBody();
      var md = new Box2D.b2MouseJointDef();
      md.set_bodyA(mouseJointGroundBody);
      md.set_bodyB(body);
      md.set_target( new Box2D.b2Vec2(mousePosWorld.x, mousePosWorld.y) );
      md.set_maxForce( 1000 * body.GetMass() );
      md.set_collideConnected(true);

      mouseJoint = Box2D.castObject( World.world.CreateJoint(md), Box2D.b2MouseJoint );
      body.SetAwake(true);
    }
  }

  static onMouseDown(canvas, evt) {
    this.updateMousePos(canvas, evt);
    if ( !mouseDown )
      this.startMouseJoint();
    mouseDown = true;
    this.updateStats();
  }

  static onMouseUp(canvas, evt) {
    mouseDown = false;
    this.updateMousePos(canvas, evt);
    this.updateStats();
    if ( mouseJoint != null ) {
      World.world.DestroyJoint(mouseJoint);
      mouseJoint = null;
    }
  }

  static onMouseOut(canvas, evt) {
    this.onMouseUp(canvas,evt);
  }

  static onKeyDown(canvas, evt) {
    //console.log(evt.keyCode);
    if ( evt.keyCode == 80 ) {//p
                              this.pause();
    }
    else if ( evt.keyCode == 82 ) {//r
                                   this.resetScene();
    }
    else if ( evt.keyCode == 83 ) {//s
                                   this.step();
    }
    else if ( evt.keyCode == 88 ) {//x
                                   this.zoomIn();
    }
    else if ( evt.keyCode == 90 ) {//z
                                   this.zoomOut();
    }
    else if ( evt.keyCode == 37 ) {//left
                                   canvasOffset.x += 32;
    }
    else if ( evt.keyCode == 39 ) {//right
                                   canvasOffset.x -= 32;
    }
    else if ( evt.keyCode == 38 ) {//up
                                   canvasOffset.y += 32;
    }
    else if ( evt.keyCode == 40 ) {//down
                                   canvasOffset.y -= 32;
    }
    else if ( evt.keyCode == 16 ) {//shift
                                   shiftDown = true;
    }

    if ( currentTest && currentTest.onKeyDown )
      currentTest.onKeyDown(canvas, evt);

    this.draw();
  }

  static onKeyUp(canvas, evt) {
    if ( evt.keyCode == 16 ) {//shift
                              shiftDown = false;
    }

    if ( currentTest && currentTest.onKeyUp )
      currentTest.onKeyUp(canvas, evt);
  }

  static zoomIn() {
    var currentViewCenterWorld = this.getWorldPointFromPixelPoint( viewCenterPixel );
    PTM *= 1.1;
    var newViewCenterWorld = this.getWorldPointFromPixelPoint( viewCenterPixel );
    canvasOffset.x += (newViewCenterWorld.x-currentViewCenterWorld.x) * PTM;
    canvasOffset.y -= (newViewCenterWorld.y-currentViewCenterWorld.y) * PTM;
    this.draw();
  }

  static zoomOut() {
    var currentViewCenterWorld = this.getWorldPointFromPixelPoint( viewCenterPixel );
    PTM /= 1.1;
    var newViewCenterWorld = this.getWorldPointFromPixelPoint( viewCenterPixel );
    canvasOffset.x += (newViewCenterWorld.x-currentViewCenterWorld.x) * PTM;
    canvasOffset.y -= (newViewCenterWorld.y-currentViewCenterWorld.y) * PTM;
    this.draw();
  }

  static updateDebugDrawCheckboxesFromWorld() {
    var flags = myDebugDraw.GetFlags();
  }

  static updateWorldFromDebugDrawCheckboxes() {
    var flags = 0;
    if ( document.getElementById('drawShapesCheck').checked )
      flags |= e_shapeBit;
    if ( document.getElementById('drawJointsCheck').checked )
      flags |= e_jointBit;
    if ( document.getElementById('drawAABBsCheck').checked )
      flags |= e_aabbBit;
    /*if ( document.getElementById('drawPairsCheck').checked )
       flags |= e_pairBit;*/
    if ( document.getElementById('drawTransformsCheck').checked )
      flags |= e_centerOfMassBit;
    myDebugDraw.SetFlags( flags );
  }

  static updateContinuousRefreshStatus() {
    showStats = ( document.getElementById('showStatsCheck').checked );
    if ( !showStats ) {
      var fbSpan = document.getElementById('feedbackSpan');
      fbSpan.innerHTML = "";
    }
    else
      this.updateStats();
  }

  static init() {

    // canvas = document.getElementById("canvas");
    context = canvas.getContext( '2d' );

    canvasOffset.x = canvas.width/2;
    canvasOffset.y = canvas.height/2;

    canvas.addEventListener('mousemove', function(evt) {
      HTML5CanvasTestBed.onMouseMove(canvas,evt);
    }, false);

    canvas.addEventListener('mousedown', function(evt) {
      HTML5CanvasTestBed.onMouseDown(canvas,evt);
    }, false);

    canvas.addEventListener('mouseup', function(evt) {
      HTML5CanvasTestBed.onMouseUp(canvas,evt);
    }, false);

    canvas.addEventListener('mouseout', function(evt) {
      HTML5CanvasTestBed.onMouseOut(canvas,evt);
    }, false);

    canvas.addEventListener('keydown', function(evt) {
      HTML5CanvasTestBed.onKeyDown(canvas,evt);
    }, false);

    canvas.addEventListener('keyup', function(evt) {
      HTML5CanvasTestBed.onKeyUp(canvas,evt);
    }, false);

    myDebugDraw = DebugDraw.getCanvasDebugDraw();
    myDebugDraw.SetFlags(e_shapeBit);

    ////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////
    // TODO:
    myQueryCallback = new Box2D.JSQueryCallback();

    myQueryCallback.ReportFixture = function(fixturePtr) {
      var fixture = Box2D.wrapPointer( fixturePtr, b2Fixture );
      if ( fixture.GetBody().GetType() != Box2D.b2_dynamicBody ) //mouse cannot drag static bodies around
        return true;
      if ( ! fixture.TestPoint( this.m_point ) )
        return true;
      this.m_fixture = fixture;
      return false;
    };
    ////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////
  }

  static changeTest() {
    this.resetScene();
    if ( currentTest && currentTest.setNiceViewCenter )
      currentTest.setNiceViewCenter();
    this.updateDebugDrawCheckboxesFromWorld();
    this.draw();
  }

  static createWorld() {
    if ( World.world != null )
      Box2D.destroy(World.world);
    // world = new Box2D.b2World( new Box2D.b2Vec2(0.0, -10.0) );
    World.createWorld(new Box2D.b2Vec2(0.0, -10.0));
    World.world.SetDebugDraw(myDebugDraw);
    mouseJointGroundBody = World.world.CreateBody( new Box2D.b2BodyDef() );
    var e = document.getElementById("testSelection");
    // var v = "embox2dTest_car";
    // eval( "currentTest = new "+v+"();" );
    currentTest = new embox2dTest_car();
    currentTest.setup();
  }

  static resetScene() {
    this.createWorld();
    this.draw();
  }

  // moved to BaseApp
  static step(timestamp) {

    if ( currentTest && currentTest.step )
      currentTest.step();

    if ( ! showStats ) {
      World.world.Step(1/60, 3, 2);
      this.draw();
      return;
    }

    var current = Date.now();
    World.world.Step(1/60, 3, 2);
    var frametime = (Date.now() - current);
    frameTime60 = frameTime60 * (59/60) + frametime * (1/60);

    this.draw();
    statusUpdateCounter++;
    if ( statusUpdateCounter > 20 ) {
      this.updateStats();
      statusUpdateCounter = 0;
    }
  }

  // moved to BaseApp
  // static draw() {
  //
  //   //black background
  //   context.fillStyle = 'rgb(0,0,0)';
  //   context.fillRect( 0, 0, canvas.width, canvas.height );
  //
  //   context.save();
  //   context.translate(canvasOffset.x, canvasOffset.y);
  //   context.scale(1,-1);
  //   context.scale(PTM,PTM);
  //   context.lineWidth /= PTM;
  //
  //   DebugDraw.drawAxes(context);
  //
  //   context.fillStyle = 'rgb(255,255,0)';
  //   World.world.DrawDebugData();
  //
  //   if ( mouseJoint != null ) {
  //     //mouse joint is not drawn with regular joints in debug draw
  //     var p1 = mouseJoint.GetAnchorB();
  //     var p2 = mouseJoint.GetTarget();
  //     context.strokeStyle = 'rgb(204,204,204)';
  //     context.beginPath();
  //     context.moveTo(p1.get_x(),p1.get_y());
  //     context.lineTo(p2.get_x(),p2.get_y());
  //     context.stroke();
  //   }
  //
  //   context.restore();
  // }

  static updateStats() {
    if ( ! showStats )
      return;
    var currentViewCenterWorld = this.getWorldPointFromPixelPoint( viewCenterPixel );
    var fbSpan = document.getElementById('feedbackSpan');
    fbSpan.innerHTML =
    "Status: "+(run?'running':'paused') +
    "<br>Physics step time (average of last 60 steps): "+this.myRound(frameTime60,2)+"ms" +
    //"<br>Mouse down: "+mouseDown +
    "<br>PTM: "+this.myRound(PTM,2) +
    "<br>View center: "+this.myRound(currentViewCenterWorld.x,3)+", "+this.myRound(currentViewCenterWorld.y,3) +
    //"<br>Canvas offset: "+myRound(canvasOffset.x,0)+", "+myRound(canvasOffset.y,0) +
    "<br>Mouse pos (pixel): "+mousePosPixel.x+", "+mousePosPixel.y +
    "<br>Mouse pos (world): "+this.myRound(mousePosWorld.x,3)+", "+this.myRound(mousePosWorld.y,3);
  }

  static animate() {
    if ( run )
      window.requestAnimFrame( HTML5CanvasTestBed.animate );
    HTML5CanvasTestBed.step();
  }

  static pause() {
    run = !run;
    if (run)
      this.animate();
    this.updateStats();
  }

}

window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          window.oRequestAnimationFrame      ||
          window.msRequestAnimationFrame     ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();

export default HTML5CanvasTestBed;
