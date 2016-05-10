import BaseLevel from '../levels/BaseLevel';
import Player from '../player/Player';


class Level1 extends BaseLevel {
  constructor(){
    super();

    this.player = new Player();
    console.log(this.player);
  }
}
export default Level1;
