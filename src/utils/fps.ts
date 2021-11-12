import Ludic, { LudicPluginClass, LudicConstructor } from '../core/app'

export interface FPS {
  readonly count: number
  readonly _times: number[]
}

export default class FPSPlugin implements LudicPluginClass {

  install(app: LudicConstructor){
    app.globals.fps = {count: 0, _times: []}
    app.registerUpdateFunction(()=>{
      const now = performance.now()
      while (app.globals.fps._times.length > 0 && app.globals.fps._times[0] <= now - 1000) {
        app.globals.fps._times.shift()
      }
      app.globals.fps._times.push(now)
      app.globals.fps.count = app.globals.fps._times.length
      if(app.isWorker && app.$instance.workerPort){
        app.events.notify('ludic:plugin:fps', {
          count: app.globals.fps.count,
        }, app.$instance.workerPort)
      }
    })
  }
}

export function useFps(cb: (fps: number)=>void){
  Ludic.events.listen('ludic:plugin:fps', (data)=>{
    cb(data.count)
  })
}
