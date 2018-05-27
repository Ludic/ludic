// TypeScript Definitions file
declare namespace ludic {

  // app
  export interface LudicAppConfig {
    el? : string | HTMLElement;
  }
  export class LudicApp {
    $config: object;
    $canvas: Canvas;
    $context: CanvasRenderingContext2D;
    $input: InputController;
    // hidden properties
    _running: boolean;
    _lastTime: number;
    constructor(config: LudicAppConfig);
    // methods
    update(delta: number, time: number): void;
    pause(): void;
    run(updateFunction?: function): void;
    use(plugin: any, ...args: any[]): void;
    static use(plugin: any, ...args: any[]): void;
  }

  // Assets
  export class Asset {
    name: string;
    url: string;
    type: string;
    options: object;
    data: any;
    constructor(name: string, url: string, type: string, options?: object)
    load(): void;
    onload(resolve: function, reject: function): function;
    onAssetResolve(assetManager: AssetManager): void;
    onAssetReject(assetManager: AssetManager): void;
    destroy(): void;
  }
  export class AssetManager {
    // assets: {[name: string]: Asset}[];
    assets: object;
    loadQueue: Asset[];
    promiseQueue: Promise<T>[];
    loaders: any[];
    addLoader(fileType: string, loader: AssetLoader): void;
    addLoader(fileTypes: string[], loader: AssetLoader): void;
    loadResource(name: string, url: string, type: string, options?: object, overwrite?: boolean): Promise<T>;
    getAsset(name: string): Asset;
    isLoading(): boolean;
    step(): void;
    setOnAssetsLoadedCallback(callback: function): void;
    destroyAsset(asset: Asset): void;
  }
  export class AssetLoader {
    constructor();
    load(name: string, url: string, type: string, options?: object): any;
  }
  export class ImageAsset extends Asset{
    data: HTMLImageElement;
  }

  // Camera
  export interface CameraOptions {
    inverseY?: boolean;
    inverseX?: boolean;
    x?: number;
    y?: number;
    width?: number;
    height?: number;
  }
  export interface Point {
    x: number;
    y: number;
  }
  export interface ViewportBounds {
    x: number;
    y: number;
    w: number;
    h: number;
  }
  export class Camera {
    x: number;
    y: number;
    width: number;
    height: number;
    inverseX: boolean;
    inverseY: boolean;
    ptm: number;
    viewCenterPixel: Point;
    singleWorldPoint: Point;
    singlePixelPoint: Point;
    offset: Point;
    constructor(options: CameraOptions)
    constructor(canvas: Canvas)
    constructor(ptm: number)
    constructor(width: number, height: number)
    constructor(x: number, y: number, width: number, height: number)
    draw(ctx: CanvasRenderingContext2D): void;
    drawAxes(ctx: CanvasRenderingContext2D): void;
    drawBounds(ctx: CanvasRenderingContext2D, color?: string | CanvasGradient | CanvasPattern): void;
    getWorldPointFromPixelPoint(pixelPoint: Point): Point;
    getPixelPointFromWorldPoint(worldPoint: Point): Point;
    setViewCenterWorld(point: Vector2, instantaneous?: boolean, fraction?: number): void;
    centerWorldToCamera(): void;
    centerWorldToTopLeft(): void;
    getViewCenterWorld(): Point;
    moveCenterBy(toMove: Point, instantaneous?: boolean, fraction?: number): void;
    getViewCenterPixel(): Point;
    getViewportBounds(): ViewportBounds;
    getPTM(): number;
    setPTM(ptm: number): void;
    getOffset(): Point;
    getOffsetX(): number;
    getOffsetY(): number;
    setOffset(offset: Point): void;
    setOffset(x: number, y: number): void;
    setTransform(ctx: CanvasRenderingContext2D): void;
    resetTransform(ctx: CanvasRenderingContext2D): void;
    isPointInBounds(x: number, y: number, ctx: CanvasRenderingContext2D): boolean;
  }

  // canvas
  export class Canvas {
    el: HTMLElement;
    dimension: string;
    constructor(element: string | HTMLElement, dimension?: string = '2d');
    setupCanvas(element: string | HTMLElement): void;
    resize(): void;
    focus(): void;
    getElement(): HTMLElement;
    setElement(element: HTMLElement): void;
    addEventListener(...args: any[]): void;
    removeEventListener(...args: any[]): void;
    getContext(dimension?: string, options?: object): CanvasRenderingContext2D;
    width(): number;
    height(): number;
    clear(clearColor?: string | CanvasGradient | CanvasPattern, context?: CanvasRenderingContext2D): void;
  }

  // audio
  export class AudioController {
    ac: AudioContext;
    playSound(arrayBuffer: ArrayBuffer): void;
  }

  // input
  export class InputEventListener {
    stopPropagation: boolean;
    keyConfig: object;
    options: object;
    binder: any;
    enabled: boolean;
    constructor(options: object, binder?: any);
    $enable(): void;
    $disable(): void;
    // button methods
    start(down: boolean, event: any): void;
    select(down: boolean, event: any): void;
    home(down: boolean, event: any): void;
    left(down: boolean, event: any): void;
    right(down: boolean, event: any): void;
    down(down: boolean, event: any): void;
    up(down: boolean, event: any): void;
    l1(down: boolean, event: any): void;
    l2(down: boolean, event: any): void;
    l3(down: boolean, event: any): void;
    r1(down: boolean, event: any): void;
    r2(down: boolean, event: any): void;
    r3(down: boolean, event: any): void;
    triangle(down: boolean, event: any): void;
    square(down: boolean, event: any): void;
    circle(down: boolean, event: any): void;
    cross(down: boolean, event: any): void;
    extra(down: boolean, event: any): void;
    leftStick(x: number, y: number, event: any): void;
    rightStick(x: number, y: number, event: any): void;
  }
  export class InputController {
    canvas: Canvas;
    constructor(canvas: Canvas);
    addInputController(controller: any): void;
    addInputListener(listener: InputEventListener): void;
    newInputListener(options: object, alsoAdd?: boolean): InputEventListener;
    newInputListener(options: object, binder?: object, alsoAdd?: boolean): InputEventListener;
    removeInputListener(listener: InputEventListener): void;
    update(...args: any[]): void;
  }
  export class GamepadController {
    inputController: InputController;
    update(): void;
  }

  // import path2D from './patches/Path2D'
  // import object from './patches/Object'

  // screen
  export class Screen {
    private _isFinished: boolean;
    private _finalData: object;
    $app: LudicApp; // added during `onAddedToManager`
    constructor(options?: object);
    private _step(delta: number, ...rest: any[]): void;
    update(delta: number, ...rest?: any[]): void;
    finish(data: object): void;
    onDestroy(): void;
    onAddedToManager(manager: ScreenManager): void;
    onRemovedFromManager(manager: ScreenManager): void;
    $mapMethods<T>(component: T, mapping: object): T;
  }
  export class ScreenManager {
    $app: LudicApp;
    constructor(app: LudicApp);
    update(delta: number): void;
    addScreen(screen: Screen, replace?: boolean)
    popScreen(): Screen[];
    popToScreen(screen: Screen): boolean | number;
    addScreenEventListener(listener: ScreenEventListener): void;
    getNewScreenEventListener(alsoAdd?: boolean): ScreenEventListener;
    getNewId(): number;
  }
  export interface ScreenEventListener {
    onScreenFinished?(screen: Screen, manager: ScreenManager, data?: any);
    onScreenAdded?(screen: Screen, manager: ScreenManager, replaced: boolean);
    onScreensRemoved?(screen: Screen, manager: ScreenManager);
    onWarnPopScreen?(stack: Screen[], manager: ScreenManager);
  }

  // util
  // import * as utils from './utils'
  // export {utils}

  // vectors
  export class Vector2 {
    x: number;
    y: number;
    constructor(x: number, y: number);
    get_x(): number;
    get_y(): number;
  }

}
export = ludic;