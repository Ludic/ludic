import Pool from '../pooling/pool'

export interface ContextStackCall {
  type: 'call'
  prop: string
  args: any[] | null
}
export interface ContextStackSet {
  type: 'set'
  prop: string
  value: any
}

export type ContextStackItem = ContextStackCall|ContextStackSet

export class Context implements CanvasRenderingContext2D {
  
  $ctx: CanvasRenderingContext2D|OffscreenCanvasRenderingContext2D|undefined
  $stack: ContextStackItem[]
  $callPool: Pool<ContextStackCall>
  $setPool: Pool<ContextStackSet>

  constructor(ctx?: CanvasRenderingContext2D|OffscreenCanvasRenderingContext2D){
    this.$ctx = ctx
    this.$stack = []
    this.$callPool = new Pool(()=>{
      return {
        type: 'call',
        prop: '',
        args: null,
      }
    }, 300)
    this.$setPool = new Pool(()=>{
      return {
        type: 'set',
        prop: '',
        value: null
      }
    }, 100)
  }

  render(ctx = this.$ctx){
    if(ctx != null){
      this.$stack.forEach((item)=>{
        if(item.type === 'call'){
          const fn = Reflect.get(ctx, item.prop)
          Reflect.apply(fn, ctx, item.args||[])
          this.$callPool.free(item)
        } else if(item.type === 'set'){
          Reflect.set(ctx, item.prop, item.value)
          this.$setPool.free(item)
        }
      })
      // reset the stack after each render call
      this.$stack.splice(0)
    }
  }

  $push(prop: string, ...args: any[]){
    const item = this.$callPool.get()
    item.prop = prop
    item.args = args
    this.$stack.push(item)
  }
  $set(prop: string, value: any){
    const item = this.$setPool.get()
    item.prop = prop
    item.value = value
    this.$stack.push(item)
  }

  ////////////////////////////////////////
  // CanvasRenderingContext2D methods
  ////////////////////////////////////////

  // @ts-ignore
  get canvas(): HTMLCanvasElement|OffscreenCanvas|null {
    return this.$ctx != null ? this.$ctx.canvas : null
  }

  restore(): void {
    console.warn('Do not use restore.')
    this.$push('restore')
  }
  save(): void {
    console.warn('Do not use save.')
    this.$push('save')
  }
  getTransform(): DOMMatrix {
    throw new Error('Method not implemented.');
  }
  resetTransform(): void {
    this.$push('resetTransform')
  }
  rotate(angle: number): void {
    this.$push('rotate', angle)
  }
  scale(x: number, y: number): void {
    this.$push('scale', x, y)
  }
  setTransform(a: number, b: number, c: number, d: number, e: number, f: number): void
  setTransform(transform?: DOMMatrix2DInit): void
  setTransform(...args: any[]) {
    this.$push('setTransform', ...args)
  }
  transform(a: number, b: number, c: number, d: number, e: number, f: number): void {
    this.$push('transform', a, b, c, d, e, f)
  }
  translate(x: number, y: number): void {
    this.$push('translate', x, y)
  }
  set globalAlpha(val: number){
    this.$set('globalAlpha', val)
  }
  set globalCompositeOperation(val: string){
    this.$set('globalCompositeOperation', val)
  }
  set imageSmoothingEnabled(val: boolean){
    this.$set('imageSmoothingEnabled', val)
  }
  set imageSmoothingQuality(val: ImageSmoothingQuality){
    this.$set('imageSmoothingQuality', val)
  }
  set fillStyle(val: string | CanvasGradient | CanvasPattern){
    this.$set('fillStyle', val)
  }
  set strokeStyle(val: string | CanvasGradient | CanvasPattern){
    this.$set('strokeStyle', val)
  }
  createLinearGradient(x0: number, y0: number, x1: number, y1: number): CanvasGradient {
    throw new Error('Method not implemented.');
  }
  createPattern(image: CanvasImageSource, repetition: string): CanvasPattern {
    throw new Error('Method not implemented.');
  }
  createRadialGradient(x0: number, y0: number, r0: number, x1: number, y1: number, r1: number): CanvasGradient {
    throw new Error('Method not implemented.');
  }
  set shadowBlur(val: number){
    this.$set('shadowBlur', val)
  }
  set shadowColor(val: string){
    this.$set('shadowColor', val)
  }
  set shadowOffsetX(val: number){
    this.$set('shadowOffsetX', val)
  }
  set shadowOffsetY(val: number){
    this.$set('shadowOffsetY', val)
  }
  set filter(val: string){
    this.$set('filter', val)
  }
  clearRect(x: number, y: number, w: number, h: number): void {
    this.$push('clearRect', x, y, w, h)
  }
  fillRect(x: number, y: number, w: number, h: number): void {
    this.$push('fillRect', x, y, w, h)
  }
  strokeRect(x: number, y: number, w: number, h: number): void {
    this.$push('strokeRect', x, y, w, h)
  }
  beginPath(): void {
    this.$push('beginPath')
  }
  clip(fillRule?: CanvasFillRule): void
  clip(path: Path2D, fillRule?: CanvasFillRule): void
  clip(...args: any[]) {
    this.$push('clip', ...args)
  }
  fill(fillRule?: CanvasFillRule): void
  fill(path: Path2D, fillRule?: CanvasFillRule): void
  fill(...args: any[]) {
    this.$push('fill', ...args)
  }
  isPointInPath(x: number, y: number, fillRule?: CanvasFillRule): boolean
  isPointInPath(path: Path2D, x: number, y: number, fillRule?: CanvasFillRule): boolean
  isPointInPath(path: any, x: any, y?: any, fillRule?: any) {
    throw new Error('Method not implemented.');
    return false
  }
  isPointInStroke(x: number, y: number): boolean
  isPointInStroke(path: Path2D, x: number, y: number): boolean
  isPointInStroke(path: any, x: any, y?: any) {
    throw new Error('Method not implemented.');
    return false
  }
  stroke(): void
  stroke(path: Path2D): void
  stroke(...args: any[]) {
    this.$push('stroke', ...args)
  }
  drawFocusIfNeeded(element: Element): void
  drawFocusIfNeeded(path: Path2D, element: Element): void
  drawFocusIfNeeded(...args: any[]) {
    this.$push('draw', ...args)
  }
  scrollPathIntoView(): void
  scrollPathIntoView(path: Path2D): void
  scrollPathIntoView(path?: any) {
    this.$push('scrollPathIntoView', path)
  }
  fillText(text: string, x: number, y: number, maxWidth?: number): void {
    this.$push('fillText', text, x, y, maxWidth)
  }
  measureText(text: string): TextMetrics {
    throw new Error('Method not implemented.');
  }
  strokeText(text: string, x: number, y: number, maxWidth?: number): void {
    this.$push('strokeText', text, x, y, maxWidth)
  }
  drawImage(image: CanvasImageSource, dx: number, dy: number): void
  drawImage(image: CanvasImageSource, dx: number, dy: number, dw: number, dh: number): void
  drawImage(image: CanvasImageSource, sx: number, sy: number, sw: number, sh: number, dx: number, dy: number, dw: number, dh: number): void
  drawImage(...args: any[]) {
    this.$push('drawImage', ...args)
  }
  // @ts-ignore
  createImageData(sw: number, sh: number): ImageData
  createImageData(imagedata: ImageData): ImageData
  createImageData(sw: any, sh?: any) {
    throw new Error('Method not implemented.');
  }
  getImageData(sx: number, sy: number, sw: number, sh: number): ImageData {
    throw new Error('Method not implemented.');
  }
  putImageData(imagedata: ImageData, dx: number, dy: number): void
  putImageData(imagedata: ImageData, dx: number, dy: number, dirtyX: number, dirtyY: number, dirtyWidth: number, dirtyHeight: number): void
  putImageData(...args: any[]) {
    this.$push('putImageData', ...args)
  }
  set lineCap(val: CanvasLineCap){
    this.$set('lineCap', val)
  }
  set lineDashOffset(val: number){
    this.$set('lineDashOffset', val)
  }
  set lineJoin(val: CanvasLineJoin){
    this.$set('lineJoin', val)
  }
  set lineWidth(val: number){
    this.$set('lineWidth', val)
  }
  set miterLimit(val: number){
    this.$set('miterLimit', val)
  }
  getLineDash(): number[] {
    throw new Error('Method not implemented.');
  }
  setLineDash(segments: number[]): void
  setLineDash(segments: Iterable<number>): void
  setLineDash(segments: any) {
    this.$push('setLineDash', segments)
  }
  set direction(val: CanvasDirection){
    this.$set('direction', val)
  }
  set font(val: string){
    this.$set('font', val)
  }
  set textAlign(val: CanvasTextAlign){
    this.$set('textAlign', val)
  }
  set textBaseline(val: CanvasTextBaseline){
    this.$set('textBaseline', val)
  }
  arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, anticlockwise?: boolean): void {
    this.$push('arc', x, y, radius, startAngle, endAngle, anticlockwise)
  }
  arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): void {
    this.$push('arcTo', x1, y1, x2, y2, radius)
  }
  bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number): void {
    this.$push('bezierCurveTo', cp1x, cp1y, cp2x, cp2y, x, y)
  }
  closePath(): void {
    this.$push('closePath')
  }
  ellipse(x: number, y: number, radiusX: number, radiusY: number, rotation: number, startAngle: number, endAngle: number, anticlockwise?: boolean): void {
    this.$push('ellipse', x, y, radiusX, radiusY, rotation, startAngle, endAngle, anticlockwise)
  }
  lineTo(x: number, y: number): void {
    this.$push('lineTo', x, y)
  }
  moveTo(x: number, y: number): void {
    this.$push('moveTo', x, y)
  }
  quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): void {
    this.$push('quadraticCurveTo', cpx, cpy, x, y)
  }
  rect(x: number, y: number, w: number, h: number): void {
    this.$push('rect', x, y, w, h)
  }


}

export default Context