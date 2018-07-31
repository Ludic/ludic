let gamepadMaps = {
  'ps4-1': {
    name: 'PS4 Controller (Chrome;macOS)',
    buttons: ['cross','circle','square','triangle','l1','r1','l2','r2','extra','start','l3','r3','up','down','left','right','home','select'],
    axes: ['lx','ly','rx','ry'],
    sticks: {
      lx:'leftStick',
      ly:'leftStick',
      rx:'rightStick',
      ry:'rightStick'
    },
    test(gamepad){
      let ua = navigator.userAgent
      return /54c.*5c4/.test(gamepad.id)
        && gamepad.axes.length == this.axes.length
        && gamepad.buttons.length == this.buttons.length
        && ua.includes('Chrome') && ua.includes('Mac OS X')
    },
  },
  'ps4-2': {
    name: 'PS4 Controller (Firefox;macOS)',
    buttons: ['square','cross','circle','triangle','l1','r1','l2','r2','extra','start','l3','r3','home','select','up','down','left','right'],
    // axes: ['lx','ly','rx','l2','r2','ry'],
    axes: ['dpadX','dpadY','rx','l2','r2','ry'],
    sticks: {
      lx:'leftStick',
      ly:'leftStick',
      rx:'rightStick',
      ry:'rightStick',
    },
    buttonAxes: {
      l2:6,
      r2:7,
    },
    dpadAxes: {
      dpadX: {
        left: -1,
        right: 1,
      },
      dpadY: {
        up: -1,
        down: 1,
      },
    },
    test(gamepad){
      let ua = navigator.userAgent
      return /54c.*5c4/.test(gamepad.id)
        && gamepad.axes.length == this.axes.length
        && gamepad.buttons.length == this.buttons.length
        && ua.includes('Firefox') && ua.includes('Mac OS X')
    },
  },
  'ps4-3': {
    name: 'PS4 Controller (Firefox;Ubuntu)',
    buttons: ['cross','circle','triangle','square','l1','r1','l2','r2','extra','start','home','l3','r3'],
    axes: ['lx','ly','l2','rx','ry','r2','dpadX','dpadY'],
    sticks: {
      lx:'leftStick',
      ly:'leftStick',
      rx:'rightStick',
      ry:'rightStick',
    },
    buttonAxes: {
      l2:6,
      r2:7,
    },
    dpadAxes: {
      dpadX: {
        left: -1,
        right: 1,
      },
      dpadY: {
        up: -1,
        down: 1,
      },
    },
    test(gamepad){
      let ua = navigator.userAgent
      return /54c/.test(gamepad.id)
        && gamepad.axes.length == this.axes.length
        && gamepad.buttons.length == this.buttons.length
        && ua.includes('Firefox') && ua.includes('Ubuntu')
    },
  },
}

let gamepadsAxisDeadZone = 0.08
let gamepadsConfig = {}

const gamepadMappings = {}

const getGamepadMap = function getGamepadMap(gamepad){
  return gamepadMappings[gamepad.index] || {}
}

class GamepadController {
  constructor() {
    this.initGamepads()
  }

  install(inputController){
    this.inputController = inputController
  }

  initGamepads(){
    this.lastButtonStates = [
      [], // gamepad index 0
      [], // gamepad index 1
      [], // gamepad index 2
      []  // gamepad index 3
    ]
    this.lastAxisStates = [
      [], // gamepad index 0
      [], // gamepad index 1
      [], // gamepad index 2
      []  // gamepad index 3
    ]
    this.lastDPadAxisStates = [
      [], // gamepad index 0
      [], // gamepad index 1
      [], // gamepad index 2
      []  // gamepad index 3
    ]
    window.addEventListener("gamepadconnected", ({gamepad, ...e})=>{
      let [mappingId, mapping] = this.findMappingForGamepad(gamepad)
      if(!mapping){
        // log out an unknown gamepad
        console.warn("No mapping found for gamepad at index %d: %s. %d buttons, %d axes.",
          gamepad.index, gamepad.id,
          gamepad.buttons.length, gamepad.axes.length)
        console.log(gamepad)
      } else {
        console.log(`${mapping.name} connected as controller ${gamepad.index}.`)
        gamepadMappings[gamepad.index] = mapping
      }
      this.getGamepads()
    })
    window.addEventListener("gamepaddisconnected", ({gamepad, ...e})=>{
      console.log('Gamepad disconnected: ', gamepad)
      this.getGamepads()
    })

    // window.addEventListener('gamepadbuttondown', (e)=>{
    //   console.log('gamepad button down: ',e)
    // })
    //
    // window.addEventListener('gamepadbuttonup', (e)=>{
    //   console.log('gamepad button up: ',e)
    // })
  }

  findMappingForGamepad(gamepad){
    return Object.entries(gamepadMaps).find(([id, mapping]) => mapping.test(gamepad)) || []
  }

  getGamepads(){
    // `navigator.getGamepads()` returns an Array-like object. We want to convert
    // it to an actual array, filter out the null values since it will always have
    // a length of 4, and sort by the gamepad's index (possibly unnecessary).
    return Array.from(navigator.getGamepads() || [])
      .filter(gp => gp != null)
      .sort((gpA, gpB) => gpA.index - gpB.index)
      .map((gp)=>{
        gp.map = this.getGamepadMap(gp)
        return gp
      })
  }

  update(delta){
    this._stepGamepads(delta)
  }

  _stepGamepads(delta){
    this.getGamepads().forEach((gamepad, gamepadIndex)=>{
      // for each gamepad that the api reads, poll the state of each button,
      //  sending an event when pressed
      gamepad.buttons.forEach( (button, buttonIndex)=>{
        // check if this button is actually a button or axis
        if(gamepad.map && gamepad.map.buttonAxes && gamepad.map.buttons[buttonIndex] in gamepad.map.buttonAxes){
          // skip this button because the axis will handle it
          return
        }
        // get the last known state of the button
        let lastState = this.getLastState(gamepadIndex,buttonIndex)
        button.index = buttonIndex // tell the button what it's index is
        button.lastState = lastState

        if(button.pressed){
          // if pressed, create a button event and set the buttons last known state
          let buttonEvent = this.createGamepadButtonEvent(gamepad, button, true, button.value, delta)
          buttonEvent && this.inputController.dispatchEvent(this, this.onGamepadButtonEvent, buttonEvent)
          this.setLastState(gamepadIndex,buttonIndex,true)
        } else {
          if(lastState) {
            // if the button is not pressed but its last state was pressed, create a 'button up' event
            if(lastState.pressed) {
              let buttonEvent = this.createGamepadButtonEvent(gamepad, button, false, button.value, delta)
              buttonEvent && this.inputController.dispatchEvent(this, this.onGamepadButtonEvent, buttonEvent)
            }
          }
          // set the buttons last known state for not pressed
          this.setLastState(gamepadIndex,buttonIndex,false)
        }
      })

      // do the same thing for each of the axis (analog sticks)
      // loop through each and poll state
      gamepad.axes.forEach( (axisValue,axisIndex)=>{
        // first determine if this axis is for a stick or a button or a dpad
        let axis = new GamepadAxis(gamepad, axisIndex, axisValue)
        if(axis.stick != null){
          // this is an axis for a stick
          // get the deadZone associated with each axis
          let dz = this.getDeadZone(axisIndex)
          // get the last known state for the axis
          let lastState = this.getLastAxisState(gamepadIndex,axisIndex)

          // if the axisValue of the axis is withing the bounds of the deadzone
          //  create an axis event
          if( axisValue < -dz || axisValue > dz ){
            let axisEvent = this.createGamepadAxisEvent(axis,false, delta)
            this.inputController.dispatchEvent(this,this.onGamepadAxis, axisEvent)
            this.setLastAxisState(gamepadIndex,axisIndex,false)
          } else if(!lastState.zeroed){
            axis.zero()
            let axisEvent = this.createGamepadAxisEvent(axis,true, delta)
            this.inputController.dispatchEvent(this,this.onGamepadAxis, axisEvent)
            this.setLastAxisState(gamepadIndex,axisIndex,true)
          }
        } else if(axis.buttonIndex != null) {
          // this is an axis for a button
          let button = gamepad.buttons[axis.buttonIndex]
          let lastState = this.getLastState(gamepadIndex,axis.buttonIndex)
          button.index = axis.buttonIndex // tell the button what it's index is
          button.lastState = lastState
          if(button.pressed){
            // if pressed, create a button event and set the buttons last known state
            let buttonEvent = this.createGamepadButtonEvent(gamepad,button,true,axisValue, delta)
            buttonEvent && this.inputController.dispatchEvent(this,this.onGamepadButtonEvent,buttonEvent)
            this.setLastState(gamepadIndex,axis.buttonIndex,true)
          } else {
            if(lastState) {
              // if the button is not pressed but its last state was pressed, create a 'button up' event
              if(lastState.pressed) {
                let buttonEvent = this.createGamepadButtonEvent(gamepad,button,false,axisValue, delta)
                buttonEvent && this.inputController.dispatchEvent(this,this.onGamepadButtonEvent,buttonEvent)
              }
            }
            // set the buttons last known state for not pressed
            this.setLastState(gamepadIndex,axis.buttonIndex,false)
          }
        } else if(axis.dpad != null) {
          for(let direction in axis.dpad){
            let lastState = this.getLastDPadAxisState(gamepadIndex,axisIndex)
            if(axis.dpad[direction] == axisValue){
              let button = {pressed: true, value: axisValue, id: direction}
              let buttonEvent = new GamepadButtonEvent(gamepad,button,true,button.value, delta)
              this.inputController.dispatchEvent(this,this.onGamepadButtonEvent,buttonEvent)
              this.setLastDPadAxisState(gamepadIndex,axisIndex,direction,false)
            } else if(lastState.direction == direction && !lastState.zeroed) {
              let button = {pressed: false, value: axisValue, id: direction}
              let buttonEvent = new GamepadButtonEvent(gamepad,button,false,button.value, delta)
              this.inputController.dispatchEvent(this,this.onGamepadButtonEvent,buttonEvent)
              this.setLastDPadAxisState(gamepadIndex,axisIndex,direction,true)
            }
          }
        }
      })
    })
  }

  getLastAxisState(gpIndex,axis){
    return this.lastAxisStates[gpIndex][axis] || {zeroed:true}
  }

  setLastAxisState(gpIndex,axis,state){
    this.lastAxisStates[gpIndex][axis] = {zeroed:state}
  }

  getLastDPadAxisState(gpIndex,axis,direction){
    return (this.lastDPadAxisStates[gpIndex][axis] || (this.lastDPadAxisStates[gpIndex][axis] = {zeroed:true, direction}))
  }

  setLastDPadAxisState(gpIndex,axis,direction,state){
    this.lastDPadAxisStates[gpIndex][axis] = {zeroed:state, direction}
  }

  getDeadZone(gamepadIndex){
    if(gamepadsConfig.hasOwnProperty(gamepadIndex) && gamepadsConfig[gamepadIndex].hasOwnProperty(deadZone)){
      return gamepadsConfig[gamepadIndex].deadZone
    }
    return gamepadsAxisDeadZone
  }

  setDeadZone(deadZone,gamepadIndex){
    if(gamepadIndex !== null && gamepadIndex !== undefined){
      if(gamepadsConfig.hasOwnProperty(gamepadIndex)){
        gamepadsConfig[gamepadIndex].deadZone = deadZone
      } else {
        gamepadsConfig[gamepadIndex] = {deadZone: deadZone}
      }
    } else {
      gamepadsAxisDeadZone = deadZone
    }
  }

  getLastState(i,ix){
    return this.lastButtonStates[i][ix]
  }

  setLastState(i,ix,state){
    this.lastButtonStates[i][ix] = {pressed:state}
  }

  createGamepadButtonEvent(gamepad,button,down,value, delta) {
    button.id = gamepadMappings[gamepad.index].buttons[button.index]
    return button.id ? new GamepadButtonEvent(gamepad,button,down,value, delta) : null
  }

  onGamepadButtonEvent(l,evt){
    if(!l || !l.enabled){
      return
    }
    let func = l[evt.keyIdentifier]
    if(!func){
      return
    }
    if(l.gamepadIndex >= 0 && l.gamepadIndex !== evt.gamepadIndex){
      return
    }

    let bndr = l.binder || l
    let b = func.call(bndr,evt.down,evt)
    if(b === true){
      return true
    }
    // check for if listener wants the only control
    if(l.stopPropagation){
      return true
    }
  }

  _onGamepadButtonEvent(evt){
    let down = evt.down

    // if(this.config.logAllKeys){
    //   console.log(evt.keyCode,evt.keyIdentifier)
    // }
    for(let l of listeners.slice().reverse()){
      if(!l || !l.enabled){
        continue
      }
      let func = l[evt.keyIdentifier]
      if(!func){
        continue
      }
      if(l.gamepadIndex >= 0 && l.gamepadIndex !== evt.gamepadIndex){
        continue
      }

      let bndr = l.binder || l
      let b = func.call(bndr,down,evt)
      if(b === true){
        return
      }
      // check for if listener wants the only control
      if(l.stopPropagation){
        break
      }
    }
    // if(this.config.logUnmappedKeys){
    //   console.log(evt.keyCode,evt.keyIdentifier,evt.button.value, listeners.length===0?"No listeners":"")
    // }
  }

  getGamepadMap(gamepad){
    return getGamepadMap(gamepad)
  }

  createGamepadAxisEvent(axis, zeroed, delta){
    let evt = new GamepadAxisEvent(axis, zeroed, delta)
    if(axis.stick==='leftStick'){
      evt.values.x = axis.gamepad.getValueByAxisId('lx')
      evt.values.y = axis.gamepad.getValueByAxisId('ly')
    } else if(axis.stick==='rightStick'){
      evt.values.x = axis.gamepad.getValueByAxisId('rx')
      evt.values.y = axis.gamepad.getValueByAxisId('ry')
    } else {
      console.log(axisIndex, value)
    }
    return evt
  }

  _onGamepadAxis(evt){
    for(let l of listeners.slice().reverse()){
      if(!l){
        continue
      }

      let func = l[evt.stick]
      if(!func){
        continue
      }
      // only fire for correct gamepadIndex
      if(l.gamepadIndex >= 0 && l.gamepadIndex !== evt.gamepadIndex){
        continue
      }

      let bndr = l.binder || l
      if(func.call(bndr,evt.values.x,evt.values.y,evt) === false){
        continue
      }
      return
    }
  }
  onGamepadAxis(l,evt){
    let func = l[evt.stick]
    if(!func){
      return
    }
    // only fire for correct gamepadIndex
    if(l.gamepadIndex >= 0 && l.gamepadIndex !== evt.gamepadIndex){
      return
    }

    let bndr = l.binder || l
    if(func.call(bndr,evt.values.x,evt.values.y,evt) === false){
      return
    }
  }
}

class GamepadButtonEvent {
  constructor(gamepad,button,down,value, delta) {
    this.gamepad = gamepad
    this.gamepadIndex = gamepad.index
    this.button = button
    this.down = down
    this.type = 'gamepadButtonEvent'
    this.keyCode = button.index
    this.keyIdentifier = button.id
    this.value = value
    this.delta = delta
  }
}

class GamepadAxisEvent {
  constructor(axis, zeroed, delta) {
    this.gamepad = axis.gamepad
    this.gamepadIndex = axis.gamepad.index
    this.axis = axis
    this.stick = axis.stick
    this.keyCode = 200+axis.index
    this.keyIdentifier = axis.id
    this.values = axis.values || {}
    this.type = 'gamepadAxisEvent'
    this.delta = delta
    this.zeroed = zeroed
  }
}

Gamepad.prototype.getValueByAxisId = function(axisId){
  let gp = gamepadMappings[this.index]
  let ix = gp.axes.indexOf(axisId)
  if(ix>-1){
    return this.axes[ix]
  }
  return
}

class GamepadAxis {
  constructor(gamepad, axisIndex, value) {
    this.gamepad = gamepad
    this.id = gamepad.map.axes[axisIndex]
    this.stick = gamepad.map.sticks[this.id]
    this.buttonIndex = gamepad.map.buttonAxes ? gamepad.map.buttonAxes[this.id] : null
    this.dpad = gamepad.map.dpadAxes ? gamepad.map.dpadAxes[this.id] : null
    this.index = axisIndex
    this.value = value
    this.zeroed = false
  }
  zero(){
    this.value = 0
    this.zeroed = true
  }
}

// Object.defineProperty(GamepadButton.prototype, 'value', {
//   set: function(x) {
//     console.log('set value',x)
//     // this.value = x
//   }
// })

export default GamepadController
