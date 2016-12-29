module.exports =
/******/ (function(modules) { // webpackBootstrap
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
/******/ 	return __webpack_require__(__webpack_require__.s = 24);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _config = {
  canvas: {
    fullscreen: false,
    fps: false
  },
  world: {
    gravity: {
      x: 0,
      y: 0
    },
    drawAxes: false,
    drawDebug: false
  },
  console: {
    log: true
  }
};

var Util = function () {
  function Util() {
    _classCallCheck(this, Util);
  }

  _createClass(Util, null, [{
    key: 'convertHex',
    value: function convertHex(hex, opacity) {
      hex = hex.replace('#', '');
      var r = parseInt(hex.substring(0, 2), 16);
      var g = parseInt(hex.substring(2, 4), 16);
      var b = parseInt(hex.substring(4, 6), 16);

      var result = 'rgba(' + r + ',' + g + ',' + b + ',' + opacity + ')';
      return result;
    }
  }, {
    key: 'myRound',
    value: function myRound(val, places) {
      var c = 1;
      for (var i = 0; i < places; i++) {
        c *= 10;
      }return Math.round(val * c) / c;
    }
  }, {
    key: 'using',
    value: function using(self, ns, pattern, logNames, logValues) {
      self = self || this;
      if (pattern == undefined) {
        // import all
        for (var name in ns) {
          if (!logNames) {
            self[name] = ns[name];
          } else {
            console.log(name, logValues ? ns[name] : '');
          }
        }
      } else {
        if (typeof pattern == 'string') {
          pattern = new RegExp(pattern);
        }
        // import only stuff matching given pattern
        for (var name in ns) {
          if (name.match(pattern)) {
            if (!logNames) {
              self[name] = ns[name];
            } else {
              console.log(name, logValues ? ns[name] : '');
            }
          }
        }
      }
    }
  }, {
    key: 'extend',
    value: function extend() {
      for (var i = 1; i < arguments.length; i++) {

        if (_typeof(arguments[i]) === 'object') {
          for (var key in arguments[i]) {
            if (arguments[i].hasOwnProperty(key)) {
              arguments[0] = arguments[0] || {};
              var obj = this.extend(arguments[0][key], arguments[i][key]);
              arguments[0][key] = obj;
            }
          }
        } else {
          arguments[0] = arguments[i];
        }
      }
      return arguments[0];
    }
  }, {
    key: 'setConfig',
    value: function setConfig(config) {
      _config = this.extend(_config, config);
      this.configure();
    }
  }, {
    key: 'getConfig',
    value: function getConfig() {
      return _config;
    }
  }, {
    key: 'readConfig',
    value: function readConfig(scope, param, def) {
      var params = param ? param.split('.') : [];

      var obj;

      try {
        obj = _config[scope];

        for (var i = 0; i < params.length; i++) {
          obj = obj[params[i]];
        }
      } catch (e) {
        obj = null;
      } finally {
        obj = obj || def;
      }
      return obj;
    }
  }, {
    key: 'setParam',
    value: function setParam(scope, param, value) {
      var params = param.split('.');

      var obj;

      try {
        obj = _config[scope] = _config[scope] || {};

        for (var i = 0, l = params.length; i < l; i++) {
          // obj = obj[params[i]];
          var prop = params[i];
          obj = obj[prop] = obj[prop] || i == l - 1 ? value : {};
        }
      } catch (e) {
        obj = null;
      }

      this.configure();
    }
  }, {
    key: 'configure',
    value: function configure() {
      this.configureConsole();
    }
  }, {
    key: 'configureConsole',
    value: function configureConsole() {

      if (!_config.console.log) {
        console._log = console.log;
        console.log = function () {};
      }
    }
  }]);

  return Util;
}();

/* harmony default export */ exports["a"] = Util;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Ludic = function Ludic() {
  _classCallCheck(this, Ludic);

  this.extensions = {};
};

/* harmony default export */ exports["a"] = new Ludic();

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var HUDElement = function () {
  function HUDElement() {
    _classCallCheck(this, HUDElement);
  }

  _createClass(HUDElement, [{
    key: "render",
    value: function render(delta) {}
  }]);

  return HUDElement;
}();

/* harmony default export */ exports["a"] = HUDElement;

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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__imageAssetLoader__ = __webpack_require__(22);
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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util_util__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__engine_Vector2__ = __webpack_require__(8);
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }




var PTM = 32;

var viewCenterPixel = {
  x: 0,
  y: 0
};
var singleWorldPoint = {
  x: 0,
  y: 0
};
var singlePixelPoint = {
  x: 0,
  y: 0
};
var offset = {
  x: 0,
  y: 0
};

var futurePos = new __WEBPACK_IMPORTED_MODULE_1__engine_Vector2__["a" /* default */](0, 0);

var average;
var averageArray = [];
var timeTotal = 0;
var averageCount = 60;

var _frames = 0;

var Camera = function () {
  function Camera(canvas) {
    _classCallCheck(this, Camera);

    this.canvas = canvas;
    this.context = this.canvas.getContext();
    PTM = __WEBPACK_IMPORTED_MODULE_0__util_util__["a" /* default */].readConfig('camera', 'ptm', 32);

    this.updateEnvironmentVariables();
    window.addEventListener('resize', this.updateEnvironmentVariables.bind(this), false);
  }

  _createClass(Camera, [{
    key: 'getCanvas',
    value: function getCanvas() {
      return this.canvas;
    }
  }, {
    key: 'update',
    value: function update(delta) {
      var ctx = this.context;

      this.setTransform(ctx);
      if (this.chaseEntity) {
        if (this.chaseMethod) {
          this.chaseMethod(this.chaseEntity, this);
        } else {
          futurePos = this.chaseEntity.getPosition();
          // var vel = this.chaseEntity.GetLinearVelocity();
          // futurePos.set_x( pos.get_x() + 0.15 * vel.get_x() );
          // futurePos.set_y( pos.get_y() + 0.15 * vel.get_y() );
          this.setViewCenterWorld(futurePos);
        }
      }
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
      singleWorldPoint.x = this._getWorldPointFromPixelPoint_x(pixelPoint.x);
      singleWorldPoint.y = this._getWorldPointFromPixelPoint_y(pixelPoint.y);
      return singleWorldPoint;
    }
  }, {
    key: '_getWorldPointFromPixelPoint_x',
    value: function _getWorldPointFromPixelPoint_x(x) {
      return (x - offset.x) / PTM;
    }
  }, {
    key: '_getWorldPointFromPixelPoint_y',
    value: function _getWorldPointFromPixelPoint_y(y) {
      return (y - (this.canvas.height() - offset.y)) / PTM;
    }
  }, {
    key: 'getPixelPointFromWorldPoint',
    value: function getPixelPointFromWorldPoint(worldPoint) {
      singlePixelPoint.x = this._getPixelPointFromWorldPoint_x(worldPoint.x);
      singlePixelPoint.y = this._getPixelPointFromWorldPoint_y(worldPoint.y);
      return singlePixelPoint;
    }
  }, {
    key: '_getPixelPointFromWorldPoint_x',
    value: function _getPixelPointFromWorldPoint_x(x) {
      return x * PTM + offset.x;
    }
  }, {
    key: '_getPixelPointFromWorldPoint_y',
    value: function _getPixelPointFromWorldPoint_y(y) {
      return y * PTM + (this.canvas.height() - offset.y);
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
    key: 'centerWorldToCanvas',
    value: function centerWorldToCanvas() {
      this.setViewCenterWorld(new __WEBPACK_IMPORTED_MODULE_1__engine_Vector2__["a" /* default */](), true);
    }
  }, {
    key: 'getViewCenterWorld',
    value: function getViewCenterWorld() {
      return this.getWorldPointFromPixelPoint(viewCenterPixel);
    }
  }, {
    key: 'moveCenterBy',
    value: function moveCenterBy(toMove, instantaneous, fraction) {
      fraction = fraction || instantaneous ? 1 : 0.25;
      offset.x -= __WEBPACK_IMPORTED_MODULE_0__util_util__["a" /* default */].myRound(fraction * toMove.x * PTM, 0);
      offset.y += __WEBPACK_IMPORTED_MODULE_0__util_util__["a" /* default */].myRound(fraction * toMove.y * PTM, 0);
    }
  }, {
    key: 'updateEnvironmentVariables',
    value: function updateEnvironmentVariables() {
      viewCenterPixel = {
        x: this.canvas.width() / 2,
        y: this.canvas.height() / 2
      };
    }
  }, {
    key: 'getViewportBounds',
    value: function getViewportBounds() {
      var bounds = {
        x: this._getWorldPointFromPixelPoint_x(0),
        y: this._getWorldPointFromPixelPoint_y(0),
        w: this._getWorldPointFromPixelPoint_x(this.canvas.width()),
        h: this._getWorldPointFromPixelPoint_y(this.canvas.height())
      };
      return bounds;
    }
  }, {
    key: 'getPTM',
    value: function getPTM() {
      return PTM;
    }
  }, {
    key: 'setPTM',
    value: function setPTM(ptm) {
      PTM = ptm;
    }
  }, {
    key: 'getOffset',
    value: function getOffset() {
      return offset;
    }
  }, {
    key: 'getOffsetX',
    value: function getOffsetX() {
      return offset.x;
    }
  }, {
    key: 'getOffsetY',
    value: function getOffsetY() {
      return offset.y;
    }
  }, {
    key: 'setOffset',
    value: function setOffset(obj, y) {
      if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' && !y) {
        offset.x = obj['x'] || 0;
        offset.y = obj['y'] || 0;
      } else if (typeof obj === 'number' && typeof y === 'number') {
        offset.x = obj;
        offset.y = y;
      }
    }
  }, {
    key: 'calculateFPS',
    value: function calculateFPS(timestamp) {
      timeTotal += timestamp;
      // averageArray.push(timestamp);
      //
      // if(averageArray.length>averageCount){
      //   timeTotal -= averageArray.shift();
      //   average = timeTotal / averageCount;
      //   return 1 / average;
      // }
      // return 0;

      if (timeTotal >= 1.0) {
        this.fps = _frames;
        timeTotal = 0;
        _frames = 0;
      }
      _frames++;
    }
  }, {
    key: 'setTransform',
    value: function setTransform(ctx) {
      ctx.translate(this.getOffsetX(), this.getOffsetY());
      ctx.scale(1, -1);
      ctx.scale(this.getPTM(), this.getPTM());
      ctx.lineWidth /= this.getPTM();
    }
  }, {
    key: 'resetTransform',
    value: function resetTransform(ctx) {
      ctx.scale(1, -1);
      ctx.scale(1 / this.getPTM(), 1 / this.getPTM());
      ctx.lineWidth *= this.getPTM();
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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util_util__ = __webpack_require__(0);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }



var Canvas = function () {
  function Canvas() {
    _classCallCheck(this, Canvas);

    this.setupFullscreen();
    this.config = __WEBPACK_IMPORTED_MODULE_0__util_util__["a" /* default */].readConfig('canvas');
    this.focus();
  }

  _createClass(Canvas, [{
    key: 'setupFullscreen',
    value: function setupFullscreen() {
      var ludicContainerId = __WEBPACK_IMPORTED_MODULE_0__util_util__["a" /* default */].readConfig('ludic', 'id', 'ludic'); // get or use default container id for ludic canvas
      var canvasId = __WEBPACK_IMPORTED_MODULE_0__util_util__["a" /* default */].readConfig('canvas', 'id', 'ludic-canvas');
      var fullscreen = __WEBPACK_IMPORTED_MODULE_0__util_util__["a" /* default */].readConfig('canvas', 'fullscreen', false);
      var fps = __WEBPACK_IMPORTED_MODULE_0__util_util__["a" /* default */].readConfig('camera', 'fps');

      var body = document.querySelector('body');
      var container = document.querySelector('#' + ludicContainerId);

      // create ludic container if no container was found
      if (!container) {
        container = document.createElement('div');
        container.id = '' + ludicContainerId;
        body.appendChild(container);
      }

      if (fullscreen) {
        // add correct divs
        var canvas = document.createElement('canvas');
        canvas.id = canvasId;
        canvas.setAttribute('tabindex', 1);
        container.appendChild(canvas);

        this.setElement(canvas);

        window.addEventListener('resize', this.resize.bind(this), false);
        this.resize();
      } else {
        var wrapper = document.createElement('div');
        wrapper.setAttribute('style', 'text-align:center');
        container.appendChild(wrapper);

        var canvasWrapper = document.createElement('div');
        canvasWrapper.setAttribute('style', 'margin:auto;width:640px;padding:2px;border:1px solid #888;text-align:left');
        container.appendChild(canvasWrapper);

        var canvas = document.createElement('canvas');
        canvas.id = canvasId;
        canvas.setAttribute('width', 640);
        canvas.setAttribute('height', 480);
        canvas.setAttribute('tabindex', 1);
        canvasWrapper.appendChild(canvas);

        this.setElement(canvas);
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
    value: function getContext(dimension) {
      dimension = dimension || '2d';
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
  }]);

  return Canvas;
}();

/* harmony default export */ exports["a"] = Canvas;

/***/ },
/* 8 */
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
/* 9 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util_util__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__keyCodeMap__ = __webpack_require__(23);
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
var mousePosWorld = {};
var prevMousePosPixel = {};
// let gamepadTypeMaps = [{id:'054c',type:'ps4'}];

var InputController = function () {
  function InputController(canvas, camera) {
    _classCallCheck(this, InputController);

    this.canvas = canvas;
    this.camera = camera;
    // this.config = Util.readConfig('input');
    // TODO: refactor config
    this.config = {};

    this.initKeys();
    this.initMouse();
    this.initGamepads();
  }

  // input methods

  _createClass(InputController, [{
    key: 'addEventListener',
    value: function addEventListener(listener) {
      listeners.push(listener);
    }

    // to be deprecated for `newInputListener`

  }, {
    key: 'newEventListener',
    value: function newEventListener(options, binder, alsoAdd) {
      if (typeof alsoAdd === 'undefined' && typeof binder === 'boolean') {
        // alsoAdd was the second param, without binder
        alsoAdd = binder;
        binder = null;
      }
      var l = new InputEventListener(options, binder);
      if (alsoAdd) {
        this.addEventListener(l);
      }
      return l;
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
        this.addEventListener(l);
      }
      return l;
    }
  }, {
    key: 'removeEventListener',
    value: function removeEventListener(listener) {
      var ix = listeners.indexOf(listener);
      if (ix > -1) {
        listeners.splice(ix, 1);
      }
    }

    //  -- keyboard

  }, {
    key: 'initKeys',
    value: function initKeys() {
      // object for all key states
      this.allKeys = {};

      this.canvas.addEventListener('keydown', function (evt) {
        // evt.preventDefault();
        // this.onKeyDown(this.canvas,evt);
        this.onKeyEvent(this.canvas, evt);
      }.bind(this), false);

      this.canvas.addEventListener('keyup', function (evt) {
        // evt.preventDefault();
        // this.onKeyUp(this.canvas,evt);
        this.onKeyEvent(this.canvas, evt);
      }.bind(this), false);
    }
  }, {
    key: 'onKeyEvent',
    value: function onKeyEvent(canvas, evt) {
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
        if (!l) {
          continue;
        }

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
                var _key2 = _step.value;

                var modifiers = false;
                var direction = !_key2.hasOwnProperty('direction') || _key2.direction === dir || _key2.direction === 'both';
                var method = _key2.hasOwnProperty('method') && _key2.method;
                _key2._once = down ? _key2._once : false;

                // logic for modifiers
                if (!!_key2.shiftKey == evt.shiftKey && !!_key2.altKey == evt.altKey && !!_key2.ctrlKey == evt.ctrlKey) {
                  modifiers = true;
                }

                if (method && modifiers && direction && !_key2._once) {
                  binder = _key2.binder || binder;
                  var b = this._execCommand(l, method, binder, down, evt);
                  _key2._once = _key2.once && down;
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
        if (l.stopPropagation) {
          break;
        }
      }
    }
  }, {
    key: '_execCommand',
    value: function _execCommand(listener, method, binder) {
      for (var _len = arguments.length, args = Array(_len > 3 ? _len - 3 : 0), _key3 = 3; _key3 < _len; _key3++) {
        args[_key3 - 3] = arguments[_key3];
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
        if (l) {
          if (l.hasOwnProperty(key)) {
            var bndr = l.binder || l;
            var b = l[key].call(bndr, mousePosPixel, mousePosWorld, evt);
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
      mousePosWorld = this.camera.getWorldPointFromPixelPoint(mousePosPixel);
    }

    //  -- gamepad

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

      window.addEventListener('gamepadbuttondown', function (e) {
        console.log('gamepad button down: ', e);
      });

      window.addEventListener('gamepadbuttonup', function (e) {
        console.log('gamepad button up: ', e);
      });
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
        this.onGamepadButtonEvent(new GamepadButtonEvent(gamepad, button, down));
      } else {
        console.log(arguments);
      }
    }
  }, {
    key: 'onGamepadButtonEvent',
    value: function onGamepadButtonEvent(evt) {
      var l;
      var down = evt.down;

      // if(this.config.logAllKeys){
      //   console.log(evt.keyCode,evt.keyIdentifier);
      // }
      for (var i = listeners.length - 1; i >= 0; i--) {
        l = listeners[i];
        if (!l) {
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

      this.onGamepadAxis(evt);
    }
  }, {
    key: 'onGamepadAxis',
    value: function onGamepadAxis(evt) {
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

  var _loop = function _loop(_key4) {
    var mods = stripModifiers(_key4);
    var _key = _key4;
    var cfg = keyConfig[_key4];
    _key4 = __WEBPACK_IMPORTED_MODULE_1__keyCodeMap__["a" /* default */][mods.key] || mods.key;

    // everything needs to be an array of objects
    if (typeof cfg === 'string' || typeof cfg === 'function') {
      config[_key4] = [Object.assign({}, { method: cfg }, mods.config)];
    } else if ((typeof cfg === 'undefined' ? 'undefined' : _typeof(cfg)) === 'object' && !Array.isArray(cfg)) {
      config[_key4] = [Object.assign({}, mods.config, cfg)];
    } else if (Array.isArray(cfg)) {
      config[_key4] = cfg.map(function (conf) {
        return Object.assign({}, mods.config, conf);
      });
    } else {
      console.warn('InputController: Unsupported key config type \'' + (typeof cfg === 'undefined' ? 'undefined' : _typeof(cfg)) + '\' for \'' + _key4 + '\'', cfg);
    }
    key = _key4;
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

    // this.keyConfig = Util.extend(keyConfig, defaultKeyConfig);
    this.keyConfig = importKeyConfig.call(this, keyConfig);
    this.options = options;
    this.binder = binder;

    if (options.hasOwnProperty('methods')) {
      this._loadListener(options.methods);
    }
  }

  _createClass(InputEventListener, [{
    key: '_loadListener',
    value: function _loadListener(listener) {
      var avail = ['start', 'select', 'home', 'left', 'right', 'up', 'down', 'l1', 'l2', 'l3', 'r1', 'r2', 'r3', 'triangle', 'square', 'circle', 'cross', 'extra', 'leftStick', 'rightStick', 'mouseMove', 'mouseDown', 'mouseUp', 'mouseOut', 'touchStart', 'touchEnd', 'touchMove', 'touchCancel'];

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = avail[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var _key5 = _step2.value;

          if (_key5 in listener) {
            var method = listener[_key5];

            if (typeof method === 'function') {
              this[_key5] = method;
            } else if (typeof method === 'string') {
              console.log(this.keyConfig);
              var code = method;

              if (Number.isNaN(parseInt(code))) {
                // need to convert char
                var _code = __WEBPACK_IMPORTED_MODULE_1__keyCodeMap__["a" /* default */][code];
                if (_code) {
                  code = _code;
                } else {
                  console.warn('There is no mapping for: ', method);
                  continue;
                }
              }

              var arr = this.keyConfig[code];

              if (arr.length === 1) {
                this[_key5] = arr[0].method;
              } else {
                console.warn('multiple entries per keycode is not supported at this yet.', _key5, arr, method);
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

/* harmony default export */ exports["a"] = InputController;

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var stack = [];
var _listener = void 0;

var ScreenManager = function () {
  function ScreenManager() {
    _classCallCheck(this, ScreenManager);
  }

  _createClass(ScreenManager, [{
    key: "update",
    value: function update(delta) {
      if (stack.length > 0) {
        var screen = stack[stack.length - 1];
        screen._step.apply(screen, arguments);

        if (_listener) {
          if (screen._isFinished) {
            _listener.onScreenFinished(screen, this, screen._finalData);
          }
        }
      }
    }
  }, {
    key: "addScreen",
    value: function addScreen(screen, replace) {
      if (replace) {
        stack.splice(stack.length - 1, 1, screen);
      } else {
        stack.push(screen);
      }
    }
  }, {
    key: "getStack",
    value: function getStack() {
      return stack;
    }
  }, {
    key: "setEventListener",
    value: function setEventListener(listener) {
      _listener = listener;
    }
  }, {
    key: "newListener",
    value: function newListener(alsoSet) {
      var l = new ScreenEventListener();
      if (alsoSet) {
        this.setEventListener(l);
      }
      return l;
    }
  }]);

  return ScreenManager;
}();

var ScreenEventListener = function () {
  function ScreenEventListener() {
    _classCallCheck(this, ScreenEventListener);
  }

  _createClass(ScreenEventListener, [{
    key: "onScreenFinished",
    value: function onScreenFinished() {}
  }]);

  return ScreenEventListener;
}();

/* harmony default export */ exports["a"] = ScreenManager;

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
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__HUDElement__ = __webpack_require__(2);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }



var valid_positions_x = ['center', 'left', 'right'];
var valid_positions_y = ['center', 'top', 'bottom'];

var Dialog = function (_HUDElement) {
  _inherits(Dialog, _HUDElement);

  function Dialog() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$x = _ref.x,
        x = _ref$x === undefined ? 0 : _ref$x,
        _ref$y = _ref.y,
        y = _ref$y === undefined ? 0 : _ref$y,
        _ref$width = _ref.width,
        width = _ref$width === undefined ? 100 : _ref$width,
        _ref$height = _ref.height,
        height = _ref$height === undefined ? 100 : _ref$height,
        _ref$position = _ref.position,
        position = _ref$position === undefined ? '' : _ref$position,
        _ref$positionX = _ref.positionX,
        positionX = _ref$positionX === undefined ? '' : _ref$positionX,
        _ref$positionY = _ref.positionY,
        positionY = _ref$positionY === undefined ? '' : _ref$positionY,
        _ref$offset = _ref.offset,
        offset = _ref$offset === undefined ? { x: 0, y: 0 } : _ref$offset,
        _ref$offsetX = _ref.offsetX,
        offsetX = _ref$offsetX === undefined ? 0 : _ref$offsetX,
        _ref$offsetY = _ref.offsetY,
        offsetY = _ref$offsetY === undefined ? 0 : _ref$offsetY,
        _ref$backgroundColor = _ref.backgroundColor,
        backgroundColor = _ref$backgroundColor === undefined ? 'black' : _ref$backgroundColor,
        _ref$textColor = _ref.textColor,
        textColor = _ref$textColor === undefined ? 'white' : _ref$textColor,
        _ref$title = _ref.title,
        title = _ref$title === undefined ? '' : _ref$title,
        _ref$visible = _ref.visible,
        visible = _ref$visible === undefined ? false : _ref$visible,
        _ref$borderColor = _ref.borderColor,
        borderColor = _ref$borderColor === undefined ? 'blue' : _ref$borderColor,
        _ref$borderWidth = _ref.borderWidth,
        borderWidth = _ref$borderWidth === undefined ? 0 : _ref$borderWidth;

    _classCallCheck(this, Dialog);

    var _this = _possibleConstructorReturn(this, (Dialog.__proto__ || Object.getPrototypeOf(Dialog)).call(this));

    _this._x = x;
    _this._y = y;
    _this.width = width;
    _this.height = height;
    _this.backgroundColor = backgroundColor;

    // text vars
    _this.textColor = textColor;
    _this.title = title;

    // calc positioning setup
    _this.__calcPosition({ position: position, positionX: positionX, positionY: positionY, offset: offset, offsetX: offsetX, offsetY: offsetY });

    if (visible) {
      _this.show();
    }

    _this.borderColor = borderColor;
    _this.borderWidth = borderWidth;
    return _this;
  }

  _createClass(Dialog, [{
    key: 'render',
    value: function render(delta, ctx) {
      ctx.save();
      var pos = this.getPosition(ctx);

      // draw border
      this._drawBorder(ctx, pos);
      // draw the main background rect
      this._drawBackground(ctx, pos);

      // draw the title
      ctx.save();
      ctx.fillStyle = this.textColor;
      ctx.font = '22px serif';
      ctx.fillText(this.title, pos.x + 10, pos.y + 22 + 10);
      ctx.restore();

      ctx.restore();
    }
  }, {
    key: '_drawBorder',
    value: function _drawBorder(ctx, pos) {
      if (this.borderWidth > 0) {
        var bw = this.borderWidth - 1;
        // draw the border just outside the normal dimensions
        ctx.beginPath();
        ctx.strokeStyle = this.borderColor;
        ctx.lineWidth = this.borderWidth;
        ctx.moveTo(pos.x - bw, pos.y - bw);
        ctx.lineTo(pos.x + this.width + bw, pos.y - bw);
        ctx.lineTo(pos.x + this.width + bw, pos.y + this.height + bw);
        ctx.lineTo(pos.x - bw, pos.y + this.height + bw);
        ctx.closePath();
        ctx.stroke();
      }
    }
  }, {
    key: '_drawBackground',
    value: function _drawBackground(ctx, pos) {
      ctx.fillStyle = this.backgroundColor;
      ctx.fillRect(pos.x, pos.y, this.width, this.height);
    }
  }, {
    key: 'show',
    value: function show() {
      this.visible = true;
    }
  }, {
    key: 'hide',
    value: function hide() {
      this.visible = false;
    }
  }, {
    key: 'toggle',
    value: function toggle() {
      if (this.visible) {
        this.hide();
      } else {
        this.show();
      }
    }
  }, {
    key: 'getPosition',
    value: function getPosition(ctx) {
      var position = { x: 0, y: 0 };
      if (this._positionX && this._positionY && ctx) {
        var c_width = ctx.canvas.width;
        var c_height = ctx.canvas.height;

        var x = this.__getXfromPositionX.call(this, this._positionX, c_width);
        var y = this.__getYfromPositionY.call(this, this._positionY, c_height);

        position = { x: x, y: y };
      } else if (!ctx) {
        console.warn("Canvas context was not passed into 'getPosition'.");
      } else {
        position = { x: this._x, y: this._y };
      }

      this.position = position;
      return this.position;
    }

    /** Helper Methods **/

  }, {
    key: '__validatePositionX',
    value: function __validatePositionX(posX) {
      if (valid_positions_x.indexOf(posX) > -1) {
        return true;
      }
      console.warn('Unknown value for position x: ', posX, '. The valid positions are: ', valid_positions_x);
      return false;
    }
  }, {
    key: '__validatePositionY',
    value: function __validatePositionY(posY) {
      if (valid_positions_y.indexOf(posY) > -1) {
        return true;
      }
      console.warn('Unknown value for position y: ', posY, '. The valid positions are: ', valid_positions_y);
      return false;
    }
  }, {
    key: '__getXfromPositionX',
    value: function __getXfromPositionX(posX, c_width) {
      switch (posX) {
        case 'center':
          return c_width / 2 - this.width / 2 + this._offsetX;
        case 'left':
          return this._offsetX;
        case 'right':
          return c_width - this.width + this._offsetX;
          break;
        default:
          console.warn('Unknown value for position x: ', posX, '. The valid positions are: ', valid_positions_x);
          return 0;
      }
    }
  }, {
    key: '__getYfromPositionY',
    value: function __getYfromPositionY(posY, c_height) {
      switch (posY) {
        case 'center':
          return c_height / 2 - this.height / 2 + this._offsetY;
        case 'top':
          return this._offsetY;
        case 'bottom':
          return c_height - this.height + this._offsetY;
          break;
        default:
          console.warn('Unknown value for position y: ', posY, '. The valid positions are: ', valid_positions_y);
          return 0;
      }
    }
  }, {
    key: '__calcPosition',
    value: function __calcPosition(_ref2) {
      var position = _ref2.position,
          positionX = _ref2.positionX,
          positionY = _ref2.positionY,
          offset = _ref2.offset,
          offsetX = _ref2.offsetX,
          offsetY = _ref2.offsetY;

      if (position) {
        var positions = position.split(' ');
        if (positions.length == 1 && positions[0] === 'center') {
          positionX = positionY = positions[0];
        } else if (positions.length == 2 && this.__validatePositionX(positions[0]) && this.__validatePositionY(positions[1])) {
          positionX = positions[0];
          positionY = positions[1];
        }
      }
      // should have positionX & positionY, either from above logic or as param
      if (positionX != null && positionY != null) {
        this._positionX = positionX;
        this._positionY = positionY;
      }

      if (offset != null && offset.hasOwnProperty('x') && offset.hasOwnProperty('y')) {
        offsetX = offset.x;
        offsetY = offset.y;
      }

      // should have offsetX & offsetY, either from above logic or as param
      if (offsetX != null && offsetY != null) {
        this._offsetX = offsetX;
        this._offsetY = offsetY;
      }
    }

    /** Getters and Setters **/

  }, {
    key: 'offsetX',
    get: function get() {
      return this._offsetX;
    },
    set: function set(x) {
      this._offsetX = x;
    }
  }, {
    key: 'offsetY',
    get: function get() {
      return this._offsetY;
    },
    set: function set(y) {
      this._offsetY = y;
    }
  }]);

  return Dialog;
}(__WEBPACK_IMPORTED_MODULE_0__HUDElement__["a" /* default */]);

/* harmony default export */ exports["a"] = Dialog;

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__canvas_canvas__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__base_camera__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__util_util__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__screen_screenManager__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ludic__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__input_inputController__ = __webpack_require__(9);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }








var LudicApp = function () {
  function LudicApp(config) {
    _classCallCheck(this, LudicApp);

    __WEBPACK_IMPORTED_MODULE_2__util_util__["a" /* default */].setConfig(config);
    __WEBPACK_IMPORTED_MODULE_4__ludic__["a" /* default */].config = config;
    __WEBPACK_IMPORTED_MODULE_4__ludic__["a" /* default */].canvas = new __WEBPACK_IMPORTED_MODULE_0__canvas_canvas__["a" /* default */]();
    __WEBPACK_IMPORTED_MODULE_4__ludic__["a" /* default */].context = __WEBPACK_IMPORTED_MODULE_4__ludic__["a" /* default */].canvas.getContext();
    __WEBPACK_IMPORTED_MODULE_4__ludic__["a" /* default */].camera = new __WEBPACK_IMPORTED_MODULE_1__base_camera__["a" /* default */](__WEBPACK_IMPORTED_MODULE_4__ludic__["a" /* default */].canvas);
    __WEBPACK_IMPORTED_MODULE_4__ludic__["a" /* default */].screenManager = new __WEBPACK_IMPORTED_MODULE_3__screen_screenManager__["a" /* default */]();
    __WEBPACK_IMPORTED_MODULE_4__ludic__["a" /* default */].input = new __WEBPACK_IMPORTED_MODULE_5__input_inputController__["a" /* default */](__WEBPACK_IMPORTED_MODULE_4__ludic__["a" /* default */].canvas, __WEBPACK_IMPORTED_MODULE_4__ludic__["a" /* default */].camera);
    __WEBPACK_IMPORTED_MODULE_4__ludic__["a" /* default */].util = __WEBPACK_IMPORTED_MODULE_2__util_util__["a" /* default */];

    //Put Ludic on the window in devmode
    if (__WEBPACK_IMPORTED_MODULE_4__ludic__["a" /* default */].devmode) {
      window.Ludic = __WEBPACK_IMPORTED_MODULE_4__ludic__["a" /* default */];
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

  _createClass(LudicApp, [{
    key: 'update',
    value: function update(delta) {}
  }, {
    key: '_animate',
    value: function _animate(time) {
      if (this.running) {
        this._requestAnimFrame(this._animate);

        var delta = (time - this.lastTime) / 1000;
        this.lastTime = __WEBPACK_IMPORTED_MODULE_4__ludic__["a" /* default */]._time = time;

        if (!Number.isNaN(delta)) {
          __WEBPACK_IMPORTED_MODULE_4__ludic__["a" /* default */].context.save();
          this.update(delta, time);
          __WEBPACK_IMPORTED_MODULE_4__ludic__["a" /* default */].context.restore();
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
    value: function run() {
      this.running = true;
      this._animate();
    }
  }]);

  return LudicApp;
}();

/* harmony default export */ exports["a"] = LudicApp;

/***/ },
/* 14 */
/***/ function(module, exports) {


var timeTotal = 0;
var averageArray = [];
var period = 5;
var average;

onmessage = function onmessage(event) {
  timeTotal += event.data;

  averageArray.push(event.data);

  if (averageArray.length > period) {
    timeTotal -= averageArray.shift();
    average = timeTotal / period;
    // return 1 / average;
    postMessage(1 / average);
  }
};

/***/ },
/* 15 */
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
/* 16 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Screen = function () {
  function Screen(camera, options) {
    _classCallCheck(this, Screen);

    this.camera = camera;
    this.options = options || {};
  }

  _createClass(Screen, [{
    key: "_step",
    value: function _step(ctx, delta) {
      if (!this._isFinished) {
        this.update.apply(this, arguments);
      }
    }
  }, {
    key: "update",
    value: function update(ctx, delta) {}
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
  }]);

  return Screen;
}();

/* harmony default export */ exports["a"] = Screen;

/***/ },
/* 17 */
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
/* 18 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var axesLength = 100;

var HUD = function () {
  function HUD(camera) {
    _classCallCheck(this, HUD);

    this.camera = camera;
    this.ctx = this.camera.context;

    this.$refs = {};
    this.elements = [];
  }

  _createClass(HUD, [{
    key: 'update',
    value: function update(delta) {
      this.ctx.save();
      this.camera.resetTransform(this.ctx);

      // draw the axis for the hud system
      this.drawAxes(delta);

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.elements[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var el = _step.value;

          if (el.visible) {
            el.render(delta, this.ctx);
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

      this.ctx.restore();
    }
  }, {
    key: 'drawAxes',
    value: function drawAxes(delta) {
      this.ctx.save();
      // this is to allow the axes to be seen
      this.ctx.translate(this.ctx.lineWidth, this.ctx.lineWidth);
      this.ctx.strokeStyle = 'rgb(192,0,0)';
      this.ctx.beginPath();
      this.ctx.moveTo(0, 0);
      this.ctx.lineTo(axesLength, 0);
      this.ctx.stroke();
      this.ctx.strokeStyle = 'rgb(0,192,0)';
      this.ctx.beginPath();
      this.ctx.moveTo(0, 0);
      this.ctx.lineTo(0, axesLength);
      this.ctx.stroke();
      this.ctx.restore();
    }
  }, {
    key: 'addElement',
    value: function addElement(element, ref) {
      this.elements.push(element);
      if (ref) {
        if (!this.$refs.hasOwnProperty(ref)) {
          this.$refs[ref] = element;
        } else {
          console.warn('Ref "' + ref + '" is already taken');
        }
      }
      return this;
    }
  }]);

  return HUD;
}();

/* harmony default export */ exports["a"] = HUD;

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Dialog__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__app_ludic__ = __webpack_require__(1);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }




var MenuDialog = function (_Dialog) {
  _inherits(MenuDialog, _Dialog);

  function MenuDialog(options) {
    _classCallCheck(this, MenuDialog);

    var _this = _possibleConstructorReturn(this, (MenuDialog.__proto__ || Object.getPrototypeOf(MenuDialog)).call(this, options));

    _this.menuItems = [];

    return _this;
  }

  _createClass(MenuDialog, [{
    key: 'render',
    value: function render(delta, ctx) {
      _get(MenuDialog.prototype.__proto__ || Object.getPrototypeOf(MenuDialog.prototype), 'render', this).call(this, delta, ctx);

      // render the menu items
      ctx.save();
      ctx.translate(this.position.x, this.position.y);
      this.menuItems.forEach(function (item, index) {
        item.render(delta, ctx, index);
      });
      ctx.restore();
    }
  }, {
    key: 'addMenuItem',
    value: function addMenuItem(item) {
      if (item instanceof MenuDialog.MenuItem) {
        this.menuItems.push(item);
      } else {
        console.warn("Parameter needs to be of type MenuDialog.MenuItem");
      }
    }
  }, {
    key: 'show',
    value: function show() {
      _get(MenuDialog.prototype.__proto__ || Object.getPrototypeOf(MenuDialog.prototype), 'show', this).call(this);
      // take input control
      this.input = __WEBPACK_IMPORTED_MODULE_1__app_ludic__["a" /* default */].input.newEventListener({
        stopPropagation: true,
        keyConfig: {
          'w': 'up',
          's': 'down',
          'esc.once.down': 'start'
        },
        methods: {
          up: this.selectPreviousItem,
          down: this.selectNextItem,
          start: this.toggleMenuOpen
        }
      }, this, true);

      this.selectedItemIndex = 0;
      this.selectItem(this.selectedItemIndex);
    }
  }, {
    key: 'hide',
    value: function hide() {
      _get(MenuDialog.prototype.__proto__ || Object.getPrototypeOf(MenuDialog.prototype), 'hide', this).call(this);
      __WEBPACK_IMPORTED_MODULE_1__app_ludic__["a" /* default */].input.removeEventListener(this.input);
    }
  }, {
    key: 'selectItem',
    value: function selectItem(index) {
      if (this.selectedItem) {
        this.selectedItem.deselect();
      }
      this.selectedItem = this.menuItems[index];
      this.selectedItem.select();
    }
  }, {
    key: 'selectNextItem',
    value: function selectNextItem(keyDown, e) {
      if (keyDown && !e.button.lastState.pressed) {
        this.selectItem(++this.selectedItemIndex % this.menuItems.length);
        // this.selectedItemIndex++;
      }
    }
  }, {
    key: 'selectPreviousItem',
    value: function selectPreviousItem(keyDown, e) {
      if (keyDown && !e.button.lastState.pressed) {
        this.selectItem(this.menuItems.length - 1 - ++this.selectedItemIndex % this.menuItems.length);
        // this.selectedItemIndex++;
      }
    }
  }, {
    key: 'toggleMenuOpen',
    value: function toggleMenuOpen(keyDown, e) {
      if (keyDown && !e.button.lastState.pressed) {
        this.toggle();
      }
    }
  }]);

  return MenuDialog;
}(__WEBPACK_IMPORTED_MODULE_0__Dialog__["a" /* default */]);

/* harmony default export */ exports["a"] = MenuDialog;


MenuDialog.MenuItem = function () {
  function MenuItem(text) {
    _classCallCheck(this, MenuItem);

    this.text = text;
  }

  _createClass(MenuItem, [{
    key: 'render',
    value: function render(delta, ctx, index) {
      ctx.save();
      ctx.fillStyle = this.selected ? 'red' : 'white';
      ctx.font = '22px serif';
      ctx.fillText(this.text, 10, 59 + index * 27); // y = fontSize + 10 + distance from title = 22+10+27
      ctx.restore();
    }
  }, {
    key: 'select',
    value: function select() {
      this.selected = true;
    }
  }, {
    key: 'deselect',
    value: function deselect() {
      this.selected = false;
    }
  }]);

  return MenuItem;
}();

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__HUDElement__ = __webpack_require__(2);
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }



var Text = function (_HUDElement) {
  _inherits(Text, _HUDElement);

  function Text(text, x, y) {
    var _ref = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {},
        _ref$fontFamily = _ref.fontFamily,
        fontFamily = _ref$fontFamily === undefined ? 'serif' : _ref$fontFamily,
        _ref$fontSize = _ref.fontSize,
        fontSize = _ref$fontSize === undefined ? 12 : _ref$fontSize,
        _ref$fontSizeUnit = _ref.fontSizeUnit,
        fontSizeUnit = _ref$fontSizeUnit === undefined ? 'px' : _ref$fontSizeUnit,
        _ref$color = _ref.color,
        color = _ref$color === undefined ? 'black' : _ref$color,
        _ref$drawStyle = _ref.drawStyle,
        drawStyle = _ref$drawStyle === undefined ? 'fill' : _ref$drawStyle,
        _ref$adjustOrigin = _ref.adjustOrigin,
        adjustOrigin = _ref$adjustOrigin === undefined ? true : _ref$adjustOrigin,
        _ref$visible = _ref.visible,
        visible = _ref$visible === undefined ? true : _ref$visible;

    _classCallCheck(this, Text);

    var _this = _possibleConstructorReturn(this, (Text.__proto__ || Object.getPrototypeOf(Text)).call(this));

    _this.visible = true;

    _this._adjustOrigin = true;
    _this.drawStyle = drawStyle;

    _this.fontFamily = fontFamily;
    _this.setFontSize(fontSize, fontSizeUnit);

    // set the main attrs
    _this.text = text;
    _this.setPosition(x, y);
    _this.color = color;
    return _this;
  }

  _createClass(Text, [{
    key: 'render',
    value: function render(delta, ctx) {
      ctx.save();
      ctx.font = this.__fontSize + ' ' + this.fontFamily;

      if (this.drawStyle === 'stroke') {
        ctx.strokeStyle = this.color;
        ctx.strokeText(this.text, this.x, this._adjustOrigin ? this._y + this._fontSize : this._y);
      } else {
        ctx.fillStyle = this.color;
        ctx.fillText(this.text, this.x, this._adjustOrigin ? this._y + this._fontSize : this._y);
      }
      ctx.restore();
    }
  }, {
    key: 'setPosition',
    value: function setPosition(x, y) {
      // x can also be an object with .x/.y props
      if ((typeof x === 'undefined' ? 'undefined' : _typeof(x)) === 'object' && y == null) {
        var pos = x;
        this.setPositionX(pos.x);
        this.setPositionY(pos.y);
      } else if (typeof x === 'number' && typeof y === 'number') {
        this.setPositionX(x);
        this.setPositionY(y);
      } else {
        console.warn('Unknown parameters passed into "setPosition"', arguments);
      }
    }
  }, {
    key: 'setPositionX',
    value: function setPositionX(x) {
      this.x = x;
    }
  }, {
    key: 'setPositionY',
    value: function setPositionY(y) {
      this.y = y;
    }
  }, {
    key: 'setFontSize',
    value: function setFontSize(fontSize) {
      var unit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.fontSizeUnit;

      this.__fontSize = '' + fontSize + unit;
      this._fontSize = parseFloat(fontSize);
      this.fontSizeUnit = unit;
    }
  }, {
    key: 'y',
    get: function get() {
      return parseFloat(this._y);
    },
    set: function set(y) {
      y = parseFloat(y);
      this._y = y;
    }
  }, {
    key: 'fontSize',
    set: function set(fontSize) {
      this.setFontSize(fontSize);
    },
    get: function get() {
      return this._fontSize;
    }
  }]);

  return Text;
}(__WEBPACK_IMPORTED_MODULE_0__HUDElement__["a" /* default */]);

/* harmony default export */ exports["a"] = Text;

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ exports["a"] = classTypeOf;

function classTypeOf(typeToCheck, type) {
  do {
    if (typeToCheck === type) {
      return true;
    }
  } while ((typeToCheck = Object.getPrototypeOf(typeToCheck)) !== Function.prototype);
}

/***/ },
/* 22 */
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
/* 23 */
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
/* 24 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__components_app_LudicApp__ = __webpack_require__(13);
/* harmony reexport (binding) */ __webpack_require__.d(exports, "LudicApp", function() { return __WEBPACK_IMPORTED_MODULE_1__components_app_LudicApp__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__components_app_ludic__ = __webpack_require__(1);
/* harmony reexport (binding) */ __webpack_require__.d(exports, "default", function() { return __WEBPACK_IMPORTED_MODULE_2__components_app_ludic__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(exports, "Ludic", function() { return __WEBPACK_IMPORTED_MODULE_2__components_app_ludic__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__components_base_asset__ = __webpack_require__(3);
/* harmony reexport (binding) */ __webpack_require__.d(exports, "Asset", function() { return __WEBPACK_IMPORTED_MODULE_3__components_base_asset__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__components_base_assetManager__ = __webpack_require__(4);
/* harmony reexport (binding) */ __webpack_require__.d(exports, "AssetManager", function() { return __WEBPACK_IMPORTED_MODULE_4__components_base_assetManager__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__components_base_camera__ = __webpack_require__(5);
/* harmony reexport (binding) */ __webpack_require__.d(exports, "Camera", function() { return __WEBPACK_IMPORTED_MODULE_5__components_base_camera__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__components_base_fps__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__components_base_fps___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6__components_base_fps__);
/* harmony reexport (default from non-hamory) */ __webpack_require__.d(exports, "fps", function() { return __WEBPACK_IMPORTED_MODULE_6__components_base_fps___default.a; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__components_base_imageAsset__ = __webpack_require__(6);
/* harmony reexport (binding) */ __webpack_require__.d(exports, "ImageAsset", function() { return __WEBPACK_IMPORTED_MODULE_7__components_base_imageAsset__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__components_canvas_canvas__ = __webpack_require__(7);
/* harmony reexport (binding) */ __webpack_require__.d(exports, "Canvas", function() { return __WEBPACK_IMPORTED_MODULE_8__components_canvas_canvas__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__components_ein__ = __webpack_require__(25);
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "EntityManager", function() { return __WEBPACK_IMPORTED_MODULE_9__components_ein__["a"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "em", function() { return __WEBPACK_IMPORTED_MODULE_9__components_ein__["b"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "BaseEntity", function() { return __WEBPACK_IMPORTED_MODULE_9__components_ein__["c"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "BaseSystem", function() { return __WEBPACK_IMPORTED_MODULE_9__components_ein__["d"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__components_input_inputController__ = __webpack_require__(9);
/* harmony reexport (binding) */ __webpack_require__.d(exports, "InputController", function() { return __WEBPACK_IMPORTED_MODULE_10__components_input_inputController__["a"]; });
Object.defineProperty(exports, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_patches_Path2D__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_patches_Path2D___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__components_patches_Path2D__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__components_screen_screen__ = __webpack_require__(16);
/* harmony reexport (binding) */ __webpack_require__.d(exports, "Screen", function() { return __WEBPACK_IMPORTED_MODULE_11__components_screen_screen__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__components_screen_screenManager__ = __webpack_require__(10);
/* harmony reexport (binding) */ __webpack_require__.d(exports, "ScreenManager", function() { return __WEBPACK_IMPORTED_MODULE_12__components_screen_screenManager__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__components_sprite_BaseSprite__ = __webpack_require__(11);
/* harmony reexport (binding) */ __webpack_require__.d(exports, "BaseSprite", function() { return __WEBPACK_IMPORTED_MODULE_13__components_sprite_BaseSprite__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__components_sprite_MultiSprite__ = __webpack_require__(17);
/* harmony reexport (binding) */ __webpack_require__.d(exports, "MultiSprite", function() { return __WEBPACK_IMPORTED_MODULE_14__components_sprite_MultiSprite__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__components_ui_Hud__ = __webpack_require__(18);
/* harmony reexport (binding) */ __webpack_require__.d(exports, "HUD", function() { return __WEBPACK_IMPORTED_MODULE_15__components_ui_Hud__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__components_ui_HUDElement__ = __webpack_require__(2);
/* harmony reexport (binding) */ __webpack_require__.d(exports, "HUDElement", function() { return __WEBPACK_IMPORTED_MODULE_16__components_ui_HUDElement__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__components_ui_Text__ = __webpack_require__(20);
/* harmony reexport (binding) */ __webpack_require__.d(exports, "Text", function() { return __WEBPACK_IMPORTED_MODULE_17__components_ui_Text__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__components_ui_Dialog__ = __webpack_require__(12);
/* harmony reexport (binding) */ __webpack_require__.d(exports, "Dialog", function() { return __WEBPACK_IMPORTED_MODULE_18__components_ui_Dialog__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__components_ui_MenuDialog__ = __webpack_require__(19);
/* harmony reexport (binding) */ __webpack_require__.d(exports, "MenuDialog", function() { return __WEBPACK_IMPORTED_MODULE_19__components_ui_MenuDialog__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__components_util_util__ = __webpack_require__(0);
/* harmony reexport (binding) */ __webpack_require__.d(exports, "Util", function() { return __WEBPACK_IMPORTED_MODULE_20__components_util_util__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21__components_util_utilities__ = __webpack_require__(21);
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "classTypeOf", function() { return __WEBPACK_IMPORTED_MODULE_21__components_util_utilities__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_22__components_engine_Vector2__ = __webpack_require__(8);
/* harmony reexport (binding) */ __webpack_require__.d(exports, "Vector2", function() { return __WEBPACK_IMPORTED_MODULE_22__components_engine_Vector2__["a"]; });

// app



// base






// canvas


// ein


// input


// patches
/*
  patches that are prototype extensions, just import here
  patches that require a parameter (monkey patch) export function name with prefix `Patch`
    i.e. export {default as PatchFixSomeClass} from './components/patches/fixSomeClass'
*/


// screen



// sprite



// ui






// util



// vectors


/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__EntityManager_js__ = __webpack_require__(28);
/* harmony reexport (binding) */ __webpack_require__.d(exports, "a", function() { return __WEBPACK_IMPORTED_MODULE_0__EntityManager_js__["a"]; });
/* unused harmony reexport default */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__BaseEntity_js__ = __webpack_require__(26);
/* harmony reexport (binding) */ __webpack_require__.d(exports, "c", function() { return __WEBPACK_IMPORTED_MODULE_1__BaseEntity_js__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__BaseSystem_js__ = __webpack_require__(27);
/* harmony reexport (binding) */ __webpack_require__.d(exports, "d", function() { return __WEBPACK_IMPORTED_MODULE_2__BaseSystem_js__["a"]; });
/* harmony export (binding) */ __webpack_require__.d(exports, "b", function() { return em; });

var em = new __WEBPACK_IMPORTED_MODULE_0__EntityManager_js__["a" /* default */]();




/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BaseEntity = function BaseEntity() {
  var active = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
  var priority = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : -1;

  _classCallCheck(this, BaseEntity);

  this.active = active;
  this.priority = priority;
  this.needsDestroy = false;
};

/* harmony default export */ exports["a"] = BaseEntity;
;

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BaseSystem = function () {
  function BaseSystem() {
    var active = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
    var priority = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : -1;
    var updateFunction = arguments[2];

    _classCallCheck(this, BaseSystem);

    this.active = active;
    this.priority = priority;
    this.updateFunction = updateFunction;
    this.entities = [];
  }

  //Overide


  _createClass(BaseSystem, [{
    key: "onEntityAdded",
    value: function onEntityAdded(manager) {}
  }, {
    key: "onEntityRemoved",
    value: function onEntityRemoved(manager) {}
  }, {
    key: "onSystemAddedTo",
    value: function onSystemAddedTo(manager) {
      this.em = manager;
    }
  }, {
    key: "onSystemRemovedFrom",
    value: function onSystemRemovedFrom(manager) {}

    //Overide

  }, {
    key: "update",
    value: function update() {
      if (this.updateFunction) {
        this.updateFunction.apply(this, arguments);
      }
    }
  }]);

  return BaseSystem;
}();

/* harmony default export */ exports["a"] = BaseSystem;
;

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EntityManager = function () {
  function EntityManager() {
    _classCallCheck(this, EntityManager);

    this.entities = [];
    this.systems = [];
    this.listeners = {};
    this.nextEntityId = 0;
    this.nextSystemId = 0;
  }

  /* Entities */


  _createClass(EntityManager, [{
    key: "addEntity",
    value: function addEntity(entity) {
      var _this = this;

      if (entity.hasOwnProperty("_id")) {
        console.warn("EntityManager.addEntity(): Attempted to add an Entity with an existing _id ");
        return false;
      } else {
        entity._id = this.nextEntityId++;
        this.entities.push(entity);

        //Notify Systems EntityAdded
        this.systems.forEach(function (system) {
          system.onEntityAdded(_this);
        });
        return true;
      }
    }
  }, {
    key: "removeEntity",
    value: function removeEntity(entity) {
      var _this2 = this;

      var index = this.entities.indexOf(entity);
      if (index > -1) {
        this.entities.splice(index, 1);

        this.systems.forEach(function (system) {
          system.onEntityRemoved(_this2);
        });
        return true;
      } else {
        console.warn("EntityManager.removeEntity(): Attempted to remove an Entity not in this.entities");
        return false;
      }
    }
  }, {
    key: "getEnityById",
    value: function getEnityById(id) {
      this.entities.forEach(function (entity) {
        if (entity._id === id) {
          return entity;
        }
      });
      console.warn("EntityManager.getEnityById(): Attempted to get an Entity not in this.entities");
    }
  }, {
    key: "getEntitiesByProps",
    value: function getEntitiesByProps(props) {
      var entities = [];
      this.entities.forEach(function (entity) {
        var hasAllProps = true;
        props.forEach(function (prop) {
          if ((typeof prop === "undefined" ? "undefined" : _typeof(prop)) === 'object') {
            if (!entity.hasOwnProperty(prop.name) || entity[prop.name] !== prop.value) {
              hasAllProps = false;
            }
          } else if (typeof prop === 'string') {
            if (!entity.hasOwnProperty(prop)) {
              hasAllProps = false;
            }
          }
        });

        if (hasAllProps) {
          entities.push(entity);
        }
      });
      return entities;
    }
  }, {
    key: "getEntitiesByClassName",
    value: function getEntitiesByClassName(className) {
      var entities = [];
      this.entities.forEach(function (entity) {
        if (entity.constructor.name === className) {
          entities.push(entity);
        }
      });
      return entities;
    }

    /* Systems */

  }, {
    key: "addSystem",
    value: function addSystem(system) {
      if (system.hasOwnProperty("_id")) {
        console.warn("EntityManager.addSystem(): Attempted to add a System with an existing _id ");
        return false;
      } else {
        system._id = this.nextSystemId++;
        this.systems.push(system);
        system.onSystemAddedTo(this);
        this._sortSystems();
        return true;
      }
    }
  }, {
    key: "removeSystem",
    value: function removeSystem(system) {
      var index = this.systems.indexOf(system);
      if (index > -1) {
        this.systems.splice(index, 1);
        system.onSystemRemovedFrom(this);
        this._sortSystems();
        return true;
      } else {
        console.warn("EntityManager.removeSystem(): Attempted to remove a System not in this.systems");
        return false;
      }
    }
  }, {
    key: "_sortSystems",
    value: function _sortSystems() {
      this.systems.sort(function (a, b) {
        return a.priority - b.priority;
      });
    }

    /* Events */

  }, {
    key: "listenFor",
    value: function listenFor(eventName, listener, binder) {
      var group = this.listeners[eventName];
      if (!group) {
        group = [];
        this.listeners[eventName] = group;
      }

      var l = {};
      l.eventName = eventName;
      l.listener = listener;
      l.binder = binder;

      group.push(l);
    }
  }, {
    key: "notify",
    value: function notify(eventName) {
      var _arguments = arguments;

      var group = this.listeners[eventName];
      if (group) {
        group.forEach(function (l) {
          if ('binder' in l) {
            l.listener.apply(l.binder, _arguments);
          } else {
            l.listener.apply(l.listener, _arguments);
          }
        });
      }
    }
  }, {
    key: "removeListener",
    value: function removeListener(eventName, listener) {
      var group = this.listeners[eventName];

      if (group) {
        for (var ix in group) {
          var l = group[ix];
          if (l.listener === listener) {
            group.splice(ix, 1);
            break;
          }
        }
      }
    }

    //Update

  }, {
    key: "update",
    value: function update(delta) {
      var _this3 = this;

      //Update all active systems
      this.systems.forEach(function (system) {
        if (system.active) {
          system.update(delta, _this3);
        }
      });
    }
  }]);

  return EntityManager;
}();

/* harmony default export */ exports["a"] = EntityManager;
;

/***/ }
/******/ ]);
//# sourceMappingURL=main.js.map