export type GamepadButtonName = 'cross'|'circle'|'square'|'triangle'|'l1'|'r1'|'l2'|'r2'|'extra'|'start'|'l3'|'r3'|'up'|'down'|'left'|'right'|'home'|'select'
export type GamepadAxisName = 'lx'|'ly'|'rx'|'ry'
export interface GamepadMapConfig {
  name: string
  buttons: {[K in GamepadButtonName]: number}
  axes: {[K in GamepadAxisName]: number}
  test: (gamepad: Gamepad) => boolean
}
export interface GamepadMap {
  [key: string]: GamepadMapConfig
}

export const GAMEPAD_BUTTONS: GamepadButtonName[] = ['cross','circle','square','triangle','l1','r1','l2','r2','extra','start','l3','r3','up','down','left','right','home','select']
export const GAMEPAD_AXES: GamepadAxisName[] = ['lx','ly','rx','ry']

const MAPS: GamepadMap = {
  'standard': {
    name: 'PS4 Controller (Chrome;macOS)',
    buttons: makeMap(['cross','circle','square','triangle','l1','r1','l2','r2','extra','start','l3','r3','up','down','left','right','home','select']),
    axes: makeMap(['lx','ly','rx','ry']),
    test(gamepad){
      let ua = navigator.userAgent
      const isPS4 = /54c.*5c4/.test(gamepad.id)
        && gamepad.axes.length == this.axes.length
        && gamepad.buttons.length == this.buttons.length
        && ua.includes('Chrome') && ua.includes('Mac OS X')

      const isProController = gamepad.id.includes('Pro Controller')
      
      return (isPS4 || isProController)
    },
  },
  'xbox-sx': {
    name: 'Xbox Series X Controller (Chrome;macOS;Wired)',
    buttons: makeMap(['cross', 'circle', 'square', 'triangle', 'l1', 'r1', 'l2', 'r2', 'select', 'start', 'l3', 'r3', 'up', 'down', 'left', 'right', 'home', 'extra']),
    axes: makeMap(['lx', 'ly', 'rx', 'ry']),
    test(gamepad){
      return gamepad.id.includes('Xbox Series X Controller')
    }
  }
}
export default MAPS


function makeMap<T>(keys: string[]): T {
  return keys.reduce((buttons, name, ix)=>({...buttons, [name]: ix}), {} as T)
}