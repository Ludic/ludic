import Ludic from '../../core/app'
import { Pool } from '@ludic/ein'
import InputManager, { InputState, InputController } from '../manager'

declare module '../manager' {
  interface InputManager {
    keyboard: KeyboardState
  }
}

const KEYS = [
  'Digit0','Digit1','Digit2','Digit3','Digit4','Digit5','Digit6','Digit7','Digit8','Digit9',
  'KeyA','KeyB','KeyC','KeyD','KeyE','KeyF','KeyG','KeyH','KeyI','KeyJ','KeyK','KeyL','KeyM','KeyN','KeyO','KeyP','KeyQ','KeyR','KeyS','KeyT','KeyU','KeyV','KeyW','KeyX','KeyY','KeyZ',
  'Backquote','Minus','Equal','Backspace','Tab','BracketLeft','BracketRight','Backslash',
  'CapsLock','Semicolon','Quote','Enter','ShiftLeft','Comma','Period','Slash','ShiftRight',
  'ControlLeft','AltLeft','MetaLeft','Space','MetaRight','AltRight','ControlRight','ArrowLeft','ArrowUp','ArrowDown','ArrowRight',
  'Escape','F1','F2','F3','F4','F5','F6','F7','F8','F9','F10','F11','F12',
] as const
const KEY_MAP = Object.fromEntries(KEYS.map((k, ix) => [k, ix]))

export class KeyState {
  pressed: boolean
}

export class KeyboardState extends InputState<KeyState> {
  private size: number
  private buttonsBuffer: ArrayBuffer
  private buttons: Float64Array
  // private lastButtons: Float64Array
  private syncToWorker: Worker|null

  constructor(){
    super({})
    this.size = 8
    
    this.buttonsBuffer = new ArrayBuffer(KEYS.length*this.size)  // Length of KEYS * 8 bytes per key (64bit)

    this.buttons = new Float64Array(this.buttonsBuffer, 0, KEYS.length)
    // this.lastButtons = new Float64Array(this.buttonsBuffer, this.buttonsBuffer.byteLength/2)

    if(typeof window === 'undefined'){
      // we are in a worker and should listen for events being passed from main thread
      self.addEventListener('message', ({data})=>{
        if(data){
          if(data.name === `ludic:input:keyboard:sync`){
            this.buttons.set(data.data.buttons)
          }
        }
      })
    }
  }

  set(key: number, val: boolean){
    const value = this.buttons[key] = val ? 1 : 0
    return {
      pressed: value == 1,
    }
  }
  get(key: string|number){
    const keyId = typeof key === 'number' ? key : KEY_MAP[key]
    const value = this.buttons[keyId]
    return {
      pressed: value == 1,
    }
  }

  _transferToWorker(worker: Worker){
    this.syncToWorker = worker
  }

  sync(){
    if(this.syncToWorker != null){
      Ludic.events.notify(`ludic:input:keyboard:sync`, {
        buttons: this.buttons,
      }, this.syncToWorker)
    }
  }
}

export default class KeyboardController implements InputController {
  state: KeyboardState

  syncToWorker: Worker|null

  constructor(){
    // const keyboardState = new KeyboardState()
    this.state = new KeyboardState()

    let func = (evt: KeyboardEvent)=>{
      const {type, key, code} = evt

      let down = type === 'keydown'
      const keyId = KEY_MAP[code]

      this.state.set(keyId, down)
      // we also want to set the code for this key.
      // this is a layout independent code.
      // ie. qwerty: D key -> key='d' -> code='KeyD'
      //     dvorak: D key -> key='e' -> code='KeyD'
      // this.state.set(code, { down })
    }

    self.addEventListener('keydown', func, false)
    self.addEventListener('keyup', func, false)
  }
  
  install(manager: InputManager){
    manager.keyboard = this.state
  }

  transferToWorker(worker: Worker){
    this.state._transferToWorker(worker)
  }

  update(){
    this.state.sync()
  }
}
