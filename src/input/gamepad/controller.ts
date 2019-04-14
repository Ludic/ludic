import InputManager, { InputController, InputState } from '../manager'
import GamepadMaps, { GamepadMapConfig } from './maps'

// augment our InputManager to include gamepad
declare module '../manager' {
  interface InputManager {
    gamepad: InputState<GamepadState>
  }
}


let gamepadsAxisDeadZone = 0.08
let gamepadsConfig = {}

const gamepadMappings: {[key: string]: GamepadMapConfig} = {}

const getGamepadMap = function getGamepadMap(gamepad: Gamepad): GamepadMapConfig {
  return gamepadMappings[gamepad.index] || ({} as GamepadMapConfig)
}

export class GamepadState {
  gamepad: Gamepad
  // normalized buttons and axes
  start: GamepadButton
  select: GamepadButton
  home: GamepadButton // ps/xb button
  left: GamepadButton
  right: GamepadButton
  up: GamepadButton
  down: GamepadButton
  l1: GamepadButton
  l2: GamepadButton
  l3: GamepadButton
  r1: GamepadButton
  r2: GamepadButton
  r3: GamepadButton
  triangle: GamepadButton
  square: GamepadButton
  circle: GamepadButton
  cross: GamepadButton
  extra: GamepadButton
  lx: number
  ly: number
  rx: number
  ry: number
  constructor(){
    this.start = {pressed: false, touched: false, value: 0}
    this.select = {pressed: false, touched: false, value: 0}
    this.home = {pressed: false, touched: false, value: 0} // ps/xb button
    this.left = {pressed: false, touched: false, value: 0}
    this.right = {pressed: false, touched: false, value: 0}
    this.up = {pressed: false, touched: false, value: 0}
    this.down = {pressed: false, touched: false, value: 0}
    this.l1 = {pressed: false, touched: false, value: 0}
    this.l2 = {pressed: false, touched: false, value: 0}
    this.l3 = {pressed: false, touched: false, value: 0}
    this.r1 = {pressed: false, touched: false, value: 0}
    this.r2 = {pressed: false, touched: false, value: 0}
    this.r3 = {pressed: false, touched: false, value: 0}
    this.triangle = {pressed: false, touched: false, value: 0}
    this.square = {pressed: false, touched: false, value: 0}
    this.circle = {pressed: false, touched: false, value: 0}
    this.cross = {pressed: false, touched: false, value: 0}
    this.extra = {pressed: false, touched: false, value: 0}
    this.lx = 0
    this.ly = 0
    this.rx = 0
    this.ry = 0
  }
}

export default class GamepadController implements InputController {
  state: InputState<GamepadState>
  constructor() {
    this.state = new InputState(GamepadState)
    window.addEventListener("gamepadconnected", ({gamepad, ...e}: GamepadEvent)=>{
      let gp = navigator.getGamepads()[gamepad.index]
      console.log(gp)
      let mapping = this.findMappingForGamepad(gamepad)
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
    })
    window.addEventListener("gamepaddisconnected", ({gamepad, ...e}: GamepadEvent)=>{
      console.log('Gamepad disconnected: ', gamepad)
    })

    // window.addEventListener('gamepadbuttondown', (e)=>{
    //   console.log('gamepad button down: ',e)
    // })
    //
    // window.addEventListener('gamepadbuttonup', (e)=>{
    //   console.log('gamepad button up: ',e)
    // })
  }

  install(inputManager: InputManager){
    inputManager.gamepad = this.state
  }

  findMappingForGamepad(gamepad: Gamepad){
    return Object.values(GamepadMaps).find((mapping) => mapping.test(gamepad))
  }

  get gamepads(){
    // convert this array-like into an array
    return Array.from(navigator.getGamepads() || [])
  }

  _parseGamepadState(gamepad: Gamepad): GamepadState {
    const gamepadState = new GamepadState()

    if(gamepad != null) {
      const gamepadMap = this.findMappingForGamepad(gamepad)
  
      // set the raw gamepad onto the gamepad state
      gamepadState.gamepad = gamepad
      
      if(gamepadMap){
        gamepad.buttons.forEach( (button, buttonIndex)=>{
          // check if this button is actually a button or axis
          if(gamepadMap.buttonAxes && gamepadMap.buttons[buttonIndex] in gamepadMap.buttonAxes){
            // skip this button because the axis will handle it
            return
          }
          // get the name for this button at this index from the mapping
          // and set it on the state
          const buttonName = gamepadMap.buttons[buttonIndex]
          gamepadState[buttonName] = button
        })
      }

    }

    // do the same thing for each of the axis (analog sticks)
    // loop through each and poll state
    // gamepad.axes.forEach( (axisValue,axisIndex)=>{
    //   // first determine if this axis is for a stick or a button or a dpad
    //   let axis = new GamepadAxis(gamepad, axisIndex, axisValue)
    //   if(axis.stick != null){
    //     // this is an axis for a stick
    //     // get the deadZone associated with each axis
    //     let dz = this.getDeadZone(axisIndex)
    //     // get the last known state for the axis
    //     let lastState = this.getLastAxisState(gamepadIndex,axisIndex)

    //     // if the axisValue of the axis is withing the bounds of the deadzone
    //     //  create an axis event
    //     if( axisValue < -dz || axisValue > dz ){
    //       let axisEvent = this.createGamepadAxisEvent(axis,false, delta)
    //       this.inputController.dispatchEvent(this,this.onGamepadAxis, axisEvent)
    //       this.setLastAxisState(gamepadIndex,axisIndex,false)
    //     } else if(!lastState.zeroed){
    //       axis.zero()
    //       let axisEvent = this.createGamepadAxisEvent(axis,true, delta)
    //       this.inputController.dispatchEvent(this,this.onGamepadAxis, axisEvent)
    //       this.setLastAxisState(gamepadIndex,axisIndex,true)
    //     }
    //   } else if(axis.buttonIndex != null) {
    //     // this is an axis for a button
    //     let button = gamepad.buttons[axis.buttonIndex]
    //     let lastState = this.getLastState(gamepadIndex,axis.buttonIndex)
    //     button.index = axis.buttonIndex // tell the button what it's index is
    //     button.lastState = lastState
    //     if(button.pressed){
    //       // if pressed, create a button event and set the buttons last known state
    //       let buttonEvent = this.createGamepadButtonEvent(gamepad,button,true,axisValue, delta)
    //       buttonEvent && this.inputController.dispatchEvent(this,this.onGamepadButtonEvent,buttonEvent)
    //       this.setLastState(gamepadIndex,axis.buttonIndex,true)
    //     } else {
    //       if(lastState) {
    //         // if the button is not pressed but its last state was pressed, create a 'button up' event
    //         if(lastState.pressed) {
    //           let buttonEvent = this.createGamepadButtonEvent(gamepad,button,false,axisValue, delta)
    //           buttonEvent && this.inputController.dispatchEvent(this,this.onGamepadButtonEvent,buttonEvent)
    //         }
    //       }
    //       // set the buttons last known state for not pressed
    //       this.setLastState(gamepadIndex,axis.buttonIndex,false)
    //     }
    //   } else if(axis.dpad != null) {
    //     for(let direction in axis.dpad){
    //       let lastState = this.getLastDPadAxisState(gamepadIndex,axisIndex)
    //       if(axis.dpad[direction] == axisValue){
    //         let button = {pressed: true, value: axisValue, id: direction}
    //         let buttonEvent = new GamepadButtonEvent(gamepad,button,true,button.value, delta)
    //         this.inputController.dispatchEvent(this,this.onGamepadButtonEvent,buttonEvent)
    //         this.setLastDPadAxisState(gamepadIndex,axisIndex,direction,false)
    //       } else if(lastState.direction == direction && !lastState.zeroed) {
    //         let button = {pressed: false, value: axisValue, id: direction}
    //         let buttonEvent = new GamepadButtonEvent(gamepad,button,false,button.value, delta)
    //         this.inputController.dispatchEvent(this,this.onGamepadButtonEvent,buttonEvent)
    //         this.setLastDPadAxisState(gamepadIndex,axisIndex,direction,true)
    //       }
    //     }
    //   }
    // })
    return gamepadState
  }

  update(time: number, delta: number){
    this.gamepads.forEach((gamepad, index) => {
      this.state.set(index, this._parseGamepadState(gamepad))
    })
  }

  // getDeadZone(gamepadIndex){
  //   if(gamepadsConfig.hasOwnProperty(gamepadIndex) && gamepadsConfig[gamepadIndex].hasOwnProperty(deadZone)){
  //     return gamepadsConfig[gamepadIndex].deadZone
  //   }
  //   return gamepadsAxisDeadZone
  // }

  // setDeadZone(deadZone,gamepadIndex){
  //   if(gamepadIndex !== null && gamepadIndex !== undefined){
  //     if(gamepadsConfig.hasOwnProperty(gamepadIndex)){
  //       gamepadsConfig[gamepadIndex].deadZone = deadZone
  //     } else {
  //       gamepadsConfig[gamepadIndex] = {deadZone: deadZone}
  //     }
  //   } else {
  //     gamepadsAxisDeadZone = deadZone
  //   }
  // }

  // getGamepadMap(gamepad){
  //   return getGamepadMap(gamepad)
  // }
}
