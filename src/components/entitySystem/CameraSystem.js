import BaseSystem from './BaseSystem';

export default class CameraSystem extends BaseSystem {
  constructor(active, priority, camera){
    super(active, priority)
    this.camera = camera;
  }

  //Overide
  onEntityAdded(manager){
  }

  onEntityRemoved(manager){
  }

  //Overide
  update(delta){
    this.camera.update(delta);
  }
};
