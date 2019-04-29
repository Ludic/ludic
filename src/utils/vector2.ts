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
}
export default Vector2