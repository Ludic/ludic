import PrivateProperty from '../utils/privateProperty'

let _stack = new PrivateProperty();
let _listeners = new PrivateProperty();

export default class ScreenManager {
  constructor() {
    // initialize some private variables
    let idIncrementer = 0;
    this.getNewId = ()=>{
      return idIncrementer++;
    }

    // define private properties
    _listeners.set(this,new Proxy([],{
      get(target,prop){
        if(prop in ScreenEventListener.prototype){
          return (...args)=>{
            // only call prop if it exists
            //  this allows for the 'listener' to not be a 'ScreenEventListener' but any object that defines its properties
            target.forEach(e=> e[prop] != null ? e[prop].call(e,...args) : undefined)
          }
        }
        return target[prop]
      }
    }))
    _stack.set(this,[]);
  }

  update(delta){
    let stack = _stack(this);
    if(stack.length > 0){
      let screen = stack[stack.length-1];
      screen._step.apply(screen,arguments);

      if(screen._isFinished){
        _listeners(this).onScreenFinished(screen, this, screen._finalData);
      }
    }
  }

  addScreen(screen, replace){
    let stack = _stack(this)
    // give the screen a ref to the manager
    screen.$manager = this;
    // give the screen an id
    screen.$id = this.getNewId()
    if(replace){
      stack.splice(stack.length-1,1,screen);
    } else {
      stack.push(screen);
    }
    // call screen's callback
    screen.onAddedToManager(this)
    // call listener methods
    _listeners(this).onScreenAdded(screen, this, replace);
  }

  popScreen(){
    let stack = _stack(this)
    if(stack.length > 1){
      let screen = stack.pop();
      // call screen's callback
      screen.onRemovedFromManager(this);
      // call listener methods
      _listeners(this).onScreensRemoved([screen], this);
      return [screen];
    } else {
      // cannot pop the last screen, only replace.
      _listeners(this).onWarnPopScreen(stack, this);
      return [];
    }
  }

  popToScreen(screen){
    let stack = _stack(this)
    if(!screen.hasOwnProperty('$id')){
      return false;
    }
    let index = stack.findIndex((s)=>{
      return s.$id === screen.$id
    })
    if(index === -1){
      return false;
    } else {
      let screensRemoved = stack.splice(index);
      // call screen callback method
      screensRemoved.slice().reverse().forEach(screen => screen.onRemovedFromManager(this));
      // call listener method
      _listeners(this).onScreensRemoved(screensRemoved, this);
      return screensRemoved;
    }
  }

  addScreenEventListener(listener){
    _listeners(this).push(listener)
  }

  getNewScreenEventListener(alsoAdd){
    let listener = new ScreenEventListener()
    if(alsoAdd){
      this.addScreenEventListener(listener);
    }
    return listener;
  }
}

class ScreenEventListener {
  onScreenFinished(screen, manager, data){}
  onScreenAdded(screen, manager, replaced){}
  onScreensRemoved(screen, manager){}
  onWarnPopScreen(stack, manager){}
}

ScreenManager.ScreenEventListener = ScreenEventListener;
