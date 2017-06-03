// implementation modeled from http://stackoverflow.com/a/6491621
Object.defineProperty(Object, 'resolve', {
  enumerable: false,
  value: function(path, obj = {}) {
    if(path == null){
      return;
    }
    if(path === ''){
      return obj
    }
    path = path.replace(/\[['"]?(\w+)['"]?\]/g, '.$1'); // convert indexes and brackets (["keyname"] or ['keyname']) to properties
    path = path.replace(/^\./, '');           // strip a leading dot
    var keys = path.split('.');
    return keys.reduce(function(prev, curr) {
        return prev ? prev[curr] : undefined
    }, obj)
  }
})
