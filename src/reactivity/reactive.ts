

export function reactive<T extends object>(target: T): T
export function reactive(target: object) {

  const prox = new Proxy(target, {
    
  })
}