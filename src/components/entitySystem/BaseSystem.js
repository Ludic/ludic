export default class BaseSystem {
  constructor(active = true, priority = -1){
    this.active = active;
    this.priority = priority;
  }

  //Overide
  onEntityAdded(manager){
    console.info("BaseSystem.onEntityAdded()");
  }

  onEntityRemoved(manager){
    console.info("BaseSystem.onEntityRemoved()");
  }

  //Overide
  update(){
    console.info("BaseSystem.onUpdate()");
  }
};