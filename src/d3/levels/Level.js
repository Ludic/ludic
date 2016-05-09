import BaseLevel from 'src/d3/levels/BaseLevel';
import Player from 'src/d3/player/Player';
import Wall from 'src/d3/wall/Wall';
import Door from 'src/d3/door/Door';
import EntityManager from 'src/components/engine/EntityManager';
import Dimension from 'src/d3/dimensions/Dimension';
import App from 'src/components/app/app';
import GroundEntity from 'src/d3/dimensions/GroundEntity';


const NONE = 0;
const RIGHT = 1;
const LEFT = 2;


class Level extends BaseLevel {
  constructor(scene, world, options) {
    super();

    this.world = world;
    this.scene = scene;
    this.eM = EntityManager;
    this.eM.scene = this.scene;

    var dim0 = new Dimension(this.scene, 0);
    var dim1 = new Dimension(this.scene, 1);
    var dim2 = new Dimension(this.scene, 2);

    this.dimensions = [dim0,dim1,dim2];
    this.scene.dimensions = this.dimensions;

    var colors = ['#2196f3','#ff9800','#4caf50'];
    // this.scene.objects = this.scene.objects || {};
    this.scene.bodies.forEach( (body)=>{

      switch (body.props.Class.value) {
        case 'Ground':
          var dimIndex = body.props.Dimension.value;
          var obj = new GroundEntity(body,colors[dimIndex], this.scene, this.world);
          this.eM.addEntity(obj);
          obj.dimension = this.scene.dimensions[dimIndex];
          // this.dimensions[dimIndex] = dim;
          break;
        case 'Player':
          var obj = new Player(body, null, null, this.world);
          this.player = obj;
          this.eM.addEntity(this.player);

          //App.camera.setChaseEntity(obj,this.chaseEntityMethod);
          App.camera.setChaseEntity(obj);
          break;
        case 'Door':
          var dimIndex = body.props.Dimension.value;
          var obj = new Door(body,colors[dimIndex], this.scene, this.world);
          this.eM.addEntity(obj);
          obj.dimension = this.scene.dimensions[dimIndex];
          break;
        default:

      }
    });

    //Set initial dimension
    var initialDimension = options.level.split(".")[1];
    this.resetDimension(initialDimension);

    this.inputListener = App.input.newEventListener({},true);

    this.inputListener.rightStick = (x,y,evt)=>{
      this.onRightStick(x,y,evt);
    };

    this.inputListener.r2 = (down,evt)=>{
      this.onRight2(down,evt);
    };
    this.inputListener.l2 = (down,evt)=>{
      this.onLeft2(down,evt);
    };
    this.inputListener.circle = (down,evt)=>{
      this.onCircle(down,evt);
    };


    this.upperInputBounds = 0.95;
    this.selectingDimension = NONE;
  }

  destroy(){
    App.input.removeEventListener(this.inputListener);
    this.eM.destroy();
  }

  draw(ctx, delta){
    ctx.save();

    this.eM.step(ctx, delta);
    ctx.restore();
  }

  onRightStick(xVal,yVal,evt){

    var dz = 0.3;
    var ub = 0.9;

    if(evt.keyCode==203){
      // console.log(x,y,evt);

      var op = (Math.abs(yVal)-dz)/(ub-dz);
      var opInv = 1-op;
      var dim;

      if(yVal>dz && !this.preventPop){

        if(yVal<ub){
          dim = this.peekDownDimension();
          // console.log(op);
          dim.setOpacity(op);
          this.currentDimension.setOpacity(opInv);
        } else {
          // console.log('pop down');
          this.popDownDimension();
          this.preventPop = true;
        }

      } else if(yVal<-dz && !this.preventPop){
        if(yVal>-ub){
          dim = this.peekUpDimension();
          // console.log(op);
          dim.setOpacity(op);
          this.currentDimension.setOpacity(opInv);
        } else {
          // console.log('pop up');
          this.popUpDimension();
          this.preventPop = true;
        }

      } else if(evt.axis.zeroed){
        // console.log('zeroed');
        this.dimensions[2].setOpacity(0);
        this.dimensions[0].setOpacity(0);
        this.currentDimension.setOpacity(1);
        this.preventPop = false;
      }
    }
  }

  onLeft2(down,evt){
    // if(yVal<ub){
    //   dim = this.peekDownDimension();
    //   // console.log(op);
    //   dim.setOpacity(op);
    //   this.currentDimension.setOpacity(opInv);
    // } else {
    //   // console.log('pop down');
    //   this.popDownDimension();
    //   this.preventPop = true;
    // }

    var ub = this.upperInputBounds;
    var val = evt.button.value;

    var op = (Math.abs(val))/(ub);
    var opInv = 1-op;

    if(val && !this.preventPop && (this.selectingDimension === NONE || this.selectingDimension === LEFT) ){
      if(val<=ub){
        var dim = this.peekDownDimension();
        // console.log(op);
        dim.setOpacity(op);
        this.currentDimension.setOpacity(opInv);
        this.selectingDimension = LEFT;
        this.selectedDimension = dim;
      } else {
        // console.log('pop up');
        this.popDownDimension();
        this.preventPop = true;
      }
    }

    if(!down){
      this.dimensions[2].setOpacity(0);
      this.dimensions[0].setOpacity(0);
      this.currentDimension.setOpacity(1);
      this.preventPop = false;
      if(this.selectingDimension === LEFT){
        this.selectingDimension = NONE;
        this.selectedDimension = null;
      }
    }
  }

  onRight2(down,evt){
    // console.log(evt.button.value);
    var ub = this.upperInputBounds;
    var val = evt.button.value;

    var op = (Math.abs(val))/(ub);
    var opInv = 1-op;

    if(val && !this.preventPop && (this.selectingDimension === NONE || this.selectingDimension === RIGHT) ){
      if(val<=ub){
        var dim = this.peekUpDimension();
        // console.log(val);
        dim.setOpacity(op);
        this.currentDimension.setOpacity(opInv);
        this.selectingDimension = RIGHT;
        this.selectedDimension = dim;
      } else {
        // console.log('pop up');
        this.popUpDimension();
        this.preventPop = true;
      }
    }

    if(!down){
      this.dimensions[2].setOpacity(0);
      this.dimensions[0].setOpacity(0);
      this.currentDimension.setOpacity(1);
      this.preventPop = false;
      if(this.selectingDimension === RIGHT){
        this.selectingDimension = NONE;
        this.selectedDimension = null;
      }
    }

  }

  onCircle(down, evt){

    // if(this.selectedDimension){
    //   if(down){
    //     if(!this.preventPop){
    //       this.popToDimension();
    //       this.preventPop = true;
    //     }
    //   }
    // } else {
    //   // send event to player
    // }

  }

  peekUpDimension(){
    return this.dimensions[2]; // knowing only 3 dimensions
  }

  peekDownDimension(){
    return this.dimensions[0];
  }

  popUpDimension(){
    this.dimensions.wrapLeft();
    this.resetDimension();
  }

  popDownDimension(){
    this.dimensions.wrapRight();
    this.resetDimension();
  }

  popToDimension() {
    if(this.selectingDimension === RIGHT){
      this.popUpDimension();
    } else if(this.selectingDimension === LEFT){
      this.popDownDimension();
    }

  }

  resetDimension(toDim){
    if(toDim !== undefined && toDim !== null){
      for(var i=0; i<20;i++){
        var a = this.dimensions;
        if(a[1].id==toDim){
          break;
        }
        a.wrapRight();

      }
    }

    if(this.currentDimension){
      this.world.disableStep();
      this.currentDimension.deactivate();
    }
    this.currentDimension = this.dimensions[1];
    this.currentDimension.activate();
    this.scene.currentDimension = this.currentDimension;
    this.world.enableStep();
  }

  chaseEntityMethod(chaseEntity, camera){
    var pos = chaseEntity.getPosition();
    var bounds = camera.getViewportBounds();

    var percent = .2;

    var leftBound = camera._getWorldPointFromPixelPoint_x(camera.canvas.width()*percent);
    var rightBound = camera._getWorldPointFromPixelPoint_x(camera.canvas.width()*(1-percent));
    var center = camera.getViewCenterWorld();
    var diff = {
      x:0,
      y:0
    };

    if(pos.get_x()<leftBound){
      diff.x = pos.get_x()-leftBound;
      camera.moveCenterBy(diff);
    } else if(pos.get_x()>center.x) {
      diff.x = pos.get_x()-center.x;
      camera.moveCenterBy(diff);
    }
  }

}

Array.prototype.wrapRight = function(){
  this.unshift(this.pop());
  return this;
};

Array.prototype.wrapLeft = function(){
  this.push(this.shift());
  return this;
};

export default Level;
