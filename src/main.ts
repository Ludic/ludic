import { Ludic } from './core/app'

// Core
export * from './core/app'
export * from './core/camera'
export * from './core/canvas'

// export * from './render/context'

// Screen
export * from './screen/screen'
export * from './screen/screenManager'

// Input
export * from './input/manager'
export * from './input/keyboard/controller'
export { default as KeyboardController } from './input/keyboard/controller'
export * from './input/mouse/controller'
export { default as MouseController } from './input/mouse/controller'
export * from './input/gamepad/controller'
export { default as GamepadController } from './input/gamepad/controller'

// Assets
export * from './asset/asset'
export * from './asset/assetLoader'
export * from './asset/assetManager'
export * from './asset/audioAsset'
export * from './asset/audioAssetLoader'
export * from './asset/imageAsset'
export * from './asset/imageAssetLoader'

// Utils
export * from './utils/vector2'
export * from './utils/index'
export * from './utils/fps'
export { default as FPSPlugin } from './utils/fps'

// Events
export * from './events/EventBus'

// Worker
export * from './worker/DataBus'

// reactivity
export * from './reactivity/reactivity'

export default Ludic

declare global {
  interface Window {
    mozRequestAnimationFrame: Window['requestAnimationFrame']
    oRequestAnimationFrame: Window['requestAnimationFrame']
    msRequestAnimationFrame: Window['requestAnimationFrame']
  }
  interface HTMLCanvasElement {
    transferControlToOffscreen(): OffscreenCanvas;
  }

  interface OffscreenCanvasRenderingContext2D extends CanvasState, CanvasTransform, CanvasCompositing, CanvasImageSmoothing, CanvasFillStrokeStyles, CanvasShadowStyles, CanvasFilters, CanvasRect, CanvasDrawPath, CanvasUserInterface, CanvasText, CanvasDrawImage, CanvasImageData, CanvasPathDrawingStyles, CanvasTextDrawingStyles, CanvasPath {
    readonly canvas: OffscreenCanvas;
  }
  var OffscreenCanvasRenderingContext2D: {
    prototype: OffscreenCanvasRenderingContext2D;
    new(): OffscreenCanvasRenderingContext2D;
  }
  interface CanvasRenderingContext2DSettings {
    desynchronized?: boolean
  }
  interface OffscreenCanvas extends EventTarget {
    width: number;
    height: number;
    getContext(contextId: "2d", options?: CanvasRenderingContext2DSettings): CanvasRenderingContext2D | null;
    getContext(contextId: "bitmaprenderer", options?: ImageBitmapRenderingContextSettings): ImageBitmapRenderingContext | null;
    getContext(contextId: "webgl", options?: WebGLContextAttributes): WebGLRenderingContext | null;
    getContext(contextId: "webgl2", options?: WebGLContextAttributes): WebGL2RenderingContext | null;
    getContext(contextId: string, options?: any): RenderingContext | null;
  }
  var OffscreenCanvas: {
    prototype: OffscreenCanvas;
    new(width: number, height: number): OffscreenCanvas;
  }

  interface Worker {
    postMessage(message: any, transfer?: Array<Transferable|OffscreenCanvas>): void;
  }
}