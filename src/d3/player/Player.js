import StatefulPolygonEntity from 'src/components/engine/StatefulPolygonEntity';
import AssetManager from 'src/components/base/assetManager';
import Ludic from 'src/components/app/ludic';
import Box2D from 'src/components/box2d/box2d';
import MainBlaster from 'src/d3/blaster/MainBlaster';
import EntityManager from 'src/components/engine/EntityManager';
import BaseSprite from 'src/components/sprite/BaseSprite';
import MultiSprite from 'src/components/sprite/MultiSprite';

const RIGHT = 10;
const LEFT  = 11;

class Player extends StatefulPolygonEntity {
  constructor(body, image, options, world){
    super(body, image, options);
    this.world = world;
    this.maxVX = 15;
    this.maxVY = 10;
    this.gravityScale = 4;
    this.jumpGravityScale = 6;
    this.color = "#ecf0f1";
    this.looking = RIGHT;
    this.blasters = [];
    this.allDim = true;
    this.body.SetGravityScale(this.gravityScale);
    this.initContactListeners();
    this.initMoveListeners();
    this.getBlasters();

    // this.sprite = {};
    // this.sprite = new BaseSprite('playerSpriteSheet', 6, 5, 1.25, 2.42);
    // this.sprite.scaleToWidth(2.5);
    this.sprite = new MultiSprite('megaman', 10, 7, 1.25, 2.15);
    this.sprite.scaleToHeight(3.5);
    this.sprite.setUseShadow(true);
    this.sprite.createSlice('running', 3, 3, 4);
    this.sprite.createSlice('running_shoot', 13, 3, 4);
    this.sprite.createState('standing',0);
    this.sprite.createState('jumping',6);
    this.sprite.createState('shooting',12);
    this.sprite.createState('jump_shooting',16);

    console.log(this.sprite);


    // this.parseSpriteSheet();
    this.zIndex = 10;
  }

  destroy(){
    super.destroy();
    this.world.SetContactListener(null);
    this.world = null;
    Ludic.input.removeEventListener(this.inputListener);
    this.contactListener = null;
  }

  initMoveListeners(){
    this.inputListener = Ludic.input.newEventListener({
      '39':'right',
      '37':'left',
      '38':'up',
      '40':'down',
      '32':'cross',
      '69': 'square'
    }, true);

    this.inputListener.left = (down)=>{
      this.moveLeft(down);
    }
    this.inputListener.right = (down)=>{
      this.moveRight(down);
    }

    // this.inputListener.up = (down)=>{
    //   this.moveUp(down);
    // }
    // this.inputListener.down = (down)=>{
    //   this.moveDown(down);
    // }
    this.inputListener.cross = (down)=>{
      this.jump(down);
    }

    this.inputListener.square = (down)=>{
      this.shoot(down);
    }

    this.inputListener.leftStick = (xVal,yVal,event)=>{
      if(xVal>0.3){
        this.moveRight(true);
      } else if(xVal<-0.3){
        this.moveLeft(true);
      } else {
        this.moveRight(false);
        this.moveLeft(false);
      }

      if(yVal>0.3){
        this.moveDown(true);
      } else if(yVal<-0.3){
        this.moveUp(true);
      } else {
        this.moveDown(false);
        this.moveUp(false);
      }
    }
  }

  initContactListeners(){
    this.contactCount = {};

    this.contactListener = this.world.newBodyContactListener(this.body, this.onContact.bind(this));
    this.world.registerBodyContactListener(this.contactListener);
  }

  onContact(begin, contactObject){
    // console.log('on contact');
    if(contactObject && contactObject.entityData){
      // console.log("player.onBeginContact");
      switch(contactObject.entityData.constructor.name) {
        case "GroundEntity":
          this.setGrounded(begin,contactObject);
          break;
      }
    } else {
      return;
    }
  }

  moveRight(keyDown){
    var desiredVel;
    if(keyDown){
      desiredVel = this.maxVX;
      this.running = true;
      // if(this.jumping || !this.grounded){
      //   if(this.shooting){
      //     this.sprite.setFrame(16, 'default');
      //   } else {
      //     this.sprite.setFrame(6,'default');
      //   }
      // } else {
      //   if(this.shooting){
      //     this.sprite.nextFrame('running_shoot');
      //   } else {
      //     this.sprite.nextFrame('running');
      //   }
      // }

    } else {
      desiredVel = 0;
      this.running = false;
      // if(this.jumping || !this.grounded){
      //   this.sprite.setFrame(6,'default');
      // } else {
      //   this.sprite.setFrame(0,'default');
      // }
    }
    if(!this.reverse){
      var vel = this.body.GetLinearVelocity();
      var velChange = desiredVel - vel.get_x();
      var impulse = this.body.GetMass() * velChange;
      this.body.ApplyLinearImpulse(new Box2D.b2Vec2(impulse, 0), this.body.GetWorldCenter());
      this.looking = RIGHT;
      this.sprite.setDirection(this.looking);
    }

    return true;
  }

  moveLeft(keyDown){
    var desiredVel;
    if(keyDown){
      desiredVel = -this.maxVX;
      this.running = true;
      // if(this.jumping || !this.grounded){
      //   if(this.shooting){
      //     this.sprite.setFrame(16, 'default');
      //   } else {
      //     this.sprite.setFrame(6,'default');
      //   }
      // } else {
      //   if(this.shooting){
      //     this.sprite.nextFrame('running_shoot');
      //   } else {
      //     this.sprite.nextFrame('running');
      //   }
      // }
    } else {
      desiredVel = 0;
      this.running = false;
      // if(this.jumping || !this.grounded){
      //   this.sprite.setFrame(6,'default');
      // } else {
      //   this.sprite.setFrame(0,'default');
      // }
    }
    if(!this.reverse){
      var vel = this.body.GetLinearVelocity();
      var velChange = desiredVel - vel.get_x();
      var impulse = this.body.GetMass() * velChange;
      this.body.ApplyLinearImpulse(new Box2D.b2Vec2(impulse, 0), this.body.GetWorldCenter());
      this.looking = LEFT;
      this.sprite.setDirection(this.looking);
    }

    return true;
  }

  moveUp(keyDown){
    if(keyDown && !this.reverse){
      var impulse = this.body.GetMass() * this.maxVY;
      this.body.ApplyLinearImpulse(new Box2D.b2Vec2(0, impulse), this.body.GetWorldCenter());
    }
  }

  moveDown(keyDown){
    if(keyDown && !this.reverse){
      var impulse = this.body.GetMass() * this.maxVY;
      this.body.ApplyLinearImpulse(new Box2D.b2Vec2(0, -impulse), this.body.GetWorldCenter());
    }
  }

  jump(keyDown){
    if(keyDown && !this.jumping && this.grounded){
      this.jumping = true;
      this.grounded = false;
      this.body.ApplyLinearImpulse(new Box2D.b2Vec2(0,30),this.body.GetWorldCenter());
      // this.sprite.setFrame(6,'default');
    } else if(!keyDown) {
      this.jumping = false;
      if(!this.grounded){
        this.body.SetGravityScale(this.jumpGravityScale);
      }
    }
  }

  shoot(keyDown){


    if(keyDown){

      if(!this.shootingDown){
        this.currentBlaster.fire();
        this.shooting = true;
        this.shootingDown = true;
        this.shootingInterval = 0;
      } else {
        this.shootingInterval++;
        if(this.shootingInterval > 5){
          this.shooting = false;
        }
      }



    } else {
      this.shooting = false;
      this.shootingDown = false;
      // this.sprite.setFrame(0,'default');
    }

    // if( (this.jumping || !this.grounded) && keyDown){
    //   if(this.running){
    //     this.sprite.nextFrame('running_shoot');
    //   } else {
    //     this.sprite.setFrame(16,'default');
    //   }
    // } else if( (this.jumping || !this.grounded) && !keyDown){
    //   this.sprite.setFrame(6,'default');
    // } else if(keyDown){
    //   this.shooting = true;
    //   this.sprite.setFrame(12,'default');
    // } else {
    //   this.shooting = false;
    //   this.sprite.setFrame(0,'default');
    // }

  }

  setGrounded(set,obj){
    var c = this.contactCount[obj.e];
    if(c === undefined || c === null){
      this.contactCount[obj.e] = 0;
    }
    var b = this.contactCount[obj.e] += set?1:-1;

    if(set){
      this.grounded = true;
      // this.jumping = false;
      this.body.SetGravityScale(this.gravityScale);
      // this.sprite.setFrame(0,'default');
    } else {
      if(b==0) {
        this.grounded = false;
        // this.sprite.setFrame(6,'default');
      }
    }
  }

  revertState(keyDown){
    if(keyDown){
      this.reverse = true;
    } else {
      this.reverse = false;
    }
  }

  draw(ctx, delta) {
    var pos = this.body.GetPosition();


    ctx.save();

    this.applyRotation(ctx);


    // determin animation
    if(this.running){
      if(this.jumping || !this.grounded){
        if(this.shooting){
          this.sprite.setState('jump_shooting');
        } else {
          if(this.grounded){
            this.sprite.animate('running');
          } else {
            this.sprite.setState('jumping');
          }
        }
      } else {
        if(this.shooting){
          this.sprite.animate('running_shoot');
        } else {
          this.sprite.animate('running');
        }
      }
    } else {
      if(this.jumping || !this.grounded){
        if(this.shooting){
          this.sprite.setState('jump_shooting')
        } else {
          if(this.grounded){
            this.sprite.setState('standing');
          } else {
            this.sprite.setState('jumping');
          }
        }
      } else {
        if(this.shooting){
          this.sprite.setState('shooting')
        } else {
          this.sprite.setState('standing');
        }
      }



    }

    // ctx.translate(pos.get_x(),pos.get_y());
    // ctx.fillStyle = this.color;
    // this.drawFixtures(ctx, delta, () => {
    //   ctx.fill();
    //   ctx.strokeStyle = this.color;
    //   ctx.lineWidth = 0.04;
    //   ctx.lineJoin = 'bevel';
    //   ctx.lineCap = 'round';
    //   ctx.closePath();
    //   ctx.stroke();
    // });

    ctx.restore();

    this.sprite.setPosition(this.getPosition(true));
    this.sprite.draw(ctx);
    // this.animate(ctx);
  }

  animate(ctx){
    var pos = this.getPosition(true);
    var currentFrame = this.sprite.frame;

    ctx.save();
    if(this.looking === RIGHT){
      ctx.scale(1,-1); // flip the y
      ctx.translate(-1.25,-2.42); //  [ -(w/2) , -(?) ]
      ctx.translate(pos.x,-pos.y);
    } else {
      ctx.scale(-1,-1); // flip the y
      ctx.translate(-1.25,-2.42); //  [ -(w/2) , -(?) ]
      ctx.translate(-pos.x,-pos.y);
    }

    ctx.drawImage(this.sprite.image, currentFrame.sx, currentFrame.sy, this.sprite.frameWidth, this.sprite.frameHeight, 0, 0, 2.5,3);

    ctx.restore();
  }

  parseSpriteSheet(){
    this.sprite.frames = [];
    for(var x = 0; x < this.sprite.sheet.framesX; x++){
      for(var y = 0; y < this.sprite.sheet.framesY; y++){
        var frame = {};
        frame.sx = y * this.sprite.sheet.frameWidth;
        frame.sy = x * this.sprite.sheet.frameHeight;

        this.sprite.frames.push(frame);
      }
    }

    console.log(this.sprite.frames);
  }


  getBlasters(){
    var mainBlaster = new MainBlaster(this.world, this);
    EntityManager.addEntity(mainBlaster);
    this.blasters.push(mainBlaster);
    this.currentBlaster = this.blasters[0];
  }

}

export default Player;
