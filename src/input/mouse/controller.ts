import InputManager, { InputController, InputState } from '../manager'

declare module '../manager' {
  interface InputManager {
    mouse: InputState<MouseState>
  }
}

export class MouseState {
  x: number
  y: number
  down: boolean
  constructor(x: number = 0, y: number = 0, down: boolean = false){
    this.x = x
    this.y = y
    this.down = down
  }
}

export default class MouseController implements InputController {
  state: InputState<MouseState>

  constructor(){
    this.state = new InputState(MouseState)

    self.addEventListener('mousemove', (evt: MouseEvent) => {
      const {which, x, y} = evt
      this.state.set(which, { x, y, down: false})
    }, false)

    self.addEventListener('mousedown', (evt: MouseEvent) => {
      const {which, x, y} = evt
      this.state.set(which, { x, y, down: true, })
    }, false)
    
    self.addEventListener('mouseup', (evt: MouseEvent) => {
      const {which, x, y} = evt
      this.state.set(which, { x, y, down: false, })
    }, false)
  }

  install(manager: InputManager){
    manager.mouse = this.state
  }
}
