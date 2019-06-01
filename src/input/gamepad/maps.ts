export type GamepadButtonName = 'cross'|'circle'|'square'|'triangle'|'l1'|'r1'|'l2'|'r2'|'extra'|'start'|'l3'|'r3'|'up'|'down'|'left'|'right'|'home'|'select'|'rx'|'ry'
export type GamepadAxisName = 'lx'|'ly'|'rx'|'ry'|'l2'|'r2'|'dpadX'|'dpadY'
export interface GamepadMapConfig {
  name: string
  buttons: GamepadButtonName[]
  axes: GamepadAxisName[]
  buttonAxes?: {[key: string]: number}
  dpadAxes?: {
    dpadX: {left: number, right: number},
    dpadY: {up: number, down: number},
  }
  sticks: {[key: string]: string}
  test: (gamepad: Gamepad) => boolean
}
export interface GamepadMap {
  [key: string]: GamepadMapConfig
}

const MAPS: GamepadMap = {
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
  'ps4-4': {
    name: 'PS4 Controller (Chrome;Linux;Wired)',
    buttons: ['cross','circle','square','triangle','l1','r1','l2','r2','extra','start','l3','r3','up','down','left','right','home'],
    axes: ['lx','ly','rx','ry'],
    sticks: {
      lx:'leftStick',
      ly:'leftStick',
      rx:'rightStick',
      ry:'rightStick'
    },
    test(gamepad){
      let ua = navigator.userAgent
      return /054c/.test(gamepad.id)
        && gamepad.axes.length == this.axes.length
        && gamepad.buttons.length == this.buttons.length
        && ua.includes('Chrome') && ua.includes('Linux')
    },
  },
  'ps4-5': {
    name: 'PS4 Controller (Chrome;Linux;Wireless)',
    buttons: ['circle', 'triangle', 'cross', 'square', 'l1','r1','rx','ry','select','start','home','l3', 'up','down','left','right','r3', 'extra'],
    axes: ['lx','ly','l2','r2'],
    buttonAxes: {
      rx:6,
      ry:7,
    },
    sticks: {
      lx:'leftStick',
      ly:'leftStick',
      rx:'rightStick',
      ry:'rightStick'
    },
    test(gamepad){
      let ua = navigator.userAgent
      return /054c/.test(gamepad.id)
        && gamepad.axes.length == this.axes.length
        && gamepad.buttons.length == this.buttons.length
        && ua.includes('Chrome') && ua.includes('Linux')
    },
  },

}
export default MAPS
