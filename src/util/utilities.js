
export function classTypeOf(typeToCheck, type){
  do {
    if(typeToCheck === type){
      return true;
    }
  } while ((typeToCheck = Object.getPrototypeOf(typeToCheck)) !== Function.prototype);
}
