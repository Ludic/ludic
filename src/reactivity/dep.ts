import Lambda from './lambda'

let id = 0
const stack: Array<Lambda> = []

export function pushLambda(l: Lambda){
  stack.push(l)
  Dep.lambda = l
}
export function popLambda(){
  stack.pop()
  Dep.lambda = stack[stack.length - 1]
}

class Dep {
  static lambda: Lambda | null
  id: number = id++
  lambdas: Array<Lambda> = []

  addLambda(lambda: Lambda){
    this.lambdas.push(lambda)
  }

  removeLambda(lambda: Lambda){
    const ix = this.lambdas.indexOf(lambda)
    if(ix > -1){
      this.lambdas.slice(ix, 1)
    }
  }

  depend(){
    if(Dep.lambda){
      Dep.lambda.addDep(this)
    }
  }

  notify(){
    this.lambdas.forEach(lambda => lambda.update())
  }
}

export { Dep, Dep as default }