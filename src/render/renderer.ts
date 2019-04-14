// We omit 'canvas' because it is not assignable
export type OffscreenCanvasRenderingContext2DKeys = keyof Pick<OffscreenCanvasRenderingContext2D, Exclude<keyof OffscreenCanvasRenderingContext2D, 'canvas'>>
export interface RenderingContextComponent {
  name: OffscreenCanvasRenderingContext2DKeys
}
export class RenderingContextFunctionComponent implements RenderingContextComponent {
  name: OffscreenCanvasRenderingContext2DKeys
  args: any[]
  constructor(name: OffscreenCanvasRenderingContext2DKeys, args: any[] = []){
    this.name = name
    this.args = args
  }
}
export class RenderingContextPropertyComponent implements RenderingContextComponent {
  name: OffscreenCanvasRenderingContext2DKeys
  value: any
  constructor(name: OffscreenCanvasRenderingContext2DKeys, value: any){
    this.name = name
    this.value = value
  }
}

export class RenderingContext implements OffscreenCanvasRenderingContext2D {

  static render(renderingContext: RenderingContext, ctx: OffscreenCanvasRenderingContext2D){
    renderingContext.$components.forEach((comp) => {
      if(this.componentIsFunction(comp)){
        (ctx[comp.name] as ()=>void).apply(ctx, comp.args)
      } else if(this.componentIsProperty(comp)){
        ctx[comp.name] = comp.value
      }
    })
  }
  static componentIsFunction(comp: RenderingContextComponent): comp is RenderingContextFunctionComponent {
    return comp.hasOwnProperty('args')
  }
  static componentIsProperty(comp: RenderingContextComponent): comp is RenderingContextPropertyComponent {
    return comp.hasOwnProperty('value')
  }

  $components: RenderingContextComponent[] = []
  canvas: HTMLCanvasElement;

  restore(): void {
    this.$components.push(new RenderingContextFunctionComponent('restore'))
  }
  save(): void {
    this.$components.push(new RenderingContextFunctionComponent('save'))
  }
  getTransform(): DOMMatrix {
    throw new Error('Method not implemented.');
  }
  resetTransform(): void {
    throw new Error('Method not implemented.');
  }
  rotate(angle: number): void {
    throw new Error('Method not implemented.');
  }
  scale(x: number, y: number): void {
    throw new Error('Method not implemented.');
  }
  setTransform(a: number, b: number, c: number, d: number, e: number, f: number): void;
  setTransform(transform?: DOMMatrix2DInit): void;
  setTransform(a?: any, b?: any, c?: any, d?: any, e?: any, f?: any) {
    throw new Error('Method not implemented.');
  }
  transform(a: number, b: number, c: number, d: number, e: number, f: number): void {
    throw new Error('Method not implemented.');
  }
  translate(x: number, y: number): void {
    throw new Error('Method not implemented.');
  }
  globalAlpha: number;
  globalCompositeOperation: string;
  imageSmoothingEnabled: boolean;
  imageSmoothingQuality: ImageSmoothingQuality;
  fillStyle: string | CanvasGradient | CanvasPattern;
  strokeStyle: string | CanvasGradient | CanvasPattern;
  createLinearGradient(x0: number, y0: number, x1: number, y1: number): CanvasGradient {
    throw new Error('Method not implemented.');
  }
  createPattern(image: CanvasImageSource, repetition: string): CanvasPattern {
    throw new Error('Method not implemented.');
  }
  createRadialGradient(x0: number, y0: number, r0: number, x1: number, y1: number, r1: number): CanvasGradient {
    throw new Error('Method not implemented.');
  }
  shadowBlur: number;
  shadowColor: string;
  shadowOffsetX: number;
  shadowOffsetY: number;
  filter: string;
  clearRect(x: number, y: number, w: number, h: number): void {
    throw new Error('Method not implemented.');
  }
  fillRect(x: number, y: number, w: number, h: number): void {
    throw new Error('Method not implemented.');
  }
  strokeRect(x: number, y: number, w: number, h: number): void {
    this.$components.push(new RenderingContextFunctionComponent('strokeRect', [x,y,w,h]))
  }
  beginPath(): void {
    throw new Error('Method not implemented.');
  }
  clip(fillRule?: CanvasFillRule): void;
  clip(path: Path2D, fillRule?: CanvasFillRule): void;
  clip(path?: any, fillRule?: any) {
    throw new Error('Method not implemented.');
  }
  fill(fillRule?: CanvasFillRule): void;
  fill(path: Path2D, fillRule?: CanvasFillRule): void;
  fill(path?: any, fillRule?: any) {
    throw new Error('Method not implemented.');
  }
  isPointInPath(x: number, y: number, fillRule?: CanvasFillRule): boolean;
  isPointInPath(path: Path2D, x: number, y: number, fillRule?: CanvasFillRule): boolean;
  isPointInPath(path: any, x: any, y?: any, fillRule?: any) {
    throw new Error('Method not implemented.');
  }
  isPointInStroke(x: number, y: number): boolean;
  isPointInStroke(path: Path2D, x: number, y: number): boolean;
  isPointInStroke(path: any, x: any, y?: any) {
    throw new Error('Method not implemented.');
  }
  stroke(): void;
  stroke(path: Path2D): void;
  stroke(path?: any) {
    throw new Error('Method not implemented.');
  }
  drawFocusIfNeeded(element: Element): void;
  drawFocusIfNeeded(path: Path2D, element: Element): void;
  drawFocusIfNeeded(path: any, element?: any) {
    throw new Error('Method not implemented.');
  }
  scrollPathIntoView(): void;
  scrollPathIntoView(path: Path2D): void;
  scrollPathIntoView(path?: any) {
    throw new Error('Method not implemented.');
  }
  fillText(text: string, x: number, y: number, maxWidth?: number): void {
    throw new Error('Method not implemented.');
  }
  measureText(text: string): TextMetrics {
    throw new Error('Method not implemented.');
  }
  strokeText(text: string, x: number, y: number, maxWidth?: number): void {
    throw new Error('Method not implemented.');
  }
  drawImage(image: CanvasImageSource, dx: number, dy: number): void;
  drawImage(image: CanvasImageSource, dx: number, dy: number, dw: number, dh: number): void;
  drawImage(image: CanvasImageSource, sx: number, sy: number, sw: number, sh: number, dx: number, dy: number, dw: number, dh: number): void;
  drawImage(image: any, sx: any, sy: any, sw?: any, sh?: any, dx?: any, dy?: any, dw?: any, dh?: any) {
    throw new Error('Method not implemented.');
  }
  createImageData(sw: number, sh: number): ImageData;
  createImageData(imagedata: ImageData): ImageData;
  createImageData(sw: any, sh?: any) {
    throw new Error('Method not implemented.');
  }
  getImageData(sx: number, sy: number, sw: number, sh: number): ImageData {
    throw new Error('Method not implemented.');
  }
  putImageData(imagedata: ImageData, dx: number, dy: number): void;
  putImageData(imagedata: ImageData, dx: number, dy: number, dirtyX: number, dirtyY: number, dirtyWidth: number, dirtyHeight: number): void;
  putImageData(imagedata: any, dx: any, dy: any, dirtyX?: any, dirtyY?: any, dirtyWidth?: any, dirtyHeight?: any) {
    throw new Error('Method not implemented.');
  }
  lineCap: CanvasLineCap;
  lineDashOffset: number;
  lineJoin: CanvasLineJoin;
  // lineWidth: number;
  set lineWidth(val: number){
    this.$components.push(new RenderingContextPropertyComponent('lineWidth', val))
  }
  miterLimit: number;
  getLineDash(): number[] {
    throw new Error('Method not implemented.');
  }
  setLineDash(segments: number[]): void {
    throw new Error('Method not implemented.');
  }
  direction: CanvasDirection;
  font: string;
  textAlign: CanvasTextAlign;
  textBaseline: CanvasTextBaseline;
  arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, anticlockwise?: boolean): void {
    throw new Error('Method not implemented.');
  }
  arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): void {
    throw new Error('Method not implemented.');
  }
  bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number): void {
    throw new Error('Method not implemented.');
  }
  closePath(): void {
    throw new Error('Method not implemented.');
  }
  ellipse(x: number, y: number, radiusX: number, radiusY: number, rotation: number, startAngle: number, endAngle: number, anticlockwise?: boolean): void {
    throw new Error('Method not implemented.');
  }
  lineTo(x: number, y: number): void {
    throw new Error('Method not implemented.');
  }
  moveTo(x: number, y: number): void {
    throw new Error('Method not implemented.');
  }
  quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): void {
    throw new Error('Method not implemented.');
  }
  rect(x: number, y: number, w: number, h: number): void {
    throw new Error('Method not implemented.');
  }


}
