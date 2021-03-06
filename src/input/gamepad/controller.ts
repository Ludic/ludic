import InputManager, { InputController, InputState } from '../manager'
import GamepadMaps, { GamepadMapConfig } from './maps'
import { Pool } from '@ludic/ein'

// augment our InputManager to include gamepad
declare module '../manager' {
  interface InputManager {
    gamepad: InputState<GamepadState>
  }
}

declare global {
  interface Gamepad {
    readonly vibrationActuator?: ChromeGamepadHapticActuator
  }
  interface ChromeGamepadHapticActuator {
    readonly type: GamepadHapticActuatorType | 'dual-rumble'
    playEffect(type: ChromeGamepadHapticActuator['type'], params: GamepadEffectParameters): Promise<string>
    reset(): Promise<any>
  }
  interface GamepadEffectParameters {
    duration: number
    startDelay?: number
    strongMagnitude?: number
    weakMagnitude?: number
  }

}

let gamepadsAxisDeadZone = 0.08
let gamepadsConfig = {}

const gamepadMappings: {[key: string]: GamepadMapConfig} = {}

const getGamepadMap = function getGamepadMap(gamepad: Gamepad): GamepadMapConfig {
  return gamepadMappings[gamepad.index] || ({} as GamepadMapConfig)
}

const mapRange = function mapRange(value, oldBottom, oldTop, newBottom, newTop) {
  return (value - oldBottom) / (oldTop - oldBottom) * (newTop - newBottom) + newBottom
}

export interface GamepadVibrationParams {
  duration: number
  type?: ChromeGamepadHapticActuator['type']
  value?: number
  weakMagnitude?: number
  strongMagnitude?: number
  startDelay?: number
}

class GamepadStateButton implements GamepadButton {
  pressed: boolean;
  touched: boolean;
  value: number;
  last?: GamepadStateButton
  id?: string
  constructor(btn: GamepadButton = {} as any, last?: GamepadStateButton){
    this.init(btn, last)
  }
  init({pressed=false, touched=false, value=0}: GamepadButton = {} as any, last?: GamepadStateButton): this {
    this.pressed = pressed
    this.touched = touched
    this.value = value
    this.last = undefined
    if(last != null){
      this.last = GAMEPAD_STATE_BUTTON_POOL.get()
      this.last.init(last)
      GAMEPAD_STATE_BUTTON_POOL.free(last)
    }
    return this
  }
  get toggled(){
    return this.last && this.last.pressed !== this.pressed
  }
  get buttonUp(){
    return this.toggled && !this.pressed
  }
  get buttonDown(){
    return this.toggled && this.pressed
  }
}

export class GamepadState {
  gamepad: Gamepad
  // normalized buttons and axes
  start: GamepadStateButton
  select: GamepadStateButton
  home: GamepadStateButton // ps/xb button
  left: GamepadStateButton
  right: GamepadStateButton
  up: GamepadStateButton
  down: GamepadStateButton
  l1: GamepadStateButton
  l2: GamepadStateButton
  l3: GamepadStateButton
  r1: GamepadStateButton
  r2: GamepadStateButton
  r3: GamepadStateButton
  triangle: GamepadStateButton
  square: GamepadStateButton
  circle: GamepadStateButton
  cross: GamepadStateButton
  extra: GamepadStateButton
  lx: GamepadStateButton
  ly: GamepadStateButton
  rx: GamepadStateButton
  ry: GamepadStateButton
  constructor(){
    // console.log('new gp state')
    this.start = GAMEPAD_STATE_BUTTON_POOL.get()
    this.select = GAMEPAD_STATE_BUTTON_POOL.get()
    this.home = GAMEPAD_STATE_BUTTON_POOL.get()
    this.left = GAMEPAD_STATE_BUTTON_POOL.get()
    this.right = GAMEPAD_STATE_BUTTON_POOL.get()
    this.up = GAMEPAD_STATE_BUTTON_POOL.get()
    this.down = GAMEPAD_STATE_BUTTON_POOL.get()
    this.l1 = GAMEPAD_STATE_BUTTON_POOL.get()
    this.l2 = GAMEPAD_STATE_BUTTON_POOL.get()
    this.l3 = GAMEPAD_STATE_BUTTON_POOL.get()
    this.r1 = GAMEPAD_STATE_BUTTON_POOL.get()
    this.r2 = GAMEPAD_STATE_BUTTON_POOL.get()
    this.r3 = GAMEPAD_STATE_BUTTON_POOL.get()
    this.triangle = GAMEPAD_STATE_BUTTON_POOL.get()
    this.square = GAMEPAD_STATE_BUTTON_POOL.get()
    this.circle = GAMEPAD_STATE_BUTTON_POOL.get()
    this.cross = GAMEPAD_STATE_BUTTON_POOL.get()
    this.extra = GAMEPAD_STATE_BUTTON_POOL.get()
    this.lx = GAMEPAD_STATE_BUTTON_POOL.get()
    this.ly = GAMEPAD_STATE_BUTTON_POOL.get()
    this.rx = GAMEPAD_STATE_BUTTON_POOL.get()
    this.ry = GAMEPAD_STATE_BUTTON_POOL.get()
  }
  /**
   * an abstraction for chrome/spec haptic actuators
   */
  vibrate(params: GamepadVibrationParams){
    // make sure we have a gamepad
    if(this.gamepad != null){
      // check for chrome property
      if(this.gamepad.vibrationActuator != null){
        const weakMagnitude = params.weakMagnitude != null ? params.weakMagnitude : (params.value != null ? params.value : undefined)
        const strongMagnitude = params.strongMagnitude != null ? params.strongMagnitude : (params.value != null ? params.value : undefined)
        const type = params.type != null ? params.type : this.gamepad.vibrationActuator.type
        return this.gamepad.vibrationActuator.playEffect(type, {
          duration: params.duration,
          startDelay: params.startDelay,
          weakMagnitude: weakMagnitude,
          strongMagnitude: strongMagnitude
        })
      } else if(this.gamepad.hapticActuators != null && this.gamepad.hapticActuators.length){
        const value = params.value != null ? params.value : (params.weakMagnitude != null ? params.weakMagnitude : params.strongMagnitude)
        let actuators = this.gamepad.hapticActuators
        if(params.type != null){
          actuators = actuators.filter(actuator => actuator.type === params.type)
        }
        if(value != null){
          return Promise.all(actuators.map(actuator => actuator.pulse(value, params.duration)))
        } else {
          return Promise.resolve()
        }
      }
    }
  }
}

const GAMEPAD_STATE_BUTTON_POOL = new Pool(()=>{
  return new GamepadStateButton({value: 0, pressed: false, touched: false})
}, 200)

const GAMEPAD_STATE_POOL = new Pool(()=>{
  // console.log('create gp state')
  return new GamepadState()
}, 8)

export default class GamepadController implements InputController {
  
  state: InputState<GamepadState>

  constructor() {
    this.state = new InputState(GamepadState, GAMEPAD_STATE_POOL)

    self.addEventListener("gamepadconnected", ({gamepad, ...e}: GamepadEvent)=>{
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
    self.addEventListener("gamepaddisconnected", ({gamepad, ...e}: GamepadEvent)=>{
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

  addMapping(name: string, mapping: GamepadMapConfig){
    GamepadMaps[name] = mapping
  }

  get gamepads(){
    // convert this array-like into an array
    return Array.from(navigator.getGamepads() || [])
  }

  _parseGamepadState(gamepad: Gamepad|null, lastState: GamepadState): GamepadState {
    const gamepadState = GAMEPAD_STATE_POOL.get()

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
          let {value, touched, pressed} = button
          if(gamepadMap.axisButtons && gamepadMap.axisButtons.includes(buttonName)) {
            // map this button value to an axis value of -1,1
            // ex: (0,1) -> (-1,1)
            value = mapRange(value, 0, 1, -1, 1)
          }
          // set it on the state
          // GAMEPAD_STATE_BUTTON_POOL.free(gamepadState[buttonName])
          gamepadState[buttonName].init({pressed, value, touched}, lastState[buttonName])
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
            // GAMEPAD_STATE_BUTTON_POOL.free(gamepadState[axisName])
            gamepadState[axisName].init({pressed: false, touched: false, value: axisValue}, gamepadState[axisName])
          } else if(buttonIndex != null && buttonName != null) {
            // this is an axis for a button
            const button = gamepad.buttons[buttonIndex]
            // GAMEPAD_STATE_BUTTON_POOL.free(gamepadState[buttonName])
            gamepadState[buttonName].init(button, lastState[buttonName])
          } else if(dpad != null) {
            Object.entries(dpad).forEach(([direction, dpadValue]: [string, number]) => {

              const button = gamepadState[direction].init({pressed: false, value: axisValue, touched: false}, lastState[direction])
              button.id = direction
              if(dpadValue == axisValue){
                button.pressed = true
              }
            })
          }
        })
      }
    }
    GAMEPAD_STATE_POOL.free(lastState)
    // Object.values(lastState).forEach((btn)=>{
    //   GAMEPAD_STATE_BUTTON_POOL.free(btn)
    // })
    return gamepadState
  }

  update(time: number, delta: number){
    this.gamepads.forEach((gamepad, index) => {
      this.state.set(index, this._parseGamepadState(gamepad, this.state.get(index)))
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
