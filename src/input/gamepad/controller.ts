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
          // get the name for this button at this index from the mapping
          const buttonName = gamepadMap.buttons[buttonIndex]
          // check if this button is actually a button or axis
          if(gamepadMap.buttonAxes && buttonName in gamepadMap.buttonAxes){
            // skip this button because the axis will handle it
            return
          }
          // set it on the state
          gamepadState[buttonName] = button
        })
        // do the same thing for each of the axis (analog sticks)
        // loop through each and poll state
        gamepad.axes.forEach( (axisValue,axisIndex)=>{
          // first determine if this axis is for a stick or a button or a dpad
          // let axis = new GamepadAxis(gamepad, axisIndex, axisValue)
          const axisName = gamepadMap.axes[axisIndex]
          const stick = gamepadMap.sticks[axisName]
          const buttonIndex = gamepadMap.buttonAxes ? gamepadMap.buttonAxes[axisName] : null
          const buttonName = buttonIndex != null ? gamepadMap.buttons[buttonIndex] : null
          const dpad = gamepadMap.dpadAxes ? gamepadMap.dpadAxes[axisName] : null

          if(stick != null){
            // this is an axis for an analog stick
            gamepadState[axisName] = axisValue
          } else if(buttonIndex != null) {
            // this is an axis for a button
            const button = gamepad.buttons[buttonIndex]
            gamepadState[buttonName] = button
          } else if(dpad != null) {
            Object.entries(dpad).forEach(([direction, dpadValue]: [string, number]) => {
              const button = {pressed: false, value: axisValue, id: direction}
              if(dpadValue == axisValue){
                button.pressed = true
              }
              gamepadState[direction] = button
            })
          }
        })
      }
    }
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
