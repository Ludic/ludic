import Screen from './screen'

let idIncrementer = 1

export interface ScreenManagerListener {
  onScreenFinished(screen: Screen, manager: ScreenManager, finalData: Screen['_finalData']): void
  onScreenAdded(screen: Screen, manager: ScreenManager, replace: boolean): void
  onScreensRemoved(screens: Screen[], manager: ScreenManager): void
  onWarnPopScreen(stack: Screen[], manager: ScreenManager): void
}
const LISTENER_METHODS: Array<string> = ['onScreenAdded', 'onScreenFinished', 'onScreensRemoved', 'onWarnPopScreen']

function isListenerMethod(prop: string): prop is keyof ScreenManagerListener {
  return LISTENER_METHODS.includes(prop)
}

export class ScreenManager {
  
  private _stack: Screen[]
  private _listeners: ScreenManagerListener[] & ScreenManagerListener


  constructor() {
    // this.$app = app

    // define private properties
    this._listeners = new Proxy([],{
      get(target: Array<ScreenManagerListener>, prop: string){
        if(isListenerMethod(prop)){
          return (...args: any[])=>{
            // only call prop if it exists
            //  this allows for the 'listener' to not be a 'ScreenEventListener' but any object that defines its properties
            target.forEach((e: ScreenManagerListener) => {
              e[prop] != null ? e[prop].call(e,...args) : undefined
            })
          }
        }
        return target[prop as any]
      }
    }) as ScreenManagerListener[] & ScreenManagerListener
    this._stack = []
  }

  private getNewId(){
    return idIncrementer++
  }

  update(delta: number){
    let stack = this._stack
    if(stack.length > 0){
      let screen = stack[stack.length-1]

      if(screen._isFinished){
        this._listeners.onScreenFinished(screen, this, screen._finalData)
      } else {
        screen.update.apply(screen, arguments)
      }
    }
  }

  addScreen(screen: Screen, replace: boolean = false){
    let stack = this._stack
    let finalData = null
    // give the screen a ref to the manager and the app
    screen.$manager = this
    // screen.$app = this.$app
    // give the screen an id
    screen.$id = this.getNewId()
    if(replace){
      const [rm] = this.popScreen()
      if(rm != null){
        finalData = rm._finalData
      }
    }
    stack.push(screen)
    // call screen's callback
    screen.onAddedToManager(this, finalData)
    // call listener methods
    this._listeners.onScreenAdded(screen, this, replace)
  }

  popScreen(){
    let stack = this._stack
    if(stack.length > 0){
      let screen = stack.pop()
      // call screen's callback
      screen.onRemovedFromManager(this)
      // call listener methods
      this._listeners.onScreensRemoved([screen], this)
      return [screen]
    } else {
      // cannot pop the last screen, only replace.
      this._listeners.onWarnPopScreen(stack, this)
      return []
    }
  }

  popToScreen(screen: Screen){
    let stack = this._stack
    if(!screen.hasOwnProperty('$id')){
      return false
    }
    let index = stack.findIndex((s)=>{
      return s.$id === screen.$id
    })
    if(index === -1){
      return false
    } else {
      let screensRemoved = stack.splice(index)
      // call screen callback method
      screensRemoved.slice().reverse().forEach(screen => screen.onRemovedFromManager(this))
      // call listener method
      this._listeners.onScreensRemoved(screensRemoved, this)
      return screensRemoved
    }
  }

  addScreenEventListener(listener: ScreenManagerListener){
    this._listeners.push(listener)
  }

  // getNewScreenEventListener(alsoAdd){
  //   let listener = new ScreenEventListener()
  //   if(alsoAdd){
  //     this.addScreenEventListener(listener)
  //   }
  //   return listener
  // }
}

// ScreenManager.ScreenEventListener = ScreenEventListener

export default ScreenManager