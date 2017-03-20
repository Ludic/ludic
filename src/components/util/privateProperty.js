
export default class PrivateProperty {
  constructor() {
    let weakMap = new WeakMap();
    let ctor = function(...getArgs){
      return weakMap.get(...getArgs);
    }
    ctor.set = function(...setArgs){
      return weakMap.set(...setArgs);
    }
    // ctor.get = function(...getArgs){
    //   return weakMap.get(...getArgs);
    // }
    ctor.get = ctor;
    return ctor
  }

  set(...args){
    this.weakMap.set(...setArgs)
  }
}
