import Canvas from '../canvas/canvas'
import Camera from '../base/camera'
import * as Utils from '../utils'
import ScreenManager from '../screen/screenManager'
import InputController from '../input/inputController'

const pluginArgs = new WeakMap()

let $install = function $install(plugin, ...args){
  if (typeof plugin.plugin === 'function') {
    plugin.plugin.apply(plugin, args)
  } else if (typeof plugin === 'function') {
    plugin.apply(null, args)
  }
}

export class LudicApp {
  constructor(config) {
    this.$config = config
    this.$canvas = new Canvas(config.el)
    this.$context = this.$canvas.getContext()
    this.$input = new InputController(this.$canvas)
    this.$utils = Utils

    // install plugins
    let plugins = LudicApp._plugins
    if(plugins && Array.isArray(plugins)){
      plugins.forEach(plugin => $install(plugin, ...[this, ...(pluginArgs.get(plugin) || [])]))
    }

    //Put the app context on the window in devmode
    if(this.$config.dev){
      // TODO: devvy stuff
    }

    this._running = false
    this._lastTime = Date.now()

    this._requestAnimFrame = (()=>{
      return  window.requestAnimationFrame       ||
              window.webkitRequestAnimationFrame ||
              window.mozRequestAnimationFrame    ||
              window.oRequestAnimationFrame      ||
              window.msRequestAnimationFrame     ||
              (function(){
                console.warn('LudicApp: falling back to basic requestAnimationFrame')
                return false
              })()                               ||
              function( callback ){
                window.setTimeout(callback, 1000 / 60)
              }
    })()

    // do some binding
    this._requestAnimFrame = this._requestAnimFrame.bind(window)
    this._animate = this._animate.bind(this)
  }

  // override
  update(delta,time) {}

  _animate(time) {
    if(this._running){
      this._requestAnimFrame(this._animate)

      let delta = (time - this._lastTime) / 1000
      this._lastTime = this._time = time

      if(!Number.isNaN(delta)){
        this.$context.save()
        this.update(delta,time)
        this.$context.restore()
      }
    }
  }

  pause() {
    this._running = !this._running
    if (this._running)
      this._animate()
  }

  run(updateFunction){
    this._running = true
    if(updateFunction != null){
      this.update = updateFunction
    }
    this._animate()
  }

  use(plugin, ...args){
    $install(plugin, [this, ...args])
  }

}

export default function app(config){
  return new LudicApp(config)
}

LudicApp.use = app.use = function(plugin){
  const installedPlugins = (LudicApp._plugins || (LudicApp._plugins = []))
  if(pluginArgs.has(plugin)){
    return LudicApp
  }

  // additional parameters
  const args = Array.from(arguments)
  args.splice(0,1)
  installedPlugins.push(plugin)
  pluginArgs.set(plugin, args)
  return LudicApp
}
