import Ludic from '../../core/app'
import InputManager, { InputController, InputState } from '../manager'

declare module '../manager' {
  interface InputManager {
    mouse: MouseState
  }
}

enum PositionKey {
  x,y,movementX,movementY,
  deltaX, deltaY,
}
const POSITIONS_LENGTH = Object.keys(PositionKey).length / 2
enum ButtonKey {
  mouse1 = 0,
  mouse2 = 2,
  mouse3 = 1,
  mouse4 = 3,
  mouse5 = 4,
}
console.log(ButtonKey)
const BUTTONS_LENGTH = Object.keys(ButtonKey).length / 2

interface MouseSyncData {
  name: string
  data: {
    positions: Float64Array
    buttons: Float64Array
    lastButtons: Float64Array
  }
}

export class MouseStateData {
  // x: number
  // y: number
  // down: boolean
  value: number
  lastValue: number
  pressed: boolean
  buttonUp: boolean
  buttonDown: boolean
}

export class MouseState extends InputState<MouseStateData> {
  
  declare state: {
    [k in keyof typeof PositionKey]: MouseStateData
  } & {
    [k in keyof typeof ButtonKey]: MouseStateData
  }

  private size = 8
  private positionsBuffer: ArrayBuffer
  private positions: Float64Array
  private buttonsBuffer: ArrayBuffer
  private buttons: Float64Array
  private lastButtons: Float64Array
  private dirty = false
  private syncToWorker: Worker|null
  private buttonsDown = new Set()
  
  constructor(){
    super({})
    
    this.positionsBuffer = new ArrayBuffer(POSITIONS_LENGTH*this.size) // length of keys * 8 bytes per position (64bit)
    this.positions = new Float64Array(this.positionsBuffer)
    this.buttonsBuffer = new ArrayBuffer(BUTTONS_LENGTH*this.size*2) // length of keys * 8 bytes per position (64bit)
    this.buttons = new Float64Array(this.buttonsBuffer, 0, BUTTONS_LENGTH)
    this.lastButtons = new Float64Array(this.buttonsBuffer, this.buttonsBuffer.byteLength/2)

    const that = this
    this.state = new Proxy({} as MouseState['state'], {
      get(this: null, target, prop, receiver): MouseStateData {
        if(prop in ButtonKey){
          const lastValue = that.lastButtons[ButtonKey[prop]]
          const value = that.buttons[ButtonKey[prop]]
          return {
            value,
            lastValue,
            pressed: value == 1,
            buttonUp: value == 0 && lastValue == 1,
            buttonDown: value == 1 && lastValue == 0,
          }
        } else if(prop in PositionKey) {
          const value = that.positions[PositionKey[prop]]
          return {
            value: value,
            lastValue: 0,
            pressed: false,
            buttonUp: false,
            buttonDown: false,
          }
        }
        return {
          value: 0,
          lastValue: 0,
          pressed: false,
          buttonUp: false,
          buttonDown: false,
        }
      }
    })

    if(typeof window === 'undefined'){
      // we are in a worker and should listen for events being passed from main thread
      self.addEventListener('message', ({data}: MessageEvent<MouseSyncData>)=>{
        if(data){
          if(data.name === `ludic:input:mouse:sync`){
            this.positions.set(data.data.positions)
            this.buttons.set(data.data.buttons)
            this.lastButtons.set(data.data.lastButtons)
          }
        }
      })
    }
  }

  setMove(x: number, y: number, movementX: number, movementY: number){
    this.positions[PositionKey.x] = x
    this.positions[PositionKey.y] = y
    this.positions[PositionKey.movementX] = movementX
    this.positions[PositionKey.movementY] = movementY
    // TODO: there might be a similar but for movement for lingering values in the buffer
    // and they might need to be cleared out like the buttons do. so we might need to set a dirty
    // flag and then clear out the values each frame
  }
  setButton(btn: ButtonKey, val: boolean){
    val ? this.buttonsDown.add(ButtonKey[btn]) : this.buttonsDown.delete(ButtonKey[btn])
    this.dirty = true
    const last = this.lastButtons[btn] = this.buttons[btn]
    const value = this.buttons[btn] = val ? 1 : 0
  }
  setWheel(deltaX: number, deltaY: number){
    this.positions[PositionKey.deltaX] = deltaX
    this.positions[PositionKey.deltaY] = deltaY
  }

  update(){
    this.sync()
    if(this.buttonsDown.size === 0 && this.dirty){
      this.dirty = false
      this.lastButtons.fill(0)
    } else if(this.buttonsDown.size > 0){
      this.lastButtons.set(this.buttons)
    }
    // clear wheel
    this.positions[PositionKey.deltaX] = 0
    this.positions[PositionKey.deltaY] = 0
  }

  sync(){
    if(this.syncToWorker != null){
      Ludic.events.notify(`ludic:input:mouse:sync`, {
        positions: this.positions,
        buttons: this.buttons,
        lastButtons: this.lastButtons,
      }, this.syncToWorker)
    }
  }

  _transferToWorker(worker: Worker){
    this.syncToWorker = worker
  }

}

export default class MouseController implements InputController {
  state: MouseState

  active = true

  constructor(){
    this.state = new MouseState()

    self.addEventListener('mousemove', (evt: MouseEvent) => {
      const { x, y, movementX, movementY } = evt
      this.state.setMove(x, y, movementX, movementY)
    }, {capture: true, passive: true})

    self.addEventListener('mousedown', (evt: MouseEvent) => {
      this.state.setButton(evt.button, true)
    }, {capture: true, passive: true})
    
    self.addEventListener('mouseup', (evt: MouseEvent) => {
      this.state.setButton(evt.button, false)
    }, {capture: true, passive: true})

    self.addEventListener('contextmenu', (evt: MouseEvent) => {
      evt.preventDefault()
    }, {capture: true})

    self.addEventListener('wheel', (evt: WheelEvent) => {
      const { deltaX, deltaY } = evt
      this.state.setWheel(deltaX, deltaY)
    }, {capture: true, passive: true})
  }

  install(manager: InputManager){
    manager.mouse = this.state
  }

  transferToWorker(worker: Worker){
    this.state._transferToWorker(worker)
  }

  update(){
    if(this.active){
      // this is to make sure we process the update on the next tick because if
      // we process it right after we handle a mouse event, we risk losing
      // previous loop data and both last and current states are equal.
      Promise.resolve().then(()=>{
        this.state.update()
      })
    }
  }
}
