import InputManager, { InputState, InputController } from '../manager'

declare module '../manager' {
  interface InputManager {
    keyboard: InputState<KeyState>
  }
}

export class KeyState {
  down: boolean
  constructor(down: boolean = false){
    this.down = down
  }
}

export default class KeyboardController implements InputController {
  state: InputState<KeyState>

  constructor(){
    this.state = new InputState(KeyState)

    let func = (evt: KeyboardEvent)=>{
      const {type, key, code} = evt

      let down = type === 'keydown'

      this.state.set(key, { down })
      // we also want to set the code for this key.
      // this is a layout independent code.
      // ie. qwerty: D key -> key='d' -> code='KeyD'
      //     dvorak: D key -> key='e' -> code='KeyD'
      this.state.set(code, { down })
    }

    window.addEventListener('keydown', func, false)
    window.addEventListener('keyup', func, false)
  }
  
  install(manager: InputManager){
    manager.keyboard = this.state
  }
}