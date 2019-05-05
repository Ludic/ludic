export class Vector2 {
  x: number
  y: number
  
  constructor(x = 0,y = 0) {
    this.x = x
    this.y = y
  }

  get_x(){
    return this.x
  }
  get_y(){
    return this.y
  }
  
  set_x(x: number){
    this.x = x
  }
  set_y(y: number){
    this.y = y
  }

  magnitude(){
    return Math.sqrt(this.x*this.x + this.y*this.y)
  }
  normalize(): this {
    const m = this.magnitude()
    if(m > 0){
      this.scale(1/m)
    }
    return this
  }
  scale(val: number): this {
    this.x = this.x * val
    this.y = this.y * val
    return this
  }
}
export default Vector2