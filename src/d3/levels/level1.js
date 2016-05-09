import BaseLevel from 'src/d3/levels/BaseLevel';
import Player from 'src/d3/player/Player';


class Level1 extends BaseLevel {
  constructor(){
    super();

    this.player = new Player();
    console.log(this.player);
  }
}
export default Level1;
