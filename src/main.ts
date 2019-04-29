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
  interface OffscreenCanvas extends EventTarget {
    width: number;
    height: number;
    getContext(contextId: "2d", contextAttributes ? : CanvasRenderingContext2DSettings): OffscreenCanvasRenderingContext2D | null;
  }
  var OffscreenCanvas: {
    prototype: OffscreenCanvas;
    new(width: number, height: number): OffscreenCanvas;
  }

  interface Worker {
    postMessage(message: any, transfer?: Array<Transferable|OffscreenCanvas>): void;
  }
}

import Ludic from './core/app'

export * from './core/app'
export * from './core/camera'
export * from './core/canvas'

export * from './render/renderer'

export * from './screen/screen'
export * from './screen/screenManager'

export * from './input/manager'
export * from './input/keyboard/controller'
export { default as KeyboardController } from './input/keyboard/controller'
export * from './input/mouse/controller'
export { default as MouseController } from './input/mouse/controller'
export * from './input/gamepad/controller'
export { default as GamepadController } from './input/gamepad/controller'

export * from './reactivity/dep'
export * from './reactivity/lambda'
export * from './reactivity/state'

export * from './asset/asset'
export * from './asset/assetLoader'
export * from './asset/assetManager'
export * from './asset/audioAsset'
export * from './asset/audioAssetLoader'
export * from './asset/imageAsset'
export * from './asset/imageAssetLoader'

export * from './utils/vector2'

export default Ludic
