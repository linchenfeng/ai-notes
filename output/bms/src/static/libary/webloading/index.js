;(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined'
    ? factory(exports)
    : typeof define === 'function' && define.amd
    ? define(['exports'], factory)
    : ((global = typeof globalThis !== 'undefined' ? globalThis : global || self), factory((global.rustOption = {})))
})(this, function (exports) {
  'use strict'

  /**
   * Supported loading methods
   */
  /** @public */
  exports.LOADING_TYPES = void 0
  ;(function (LOADING_TYPES) {
    LOADING_TYPES['DOM'] = 'dom'
    LOADING_TYPES['FULL'] = 'full'
    LOADING_TYPES['MINI'] = 'mini'
  })(exports.LOADING_TYPES || (exports.LOADING_TYPES = {}))
  /**
   * Supported models
   */
  /** @public */
  exports.MODEL_TYPES = void 0
  ;(function (MODEL_TYPES) {
    // Gear
    MODEL_TYPES['GEAR'] = 'Gear'
    // SKELETON
    MODEL_TYPES['SKELETON'] = 'Skeleton'
  })(exports.MODEL_TYPES || (exports.MODEL_TYPES = {}))
  /**
   *
   * @returns Return to default configuration
   */
  /** @public */
  function getDefOptions() {
    return {
      custom: null,
      html: '',
      type: exports.LOADING_TYPES.MINI,
      extendClass: 'vteam-loading',
      model: exports.MODEL_TYPES.GEAR,
      text: '加载中...',
      textGap: 8,
      fontSize: 14,
      fontFamily: 'Microsoft YaHei',
      delay: 65,
      notFeel: 0,
      delayInto: 320,
      optimization: false,
      zIndex: '2001',
      themeColor: '#fff',
      bgColor: '#111111b3',
      shadowColor: 'rgba(64,158,255,0.6)',
      shadowOffsetX: 0,
      shadowOffsetY: 0,
      shadowBlur: 0,
      pointerEvents: false,
      toast: true
    }
  }
  /** @public */
  exports.HOOKSCALL_KEY = void 0
  ;(function (HOOKSCALL_KEY) {
    HOOKSCALL_KEY['BEFORE_COLSE'] = 'beforeColse'
    HOOKSCALL_KEY['COLSED'] = 'colsed'
  })(exports.HOOKSCALL_KEY || (exports.HOOKSCALL_KEY = {}))
  /** @public */
  exports.LOG_TYPES = void 0
  ;(function (LOG_TYPES) {
    LOG_TYPES[(LOG_TYPES['INFO'] = 1)] = 'INFO'
    LOG_TYPES[(LOG_TYPES['WARN'] = 2)] = 'WARN'
    LOG_TYPES[(LOG_TYPES['ERROR'] = 3)] = 'ERROR'
  })(exports.LOG_TYPES || (exports.LOG_TYPES = {}))
  /**
   * Log output
   * @param message - content
   * @param config - to configure
   */
  var $Log = /*#__PURE__*/ (function () {
    function $Log() {}
    $Log.info = function (message) {
      this.call(message, exports.LOG_TYPES.INFO)
    }
    $Log.warn = function (message) {
      this.call(message, exports.LOG_TYPES.WARN)
    }
    $Log.error = function (message) {
      this.call(message, exports.LOG_TYPES.ERROR)
    }
    $Log.call = function (message, type, config) {
      if (type === void 0) {
        type = exports.LOG_TYPES.INFO
      }
      if (config === void 0) {
        config = {
          color: getDefOptions().themeColor,
          bgColor: getDefOptions().bgColor
        }
      }
      var bgColor = config.bgColor
      // Warning color cannot be changed
      if (type === 2) bgColor = '#fffbe5'
      // The wrong color cannot be changed
      if (type === 3) bgColor = '#fff0f0'
      var style = '\n      background:'
        .concat(bgColor, ';\n      font-size:14px;\n      color:')
        .concat(config.color, ';\n      padding: 4px;\n      border: 1px solid;')
      console.log('%c web-loading:'.concat(message, ' '), style)
    }
    return $Log
  })()
  /**
   * Judge null
   * @param value - Judgment value
   * @returns boolean
   */
  /** @function */
  function isNull(value) {
    switch (toType(value)) {
      case 'object':
        return Object.keys(value).length > 0
      case 'array':
        return value.length > 0
      case 'undefined':
        return value !== undefined
      case 'null':
        return value !== null
      default:
        return value !== undefined
    }
  }
  /**
   * empty aniamtions
   * @param id -
   */
  /** @function */
  function clearAnimationFrame(id) {
    if (!window.requestAnimationFrame) {
      window.clearInterval(id)
    } else {
      window.cancelAnimationFrame(id)
    }
  }
  /**
   * Type acquisition
   * @param key -
   * @returns
   */
  function toType(key) {
    try {
      var type = Object.prototype.toString.call(key)
      var t1 = type.split(' ')[1]
      var t2 = t1.split(']')[0]
      return t2.toLowerCase()
    } catch (e) {
      return 'not-type'
    }
  }
  /**
   * Listening to animation end function
   * @param el - element
   * @param fun - Execute Function
   */
  function onTransitionEndEvent(el, fun) {
    var transitionsName = null
    var transitions = {
      transition: 'transitionend',
      OTransition: 'oTransitionEnd',
      MozTransition: 'transitionend',
      WebkitTransition: 'webkitTransitionEnd'
    }
    for (var t in transitions) {
      if (el.style[t] !== undefined) {
        transitionsName = transitions[t]
        break
      }
    }
    if (!transitionsName) {
      fun()
    } else {
      var transitionFun_1 = function () {
        fun()
        el.removeEventListener(transitionsName, transitionFun_1)
      }
      el.addEventListener(transitionsName, transitionFun_1)
    }
  }
  /**
   * Create a unique loadingid
   * @returns
   */
  function createLoadingId() {
    var id = String(Date.now())
    if (window.crypto && window.crypto.randomUUID) id = window.crypto.randomUUID()
    return 'wl_' + id.replace(/-/g, '')
  }
  /** @public */
  exports.ZOOM_ACTION = void 0
  ;(function (ZOOM_ACTION) {
    ZOOM_ACTION['SCALE'] = 'scale'
    ZOOM_ACTION['WAVE'] = 'wave'
    ZOOM_ACTION['HEIGHT'] = 'height'
  })(exports.ZOOM_ACTION || (exports.ZOOM_ACTION = {}))
  /** @public */
  exports.PATTERN_CHART = void 0
  ;(function (PATTERN_CHART) {
    PATTERN_CHART['RECT'] = 'rect'
    PATTERN_CHART['ARC'] = 'arc'
    PATTERN_CHART['TRIANGLE'] = 'triangle'
    PATTERN_CHART['HEART'] = 'heart'
    PATTERN_CHART['POLYGON'] = 'polygon'
  })(exports.PATTERN_CHART || (exports.PATTERN_CHART = {}))
  /** @public */
  exports.ROLL_CHART = void 0
  ;(function (ROLL_CHART) {
    ROLL_CHART['RECT'] = 'rect'
    ROLL_CHART['WHEEL'] = 'wheel'
    ROLL_CHART['WINDMILL'] = 'windmill'
  })(exports.ROLL_CHART || (exports.ROLL_CHART = {}))
  /** @public */
  exports.CIRCULAR_ACTION = void 0
  ;(function (CIRCULAR_ACTION) {
    CIRCULAR_ACTION['COLLISION'] = 'collision'
    CIRCULAR_ACTION['ROTATE'] = 'rotate'
  })(exports.CIRCULAR_ACTION || (exports.CIRCULAR_ACTION = {}))

  /** @public */
  var BaseModel = /*#__PURE__*/ (function () {
    /**
     * Custom BaseModel
     * @param w - Canvas width
     * @param h - Canvas height
     * @param canvas - Canvas
     * @param options - Options
     * @param element - Container element
     * @param modelDefOptions -  Default options of model (Optional)
     * @param limits -  Default limits of model (Optional)
     * @param modelDefCall - Provides Callback function for model initialization，Generally initialize "canvas" or "brush" in model (Optional)
     */
    function BaseModel(w, h, canvas, options, element, modelDefOptions, limits, modelDefCall) {
      // Default Options of Model
      this.modelDefOptions = undefined
      // Limits of Model
      this.limits = undefined
      // Provides Callback function for model initialization
      this.modelDefCall = undefined
      this.webLog = $Log
      this.stepClear = 1
      this.w = w
      this.h = h
      this.canvas = canvas
      // Get a 2d brush by default
      this.ctx = canvas.getContext('2d')
      this.options = options
      this.element = element
      // Initialize model
      this.initContextCall(modelDefOptions, limits, modelDefCall)
    }
    // Initialize brush
    BaseModel.prototype._$initBaseContext = function () {
      this.clearRect()
      this.ctx.resetTransform()
      // Default theme color
      var op = this.options,
        defW = this.canvas.width,
        defH = this.canvas.height
      this.ctx.fillStyle = op.themeColor
      this.ctx.strokeStyle = op.themeColor
      this.ctx.shadowColor = op.shadowColor
      this.ctx.font = ''.concat(op.fontSize, 'px ').concat(op.fontFamily, ' small-caps')
      this.ctx.textAlign = 'center'
      this.ctx.textBaseline = 'middle'
      this.ctx.translate(defW / 2, defH / 2)
      // Synchronous size processing distortion
      var dpr = window.devicePixelRatio || 1
      this.ctx.scale(dpr, dpr)
      this.ctx.save()
    }
    // Initialize default events
    BaseModel.prototype._$initEvent = function () {
      var _this = this
      // Empty canvas before closing
      this.element.$store.hookCall.beforeColse(function () {
        _this.clearRect()
      })
    }
    /**
     * Encapsulate requestAnimationFrame to trigger the animation pin
     * @param fun - Trigger function
     * @returns
     */
    BaseModel.prototype._$animationFrame = function (fun) {
      var _this = this
      // compatible
      if (!window.requestAnimationFrame) {
        this.element.$store.animationId = window.setInterval(fun, this.options.delay)
      }
      // Use the time axis to control the trigger time
      var endTime = Date.now() + this.options.delay
      fun.call(this)
      var run = function () {
        if (Date.now() > endTime) {
          fun.call(_this)
          endTime = Date.now() + _this.options.delay
        }
        _this.element.$store.animationId = window.requestAnimationFrame(run)
      }
      this.element.$store.animationId = window.requestAnimationFrame(run)
    }
    /**
     * Initialize brush properties
     * @param modelDefOptions - Provides Options for model initialization
     * @param limits - Provides Limits for model initialization
     * @param modelDefCall - Provides Callback function for model initialization
     */
    BaseModel.prototype.initContextCall = function (modelDefOptions, limits, modelDefCall) {
      var _this = this
      // Initialize the point context of base
      this._$initBaseContext()
      // Initialize the hook event of base
      this._$initEvent()
      // Initialize model options
      if (isNull(modelDefOptions)) {
        // Record options
        this.modelDefOptions = modelDefOptions
        this.options = Object.assign(modelDefOptions, this.options)
        this.element.$store.options = this.options
        // Judge whether the attribute value needs to be limited (only for prompt)
        if (limits && limits.length && this.options.toast) {
          limits.forEach(function (l) {
            var mayKey = _this.options[l.key]
            if (isNull(mayKey) && !l.limit(mayKey)) $Log.warn(l.message)
          })
        }
      }
      if (isNull(limits)) this.limits = limits
      if (isNull(modelDefCall)) {
        // this.modelDefCall = modelDefCall
        modelDefCall.call(this, this)
      }
    }
    // Start Animation
    BaseModel.prototype.run = function (fun) {
      // If it is already in the loading state, there is no need to re-instance
      if (this.element.$store.animationId) this.clearAnimationFrame(this.element.$store.animationId)
      this._$animationFrame(fun)
    }
    /**
     * Cancel animationFrame animation pin
     * @param id - Animation id
     */
    BaseModel.prototype.clearAnimationFrame = function (id) {
      clearAnimationFrame(id)
    }
    // Empty the canvas
    BaseModel.prototype.clearRect = function (x, y, w_r, h) {
      var defW = this.canvas.width,
        defH = this.canvas.height
      // Because the starting point has been set to the center, expansion is needed
      if (isNull(x) && isNull(y) && isNull(w_r) && isNull(h)) {
        this.ctx.clearRect(x, y, w_r, h)
      }
      // Empty circular area
      else if (isNull(x) && isNull(y) && isNull(w_r) && !isNull(h)) {
        var calcWidth = w_r - this.stepClear
        var calcHeight = Math.sqrt(w_r * w_r - calcWidth * calcWidth)
        var posX = x - calcWidth
        var posY = y - calcHeight
        var widthX = 2 * calcWidth
        var heightY = 2 * calcHeight
        if (this.stepClear <= w_r) {
          this.ctx.clearRect(posX, posY, widthX, heightY)
          this.stepClear += 1
          this.clearRect(x, y, w_r)
        } else {
          this.stepClear = 1
        }
      } else this.ctx.clearRect(-defW, -defH, defW * 2, defH * 2)
    }
    /**
     * Draw a rounded rectangle
     * @param x - x
     * @param y - y
     * @param w - width
     * @param h - height
     * @param r - radius
     */
    BaseModel.prototype.drowRadiusRect = function (x, y, w, h, r) {
      this.ctx.beginPath()
      this.ctx.arc(x + r, y + r, r, 1 * Math.PI, 1.5 * Math.PI)
      this.ctx.lineTo(x + w - r, y)
      this.ctx.arc(x + w - r, y + r, r, 1.5 * Math.PI, 0)
      this.ctx.lineTo(x + w, y + h - r)
      this.ctx.arc(x + w - r, y + h - r, r, 0, 0.5 * Math.PI)
      this.ctx.lineTo(x + r, y + h)
      this.ctx.arc(x + r, y + h - r, r, 0.5 * Math.PI, Math.PI)
      this.ctx.lineTo(x, y + r)
      this.ctx.closePath()
    }
    /**
       *
       * @param params -
       * DrawTextParamsType:
       *    esGap?: Extra void
            x?: X-axis
            text?: text
            textColor?: text color
       */
    BaseModel.prototype.drawText = function (params) {
      var op = this.options
      var pm = Object.assign({ esGap: op.textGap || 0, x: 0, text: op.text || '', textColor: op.themeColor || 'rgba(64,158,255,1)' }, params)
      this.ctx.save()
      this.ctx.beginPath()
      this.ctx.fillStyle = pm.textColor
      this.ctx.fillText(pm.text, pm.x, (op.textGap || 0) + (op.fontSize || 0) + pm.esGap)
      this.ctx.closePath()
      this.ctx.restore()
    }
    return BaseModel
  })()

  /******************************************************************************
  Copyright (c) Microsoft Corporation.

  Permission to use, copy, modify, and/or distribute this software for any
  purpose with or without fee is hereby granted.

  THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
  REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
  AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
  INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
  LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
  OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
  PERFORMANCE OF THIS SOFTWARE.
  ***************************************************************************** */
  /* global Reflect, Promise */

  var extendStatics = function (d, b) {
    extendStatics =
      Object.setPrototypeOf ||
      ({ __proto__: [] } instanceof Array &&
        function (d, b) {
          d.__proto__ = b
        }) ||
      function (d, b) {
        for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]
      }
    return extendStatics(d, b)
  }

  function __extends(d, b) {
    if (typeof b !== 'function' && b !== null) throw new TypeError('Class extends value ' + String(b) + ' is not a constructor or null')
    extendStatics(d, b)
    function __() {
      this.constructor = d
    }
    d.prototype = b === null ? Object.create(b) : ((__.prototype = b.prototype), new __())
  }

  // Default Options of model
  var modelDefOptions$9 = {
    lineStart: 8,
    lineEnd: 14,
    lineStartSkew: 0,
    lineEndSkew: 0,
    lineWidth: 3,
    lineCap: 'round',
    lineNum: 10,
    direction: true
  }
  // Warning value
  var limits$6 = [
    {
      key: 'lineNum',
      message: 'lineNum value 4-18',
      limit: function (key) {
        return key >= 4 && key <= 18
      }
    }
  ]
  var Gear = /*#__PURE__*/ (function (_super) {
    __extends(Gear, _super)
    function Gear(w, h, canvas, options, element) {
      var _this =
        // 1.Initialize
        _super.call(this, w, h, canvas, options, element, modelDefOptions$9, limits$6, function (model) {
          // Model extra initial callback function
          var op = model.options
          model.ctx.lineCap = op.lineCap
          model.ctx.lineWidth = op.lineWidth
          model.ctx.save()
        }) || this
      _this.optimization(_this.options.textGap + _this.options.lineEnd)
      // 2.Start the animation needle and record the status
      _this.aps = Array.from({ length: _this.options.lineNum }, function (_, _index) {
        return _index
      })
      _this.run(_this.draw)
      return _this
    }
    Gear.prototype.draw = function () {
      this.clearRect()
      // technological process
      this.controller()
      // Draw gear
      this.drawGear()
      // Draw text
      var op = this.options
      this.drawText({ esGap: op.lineEnd })
    }
    Gear.prototype.controller = function () {
      var _this = this
      var op = this.options
      if (op.direction)
        this.aps = this.aps.map(function (a) {
          return a - 1 <= 0 ? _this.aps.length - 1 : a - 1
        })
      else
        this.aps = this.aps.map(function (a) {
          return a + 1 > _this.aps.length ? 0 : a + 1
        })
    }
    Gear.prototype.drawGear = function () {
      var op = this.options
      this.ctx.save()
      // Set Shadow
      this.ctx.shadowOffsetX = op.shadowOffsetX
      this.ctx.shadowOffsetY = op.shadowOffsetY
      this.ctx.shadowBlur = op.shadowBlur
      // Draw loading gear
      for (var i = 0; i < this.aps.length; i++) {
        this.ctx.beginPath()
        this.ctx.globalAlpha = this.aps[i] / 10
        this.ctx.moveTo(op.lineEndSkew, op.lineStart)
        this.ctx.lineTo(op.lineStartSkew, op.lineEnd)
        this.ctx.stroke()
        this.ctx.closePath()
        this.ctx.rotate((2 * Math.PI) / op.lineNum)
      }
      this.ctx.restore()
    }
    /**
     * Optimize processing (mainly optimize the default text position)
     * @param textY
     */
    Gear.prototype.optimization = function (textY) {
      // If optimization is turned on (optimize font position)
      if (this.options.optimization) {
        // Adjust according to width and height
        if (textY * 4 > this.h) {
          this.options.lineStart = this.h / 6 - 5
          this.options.lineEnd = this.h / 6
          this.options.textGap = 2
        }
      }
    }
    return Gear
  })(BaseModel)

  var modelDefOptions$5 = {
    lineCap: 'round',
    lineWidth: 2,
    lineColors: ['#d4d4d4', '#06ab2d', '#8a0303'],
    clockSize: 15,
    clockGap: 4,
    hLine: true,
    mLine: false,
    sLine: true,
    textTime: ''
  }
  var limits$2 = [
    {
      key: 'lineColors',
      message: 'lineColors.length <= 3',
      limit: function (key) {
        return key.length <= 3
      }
    }
  ]
  var Clock = /*#__PURE__*/ (function (_super) {
    __extends(Clock, _super)
    function Clock(w, h, canvas, options, element) {
      var _this =
        _super.call(this, w, h, canvas, options, element, modelDefOptions$5, limits$2, function (model) {
          var op = model.options
          model.ctx.lineCap = op.lineCap
          model.ctx.lineWidth = op.lineWidth
          model.ctx.save()
        }) || this
      _this.nowTime = -1
      _this.nowS = 0
      _this.run(_this.draw)
      return _this
    }
    Clock.prototype.draw = function () {
      this.clearRect()
      // Draw clock
      this.drawClock()
    }
    // drawText(h: number, m: number, s: number) {
    //   const op = this.options
    //   this.ctx.save()
    //   this.ctx.beginPath()
    //   this.ctx.fillText(op.text, 0, y)
    //   this.ctx.closePath()
    //   this.ctx.restore()
    // }
    Clock.prototype.drawClock = function () {
      var op = this.options
      var s = new Date().getSeconds()
      var m = new Date().getMinutes()
      var h = new Date().getHours()
      // top
      this.ctx.save()
      this.ctx.beginPath()
      this.setShadow()
      this.ctx.moveTo(-5, -(op.clockSize + op.clockGap))
      this.ctx.lineTo(5, -(op.clockSize + op.clockGap))
      this.ctx.stroke()
      this.ctx.closePath()
      // Outer circle
      this.ctx.beginPath()
      this.setShadow()
      this.ctx.arc(0, 0, op.clockSize, 0, Math.PI * 2)
      this.ctx.stroke()
      this.ctx.closePath()
      this.ctx.restore()
      // scale
      this.ctx.save()
      for (var i = 0; i < 12; i++) {
        this.ctx.beginPath()
        this.ctx.rotate(((360 / 12) * Math.PI) / 180)
        this.ctx.moveTo(op.clockSize - op.clockGap, 0)
        this.ctx.lineTo(op.clockSize - op.clockGap, 0)
        this.ctx.stroke()
        this.ctx.closePath()
      }
      this.ctx.restore()
      // Clockwise
      if (op.hLine) {
        this.ctx.save()
        this.ctx.beginPath()
        this.ctx.lineWidth = op.lineWidth * 1.6
        if (op.lineColors[0]) this.ctx.strokeStyle = op.lineColors[0]
        // Initialization point
        this.ctx.rotate((-90 * Math.PI) / 180)
        this.ctx.rotate((((h * 360) / 60) * Math.PI) / 180)
        this.ctx.moveTo(-1, 0)
        this.ctx.lineTo(op.clockSize / 2, 0)
        this.ctx.stroke()
        this.ctx.closePath()
        this.ctx.restore()
      }
      // minute hand
      if (op.mLine) {
        this.ctx.save()
        this.ctx.beginPath()
        if (op.lineColors[1]) this.ctx.strokeStyle = op.lineColors[1]
        this.ctx.lineWidth = op.lineWidth * 1.2
        // Initialization point
        this.ctx.rotate((-90 * Math.PI) / 180)
        this.ctx.rotate((((m * 360) / 60) * Math.PI) / 180)
        this.ctx.moveTo(-1, 0)
        this.ctx.lineTo(op.clockSize / 2 + op.clockGap, 0)
        this.ctx.stroke()
        this.ctx.closePath()
        this.ctx.restore()
      }
      // second hand
      if (op.sLine) {
        this.ctx.save()
        this.ctx.beginPath()
        if (op.lineColors[2]) this.ctx.strokeStyle = op.lineColors[2]
        this.ctx.rotate((-90 * Math.PI) / 180)
        this.ctx.rotate((((s * 360) / 60) * Math.PI) / 180)
        this.ctx.moveTo(-1, 0)
        this.ctx.lineTo(op.clockSize - op.clockGap, 0)
        this.ctx.stroke()
        this.ctx.closePath()
        this.ctx.restore()
        if (this.nowS !== s) this.nowTime++
        this.nowS = s
      }
      if (op.textTime === 'time') op.text = ''.concat(h, ' : ').concat(m, ' : ').concat(s)
      if (op.textTime === 's') op.text = this.nowTime + 's'
      this.drawText({ esGap: op.clockSize * 2 })
    }
    Clock.prototype.setShadow = function () {
      var op = this.options
      this.ctx.shadowOffsetX = op.shadowOffsetX
      this.ctx.shadowOffsetY = op.shadowOffsetY
      this.ctx.shadowBlur = op.shadowBlur
    }
    return Clock
  })(BaseModel)

  var modelDefOptions$4 = {
    charts: [
      exports.PATTERN_CHART.ARC,
      exports.PATTERN_CHART.RECT,
      exports.PATTERN_CHART.TRIANGLE,
      exports.PATTERN_CHART.HEART,
      exports.PATTERN_CHART.POLYGON
    ],
    chartColors: ['#409EFF', '#67C23A', '#E6A23C', '#F56C6C', '#0960bd'],
    maxHeight: 60,
    chartSize: 12
  }
  var limits$1 = [
    {
      key: 'chartSize',
      message: 'chartSize value 5-24',
      limit: function (key) {
        return key >= 5 && key <= 24
      }
    },
    {
      key: 'delay',
      message: 'Pattern.delay not allowed update',
      limit: function (key) {
        return key === getDefOptions().delay
      }
    }
  ]
  var Pattern = /*#__PURE__*/ (function (_super) {
    __extends(Pattern, _super)
    function Pattern(w, h, canvas, options, element) {
      var _this =
        _super.call(this, w, h, canvas, options, element, modelDefOptions$4, limits$1, function (model) {
          model.options.delay = 10
        }) || this
      _this.pattern = {
        color: _this.randomState('chartColors'),
        nowHeight: 10,
        chart: _this.randomState('charts'),
        shadow: 0,
        nowSatate: 1,
        turn: 0
      }
      _this.run(_this.draw)
      return _this
    }
    Pattern.prototype.draw = function () {
      var op = this.options
      this.clearRect()
      this.ctx.save()
      this.ctx.beginPath()
      this.ctx.translate(0, this.pattern.nowHeight)
      this.ctx.rotate((this.pattern.turn / Math.PI) * 2)
      this.ctx.fillStyle = this.pattern.color
      this.selectChart(0, 0, op.chartSize)
      this.ctx.closePath()
      this.ctx.restore()
      this.drawShadow()
      // Empty hidden part
      this.clearRect(-this.w, 0, this.w * 2, this.h)
      // Control value change
      this.controller(op)
      this.drawText({ textColor: this.pattern.color })
    }
    Pattern.prototype.controller = function (op) {
      this.pattern.turn += 10 // angle
      // Height and shadow
      if (this.pattern.nowSatate === 1) {
        this.pattern.nowHeight--
        this.pattern.shadow += 0.2
      } else if (this.pattern.nowSatate === 2) {
        this.pattern.nowHeight++
        this.pattern.shadow -= 0.2
      }
      this.pattern.shadow = Math.floor(this.pattern.shadow * 100) / 100
      // speed
      if (this.pattern.nowHeight <= -op.chartSize && this.pattern.nowHeight % 8 == 0) {
        op.delay += 0.5
        op.delay = Math.floor(op.delay * 100) / 100
      }
      // Range
      if (this.pattern.nowHeight <= -op.maxHeight) {
        this.pattern.nowSatate = 2
      } else if (this.pattern.nowHeight >= op.chartSize) {
        this.pattern.nowSatate = 1
        op.delay = 10
        // Toggle Graphics
        this.pattern.chart = this.randomState('charts')
        // Toggle Color
        this.pattern.color = this.randomState('chartColors')
      }
    }
    Pattern.prototype.selectChart = function (x, y, size) {
      switch (this.pattern.chart) {
        case exports.PATTERN_CHART.RECT:
          this.drawRect(x, y, size)
          break
        case exports.PATTERN_CHART.ARC:
          this.drawArc(x, y, size)
          break
        case exports.PATTERN_CHART.TRIANGLE:
          this.drawTriangle(x, y, size)
          break
        case exports.PATTERN_CHART.HEART:
          this.drawHeart(x, y, size)
          break
        case exports.PATTERN_CHART.POLYGON:
          this.drawPolygon(x, y, size)
          break
      }
    }
    Pattern.prototype.randomState = function (key) {
      var op = this.options
      return op[key][parseInt(String(Math.random() * op[key].length))]
    }
    Pattern.prototype.drawShadow = function () {
      this.ctx.save()
      this.ctx.beginPath()
      this.setShadow()
      this.ctx.globalAlpha = 0.2
      this.ctx.strokeStyle = this.pattern.color
      this.ctx.moveTo(-this.pattern.shadow / 2, 0)
      this.ctx.lineTo(this.pattern.shadow, 0)
      this.ctx.stroke()
      this.ctx.beginPath()
      this.ctx.restore()
    }
    Pattern.prototype.drawRect = function (x, y, size) {
      this.ctx.save()
      this.ctx.beginPath()
      this.setShadow()
      this.ctx.translate(-size / 2, -size / 2)
      this.ctx.fillRect(x, y, size, size)
      this.ctx.closePath()
      this.ctx.restore()
    }
    Pattern.prototype.drawArc = function (x, y, size) {
      this.ctx.save()
      this.ctx.beginPath()
      this.setShadow()
      this.ctx.arc(x, y, size / 2, 0, Math.PI * 2)
      this.ctx.fill()
      this.ctx.closePath()
      this.ctx.restore()
    }
    Pattern.prototype.drawTriangle = function (x, y, size) {
      this.ctx.save()
      this.ctx.beginPath()
      this.setShadow()
      this.ctx.translate(-size / 2, -((size / 2) * Math.sqrt(3)) / 2)
      this.ctx.moveTo(x, y)
      this.ctx.lineTo(size, 0)
      this.ctx.lineTo(size / 2, (size / 2) * Math.sqrt(3))
      this.ctx.lineTo(x, y)
      this.ctx.fill()
      this.ctx.closePath()
      this.ctx.restore()
    }
    Pattern.prototype.drawHeart = function (x, y, size) {
      size = size / 2
      this.ctx.save()
      this.ctx.beginPath()
      this.setShadow()
      this.ctx.translate(0, -(size * 2) / 2)
      this.ctx.moveTo(x, y)
      this.ctx.bezierCurveTo(size / 2, -size, size * 3, -size / 2, y, size * 2)
      this.ctx.moveTo(x, y)
      this.ctx.bezierCurveTo(-size / 2, -size, -size * 3, -size / 2, y, size * 2)
      this.ctx.fill()
      this.ctx.closePath()
      this.ctx.restore()
    }
    Pattern.prototype.drawPolygon = function (x, y, size) {
      this.ctx.save()
      this.ctx.beginPath()
      this.setShadow()
      this.ctx.translate(-size / 2, -size / 2)
      this.ctx.moveTo(x, y)
      this.ctx.lineTo(size, y)
      this.ctx.lineTo(size + size / 2, size / 2)
      this.ctx.lineTo(size, size / 2 + size / 2)
      this.ctx.lineTo(x, size)
      this.ctx.lineTo(x - size / 2, size - size / 2)
      this.ctx.lineTo(x, y)
      this.ctx.fill()
      this.ctx.closePath()
      this.ctx.restore()
    }
    Pattern.prototype.setShadow = function () {
      var op = this.options
      this.ctx.shadowColor = this.pattern.color
      this.ctx.shadowOffsetX = op.shadowOffsetX
      this.ctx.shadowOffsetY = op.shadowOffsetY
      this.ctx.shadowBlur = op.shadowBlur
    }
    return Pattern
  })(BaseModel)

  var modelDefOptions = {
    skeletonColor: 'rgb(240, 240, 240)',
    skeletonAnimationColor: 'rgb(226, 226, 226)',
    radius: 5,
    animation: true,
    deep: true,
    appoint: ''
  }
  var Skeleton = /*#__PURE__*/ (function (_super) {
    __extends(Skeleton, _super)
    function Skeleton(w, h, canvas, options, element) {
      var _this =
        _super.call(this, w, h, canvas, options, element, modelDefOptions, [], function (model) {
          var op = model.options
          // Reinitialize the canvas
          model.ctx.translate(-model.w / 2, -model.h / 2)
          model.canvas.width = model.element.scrollWidth
          model.canvas.height = model.element.scrollHeight
          model.ctx.fillStyle = op.skeletonColor
        }) || this
      _this.skeleton = []
      _this.colorFlow = 0
      _this.state = 1
      _this.WL_IMG = 'wl-img'
      _this.controller(_this.element.children)
      _this.run(_this.draw)
      return _this
    }
    Skeleton.prototype.draw = function () {
      this.clearRect()
      this.drawSkeleton()
    }
    Skeleton.prototype.controller = function (els) {
      var op = this.options
      for (var _i = 0, _a = Array.from(els); _i < _a.length; _i++) {
        var e = _a[_i]
        if (this.element.loadingId === e.id) continue
        if (op.appoint.length > 0 && e.getAttribute(op.appoint) === null) continue
        if (op.deep) {
          if (e.children.length <= 0) {
            this.skeleton.push({ title: e.nodeName, element: e })
          } else this.controller(e.children)
        } else {
          this.skeleton.push({ title: e.nodeName, element: e })
        }
      }
    }
    Skeleton.prototype.drawSkeleton = function () {
      var _this = this
      var op = this.options
      var linearGradient = this.ctx.createLinearGradient(0, 0, this.w, this.h)
      linearGradient.addColorStop(0, op.skeletonColor)
      linearGradient.addColorStop(this.colorFlow, op.skeletonAnimationColor)
      linearGradient.addColorStop(1, op.skeletonColor)
      if (op.animation) this.ctx.fillStyle = linearGradient
      this.skeleton.forEach(function (s) {
        var el = s.element
        // Handle the problem of fillet exposure
        _this.drowRadiusRect(el.offsetLeft, el.offsetTop, el.offsetWidth, el.offsetHeight, op.radius)
        _this.ctx.fill()
      })
      if (op.animation) {
        if (this.colorFlow >= 0.9) this.state = 2
        if (this.colorFlow <= 0.1) this.state = 1
        if (this.state === 1) this.colorFlow += 0.06
        if (this.state === 2) this.colorFlow -= 0.06
      }
    }
    return Skeleton
  })(BaseModel)

  // 动态引入会导致404
  var models = {
    Gear: Gear,
    Pattern: Pattern,
    Skeleton: Skeleton
  }

  /**
   * Model controller: which controls the displayed model
   * @param w
   * @param h
   * @param canvas
   * @param options
   * @param element
   */
  function drawController(w, h, canvas, options, element) {
    try {
      var storeModel = element.$store.model
      if (!storeModel) {
        var model = null
        if (!options.custom) model = new models[options.model](w, h, canvas, options, element)
        else model = new options.custom(w, h, canvas, options, element)
        storeModel = model
      } else {
        // Optimize:Because canvas will be reset after changing height and width, initialization is required
        storeModel.initContextCall(storeModel.modelDefOptions, storeModel.limits, storeModel.modelDefCall)
      }
    } catch (e) {
      $Log.error('draw error(' + e + ')')
    }
  }

  var $window$5 = window
  /**
   * Initialize $store
   * @param element Container element
   * @param hooks Hook function
   */
  function initStore(element, options, hooks) {
    // Storage status
    element.$store = {
      options: options,
      animationId: undefined,
      loadingId: null,
      model: null,
      hookCall: initStoreHooksCall(hooks)
    }
  }
  function initHooksCall() {
    var _a
    return (_a = {}), (_a[exports.HOOKSCALL_KEY.BEFORE_COLSE] = []), (_a[exports.HOOKSCALL_KEY.COLSED] = []), _a
  }
  // Initialize hooks
  function initStoreHooksCall(hooks) {
    var _a
    return (
      (_a = {}),
      (_a[exports.HOOKSCALL_KEY.BEFORE_COLSE] = function (fun) {
        hooks[exports.HOOKSCALL_KEY.BEFORE_COLSE].push(fun)
      }),
      (_a[exports.HOOKSCALL_KEY.COLSED] = function (fun) {
        hooks[exports.HOOKSCALL_KEY.COLSED].push(fun)
      }),
      _a
    )
  }
  function initCanvas() {
    return {
      canvas: $window$5.document.createElement('canvas'),
      hooks: initHooksCall(),
      loadingId: createLoadingId()
    }
  }
  function initHtml() {
    return {
      content: $window$5.document.createElement('div'),
      loadingId: createLoadingId()
    }
  }

  var $window$4 = window
  function initContentStyle(element, op, loadingId, animaEl) {
    // The client takes the true width and height. If penetration is enabled, the rolling width and height are taken
    var elementW = op.pointerEvents ? element.scrollWidth : element.clientWidth,
      elementH = op.pointerEvents ? element.scrollHeight : element.clientHeight,
      readElementStyle = $window$4.getComputedStyle(element),
      elementStyle = element.style,
      contentStyle = animaEl.style
    if (op.type === exports.LOADING_TYPES.DOM && !op.pointerEvents) {
      element.style.pointerEvents = 'none'
    }
    if (!readElementStyle.position || readElementStyle.position === 'static') elementStyle.position = 'relative'
    // Initialize canvas style
    animaEl.id = loadingId
    contentStyle.opacity = '0'
    contentStyle.position = 'absolute'
    contentStyle.left = ''.concat(op.pointerEvents ? 0 : element.scrollLeft, 'px')
    contentStyle.top = ''.concat(op.pointerEvents ? 0 : element.scrollTop, 'px')
    contentStyle.zIndex = op.zIndex
    contentStyle.transition = ''.concat(op.delayInto / 1000, 's ease-in-out')
    contentStyle.backgroundColor = op.bgColor
    contentStyle.borderRadius = readElementStyle.borderRadius
    // Set canvas size
    if (toType(animaEl) === 'htmlcanvaselement') {
      setupCanvas(animaEl, elementW, elementH)
    } else if (toType(animaEl) === 'htmldivelement') {
      // Initialize compatible html styles
      contentStyle.width = ''.concat(elementW, 'px')
      contentStyle.height = ''.concat(elementH, 'px')
      // Center
      contentStyle.display = 'flex'
      contentStyle.alignItems = 'center'
      contentStyle.justifyContent = 'center'
    }
    // injection
    element.append(animaEl)
    // Trigger to enter animation
    $window$4.setTimeout(function () {
      return (contentStyle.opacity = '1')
    }, 0)
    onTransitionEndEvent(element, function () {
      // Wait for all elements to appear and complete (animation ends)
      element.$store.loadingId = loadingId
    })
    return element
  }
  /**
   * Handle the amplification distortion. At the same time,
   * changing the height and width will also reset all contents of the canvas.
   * @param canvas
   * @param w
   * @param h
   */
  function setupCanvas(canvas, w, h) {
    var dpr = $window$4.devicePixelRatio || 1
    canvas.width = w * dpr
    canvas.height = h * dpr
    canvas.style.width = ''.concat(w, 'px')
    canvas.style.height = ''.concat(h, 'px')
  }
  function clearStyle(element, op, canvas) {
    // First visual transition
    canvas.style.opacity = '0'
    // Clear Extension
    if (op.type !== exports.LOADING_TYPES.DOM) {
      element.style.boxShadow = 'none'
    }
  }

  var $window$3 = window
  var WebLoading = /*#__PURE__*/ (function () {
    function WebLoading(options) {
      // canvas animation elements
      this.canvas = null
      // Html animation elements
      this.htmlElement = null
      // Animation element id
      this.loadingId = null
      // Container element
      this.element = null
      // hooks
      this.hooks = null
      // Resize control
      this.resizeTimeId = null
      // Initialize default configuration
      this.options = Object.assign(getDefOptions(), options)
    }
    /**
     * Reset Animation Container Size
     * @param element Container element
     * @param animaEl animation elements
     */
    WebLoading.prototype.resize = function (element, animaEl) {
      var _this = this
      if (!this.resizeTimeId)
        this.resizeTimeId = $window$3.setTimeout(function () {
          var canvas = animaEl
          var w = element.clientWidth,
            h = element.clientHeight
          if (canvas.width > element.clientWidth) {
            // The scroll bar needs to be calculated when shrinking
            w = element.offsetWidth
            h = element.offsetHeight
          }
          if (_this.canvas) {
            setupCanvas(canvas, w, h)
            if (element.$store) drawController(w, h, canvas, _this.options, element)
          } else if (_this.htmlElement) {
            _this.htmlElement.style.width = ''.concat(w, 'px')
            _this.htmlElement.style.height = ''.concat(h, 'px')
          }
          _this.resizeTimeId = null
        }, this.options.delayInto)
    }
    /**
     * Turn off animation
     * @param element Container element
     * @param animaEl animation elements
     */
    WebLoading.prototype.close = function (element, animaEl) {
      var _this = this
      var op = this.options
      var store = element.$store
      $window$3.setTimeout(
        function () {
          // Trigger Close Animation
          clearStyle(element, op, animaEl)
          if (op.type === exports.LOADING_TYPES.DOM && !op.pointerEvents) {
            element.style.pointerEvents = 'auto'
          }
          // Prevent seconds from closing. If seconds are closed,
          // it is necessary to wait for the previous animation to end before clearing the cache
          onTransitionEndEvent(element, function () {
            // Need to end the style before ending the canvas animation
            if (store) {
              // Clear model
              store.model = null
              // Callback before closing
              _this.callEvent(exports.HOOKSCALL_KEY.BEFORE_COLSE)
              // stop it animationFrame
              if (store.animationId) clearAnimationFrame(store.animationId)
            }
            // If the dom is extended, clear the parent element (the parent element is created by webLoading)
            if (op.type !== exports.LOADING_TYPES.DOM) element.remove()
            else animaEl.remove()
            // erase status
            _this.loadingId = null
            // Callback after closing
            _this.callEvent(exports.HOOKSCALL_KEY.COLSED)
            // Callback after closing
            _this.hooks = initHooksCall()
          })
        },
        // If the seconds are off, it is necessary to actively add a delay
        !store.loadingId ? op.delayInto : 0
      )
    }
    /**
     * Draw animation
     * @param element Container element
     */
    WebLoading.prototype.draw = function (element) {
      var op = this.options
      // Compatible with html
      if (op.html) {
        // Initialize basic data
        var _a = initHtml(),
          content = _a.content,
          loadingId = _a.loadingId
        this.htmlElement = content
        this.htmlElement.innerHTML = op.html
        this.loadingId = loadingId
        // Initialize style
        this.element = initContentStyle(element, op, loadingId, content)
      } else {
        // Initialize basic data
        var _b = initCanvas(),
          canvas = _b.canvas,
          hooks = _b.hooks,
          loadingId = _b.loadingId
        this.canvas = canvas
        this.hooks = hooks
        this.loadingId = loadingId
        // Initialize store
        initStore(element, op, hooks)
        // Initialize style
        this.element = initContentStyle(element, op, loadingId, canvas)
        if (element.$store) {
          drawController(canvas.offsetWidth, canvas.offsetHeight, canvas, this.options, element)
        } else {
          $Log.error('WebLoading:canvas or ctx null')
        }
      }
    }
    // Trigger hooks
    WebLoading.prototype.callEvent = function (hooksKey) {
      if (this.hooks)
        this.hooks[hooksKey].forEach(function (event) {
          event()
        })
    }
    return WebLoading
  })()

  var $window$2 = window
  var ExtendLoading = /*#__PURE__*/ (function () {
    function ExtendLoading(options) {
      this.options = options
      this.extendEl = this.initStyle()
    }
    /**
     * Initialize extension container element style
     * @returns extension container element
     */
    ExtendLoading.prototype.initStyle = function () {
      this.extendEl = $window$2.document.createElement('div')
      var op = this.options
      var w = '100vw',
        h = '100vh',
        borderRadius = '0px'
      if (op) {
        this.extendEl.classList.add('wl_' + (op.extendClass || 'loading'))
        if (op.type === exports.LOADING_TYPES.MINI) {
          w = '130px'
          h = '110px'
          borderRadius = '8px'
        }
        this.extendEl.style.cssText = '\n          position:fixed;\n          width:'
          .concat(w, ';\n          height:')
          .concat(h, ';\n          top:50%;\n          left:50%;\n          transform:translate(-50%, -50%);\n          border-radius: ')
          .concat(borderRadius, ';\n          z-index: ')
          .concat(
            op.zIndex,
            ';\n          box-shadow:\n          2.8px 2.8px 2.2px rgba(0, 0, 0, 0.02),\n          6.7px 6.7px 5.3px rgba(0, 0, 0, 0.028),\n          12.5px 12.5px 10px rgba(0, 0, 0, 0.035),\n          22.3px 22.3px 17.9px rgba(0, 0, 0, 0.042),\n          41.8px 41.8px 33.4px rgba(0, 0, 0, 0.05),\n          100px 100px 80px rgba(0, 0, 0, 0.07)\n          ;\n      '
          )
      }
      $window$2.document.body.appendChild(this.extendEl)
      return this.extendEl
    }
    ExtendLoading.prototype.getElement = function () {
      return this.extendEl
    }
    return ExtendLoading
  })()

  var $window$1 = window
  /** @public */
  function initLoading(options) {
    var webLoading = new WebLoading(options)
    var feelPromiseResolve = null
    var resize = function () {
      utlWL('resize')
    }
    var loading = function (dom, options) {
      // Keep the last passed in parameter
      var op = Object.assign(webLoading.options, options)
      // Prevent duplicate registration
      if (!webLoading.loadingId && !feelPromiseResolve) {
        // Create extended dom
        if (op.type !== exports.LOADING_TYPES.DOM) {
          dom = new ExtendLoading(op).getElement()
        }
        if (!dom) $Log.error('The loading function cannot find an HTMLElement element!')
        else {
          // Processing Senseless Loading through rece
          var loadingPromise = new Promise(function (res) {
            // If the time of notFeed exceeds the close time, it is considered as an insensitive load
            $window$1.setTimeout(function () {
              res(true)
            }, op.notFeel)
          })
          var feelPromise = new Promise(function (res) {
            feelPromiseResolve = res
          })
          Promise.race([loadingPromise, feelPromise]).then(function (res) {
            if (res) webLoading.draw(dom)
            else {
              // Process extended dom
              if (op.type !== exports.LOADING_TYPES.DOM) dom.remove()
            }
            feelPromiseResolve = null
          })
        }
      }
    }
    var update = function (options) {
      var canvas = webLoading.canvas
      var op = Object.assign(webLoading.options, options)
      var element = webLoading.element
      if (canvas && op && element && element.$store) drawController(canvas.offsetWidth, canvas.offsetHeight, canvas, op, element)
    }
    var close = function () {
      feelPromiseResolve && feelPromiseResolve(false)
      utlWL('close')
    }
    // Throw basic information
    var getLoadingId = function () {
      return webLoading.loadingId
    }
    var getOptions = function () {
      return webLoading.options
    }
    // WebLoading operation
    function utlWL(key) {
      if (webLoading.element) {
        // canvas
        var temEl = webLoading.canvas
        // html
        if (webLoading.htmlElement) temEl = webLoading.htmlElement
        // set up
        if (temEl) webLoading[key](webLoading.element, temEl)
        else $Log.warn('Animation element not found!')
      }
    }
    return {
      loading: loading,
      resize: resize,
      close: close,
      update: update,
      getOptions: getOptions,
      getLoadingId: getLoadingId
    }
  }
  // Extended Load Method
  function _$extendLoading(type, options) {
    return initLoading(Object.assign(getDefOptions(), options || {}, { type: type }))
  }
  /** @public */
  function fullLoading(options) {
    return _$extendLoading(exports.LOADING_TYPES.FULL, options)
  }
  /** @public */
  function miniLoading(options) {
    return _$extendLoading(exports.LOADING_TYPES.MINI, options)
  }

  var $window = window
  $window.BaseModel = BaseModel
  // initialization
  $window.initLoading = function (options) {
    return initLoading(options)
  }
  // extend
  // Mobile terminal
  $window.miniLoading = function (options) {
    return _$extendLoading(exports.LOADING_TYPES.MINI, options)
  }
  // Full screen
  $window.fullLoading = function (options) {
    return _$extendLoading(exports.LOADING_TYPES.FULL, options)
  }

  exports.BaseModel = BaseModel
  exports.fullLoading = fullLoading
  exports.initLoading = initLoading
  exports.miniLoading = miniLoading

  Object.defineProperty(exports, '__esModule', { value: true })
})
