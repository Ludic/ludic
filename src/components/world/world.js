import Box2D from 'box2d';
import Util from '../util/util';

// var canvasOffset = {
//   x: 0,
//   y: 0
// };

class World {
  constructor(b2Vec2) {
    var x = Util.readConfig('world','gravity.x',0),
        y = Util.readConfig('world','gravity.y',0);

    b2Vec2 = b2Vec2 || new Box2D.b2Vec2(x,y);
    this.world = new Box2D.b2World(b2Vec2);
    Util.using(this,this.world);
    this.config = Util.readConfig('world');
    this.enableStep();

    // contact stuff
    this._contactListeners = [];
    this._contactListener = new Box2D.JSContactListener();

    //If the Contact involved the Player (check if entityA or entityB)
    this._contactListener.BeginContact = this.onContact(true).bind(this);
    this._contactListener.EndContact = this.onContact(false).bind(this);
    this._contactListener.PreSolve = function() {};
    this._contactListener.PostSolve = function() {};

    this.world.SetContactListener(this._contactListener);
  }

  drawDebug(override){
    if(this.config.drawDebug || override){
      this.world.DrawDebugData();
    }
  }

  onContact(begin){
    return function(contactPtr){
      var listener;
      for(var i=0;i<this._contactListeners.length;i++){
        listener = this._contactListeners[i];
        var contactObject = this.bodyInvolvedInContact(listener.body, contactPtr);

        if(contactObject){

          if(listener.className) {
            if( contactObject.entityData.constructor.name === listener.className){
              listener.callback(begin, contactObject);
            }
          } else {
            listener.callback(begin, contactObject);
          }

        } else {
          continue;
        }
      }
    }
  }

  // onBeginContact(contactPtr){
  //   var listener;
  //   for(var i=0;i<this._contactListeners.length;i++){
  //     listener = this._contactListeners[i];
  //
  //     var contactObject = this.bodyInvolvedInContact(listener.body, contactPtr);
  //
  //     if(contactObject){
  //       // console.log("player.onBeginContact");
  //
  //       if(listener.className) {
  //         if( contactObject.entityData.constructor.name === listener.className){
  //           listener.callback(true, contactObject);
  //         }
  //       } else {
  //         listener.callback(true, contactObject);
  //       }
  //
  //     } else {
  //       continue;
  //     }
  //   }
  // }
  //
  // onEndContact(contactPtr){
  //
  // }

  registerBodyContactListener(l){
    this._contactListeners.push(l);
  }

  newBodyContactListener(body, className, callback, addAlso){
    var cl = new ContactListener(body, className, callback);

    if(addAlso){
      this.registerBodyContactListener(cl);
    }

    return cl;
  }

  bodyInvolvedInContact(body, contactPtr){
    var contact = Box2D.wrapPointer(contactPtr, Box2D.b2Contact);
    var bodyA = contact.GetFixtureA().GetBody();
    var bodyB = contact.GetFixtureB().GetBody();
    if(bodyA == body){
      return bodyB;
    } else if(bodyB == body){
      return bodyA;
    } else {
      return false;
    }
  }

  step(delta,a,b){
    delta = (delta!==undefined && delta!==null) ? delta : 0;
    a = (a!==undefined && a!==null) ? a : 3;
    b = (b!==undefined && b!==null) ? b : 2;
    if(this.stepWorld){
      this.world.Step(delta, a, b);
    }
  }

  enableStep(){
    this.stepWorld = true;
  }

  disableStep(){
    this.stepWorld = false;
  }

  destroy(){
    Box2D.destroy(this.world);
  }

}

class ContactListener {
  constructor(body,className,callback) {
    if(typeof className === 'function' ){
      callback = className;
      className = false;
    }

    this.body = body;
    this.className = className;
    this.callback = callback;
  }
}

export default World;
