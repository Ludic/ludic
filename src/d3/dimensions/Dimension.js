import BaseEntity from '../../components/engine/BaseEntity';

class Dimension  {
  constructor(scene, id) {
    this.id = id;
    this.opacity = 0;
    this.scene = scene;
  }

  activate(){
    this.opacity = 1;
  }

  deactivate(){
    this.opacity = 0;
  }

  setOpacity(op){
    this.opacity = op;
  }
}

export default Dimension;
