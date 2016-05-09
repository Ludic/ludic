
let stack = [];
let _listener;

class ScreenManager {
  constructor() {
  }


  draw(ctx, delta){

    if(stack.length > 0){
      let screen = stack[stack.length-1];
      screen._draw.apply(screen,arguments);


      if(_listener){
        if(screen._isFinished){
          _listener.onScreenFinished(screen, this, screen._finalData);
        }
      }
    }
  }

  addScreen(screen, replace){
    // if(replace){
    //   stack.splice(stack.length-1, 1, screen);
    // } else {
    //   stack.push(screen);
    // }

    if(replace){
      stack.splice(stack.length-1,1,screen);
    } else {
      stack.push(screen);
    }
    // console.log('add screen:',stack.length,replace);
  }

  getStack(){
    return stack;
  }

  setEventListener(listener){
    _listener = listener;
  }

  newListener(alsoSet){
    var l = new ScreenEventListener();
    if(alsoSet){
      this.setEventListener(l);
    }
    return l;
  }
}

class ScreenEventListener {
  onScreenFinished(){
  }
}


export default ScreenManager;
