import Util from '../util/util';
import BaseSystem from '../entitySystem/BaseSystem'


export default class InputSystem extends BaseSystem {
  constructor(inputController, active, priority) {
    super(active, priority);
    this.inputController = inputController;
  }

  update(delta){
    this.inputController.step(delta);
  }
}
