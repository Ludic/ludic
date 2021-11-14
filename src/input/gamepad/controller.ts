import Ludic from '../../core/app'
import InputManager, { InputController, InputState } from '../manager'
import GamepadMaps, { GamepadMapConfig, GAMEPAD_BUTTONS, GAMEPAD_AXES, GamepadButtonName, GamepadAxisName } from './maps'

// augment our InputManager to include gamepad
declare module '../manager' {
  interface InputManager {
    gamepad: InputState<FullGamepadState>
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


export interface GamepadStateOptions {
  buttons: ArrayBuffer
  axes: ArrayBuffer
  size: number
}


export class GamepadState {
  private size = 8 // bytes per button (64bit)
  index: number
  gamepad: Gamepad
  map: GamepadMapConfig|undefined
  syncToWorker: Worker|undefined

  // current state
  private buttonsBuffer: ArrayBuffer
  private buttons: Float64Array
  private lastButtons: Float64Array
  private axesBuffer: ArrayBuffer
  private axes: Float64Array
  private lastAxes: Float64Array

  constructor(index: number, options?: GamepadStateOptions){
    this.index = index
    this.size = options?.size ?? 8
    
    this.buttonsBuffer = options?.buttons ?? new ArrayBuffer(18*this.size*2)  // 18 buttons * 8 bytes per button (64bit) * 2 (first half current values, second half last values)
    this.axesBuffer = options?.axes ?? new ArrayBuffer(4*this.size*2)         // 4 axes * 8 bytes per axis (64bit) * 2 (first half current values, second half last values)

    this.buttons = new Float64Array(this.buttonsBuffer, 0, 18)
    this.lastButtons = new Float64Array(this.buttonsBuffer, this.buttonsBuffer.byteLength/2)
    this.axes = new Float64Array(this.axesBuffer, 0, 4)
    this.lastAxes = new Float64Array(this.axesBuffer, this.axesBuffer.byteLength/2)

    if(typeof window === 'undefined'){
      // we are in a worker and should listen for events being passed from main thread
      self.addEventListener('message', ({data})=>{
        if(data){
          if(data.name === `ludic:input:gamepad:${this.index}:init`){
            this.map = data.data.map
            Ludic.events.notify('ludic:input:gamepad:init', {
              index: this.index,
              map: this.map,
            })
          }
          if(data.name === `ludic:input:gamepad:${this.index}:sync`){
            // console.log('sync gamepad')
            this.syncButtons(data.data.buttons, data.data.lastButtons)
            this.syncAxes(data.data.axes, data.data.lastAxes)
          }
        }
      })
    }

    GAMEPAD_BUTTONS.forEach(name => {
      Object.defineProperty(this, name, {
        get(this: GamepadState){
          const buttonIndex = this.map?.buttons[name] ?? -1
          const value = this.buttons[buttonIndex] ?? 0
          const lastValue = this.lastButtons[buttonIndex] ?? 0
          return {
            value,
            lastValue,
            pressed: value == 1,
            buttonDown: value == 1 && lastValue == 0,
            buttonUp: value == 0 && lastValue == 1,
          }
        }
      })
    })
    GAMEPAD_AXES.forEach(name => {
      Object.defineProperty(this, name, {
        get(this: GamepadState){
          const axisIndex = this.map?.axes[name] ?? -1
          const value = this.axes[axisIndex] ?? 0
          const lastValue = this.lastAxes[axisIndex] ?? 0
          return {
            value,
            lastValue,
          }
        }
      })
    })
  }

  private syncButtons(buttons: Float64Array, lastButtons: Float64Array){
    this.buttons.set(buttons)
    this.lastButtons.set(lastButtons)
  }
  private syncAxes(axes: Float64Array, lastAxes: Float64Array){
    this.axes.set(axes)
    this.lastAxes.set(lastAxes)
  }

  // internal
  _transferToWorker(worker: Worker){
    this.syncToWorker = worker
  }

  setButton(index: number, value: number){
    this.lastButtons[index] = this.buttons[index]
    this.buttons[index] = value
  }
  setAxis(index: number, value: number){
    const dz = this.map?.deadzone ?? 0
    this.lastAxes[index] = this.axes[index]
    this.axes[index] = value < -dz || dz < value ? value : 0
  }

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
          // @ts-ignore - Firefox usage
          return Promise.all(actuators.map(actuator => actuator.pulse(value, params.duration)))
        } else {
          return Promise.resolve()
        }
      }
    }
  }

  init(gamepad: Gamepad, {test, ...map}: GamepadMapConfig){
    this.gamepad = gamepad
    this.map = {test, ...map}
    Ludic.events.notify('ludic:input:gamepad:init', {
      index: this.index,
      map: this.map,
    })
    Ludic.events.notify(`ludic:input:gamepad:${this.index}:init`, {
      map,
    }, this.syncToWorker)
  }

  sync(){
    Ludic.events.notify(`ludic:input:gamepad:${this.index}:sync`, {
      buttons: this.buttons,
      lastButtons: this.lastButtons,
      axes: this.axes,
      lastAxes: this.lastAxes,
    }, this.syncToWorker)
  }
}

interface GamepadButtonState {
  value: number
  lastValue: number
  pressed: boolean
  buttonDown: boolean
  buttonUp: boolean
}
interface GamepadAxesState {
  value: number
  lastValue: number
}
export type FullGamepadState = GamepadState&Record<GamepadButtonName, GamepadButtonState>&Record<GamepadAxisName, GamepadAxesState>

export default class GamepadController implements InputController {

  state: InputState<GamepadState>
  private gamepadIndexes = [0, 1, 2, 3]
  private gamepadStates: [GamepadState, GamepadState, GamepadState, GamepadState]


  constructor() {
    this.gamepadStates = [
      new GamepadState(0),
      new GamepadState(1),
      new GamepadState(2),
      new GamepadState(3),
    ]
    this.state = new InputState(Object.fromEntries(this.gamepadStates.map((s,i) => [i,s])))

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
        this.gamepadStates[gamepad.index].init(gamepad, mapping)
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
    inputManager.gamepad = this.state as InputState<FullGamepadState>
  }

  transferToWorker(worker: Worker){
    this.gamepadStates.forEach(gpstate => {
      gpstate._transferToWorker(worker)
    })
  }

  findMappingForGamepad(gamepad: Gamepad){
    return Object.values(GamepadMaps).find((mapping) => mapping.test(gamepad))
  }

  addMapping(name: string, mapping: GamepadMapConfig){
    GamepadMaps[name] = mapping
  }

  get gamepads(){
    // convert this array-like into an array
    // return Array.from(navigator.getGamepads() || [])
    if(typeof window === 'undefined'){
      // console.log('worker gamepad controller')
      return []
    } else {
      // console.log('main gamepad controller')
      const _gamepads = navigator.getGamepads()
      return this.gamepadIndexes.map((ix)=>_gamepads[ix])
    }
    // return []
  }

  _parseGamepadState(gamepad: Gamepad|null, gamepadState: GamepadState) {
    // const gamepadState = GAMEPAD_STATE_POOL.get()
    
    if(gamepad != null) {
      // const gamepadState = this.gamepadStates[gamepad.index]
      // if(gamepadState.map == null){
      //   gamepadState.map = this.findMappingForGamepad(gamepad)
      // }

      // set the raw gamepad onto the gamepad state
      gamepadState.gamepad = gamepad

      // loop over the buttons and set them onto the arraybuffer
      gamepad.buttons.forEach((button, ix)=>{
        gamepadState.setButton(ix, button.value)
      })
      gamepad.axes.forEach((value, ix)=>{
        gamepadState.setAxis(ix, value)
      })

      gamepadState.sync()
    }
    // GAMEPAD_STATE_POOL.free(lastState)
    // Object.values(lastState).forEach((btn)=>{
    //   GAMEPAD_STATE_BUTTON_POOL.free(btn)
    // })
    return gamepadState
  }

  update(time: number, delta: number){
    this.gamepads.forEach((gamepad, index) => {
      // this.state.set(index, this._parseGamepadState(gamepad, this.state.get(index)))
      // this.state.set(index, this._parseGamepadState(gamepad, this.gamepadStates[index]))
      this._parseGamepadState(gamepad, this.gamepadStates[index])
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
