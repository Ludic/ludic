(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Ludic"] = factory();
	else
		root["Ludic"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 19);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Canvas = function () {
  function Canvas(element) {
    var dimension = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '2d';

    _classCallCheck(this, Canvas);

    this.dimension = dimension;
    this.setupCanvas(element);
    this.focus();
  }

  _createClass(Canvas, [{
    key: 'setupCanvas',
    value: function setupCanvas(element) {
      var canvas = void 0;

      if (typeof element === 'string') {
        canvas = document.querySelector(element);
      } else if (element instanceof HTMLElement) {
        canvas = element;
      } else {
        console.warn('Ludic::Canvas: Unknown property type passed as \'el\'.', element);
      }

      if (canvas != null) {
        // make sure canvas has 'tabindex' attr for key binding
        canvas.setAttribute('tabindex', canvas.getAttribute('tabindex') || '1');
        canvas.style.position = 'relative';
        this.setElement(canvas);
      } else {
        console.warn('Ludic::Canvas: Ludic does not have a canvas to bind to. Please supply one with the \'el\' config property.');
      }
    }
  }, {
    key: 'resize',
    value: function resize() {
      this.el.width = window.innerWidth;
      this.el.height = window.innerHeight;
    }
  }, {
    key: 'focus',
    value: function focus() {
      this.el.focus();
    }
  }, {
    key: 'getElement',
    value: function getElement() {
      return this.el;
    }
  }, {
    key: 'setElement',
    value: function setElement(canvas) {
      this.el = canvas;
    }
  }, {
    key: 'addEventListener',
    value: function addEventListener() {
      this.el.addEventListener.apply(this.el, arguments);
    }
  }, {
    key: 'removeEventListener',
    value: function removeEventListener() {
      this.el.removeEventListener.apply(this.el, arguments);
    }
  }, {
    key: 'getContext',
    value: function getContext() {
      var dimension = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.dimension;

      return this.el.getContext(dimension);
    }
  }, {
    key: 'height',
    value: function height() {
      return this.el.height;
    }
  }, {
    key: 'width',
    value: function width() {
      return this.el.width;
    }

    /**
     * Helper function to clear the current context at full width-height
     * @param {String} clearColor - color to clear the screen with
     */

  }, {
    key: 'clear',
    value: function clear() {
      var clearColor = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'white';
      var context = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.getContext();

      context.fillStyle = clearColor;
      context.clearRect(0, 0, this.width(), this.height());
      context.fillRect(0, 0, this.width(), this.height());
    }
  }]);

  return Canvas;
}();

/* harmony default export */ exports["a"] = Canvas;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* harmony export (immutable) */ exports["convertHex"] = convertHex;
/* harmony export (immutable) */ exports["round"] = round;
/* harmony export (immutable) */ exports["using"] = using;
/* harmony export (immutable) */ exports["extend"] = extend;
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function convertHex(hex) {
  var opacity = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

  hex = hex.replace('#', '');
  var r = parseInt(hex.substring(0, 2), 16);
  var g = parseInt(hex.substring(2, 4), 16);
  var b = parseInt(hex.substring(4, 6), 16);

  var result = 'rgba(' + r + ',' + g + ',' + b + ',' + opacity + ')';
  return result;
}

function round(val) {
  var places = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

  var c = 1;
  for (var i = 0; i < places; i++) {
    c *= 10;
  }
  return Math.round(val * c) / c;
}

function using(self, ns, pattern) {
  self = self || this;
  if (pattern == null) {
    // import all
    for (var name in ns) {
      self[name] = ns[name];
    }
  } else if (typeof pattern == 'string') {
    var regex = new RegExp(pattern);
    // import only stuff matching given pattern
    for (var _name in ns) {
      if (_name.match(regex)) {
        self[_name] = ns[_name];
      }
    }
  }
}

function extend() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  for (var i = 1; i < args.length; i++) {

    if (_typeof(args[i]) === 'object' && !(args[i] instanceof HTMLElement)) {
      for (var key in args[i]) {
        if (args[i].hasOwnProperty(key)) {
          args[0] = args[0] || {};
          var obj = this.extend(args[0][key], args[i][key]);
          args[0][key] = obj;
        }
      }
    } else {
      args[0] = args[i];
    }
  }
  return args[0];
}

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__canvas_canvas__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__base_camera__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__utils__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__screen_screenManager__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__input_inputController__ = __webpack_require__(9);
/* harmony export (binding) */ __webpack_require__.d(exports, "b", function() { return LudicApp; });
/* harmony export (immutable) */ exports["a"] = app;
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }







var pluginArgs = new WeakMap();

var $install = function $install(plugin) {
  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  if (typeof plugin.install === 'function') {
    plugin.install.apply(plugin, args);
  } else if (typeof plugin === 'function') {
    plugin.apply(null, args);
  }
};

var LudicApp = function () {
  function LudicApp(config) {
    var $app = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, LudicApp);

    this.$app = $app;
    // TODO: Create better config system
    this.$app.config = config;
    this.$app.canvas = new __WEBPACK_IMPORTED_MODULE_0__canvas_canvas__["a" /* default */](config.el);
    this.$app.context = this.$app.canvas.getContext();
    this.$app.input = new __WEBPACK_IMPORTED_MODULE_4__input_inputController__["a" /* default */](this.$app.canvas);
    this.$app.utils = __WEBPACK_IMPORTED_MODULE_2__utils__;

    // install plugins
    var plugins = this.$app._plugins;
    if (plugins && Array.isArray(plugins)) {
      plugins.forEach(function (plugin) {
        return $install.apply(undefined, [plugin].concat(_toConsumableArray(pluginArgs.get(plugin) || [])));
      });
    }

    //Put the app context on the window in devmode
    if (this.$app.devmode) {
      window.$ludicAppContext = this.$app;
    }

    this.running = false;
    this.lastTime = Date.now();

    this._requestAnimFrame = function () {
      return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function () {
        console.warn('LudicApp: falling back to basic requestAnimationFrame');
        return false;
      }() || function (callback) {
        window.setTimeout(callback, 1000 / 60);
      };
    }();

    // do some binding
    this._requestAnimFrame = this._requestAnimFrame.bind(window);
    this._animate = this._animate.bind(this);
  }

  // override


  _createClass(LudicApp, [{
    key: 'update',
    value: function update(delta, time) {}
  }, {
    key: '_animate',
    value: function _animate(time) {
      if (this.running) {
        this._requestAnimFrame(this._animate);

        var delta = (time - this.lastTime) / 1000;
        this.lastTime = this.$app._time = time;

        if (!Number.isNaN(delta)) {
          this.$app.context.save();
          this.update(delta, time);
          this.$app.context.restore();
        }
      }
    }
  }, {
    key: 'pause',
    value: function pause() {
      this.running = !this.running;
      if (this.running) this._animate();
    }
  }, {
    key: 'run',
    value: function run(updateFunction) {
      this.running = true;
      if (updateFunction != null) {
        this.update = updateFunction;
      }
      this._animate();
    }
  }, {
    key: 'use',
    value: function use(plugin) {
      for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }

      args.splice(0, 0, this.$app);
      $install(plugin, args);
    }
  }]);

  return LudicApp;
}();

function app(config) {
  return new LudicApp(config, app);
}

app.use = function (plugin) {
  var installedPlugins = this._plugins || (this._plugins = []);
  if (pluginArgs.has(plugin)) {
    return this;
  }

  // additional parameters
  var args = Array.from(arguments);
  args.splice(0, 1, this);
  installedPlugins.push(plugin);
  pluginArgs.set(plugin, args);
  return this;
};

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Asset = function () {
  function Asset(name, url, type, options) {
    _classCallCheck(this, Asset);

    this.name = name;
    this.url = url;
    this.type = type;
    this.options = options || {};
  }

  _createClass(Asset, [{
    key: "load",
    value: function load() {}
  }, {
    key: "onload",
    value: function onload(resolve, reject) {
      var _this = this;

      return function () {
        resolve(_this);
      };
    }
  }, {
    key: "onAssetResolve",
    value: function onAssetResolve(am) {}
  }, {
    key: "onAssetReject",
    value: function onAssetReject(am) {}
  }, {
    key: "destroy",
    value: function destroy() {
      this.name = null;
      this.url = null;
      this.type = null;
      this.options = null;
      this.data = null;
    }
  }]);

  return Asset;
}();

/* harmony default export */ exports["a"] = Asset;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__imageAssetLoader__ = __webpack_require__(16);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// import ImageAsset from './imageAsset';
// import RubeAsset from './rubeAsset';
// import RubeImageAsset from './rubeImageAsset';


var AssetManager = function () {
  function AssetManager() {
    _classCallCheck(this, AssetManager);

    this.assets = {};

    this.loadQueue = [];
    this.promiseQueue = [];
    this.loaders = {};

    this.addLoader('image', __WEBPACK_IMPORTED_MODULE_0__imageAssetLoader__["a" /* default */]);
  }

  _createClass(AssetManager, [{
    key: 'loadResource',
    value: function loadResource(name, url, type, options, overwrite) {
      // let promise = Promise.reject({
      //   reason: "resource load failed",
      //   name,
      //   url,
      //   type,
      //   options,
      //   overwrite
      // });
      var promise = null;
      // first check if we have the asset
      if (!this.assets[name] || overwrite) {
        var asset = this.NewAsset(name, url, type, options);
        if (asset) {
          this.loadQueue.push(asset);

          this.loading = true;

          promise = asset.promise.then(this.onAssetResolve.bind(this), this.onAssetReject.bind(this));
        }
      }
      return promise;
    }
  }, {
    key: 'getAsset',
    value: function getAsset(name) {
      return this.assets[name];
    }
  }, {
    key: 'getImage',
    value: function getImage(name) {
      var asset = this.getAsset(name);

      switch (asset.type) {
        case 'image':
        case 'rubeImage':
          return asset.data;
          break;
        default:
          return null;
      }
    }
  }, {
    key: 'getData',
    value: function getData(name) {
      return this.getAsset(name).data;
    }
  }, {
    key: 'onAssetResolve',
    value: function onAssetResolve(asset) {
      this.assets[asset.name] = asset;
      asset.onAssetResolve(this);
      return asset;
    }
  }, {
    key: 'onAssetReject',
    value: function onAssetReject() {
      console.log('rejected: ', arguments);
      return Promise.reject({
        reason: 'onAssetReject'
      });
    }
  }, {
    key: 'isLoading',
    value: function isLoading() {
      return this.loading;
    }
  }, {
    key: 'step',
    value: function step() {
      var _this = this,
          _arguments = arguments;

      if (this.loadQueue.length == 0) {
        if (!this.finalPromise) {
          this.finalPromise = Promise.all(this.promiseQueue).then(function () {
            if (_this.finalPromise) {
              // [tries to*] assures that this is not called prematurely if an asset is added late
              _this.assetsLoaded.apply(_this, _arguments);
              _this.promiseQueue = []; // reset promise queue to free objects;
            }
          });
        }
      } else {
        this.finalPromise = null;
        var asset = this.loadQueue.shift();
        this.promiseQueue.push(asset.promise);
        asset.load();
      }
    }
  }, {
    key: 'assetsLoaded',
    value: function assetsLoaded() {
      // console.log('all assets loaded: ',arguments);
      if (this.onAssetsLoadedCallback) {
        this.onAssetsLoadedCallback(this);
      }
      this.loading = false;
    }
  }, {
    key: 'setOnAssetsLoadedCallback',
    value: function setOnAssetsLoadedCallback(callback) {
      this.onAssetsLoadedCallback = callback;
    }
  }, {
    key: 'NewAsset',
    value: function NewAsset(name, url, type, options) {
      type = type || 'image';
      // switch (type) {
      //   case 'image':
      //     return new ImageAsset(name, url, type, options);
      //     break;
      //   case 'rube':
      //     return new RubeAsset(name, url, type, options);
      //     break;
      //   case 'rubeImage':
      //     return new RubeImageAsset(name, url, type, options);
      //     break;
      //   default:
      //     return null;
      // }

      var loader = this.loaders[type];

      if (loader) {
        return loader.load(name, url, type, options);
      } else {
        return null;
      }
    }
  }, {
    key: 'destroyAsset',
    value: function destroyAsset(asset) {
      delete this.assets[asset.name];
      asset.destroy();
    }
  }, {
    key: 'addLoader',
    value: function addLoader(fileTypes, loader) {
      var _this2 = this;

      if (typeof fileTypes === 'string') {
        fileTypes = [fileTypes];
      }

      fileTypes.forEach(function (type) {
        _this2.loaders[type] = loader;
      });
    }
  }]);

  return AssetManager;
}();

/* harmony default export */ exports["a"] = new AssetManager();

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__engine_Vector2__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__canvas_canvas__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__app_app__ = __webpack_require__(2);
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }






// PTM: Pixels to Meters ratio
var DEFAULT_PTM = 32;

var DEFAULTS = {
  inverseY: true,
  inverseX: false,
  x: 0,
  y: 0,
  ptm: DEFAULT_PTM
};

var Camera = function () {

  /**
   * `new Camera(options)`
   * @param {object} [options] - options object
   * @param {boolean} [options.inverseY=true] - make 'y' axis point up
   * @param {boolean} [options.inverseX=false] - make 'x' axis point left
   * @param {number} [options.x=0] - 'x' coordinate to start the camera
   * @param {number} [options.y=0] - 'y' coordinate to start the camera
   * @param {number} [options.width=app.canvas.width()] - width of the camera view
   * @param {number} [options.height=app.canvas.height()] - height of the camera view
   *
   * `new Camera({Canvas})`
   * @param {Canvas} [canvas] - optional canvas to provide dimensions
   *
   * `new Camera(ptm)` - assumes fill canvas width/height
   * @param {number} [ptm] - pixels to meters scaling factor
   *
   * `new Camera(width,height)`
   * @param {number} [width] - width of the camera view
   * @param {number} [height] - height of the camera view
   *
   * `new Camera(x,y,width,height)`
   * @param {number} [x] - 'x' coordinate to start the camera
   * @param {number} [y] - 'y' coordinate to start the camera
   * @param {number} [width] - width of the camera view
   * @param {number} [height] - height of the camera view
   */
  function Camera() {
    _classCallCheck(this, Camera);

    var options = Object.assign({}, DEFAULTS);
    if (arguments.length === 1) {
      if (_typeof(arguments[0]) === 'object') {
        if (arguments[0] instanceof __WEBPACK_IMPORTED_MODULE_2__canvas_canvas__["a" /* default */]) {
          options.width = arguments[0].width();
          options.height = arguments[0].height();
        } else {
          // options argument
          options = Object.assign(options, arguments[0]);
        }
      } else if (typeof arguments[0] === 'number') {
        // arg is ptm
        options.ptm = arguments[0];
      } else {
        console.warn('Camera::Unknown single argument \'' + _typeof(arguments[0]) + '\'.', arguments);
      }
    } else if (arguments.length === 2) {
      // width and height
      var _arguments = Array.prototype.slice.call(arguments),
          width = _arguments[0],
          height = _arguments[1];

      options.width = width;
      options.height = height;
    } else if (arguments.length === 4) {
      // x,y,width,height
      var _arguments2 = Array.prototype.slice.call(arguments),
          x = _arguments2[0],
          y = _arguments2[1],
          _width = _arguments2[2],
          _height = _arguments2[3];

      options.x = x;
      options.y = y;
      options.width = _width;
      options.height = _height;
    } else if (arguments.length === 0) {
      console.warn('Camera::Initialized without any arguments.', arguments);
    } else if (arguments.length !== 0) {
      console.warn('Camera::Unknown arguments.', arguments);
    }

    // apply the options
    this.x = options.x;
    this.y = options.y;
    this.width = options.width;
    this.height = options.height;
    this.inverseX = options.inverseX;
    this.inverseY = options.inverseY;
    this.ptm = options.ptm;

    // setup variables
    this.viewCenterPixel = {
      x: 0,
      y: 0
    };
    this.singleWorldPoint = {
      x: 0,
      y: 0
    };
    this.singlePixelPoint = {
      x: 0,
      y: 0
    };
    this.offset = {
      x: 0,
      y: 0
    };
    this.futurePos = new __WEBPACK_IMPORTED_MODULE_1__engine_Vector2__["a" /* default */](0, 0);

    this.updateEnvironmentVariables();
    window.addEventListener('resize', this.updateEnvironmentVariables.bind(this), false);

    window.camera = this;
  }

  _createClass(Camera, [{
    key: 'getCanvas',
    value: function getCanvas() {
      return this.canvas;
    }
  }, {
    key: 'draw',
    value: function draw(ctx) {

      this.setTransform(ctx);
    }
  }, {
    key: 'drawAxes',
    value: function drawAxes(ctx) {
      ctx.strokeStyle = 'rgb(192,0,0)';
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(1, 0);
      ctx.stroke();
      ctx.strokeStyle = 'rgb(0,192,0)';
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, 1);
      ctx.stroke();
    }
  }, {
    key: 'setChaseEntity',
    value: function setChaseEntity(ent, chaseMethod) {
      this.chaseEntity = ent;
      this.chaseMethod = chaseMethod;
    }
  }, {
    key: 'setChaseMethod',
    value: function setChaseMethod(chaseMethod) {
      this.chaseMethod = chaseMethod;
    }
  }, {
    key: 'getWorldPointFromPixelPoint',
    value: function getWorldPointFromPixelPoint(pixelPoint) {
      this.singleWorldPoint.x = this._getWorldPointFromPixelPoint_x(pixelPoint.x);
      this.singleWorldPoint.y = this._getWorldPointFromPixelPoint_y(pixelPoint.y);
      return this.singleWorldPoint;
    }
  }, {
    key: '_getWorldPointFromPixelPoint_x',
    value: function _getWorldPointFromPixelPoint_x(x) {
      // let inv = (this.offset.x - x) / this.ptm;
      // let reg = (x - this.offset.x) / this.ptm;
      return (this.inverseX ? this.offset.x - x : x - this.offset.x) / this.ptm;
    }
  }, {
    key: '_getWorldPointFromPixelPoint_y',
    value: function _getWorldPointFromPixelPoint_y(y) {
      // let inv = (y - (this.height - this.offset.y)) / this.ptm;
      // let reg = ((this.height - this.offset.y) - y) / this.ptm;
      return (this.inverseY ? y - (this.height - this.offset.y) : this.height - this.offset.y - y) / this.ptm;
    }
  }, {
    key: 'getPixelPointFromWorldPoint',
    value: function getPixelPointFromWorldPoint(worldPoint) {
      this.singlePixelPoint.x = this._getPixelPointFromWorldPoint_x(worldPoint.x);
      this.singlePixelPoint.y = this._getPixelPointFromWorldPoint_y(worldPoint.y);
      return this.singlePixelPoint;
    }
  }, {
    key: '_getPixelPointFromWorldPoint_x',
    value: function _getPixelPointFromWorldPoint_x(x) {
      // let reg = (x*this.ptm) + this.offset.x;
      // let inv = this.offset.x - (x*this.ptm);
      return this.inverseX ? this.offset.x - x * this.ptm : x * this.ptm + this.offset.x;
    }
  }, {
    key: '_getPixelPointFromWorldPoint_y',
    value: function _getPixelPointFromWorldPoint_y(y) {
      // let inv = (y*this.ptm) + (this.height - this.offset.y);
      // let reg = (this.height - this.offset.y) - (y*this.ptm);
      return this.inverseY ? y * this.ptm + (this.height - this.offset.y) : this.height - this.offset.y - y * this.ptm;
    }
  }, {
    key: 'setViewCenterWorld',
    value: function setViewCenterWorld(vector2, instantaneous, fraction) {
      var currentViewCenterWorld = this.getViewCenterWorld();
      var toMove = {};
      toMove.x = vector2.get_x() - currentViewCenterWorld.x;
      toMove.y = vector2.get_y() - currentViewCenterWorld.y;
      this.moveCenterBy(toMove, instantaneous, fraction);
    }
  }, {
    key: 'centerWorldToCamera',
    value: function centerWorldToCamera() {
      // this.setViewCenterWorld(new Vector2(), true);
      this.setOffset(this.viewCenterPixel);
    }
  }, {
    key: 'centerWorldToTopLeft',
    value: function centerWorldToTopLeft() {
      this.setViewCenterWorld(new __WEBPACK_IMPORTED_MODULE_1__engine_Vector2__["a" /* default */](), true);
    }
  }, {
    key: 'getViewCenterWorld',
    value: function getViewCenterWorld() {
      return this.getWorldPointFromPixelPoint(this.viewCenterPixel);
    }
  }, {
    key: 'moveCenterBy',
    value: function moveCenterBy(toMove, instantaneous, fraction) {
      fraction = fraction || instantaneous ? 1 : 0.25;
      this.offset.x -= __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__utils__["round"])(fraction * toMove.x * this.ptm, 0);
      this.offset.y += __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__utils__["round"])(fraction * toMove.y * this.ptm, 0);
    }
  }, {
    key: 'updateEnvironmentVariables',
    value: function updateEnvironmentVariables() {
      this.viewCenterPixel = {
        x: this.width / 2,
        y: this.height / 2
      };
    }
  }, {
    key: 'getViewCenterPixel',
    value: function getViewCenterPixel() {
      return this.viewCenterPixel;
    }
  }, {
    key: 'getViewportBounds',
    value: function getViewportBounds() {
      var bounds = {
        x: this._getWorldPointFromPixelPoint_x(0),
        y: this._getWorldPointFromPixelPoint_y(0),
        w: this._getWorldPointFromPixelPoint_x(this.width),
        h: this._getWorldPointFromPixelPoint_y(this.height)
      };
      return bounds;
    }
  }, {
    key: 'getPTM',
    value: function getPTM() {
      return this.ptm;
    }
  }, {
    key: 'setPTM',
    value: function setPTM(ptm) {
      this.ptm = ptm;
    }
  }, {
    key: 'getOffset',
    value: function getOffset() {
      return this.offset;
    }
  }, {
    key: 'getOffsetX',
    value: function getOffsetX() {
      return this.offset.x;
    }
  }, {
    key: 'getOffsetY',
    value: function getOffsetY() {
      return this.offset.y;
    }
  }, {
    key: 'setOffset',
    value: function setOffset(obj, y) {
      if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' && !y) {
        this.offset.x = obj['x'] || 0;
        this.offset.y = obj['y'] || 0;
      } else if (typeof obj === 'number' && typeof y === 'number') {
        this.offset.x = obj;
        this.offset.y = y;
      }
    }
  }, {
    key: 'setTransform',
    value: function setTransform(ctx) {
      ctx.translate(this.getOffsetX(), this.getOffsetY());
      var ptm = this.getPTM();
      // apply the scaling factor and inverses
      ctx.scale(this.inverseX ? -ptm : ptm, this.inverseY ? -ptm : ptm);
      ctx.lineWidth /= ptm;
    }
  }, {
    key: 'resetTransform',
    value: function resetTransform(ctx) {
      var ptm = this.getPTM();
      // ctx.scale(1 / this.getPTM(),1 / this.getPTM());
      ctx.scale(this.inverseX ? -1 / ptm : 1 / ptm, this.inverseY ? -1 / ptm : 1 / ptm);
      ctx.lineWidth *= ptm;
      ctx.translate(-this.getOffsetX(), -this.getOffsetY());
    }
  }]);

  return Camera;
}();

/* harmony default export */ exports["a"] = Camera;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__asset__ = __webpack_require__(3);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }



var ImageAsset = function (_Asset) {
  _inherits(ImageAsset, _Asset);

  function ImageAsset(name, url, type, options) {
    _classCallCheck(this, ImageAsset);

    var _this = _possibleConstructorReturn(this, (ImageAsset.__proto__ || Object.getPrototypeOf(ImageAsset)).call(this, name, url, type || 'image', options));

    _this.data = new Image();
    _this.promise = new Promise(function (resolve, reject) {
      _this.data.onload = _this.onload(resolve, reject);
    });

    return _this;
  }

  _createClass(ImageAsset, [{
    key: 'load',
    value: function load() {
      this.data.src = this.url;
    }
  }, {
    key: 'onload',
    value: function onload(resolve, reject) {
      var _this2 = this;

      return function () {
        resolve(_this2);
      };
    }
  }, {
    key: 'destroy',
    value: function destroy() {}
  }]);

  return ImageAsset;
}(__WEBPACK_IMPORTED_MODULE_0__asset__["a" /* default */]);

/* harmony default export */ exports["a"] = ImageAsset;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Vector2 = function () {
  function Vector2() {
    var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

    _classCallCheck(this, Vector2);

    this.x = x;
    this.y = y;
  }

  _createClass(Vector2, [{
    key: "get_x",
    value: function get_x() {
      return this.x;
    }
  }, {
    key: "get_y",
    value: function get_y() {
      return this.y;
    }
  }]);

  return Vector2;
}();

/* harmony default export */ exports["a"] = Vector2;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ps4Mapping = {
  buttons: ['cross', 'circle', 'square', 'triangle', 'l1', 'r1', 'l2', 'r2', 'extra', 'start', 'l3', 'r3', 'up', 'down', 'left', 'right', 'home', 'select'],
  axes: ['lx', 'ly', 'rx', 'ry'],
  sticks: {
    lx: 'leftStick',
    ly: 'leftStick',
    rx: 'rightStick',
    ry: 'rightStick'
  }
};

var gamepadMaps = {
  'Wireless Controller (STANDARD GAMEPAD Vendor: 054c Product: 05c4)': ps4Mapping // ps4 controller
};

var gamepadsAxisDeadZone = 0.08;
var gamepadsConfig = {};

var GamepadController = function () {
  function GamepadController() {
    _classCallCheck(this, GamepadController);

    this.initGamepads();
  }

  _createClass(GamepadController, [{
    key: 'install',
    value: function install(inputController) {
      this.inputController = inputController;
    }
  }, {
    key: 'initGamepads',
    value: function initGamepads() {
      var _this = this;

      this.gamepads = {};
      this.lastButtonStates = [[], // gamepad index 0
      [], // gamepad index 1
      [], // gamepad index 2
      [] // gamepad index 3
      ];
      this.lastAxisStates = [[], // gamepad index 0
      [], // gamepad index 1
      [], // gamepad index 2
      [] // gamepad index 3
      ];
      window.addEventListener("gamepadconnected", function (e) {
        console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.", e.gamepad.index, e.gamepad.id, e.gamepad.buttons.length, e.gamepad.axes.length);
        console.log(e.gamepad);
        _this.getGamepads();
      });
      window.addEventListener("gamepaddisconnected", function (e) {
        console.log('Gamepad disconnected: ', e);
        _this.getGamepads();
      });

      // window.addEventListener('gamepadbuttondown', (e)=>{
      //   console.log('gamepad button down: ',e);
      // });
      //
      // window.addEventListener('gamepadbuttonup', (e)=>{
      //   console.log('gamepad button up: ',e);
      // });
    }
  }, {
    key: 'getGamepads',
    value: function getGamepads() {
      var gps = navigator.getGamepads() || [];
      var gp;
      for (var i = 0; i < gps.length; i++) {
        gp = gps[i];
        if (gp) {
          this.gamepads[gp.index] = gp;
        }
      }
      return this.gamepads;
    }
  }, {
    key: 'update',
    value: function update() {
      this._stepGamepads();
    }
  }, {
    key: '_stepGamepads',
    value: function _stepGamepads() {
      var _this2 = this;

      var gps = this.getGamepads();
      var gp;
      for (var i in gps) {
        gp = gps[i]; // gamepad instance from api
        if (gp) {

          // for each gamepad that the api reads; poll the state of each button,
          //  sending an event when pressed
          gp.buttons.forEach(function (b, ix) {
            // get the last known state of the button
            var lastState = _this2.getLastState(i, ix);
            b.index = ix; // tell the button what it's index is
            b.lastState = lastState;

            if (b.pressed) {
              // if pressed, create a button event and set the buttons last known state
              _this2.gamepadButtonEvent(gp, b, true);
              _this2.setLastState(i, ix, true);
            } else {
              if (lastState) {
                // if the button is not pressed but its last state was pressed, create a 'button up' event
                if (lastState.pressed) {
                  _this2.gamepadButtonEvent(gp, b, false);
                }
              }
              // set the buttons last known state for not pressed
              _this2.setLastState(i, ix, false);
            }
          });

          // do the same thing for each of the axis (analog sticks)
          // loop through each and poll state
          gp.axes.forEach(function (value, axis) {
            // get the deadZone associated with each axis
            var dz = _this2.getDeadZone(axis);
            // get the last known state for the axis
            var lastState = _this2.getLastAxisState(i, axis);

            // if the value of the axis is withing the bounds of the deadzone
            //  create an axis event
            if (value < -dz || value > dz) {
              _this2.gamepadAxisEvent(gp, axis, value, false);
            } else if (!lastState.zeroed) {
              _this2.gamepadAxisEvent(gp, axis, 0, true);
            }
          });
        } else {
          console.log('no gamepad!', i);
        }
      }
    }
  }, {
    key: 'getLastAxisState',
    value: function getLastAxisState(gpIndex, axis) {
      var b = this.lastAxisStates[gpIndex][axis] || { zeroed: true };
      return b;
    }
  }, {
    key: 'setLastAxisState',
    value: function setLastAxisState(gpIndex, axis, state) {
      this.lastAxisStates[gpIndex][axis] = { zeroed: state };
    }
  }, {
    key: 'getDeadZone',
    value: function getDeadZone(gamepadIndex) {
      if (gamepadsConfig.hasOwnProperty(gamepadIndex) && gamepadsConfig[gamepadIndex].hasOwnProperty(deadZone)) {
        return gamepadsConfig[gamepadIndex].deadZone;
      }
      return gamepadsAxisDeadZone;
    }
  }, {
    key: 'setDeadZone',
    value: function setDeadZone(deadZone, gamepadIndex) {
      if (gamepadIndex !== null && gamepadIndex !== undefined) {
        if (gamepadsConfig.hasOwnProperty(gamepadIndex)) {
          gamepadsConfig[gamepadIndex].deadZone = deadZone;
        } else {
          gamepadsConfig[gamepadIndex] = { deadZone: deadZone };
        }
      } else {
        gamepadsAxisDeadZone = deadZone;
      }
    }
  }, {
    key: 'getLastState',
    value: function getLastState(i, ix) {
      var b = this.lastButtonStates[i][ix];
      return b;
    }
  }, {
    key: 'setLastState',
    value: function setLastState(i, ix, state) {
      this.lastButtonStates[i][ix] = { pressed: state };
    }
  }, {
    key: 'gamepadButtonEvent',
    value: function gamepadButtonEvent(gamepad, button, down) {
      button.id = gamepadMaps[gamepad.id].buttons[button.index];
      if (button.id) {
        this.inputController.dispatchEvent(this, this.onGamepadButtonEvent, new GamepadButtonEvent(gamepad, button, down));
      } else {
        console.log(arguments);
      }
    }
  }, {
    key: 'onGamepadButtonEvent',
    value: function onGamepadButtonEvent(l, evt) {
      if (!l || !l.enabled) {
        return;
      }
      var func = l[evt.keyIdentifier];
      if (!func) {
        return;
      }
      if (l.gamepadIndex >= 0 && l.gamepadIndex !== evt.gamepadIndex) {
        return;
      }

      var bndr = l.binder || l;
      var b = func.call(bndr, evt.down, evt);
      if (b === true) {
        return true;
      }
      // check for if listener wants the only control
      if (l.stopPropagation) {
        return true;
      }
    }
  }, {
    key: '_onGamepadButtonEvent',
    value: function _onGamepadButtonEvent(evt) {
      var l;
      var down = evt.down;

      // if(this.config.logAllKeys){
      //   console.log(evt.keyCode,evt.keyIdentifier);
      // }
      for (var i = listeners.length - 1; i >= 0; i--) {
        l = listeners[i];
        if (!l || !l.enabled) {
          continue;
        }
        var func = l[evt.keyIdentifier];
        if (!func) {
          continue;
        }
        if (l.gamepadIndex >= 0 && l.gamepadIndex !== evt.gamepadIndex) {
          continue;
        }

        var bndr = l.binder || l;
        var b = func.call(bndr, down, evt);
        if (b === true) {
          return;
        }
        // check for if listener wants the only control
        if (l.stopPropagation) {
          break;
        }
      }
      // if(this.config.logUnmappedKeys){
      //   console.log(evt.keyCode,evt.keyIdentifier,evt.button.value, listeners.length===0?"No listeners":"");
      // }
    }
  }, {
    key: 'getGamepadMap',
    value: function getGamepadMap(gamepadId) {
      return gamepadMaps[gamepadId] || {};
    }
  }, {
    key: 'gamepadAxisEvent',
    value: function gamepadAxisEvent(gamepad, axisIndex, value, zeroed) {
      this.setLastAxisState(gamepad.index, axisIndex, zeroed);
      var gpMap = this.getGamepadMap(gamepad.id);
      var axis = {};
      axis.id = gpMap.axes[axisIndex];
      axis.stick = gpMap.sticks[axis.id];
      axis.index = axisIndex;
      axis.value = value;
      axis.zeroed = zeroed;

      var evt = new GamepadAxisEvent(gamepad, axis);
      evt.values = {};
      if (axis.stick === 'leftStick') {
        evt.values.x = gamepad.getValueByAxisId('lx');
        evt.values.y = gamepad.getValueByAxisId('ly');
      } else if (axis.stick === 'rightStick') {
        evt.values.x = gamepad.getValueByAxisId('rx');
        evt.values.y = gamepad.getValueByAxisId('ry');
      }

      // this.onGamepadAxis(evt);
      this.inputController.dispatchEvent(this, this.onGamepadAxis, evt);
    }
  }, {
    key: '_onGamepadAxis',
    value: function _onGamepadAxis(evt) {
      var l;
      for (var i = listeners.length - 1; i >= 0; i--) {
        l = listeners[i];
        if (!l) {
          continue;
        }

        var func = l[evt.stick];
        if (!func) {
          continue;
        }
        // only fire for correct gamepadIndex
        if (l.gamepadIndex >= 0 && l.gamepadIndex !== evt.gamepadIndex) {
          continue;
        }

        var bndr = l.binder || l;
        if (func.call(bndr, evt.values.x, evt.values.y, evt) === false) {
          continue;
        }
        return;
      }
    }
  }, {
    key: 'onGamepadAxis',
    value: function onGamepadAxis(l, evt) {
      var func = l[evt.stick];
      if (!func) {
        return;
      }
      // only fire for correct gamepadIndex
      if (l.gamepadIndex >= 0 && l.gamepadIndex !== evt.gamepadIndex) {
        return;
      }

      var bndr = l.binder || l;
      if (func.call(bndr, evt.values.x, evt.values.y, evt) === false) {
        return;
      }
    }
  }]);

  return GamepadController;
}();

var GamepadButtonEvent = function GamepadButtonEvent(gamepad, button, down) {
  _classCallCheck(this, GamepadButtonEvent);

  this.gamepad = gamepad;
  this.gamepadIndex = gamepad.index;
  this.button = button;
  this.down = down;
  this.type = 'gamepadButtonEvent';
  this.keyCode = button.index;
  this.keyIdentifier = button.id;
};

var GamepadAxisEvent = function GamepadAxisEvent(gamepad, axis) {
  _classCallCheck(this, GamepadAxisEvent);

  this.gamepad = gamepad;
  this.gamepadIndex = gamepad.index;
  this.axis = axis;
  this.stick = axis.stick;
  this.keyCode = 200 + axis.index;
  this.keyIdentifier = axis.id;
  this.values = axis.values;
  this.type = 'gamepadAxisEvent';
};

Gamepad.prototype.getValueByAxisId = function (axisId) {
  var gp = gamepadMaps[this.id];
  var ix = gp.axes.indexOf(axisId);
  if (ix > -1) {
    return this.axes[ix];
  }
  return;
};

/* harmony default export */ exports["a"] = GamepadController;

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__keyCodeMap__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__gamepadController__ = __webpack_require__(8);
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }





var listeners = [];
var defaultKeyConfig = {
  preventDefault: true
};
var ps4Mapping = {
  buttons: ['cross', 'circle', 'square', 'triangle', 'l1', 'r1', 'l2', 'r2', 'extra', 'start', 'l3', 'r3', 'up', 'down', 'left', 'right', 'home', 'select'],
  axes: ['lx', 'ly', 'rx', 'ry'],
  sticks: {
    lx: 'leftStick',
    ly: 'leftStick',
    rx: 'rightStick',
    ry: 'rightStick'
  }
};

var gamepadMaps = {
  'Wireless Controller (STANDARD GAMEPAD Vendor: 054c Product: 05c4)': ps4Mapping // ps4 controller
};

var gamepadsAxisDeadZone = 0.08;
var gamepadsConfig = {};

var mousePosPixel = {};
var prevMousePosPixel = {};
// let gamepadTypeMaps = [{id:'054c',type:'ps4'}];

var InputController = function () {
  function InputController(canvas) {
    _classCallCheck(this, InputController);

    this.canvas = canvas;
    // TODO: refactor config
    this.config = {};

    this.inputControllers = [];

    this.initKeys();
    this.initMouse();
    this.addInputController(new __WEBPACK_IMPORTED_MODULE_1__gamepadController__["a" /* default */]());
    // this.initGamepads();
  }

  _createClass(InputController, [{
    key: 'addInputController',
    value: function addInputController(inputController) {
      inputController.install(this);
      this.inputControllers.push(inputController);
    }

    // input methods

  }, {
    key: 'addInputListener',
    value: function addInputListener(listener) {
      listeners.push(listener);
    }

    /**
     * Instantiates and returns a new InputEventListener
     * @param {Object} options - passed along to new InputEventListener
     * @param {Binder} binder (optional) - passed along to new InputEventListener
     * @param {Boolean} alsoAdd (optional) - determines whether the returning InputEventListener should also be added to this
     *
     * @return {InputEventListener} - listener object used to attached handlers for input events
     */

  }, {
    key: 'newInputListener',
    value: function newInputListener(options, binder, alsoAdd) {
      if (typeof alsoAdd === 'undefined' && typeof binder === 'boolean') {
        // alsoAdd was the second param, without binder
        alsoAdd = binder;
        binder = null;
      }
      var l = new InputEventListener(options, binder);
      if (alsoAdd) {
        this.addInputListener(l);
      }
      return l;
    }
  }, {
    key: 'removeInputListener',
    value: function removeInputListener(listener) {
      var ix = listeners.indexOf(listener);
      if (ix > -1) {
        listeners.splice(ix, 1);
      }
    }

    //  -- keyboard

  }, {
    key: 'initKeys',
    value: function initKeys() {
      var _this = this;

      // object for all key states
      this.allKeys = {};

      var func = function func(evt) {
        // evt.preventDefault();
        // this.onKeyDown(this.canvas,evt);
        // this.onKeyEvent(evt);
        var l;
        var down = evt.type === 'keydown';
        var dir = down ? 'down' : 'up';

        // give the event a list of all keys states
        _this.allKeys[evt.keyCode] = _this.allKeys[evt.key] = down;
        evt.allKeys = _this.allKeys;

        if (_this.config.logAllKeys) {
          console.log(evt.keyCode);
        }
        _this.dispatchEvent(_this, _this.keyHandler, evt, down, dir);
      };

      this.canvas.addEventListener('keydown', func, false);
      this.canvas.addEventListener('keyup', func, false);
    }
  }, {
    key: 'dispatchEvent',
    value: function dispatchEvent(thisArg, handler, event) {
      for (var _len = arguments.length, args = Array(_len > 3 ? _len - 3 : 0), _key2 = 3; _key2 < _len; _key2++) {
        args[_key2 - 3] = arguments[_key2];
      }

      for (var listener, i = listeners.length - 1; i >= 0; i--) {
        listener = listeners[i];
        if (!listener || !listener.enabled) {
          continue;
        }
        if (handler.call.apply(handler, [thisArg, listener, event].concat(args)) === true) {
          break;
        }
      }
    }
  }, {
    key: 'keyHandler',
    value: function keyHandler(l, evt, down, dir) {
      var cfg = l.keyConfig;
      var key = cfg[evt.keyCode];
      var binder = l.binder || l;
      if (key) {
        if ((typeof key === 'undefined' ? 'undefined' : _typeof(key)) === 'object' || Array.isArray(key)) {
          var keys = void 0;
          // make array out of single object, treat everything like an array
          if (Array.isArray(key)) {
            keys = key;
          } else {
            keys = [key];
          }

          // loop through all key configs
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = keys[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var _key3 = _step.value;

              var modifiers = false;
              var direction = !_key3.hasOwnProperty('direction') || _key3.direction === dir || _key3.direction === 'both';
              var method = _key3.hasOwnProperty('method') && _key3.method;
              _key3._once = down ? _key3._once : false;

              // logic for modifiers
              if (!!_key3.shiftKey == evt.shiftKey && !!_key3.altKey == evt.altKey && !!_key3.ctrlKey == evt.ctrlKey) {
                modifiers = true;
              }

              if (method && modifiers && direction && !_key3._once) {
                binder = _key3.binder || binder;
                var b = this._execCommand(l, method, binder, down, evt);
                _key3._once = _key3.once && down;
              }
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }
        } else {
          console.warn('InputController: Unsupported key config type \'' + key + '\'');
        }
      }
      // else {
      //   console.log('no config for keycode', evt.keyCode, key);
      // }

      // check for if listener wants the only control
      // if(l.stopPropagation){
      //   break;
      // }
    }
  }, {
    key: 'onKeyEvent',
    value: function onKeyEvent(evt) {
      // console.log(evt);
      var l;
      var down = evt.type === 'keydown';
      var dir = down ? 'down' : 'up';

      // give the event a list of all keys states
      this.allKeys[evt.keyCode] = this.allKeys[evt.key] = down;
      evt.allKeys = this.allKeys;

      if (this.config.logAllKeys) {
        console.log(evt.keyCode);
      }
      for (var i = listeners.length - 1; i >= 0; i--) {
        l = listeners[i];
        if (!l || !l.enabled) {
          continue;
        }
      }
    }
  }, {
    key: '_execCommand',
    value: function _execCommand(listener, method, binder) {
      for (var _len2 = arguments.length, args = Array(_len2 > 3 ? _len2 - 3 : 0), _key4 = 3; _key4 < _len2; _key4++) {
        args[_key4 - 3] = arguments[_key4];
      }

      if (typeof method === 'string') {
        var _listener$method;

        return (_listener$method = listener[method]).call.apply(_listener$method, [binder].concat(args));
      } else if (typeof method === 'function') {
        return method.call.apply(method, [binder].concat(args));
      } else {
        return false;
      }
    }

    //  -- mouse

  }, {
    key: 'initMouse',
    value: function initMouse() {
      this.canvas.addEventListener('mousemove', function (evt) {
        this.onMouseEvent('mouseMove', this.canvas.el, evt);
      }.bind(this), false);

      this.canvas.addEventListener('mousedown', function (evt) {
        this.onMouseEvent('mouseDown', this.canvas.el, evt);
      }.bind(this), false);

      this.canvas.addEventListener('mouseup', function (evt) {
        this.onMouseEvent('mouseUp', this.canvas.el, evt);
      }.bind(this), false);

      this.canvas.addEventListener('mouseout', function (evt) {
        this.onMouseEvent('mouseOut', this.canvas.el, evt);
      }.bind(this), false);

      this.canvas.addEventListener('mouseenter', function (evt) {
        this.onMouseEvent('mouseEnter', this.canvas.el, evt);
      }.bind(this), false);
      this.canvas.addEventListener('mouseleave', function (evt) {
        this.onMouseEvent('mouseLeave', this.canvas.el, evt);
      }.bind(this), false);

      // touch events
      this.canvas.addEventListener('touchstart', function (evt) {
        this.onMouseEvent('touchStart', this.canvas.el, evt);
      }.bind(this), false);

      this.canvas.addEventListener('touchend', function (evt) {
        this.onMouseEvent('touchEnd', this.canvas.el, evt);
      }.bind(this), false);

      this.canvas.addEventListener('touchmove', function (evt) {
        this.onMouseEvent('touchMove', this.canvas.el, evt);
      }.bind(this), false);

      this.canvas.addEventListener('touchcancel', function (evt) {
        this.onMouseEvent('touchCancel', this.canvas, evt);
      }.bind(this), false);
    }
  }, {
    key: 'onMouseEvent',
    value: function onMouseEvent(key, canvas, evt) {
      prevMousePosPixel = mousePosPixel;
      this.updateMousePos(canvas, evt);

      for (var i = listeners.length - 1; i >= 0; i--) {
        var l = listeners[i];
        if (l && l.enabled) {
          if (l.hasOwnProperty(key)) {
            var bndr = l.binder || l;
            var b = l[key].call(bndr, mousePosPixel, evt);
            if (b === true) {
              return;
            }
          }
        }
      }
    }

    //    -- mouse helper function

  }, {
    key: 'updateMousePos',
    value: function updateMousePos(canvas, evt) {
      var rect = canvas.getBoundingClientRect();
      mousePosPixel = {
        x: evt.clientX - rect.left,
        y: canvas.height - (evt.clientY - rect.top)
      };
    }

    //  -- gamepad


  }, {
    key: 'update',
    value: function update() {
      for (var _len3 = arguments.length, args = Array(_len3), _key5 = 0; _key5 < _len3; _key5++) {
        args[_key5] = arguments[_key5];
      }

      this.inputControllers.forEach(function (controller) {
        if (controller.hasOwnProperty('update')) {
          controller.update.apply(controller, args);
        }
      });
    }
  }]);

  return InputController;
}();

var stripModifiers = function stripModifiers(key) {
  var mods = key.split('.');
  key = mods[0];
  var ret = { key: key, config: {} };
  if (mods.length > 1) {
    for (var i = 1; i < mods.length; i++) {
      var mod = mods[i];
      switch (mod) {
        case 'alt':
        case 'altKey':
          ret.config.altKey = true;
          break;
        case 'shift':
        case 'shiftKey':
          ret.config.shiftKey = true;
          break;
        case 'ctrl':
        case 'ctrlKey':
          ret.config.ctrlKey = true;
          break;
        case 'up':
          ret.config.direction = 'up';
          break;
        case 'down':
          ret.config.direction = 'down';
          break;
        case 'once':
          ret.config.once = true;
          break;
        default:
          break;
      }
    }
  }
  return ret;
};

var importKeyConfig = function importKeyConfig(keyConfig) {
  var config = {};

  var _loop = function _loop(_key6) {
    var mods = stripModifiers(_key6);
    var _key = _key6;
    var cfg = keyConfig[_key6];
    _key6 = __WEBPACK_IMPORTED_MODULE_0__keyCodeMap__["a" /* default */][mods.key] || mods.key;

    // everything needs to be an array of objects
    if (typeof cfg === 'string' || typeof cfg === 'function') {
      config[_key6] = [Object.assign({}, { method: cfg }, mods.config)];
    } else if ((typeof cfg === 'undefined' ? 'undefined' : _typeof(cfg)) === 'object' && !Array.isArray(cfg)) {
      config[_key6] = [Object.assign({}, mods.config, cfg)];
    } else if (Array.isArray(cfg)) {
      config[_key6] = cfg.map(function (conf) {
        return Object.assign({}, mods.config, conf);
      });
    } else {
      console.warn('InputController: Unsupported key config type \'' + (typeof cfg === 'undefined' ? 'undefined' : _typeof(cfg)) + '\' for \'' + _key6 + '\'', cfg);
    }
    key = _key6;
  };

  for (var key in keyConfig) {
    _loop(key);
  }
  return config;
};

var InputEventListener = function () {
  function InputEventListener(options, binder) {
    _classCallCheck(this, InputEventListener);

    var keyConfig = options;
    if (options.hasOwnProperty('keyConfig')) {
      keyConfig = options.keyConfig;
    }
    if (options.hasOwnProperty('gamepadIndex')) {
      this.gamepadIndex = options.gamepadIndex;
    } else {
      this.gamepadIndex = -1;
    }
    if (options.hasOwnProperty('binder')) {
      binder = options.binder;
    }

    this.stopPropagation = options.stopPropagation;

    this.keyConfig = importKeyConfig.call(this, keyConfig);
    this.options = options;
    this.binder = binder;
    this.enabled = options.hasOwnProperty('enabled') ? options.enabled : true;

    if (options.hasOwnProperty('methods')) {
      this._loadListener(options.methods);
    }
  }

  _createClass(InputEventListener, [{
    key: '$enable',
    value: function $enable() {
      this.enabled = true;
    }
  }, {
    key: '$disable',
    value: function $disable() {
      this.enabled = false;
    }
  }, {
    key: '_loadListener',
    value: function _loadListener(listener) {
      var avail = ['start', 'select', 'home', 'extra', 'left', 'right', 'up', 'down', 'l1', 'l2', 'l3', 'r1', 'r2', 'r3', 'triangle', 'square', 'circle', 'cross', 'leftStick', 'rightStick', 'mouseMove', 'mouseDown', 'mouseUp', 'mouseOut', 'mouseEnter', 'mouseLeave', 'touchStart', 'touchEnd', 'touchMove', 'touchCancel'];

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = avail[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var _key7 = _step2.value;

          if (_key7 in listener) {
            var method = listener[_key7];

            if (typeof method === 'function') {
              this[_key7] = method;
            } else if (typeof method === 'string') {
              console.log(this.keyConfig);
              var code = method;

              if (Number.isNaN(parseInt(code))) {
                // need to convert char
                var _code = __WEBPACK_IMPORTED_MODULE_0__keyCodeMap__["a" /* default */][code];
                if (_code) {
                  code = _code;
                } else {
                  console.warn('There is no mapping for: ', method);
                  continue;
                }
              }

              var arr = this.keyConfig[code];

              if (arr.length === 1) {
                this[_key7] = arr[0].method;
              } else {
                console.warn('multiple entries per keycode is not supported at this yet.', _key7, arr, method);
              }
            }
          }
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    }
  }, {
    key: 'start',
    value: function start() {
      return null;
    }
  }, {
    key: 'select',
    value: function select() {
      return null;
    }
  }, {
    key: 'home',
    value: function home() {
      // ps/xb button
      return null;
    }
  }, {
    key: 'left',
    value: function left() {
      return null;
    }
  }, {
    key: 'right',
    value: function right() {
      return null;
    }
  }, {
    key: 'up',
    value: function up() {
      return null;
    }
  }, {
    key: 'down',
    value: function down() {
      return null;
    }
  }, {
    key: 'l1',
    value: function l1() {
      return null;
    }
  }, {
    key: 'l2',
    value: function l2() {
      return null;
    }
  }, {
    key: 'l3',
    value: function l3() {
      return null;
    }
  }, {
    key: 'r1',
    value: function r1() {
      return null;
    }
  }, {
    key: 'r2',
    value: function r2() {
      return null;
    }
  }, {
    key: 'r3',
    value: function r3() {
      return null;
    }
  }, {
    key: 'triangle',
    value: function triangle() {
      return null;
    }
  }, {
    key: 'square',
    value: function square() {
      return null;
    }
  }, {
    key: 'circle',
    value: function circle() {
      return null;
    }
  }, {
    key: 'cross',
    value: function cross() {
      return null;
    }
  }, {
    key: 'extra',
    value: function extra() {
      return null;
    }
  }, {
    key: 'leftStick',
    value: function leftStick(x, y, event) {
      return null;
    }
  }, {
    key: 'rightStick',
    value: function rightStick(x, y, event) {
      return null;
    }
  }]);

  return InputEventListener;
}();
// assign the InputEventListener class as a static property on InputController
//  so it can be instantiated properly outside of this module


InputController.InputEventListener = InputEventListener;

/* harmony default export */ exports["a"] = InputController;

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils_privateProperty__ = __webpack_require__(18);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }



var _stack = new __WEBPACK_IMPORTED_MODULE_0__utils_privateProperty__["a" /* default */]();
var _listeners = new __WEBPACK_IMPORTED_MODULE_0__utils_privateProperty__["a" /* default */]();

var ScreenManager = function () {
  function ScreenManager() {
    _classCallCheck(this, ScreenManager);

    // initialize some private variables
    var idIncrementer = 0;
    this.getNewId = function () {
      return idIncrementer++;
    };

    // define private properties
    _listeners.set(this, new Proxy([], {
      get: function get(target, prop) {
        if (prop in ScreenEventListener.prototype) {
          return function () {
            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
              args[_key] = arguments[_key];
            }

            // only call prop if it exists
            //  this allows for the 'listener' to not be a 'ScreenEventListener' but any object that defines its properties
            target.forEach(function (e) {
              var _e$prop;

              return e[prop] != null ? (_e$prop = e[prop]).call.apply(_e$prop, [e].concat(args)) : undefined;
            });
          };
        }
        return target[prop];
      }
    }));
    _stack.set(this, []);
  }

  _createClass(ScreenManager, [{
    key: 'update',
    value: function update(delta) {
      var stack = _stack(this);
      if (stack.length > 0) {
        var screen = stack[stack.length - 1];
        screen._step.apply(screen, arguments);

        if (screen._isFinished) {
          _listeners(this).onScreenFinished(screen, this, screen._finalData);
        }
      }
    }
  }, {
    key: 'addScreen',
    value: function addScreen(screen, replace) {
      var stack = _stack(this);
      // give the screen a ref to the manager
      screen.$manager = this;
      // give the screen an id
      screen.$id = this.getNewId();
      if (replace) {
        stack.splice(stack.length - 1, 1, screen);
      } else {
        stack.push(screen);
      }
      // call screen's callback
      screen.onAddedToManager(this);
      // call listener methods
      _listeners(this).onScreenAdded(screen, this, replace);
    }
  }, {
    key: 'popScreen',
    value: function popScreen() {
      var stack = _stack(this);
      if (stack.length > 1) {
        var screen = stack.pop();
        // call screen's callback
        screen.onRemovedFromManager(this);
        // call listener methods
        _listeners(this).onScreensRemoved([screen], this);
        return [screen];
      } else {
        // cannot pop the last screen, only replace.
        _listeners(this).onWarnPopScreen(stack, this);
        return [];
      }
    }
  }, {
    key: 'popToScreen',
    value: function popToScreen(screen) {
      var _this = this;

      var stack = _stack(this);
      if (!screen.hasOwnProperty('$id')) {
        return false;
      }
      var index = stack.findIndex(function (s) {
        return s.$id === screen.$id;
      });
      if (index === -1) {
        return false;
      } else {
        var screensRemoved = stack.splice(index);
        // call screen callback method
        screensRemoved.slice().reverse().forEach(function (screen) {
          return screen.onRemovedFromManager(_this);
        });
        // call listener method
        _listeners(this).onScreensRemoved(screensRemoved, this);
        return screensRemoved;
      }
    }
  }, {
    key: 'addScreenEventListener',
    value: function addScreenEventListener(listener) {
      _listeners(this).push(listener);
    }
  }, {
    key: 'getNewScreenEventListener',
    value: function getNewScreenEventListener(alsoAdd) {
      var listener = new ScreenEventListener();
      if (alsoAdd) {
        this.addScreenEventListener(listener);
      }
      return listener;
    }
  }]);

  return ScreenManager;
}();

/* harmony default export */ exports["a"] = ScreenManager;

var ScreenEventListener = function () {
  function ScreenEventListener() {
    _classCallCheck(this, ScreenEventListener);
  }

  _createClass(ScreenEventListener, [{
    key: 'onScreenFinished',
    value: function onScreenFinished(screen, manager, data) {}
  }, {
    key: 'onScreenAdded',
    value: function onScreenAdded(screen, manager, replaced) {}
  }, {
    key: 'onScreensRemoved',
    value: function onScreensRemoved(screen, manager) {}
  }, {
    key: 'onWarnPopScreen',
    value: function onWarnPopScreen(stack, manager) {}
  }]);

  return ScreenEventListener;
}();

ScreenManager.ScreenEventListener = ScreenEventListener;

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__base_assetManager__ = __webpack_require__(4);
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }



var RIGHT = 10;
var LEFT = 11;

var BaseSprite = function () {
  function BaseSprite(image, framesX, framesY, offsetX, offsetY) {
    _classCallCheck(this, BaseSprite);

    if (typeof image === 'string') {
      this.image = __WEBPACK_IMPORTED_MODULE_0__base_assetManager__["a" /* default */].getImage(image);
    } else {
      this.image = image;
    }

    if (!this.image) {
      console.warn('Sprite created without an image', this);
      return;
    }

    this.width = this.image.width;
    this.height = this.image.height;

    this.frames = [];
    this.framesX = framesX;
    this.framesY = framesY;
    this.frameWidth = this.width / this.framesX;
    this.frameHeight = this.height / this.framesY;
    this.totalFrames = this.framesX * this.framesY;

    this.scaleToWidth(1);

    this.setOffset(offsetX || 0, offsetY || 0);

    this.currentFrameIndex = 0;

    this.direction = RIGHT;

    this.parseSpriteSheet();

    this.setFrame();
  }

  _createClass(BaseSprite, [{
    key: 'parseSpriteSheet',
    value: function parseSpriteSheet() {
      for (var y = 0; y < this.framesY; y++) {
        for (var x = 0; x < this.framesX; x++) {
          var frame = {};
          frame.sx = x * this.frameWidth;
          frame.sy = y * this.frameHeight;

          this.frames.push(frame);
        }
      }

      console.log(this.frames);
    }
  }, {
    key: 'animate',
    value: function animate() {
      this.currentFrameIndex = (this.currentFrameIndex + 1) % this.frames.length;
      this.setFrame();
    }
  }, {
    key: 'setFrame',
    value: function setFrame(frameIndex) {
      frameIndex = frameIndex === undefined ? this.currentFrameIndex : frameIndex;
      this.frame = this.frames[frameIndex];
    }
  }, {
    key: 'setPosition',
    value: function setPosition(pos) {
      this.pos = pos;
    }
  }, {
    key: 'setOffset',
    value: function setOffset(offset, offsetY) {
      if ((typeof offset === 'undefined' ? 'undefined' : _typeof(offset)) === 'object') {
        this.offset = offset;
      } else if (offsetY !== undefined) {
        this.offset = {
          x: offset,
          y: offsetY
        };
      }
    }
  }, {
    key: 'setUseShadow',
    value: function setUseShadow(use) {
      this.useShadow = use;
    }
  }, {
    key: 'setDirection',
    value: function setDirection(dir) {
      this.direction = dir;
    }
  }, {
    key: 'scaleToWidth',
    value: function scaleToWidth(w) {
      var h = w / this.frameWidth;
      this.drawWidth = w;
      this.drawHeight = h * this.frameHeight;
    }
  }, {
    key: 'scaleToHeight',
    value: function scaleToHeight(h) {
      var w = h / this.frameHeight;
      this.drawWidth = w * this.frameWidth;
      this.drawHeight = h;
    }
  }, {
    key: 'scale',
    value: function scale(_scale) {
      this.drawWidth *= _scale;
      this.drawHeight *= _scale;
    }
  }, {
    key: 'draw',
    value: function draw(ctx) {

      ctx.save();
      if (this.direction === RIGHT) {
        ctx.scale(1, -1); // flip the y
        ctx.translate(-this.offset.x, -this.offset.y); //  [ -(w/2) , -(?) ]
        ctx.translate(this.pos.x, -this.pos.y);
      } else {
        ctx.scale(-1, -1); // flip the x & y
        ctx.translate(-this.offset.x, -this.offset.y); //  [ -(w/2) , -(?) ]
        ctx.translate(-this.pos.x, -this.pos.y);
      }

      if (this.useShadow) {
        ctx.shadowColor = 'black';
        ctx.shadowBlur = 20;
        ctx.shadowOffsetX = 5;
        ctx.shadowOffsetY = 10;
      }

      ctx.drawImage(this.image, this.frame.sx, this.frame.sy, this.frameWidth, this.frameHeight, 0, 0, this.drawWidth, this.drawHeight);

      ctx.restore();
    }
  }]);

  return BaseSprite;
}();

/* harmony default export */ exports["a"] = BaseSprite;

/***/ },
/* 12 */
/***/ function(module, exports) {

// implementation modeled from http://stackoverflow.com/a/6491621
Object.defineProperty(Object, 'resolve', {
  enumerable: false,
  value: function value(path) {
    var obj = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    if (path == null) {
      return;
    }
    if (path === '') {
      return obj;
    }
    path = path.replace(/\[['"]?(\w+)['"]?\]/g, '.$1'); // convert indexes and brackets (["keyname"] or ['keyname']) to properties
    path = path.replace(/^\./, ''); // strip a leading dot
    var keys = path.split('.');
    return keys.reduce(function (prev, curr) {
      return prev ? prev[curr] : undefined;
    }, obj);
  }
});

/***/ },
/* 13 */
/***/ function(module, exports) {

Path2D.rect = function () {
  var p = new Path2D();
  // .rect(x, y, width, height)
  p.rect.apply(p, arguments);
  return p;
};
Path2D.arc = function () {
  var p = new Path2D();
  // .arc(x, y, radius, startAngle, endAngle, anticlockwise)
  p.arc.apply(p, arguments);
  return p;
};
Path2D.ellipse = function () {
  var p = new Path2D();
  // .ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle, anticlockwise)
  p.ellipse.apply(p, arguments);
  return p;
};

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Screen = function () {
  function Screen(options) {
    _classCallCheck(this, Screen);

    this.options = options || {};
  }

  _createClass(Screen, [{
    key: "_step",
    value: function _step(delta) {
      for (var _len = arguments.length, rest = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        rest[_key - 1] = arguments[_key];
      }

      if (!this._isFinished) {
        this.update.apply(this, arguments);
      }
    }

    // override

  }, {
    key: "update",
    value: function update(delta) {}
  }, {
    key: "finish",
    value: function finish(data) {
      if (!this._isFinished) {
        this.onDestroy();
        this._finalData = data || {};
        this._isFinished = true;
      }
    }
  }, {
    key: "onDestroy",
    value: function onDestroy() {}
  }, {
    key: "onAddedToManager",
    value: function onAddedToManager(manager) {}
  }, {
    key: "onRemovedFromManager",
    value: function onRemovedFromManager(manager) {}
  }]);

  return Screen;
}();

/* harmony default export */ exports["a"] = Screen;

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__BaseSprite__ = __webpack_require__(11);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }



var MultiSprite = function (_BaseSprite) {
  _inherits(MultiSprite, _BaseSprite);

  function MultiSprite(image, framesX, framesY, offsetX, offsetY) {
    _classCallCheck(this, MultiSprite);

    return _possibleConstructorReturn(this, (MultiSprite.__proto__ || Object.getPrototypeOf(MultiSprite)).call(this, image, framesX, framesY, offsetX, offsetY));
  }

  _createClass(MultiSprite, [{
    key: 'createSlice',
    value: function createSlice(name, start, count, scale) {
      var slice = {};

      slice.ix = 0;
      slice._ix = 0;
      slice.start = start;
      slice.end = start + count;
      slice.scale = scale || 1;

      slice.name = name;
      slice.frames = this.frames.slice(start, slice.end);

      console.log(slice);

      this.slices[name] = slice;
    }
  }, {
    key: 'createState',
    value: function createState(name, frameIndex, sliceName) {
      sliceName = sliceName || 'default';

      var state = {};

      state.name = name;
      state.ix = frameIndex;
      state.sliceName = sliceName;

      this.states[name] = state;
    }
  }, {
    key: 'parseSpriteSheet',
    value: function parseSpriteSheet() {
      this.slices = this.slices || {};
      this.states = this.states || {};
      _get(MultiSprite.prototype.__proto__ || Object.getPrototypeOf(MultiSprite.prototype), 'parseSpriteSheet', this).apply(this, arguments);
      var slice = {
        ix: 0,
        start: 0,
        end: this.frames.length - 1,
        name: 'default',
        frames: this.frames
      };

      this.slices[slice.name] = slice;
      this.setSlice(slice.name);
    }
  }, {
    key: 'setSlice',
    value: function setSlice(name) {
      this.slice = this.slices[name];
    }
  }, {
    key: 'animate',
    value: function animate(sliceName, optScale) {
      if (sliceName) {
        this.setSlice(sliceName);
      }

      var scale = optScale || this.slice.scale,
          fl = this.slice.frames.length,
          df = fl * scale,
          _ix = this.slice._ix++;

      this.slice.ix = Math.floor(_ix % df / scale);
      if (_ix >= df) {
        this.slice._ix = 1;
      }

      this.setFrame();
    }
  }, {
    key: 'setFrame',
    value: function setFrame(frameIndex, sliceName) {
      frameIndex = frameIndex === undefined ? this.slice.ix : frameIndex;
      if (sliceName) {
        this.frame = this.slices[sliceName].frames[frameIndex];
      } else {
        this.frame = this.slice.frames[frameIndex];
      }
    }
  }, {
    key: 'setState',
    value: function setState(name) {
      var state = this.states[name];
      this.setFrame(state.ix, state.sliceName);
    }
  }]);

  return MultiSprite;
}(__WEBPACK_IMPORTED_MODULE_0__BaseSprite__["a" /* default */]);

/* harmony default export */ exports["a"] = MultiSprite;

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__imageAsset__ = __webpack_require__(6);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }



var ImageAssetLoader = function () {
  function ImageAssetLoader() {
    _classCallCheck(this, ImageAssetLoader);
  }

  _createClass(ImageAssetLoader, [{
    key: 'load',
    value: function load(name, url, type, options) {
      return new __WEBPACK_IMPORTED_MODULE_0__imageAsset__["a" /* default */](name, url, type, options);;
    }
  }]);

  return ImageAssetLoader;
}();

/* harmony default export */ exports["a"] = new ImageAssetLoader();

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/** alias mapping for keyboard keys **/

/* harmony default export */ exports["a"] = {

  // special keys
  'enter': '13',
  'tab': '9',
  'delete': '8',
  'backspace': '8',
  'space': '32',
  'esc': '27',
  'escape': '27',

  // modifier keys
  'control': '17',
  'ctrl': '17',
  'alt': '18',
  'option': '18', // on mac
  'caps': '20',
  'caps-lock': '20',
  'capslock': '20',

  'windows': '91', // windows key
  'left-command': '91', // left command key on mac layout
  'left-cmd': '91',
  'search': '91', // on chromebook
  'menu': '93', // windows menu
  'right-command': '93', // right command key on mac layout
  'right-cmd': '93',

  // arrow keys
  'left': '37',
  'up': '38',
  'right': '39',
  'down': '40',

  // alpha keys, in order of keyboard qwerty layout
  'q': '81',
  'w': '87',
  'e': '69',
  'r': '82',
  't': '84',
  'y': '89',
  'u': '85',
  'i': '73',
  'o': '79',
  'p': '80',
  'a': '65',
  's': '83',
  'd': '68',
  'f': '70',
  'g': '71',
  'h': '72',
  'j': '74',
  'k': '75',
  'l': '76',
  'z': '90',
  'x': '88',
  'c': '67',
  'v': '86',
  'b': '66',
  'n': '78',
  'm': '77'
};

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PrivateProperty = function () {
  function PrivateProperty() {
    _classCallCheck(this, PrivateProperty);

    var weakMap = new WeakMap();
    var ctor = function ctor() {
      return weakMap.get.apply(weakMap, arguments);
    };
    ctor.set = function () {
      return weakMap.set.apply(weakMap, arguments);
    };
    // ctor.get = function(...getArgs){
    //   return weakMap.get(...getArgs);
    // }
    ctor.get = ctor;
    return ctor;
  }

  _createClass(PrivateProperty, [{
    key: "set",
    value: function set() {
      var _weakMap;

      (_weakMap = this.weakMap).set.apply(_weakMap, _toConsumableArray(setArgs));
    }
  }]);

  return PrivateProperty;
}();

/* harmony default export */ exports["a"] = PrivateProperty;

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony reexport (binding) */ __webpack_require__.d(exports, "default", function() { return __WEBPACK_IMPORTED_MODULE_3__app_app__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(exports, "app", function() { return __WEBPACK_IMPORTED_MODULE_3__app_app__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(exports, "LudicApp", function() { return __WEBPACK_IMPORTED_MODULE_3__app_app__["b"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__app_app__ = __webpack_require__(2);
/* harmony reexport (binding) */ __webpack_require__.d(exports, "Asset", function() { return __WEBPACK_IMPORTED_MODULE_4__base_asset__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__base_asset__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__base_assetManager__ = __webpack_require__(4);
/* harmony reexport (binding) */ __webpack_require__.d(exports, "AssetManager", function() { return __WEBPACK_IMPORTED_MODULE_5__base_assetManager__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__base_camera__ = __webpack_require__(5);
/* harmony reexport (binding) */ __webpack_require__.d(exports, "Camera", function() { return __WEBPACK_IMPORTED_MODULE_6__base_camera__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(exports, "ImageAsset", function() { return __WEBPACK_IMPORTED_MODULE_7__base_imageAsset__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__base_imageAsset__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__canvas_canvas__ = __webpack_require__(0);
/* harmony reexport (binding) */ __webpack_require__.d(exports, "Canvas", function() { return __WEBPACK_IMPORTED_MODULE_8__canvas_canvas__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__input_inputController__ = __webpack_require__(9);
/* harmony reexport (binding) */ __webpack_require__.d(exports, "InputController", function() { return __WEBPACK_IMPORTED_MODULE_9__input_inputController__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(exports, "GamepadController", function() { return __WEBPACK_IMPORTED_MODULE_10__input_gamepadController__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__input_gamepadController__ = __webpack_require__(8);
Object.defineProperty(exports, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__patches_Path2D__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__patches_Path2D___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__patches_Path2D__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__patches_Object__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__patches_Object___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__patches_Object__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__screen_screen__ = __webpack_require__(14);
/* harmony reexport (binding) */ __webpack_require__.d(exports, "Screen", function() { return __WEBPACK_IMPORTED_MODULE_11__screen_screen__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__screen_screenManager__ = __webpack_require__(10);
/* harmony reexport (binding) */ __webpack_require__.d(exports, "ScreenManager", function() { return __WEBPACK_IMPORTED_MODULE_12__screen_screenManager__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(exports, "BaseSprite", function() { return __WEBPACK_IMPORTED_MODULE_13__sprite_BaseSprite__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__sprite_BaseSprite__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__sprite_MultiSprite__ = __webpack_require__(15);
/* harmony reexport (binding) */ __webpack_require__.d(exports, "MultiSprite", function() { return __WEBPACK_IMPORTED_MODULE_14__sprite_MultiSprite__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__utils__ = __webpack_require__(1);
/* harmony reexport (module object) */ __webpack_require__.d(exports, "utils", function() { return __WEBPACK_IMPORTED_MODULE_2__utils__; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__engine_Vector2__ = __webpack_require__(7);
/* harmony reexport (binding) */ __webpack_require__.d(exports, "Vector2", function() { return __WEBPACK_IMPORTED_MODULE_15__engine_Vector2__["a"]; });

// app


// base





// canvas


// input



// patches
/*
  patches that are prototype extensions, just import here
  patches that require a parameter (monkey patch) export function name with prefix `Patch`
    i.e. export {default as PatchFixSomeClass} from './patches/fixSomeClass'
*/



// screen



// sprite



// ui
// export {default as HUD} from './ui/hud'
// export {default as HUDElement} from './ui/HUDElement'
// export {default as Text} from './ui/Text'
// export {default as Dialog} from './ui/Dialog'
// export {default as MenuDialog} from './ui/MenuDialog'

// util



// vectors


/***/ }
/******/ ]);
});
//# sourceMappingURL=ludic.umd.js.map