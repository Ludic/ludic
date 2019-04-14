import Dep, { pushLambda, popLambda } from './dep'

export type LambdaFn<O> = (owner: O)=>any

// export class WeakMapArray<T extends object> extends Array<T> {
//   private _map = new WeakMap<T, Array<T>>()
//   constructor(){
//     super()
//     return new Proxy(this, {
//       set(this: WeakMapArray<T>, target, prop, value: T){
//         if(!isNaN(prop as number)){
//           if(!this._map.has(value)){
            
//           }
//         }
//         return Reflect.set(target, prop, value)
//       }
//     })
//   }
//   has(obj: T){
//     return this._map.has(obj)
//   }
// }

class Lambda<O=any> {
  owner: O
  fn: LambdaFn<O>
  value: any
  depIds: Set<number> = new Set()
  newDepIds: Set<number> = new Set()
  deps: Array<Dep> = []
  newDeps: Array<Dep> = []
  
  constructor(owner: O, fn: LambdaFn<O>){
    this.owner = owner
    this.fn = fn

    this.compute()
  }

  addDep(dep: Dep){
    if(!this.newDepIds.has(dep.id)){
      this.newDepIds.add(dep.id)
      this.newDeps.push(dep)
      if (!this.depIds.has(dep.id)) {
        dep.addLambda(this)
      }
    }
  }

  compute(){
    pushLambda(this)
    this.value = this.fn.call(this.owner, this.owner)
    popLambda()
    this.clean()
  }

  clean(){
    this.deps.forEach(dep => {
      if(!this.newDepIds.has(dep.id)){
        dep.removeLambda(this)
      }
    })
    // Swap Sets and Arrays and clear out new vars
    let tmp: any = this.depIds
    this.depIds = this.newDepIds
    this.newDepIds = tmp
    this.newDepIds.clear()
    tmp = this.deps
    this.deps = this.newDeps
    this.newDeps = tmp
    this.newDeps.length = 0
  }

  update(){
    this.compute()
  }


}

export { Lambda, Lambda as default }