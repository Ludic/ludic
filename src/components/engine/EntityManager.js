import Box2D from '../box2d/box2d';

class EntityManager {
  constructor(){
    this.entities = [];
    this.entityUID = 0;
  }

  addEntity(entity){
    entity._id = this.entityUID++;
    this.entities.push(entity);
  }

  step(ctx, delta){
    this.entities.sort((entA, entB)=>{
      return entA.zIndex-entB.zIndex;
    });
    for(var i = 0; i < this.entities.length; i++){
      var entity = this.entities[i];
      this.activateEntity(entity);
      this.drawEntity(entity, ctx, delta);

      if(entity.needsDestroy){
        entity.destroy();
        this.entities.splice(i, 1);
      }
    }
  }

  activateEntity(entity){
    if(this.scene.currentDimension === entity.dimension || entity.allDim){
      if(!entity.active){
        entity.activate();
      }
    } else {
      entity.deactivate();
    }
  }

  drawEntity(entity, ctx, delta){
    entity.draw(ctx, delta);
  }

  destroy(){
    for(var i=0;i<this.entities.length;i++){
      this.entities[i].destroy();
    }
    this.entities = [];
  }

}

export default new EntityManager();
