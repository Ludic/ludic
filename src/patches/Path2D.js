Path2D.rect = function(...args){
  let p = new Path2D()
  // .rect(x, y, width, height)
  p.rect(...args)
  return p
}
Path2D.arc = function(...args){
  let p = new Path2D()
  // .arc(x, y, radius, startAngle, endAngle, anticlockwise)
  p.arc(...args)
  return p
}
Path2D.ellipse = function(...args){
  let p = new Path2D()
  // .ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle, anticlockwise)
  p.ellipse(...args)
  return p
}
