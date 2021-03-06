//// Achoom //// 1.0.0 //// January 2018 //// http://achoom.loop.coop/ /////////

"use strict";
!function(ROOT) {
  'use strict';
  var META = {
    NAME: {value: 'Achoom'},
    VERSION: {value: '1.0.0'},
    HOMEPAGE: {value: 'http://achoom.loop.coop/'},
    REMARKS: {value: 'The great green neon Oom'}
  };
  var OOM = ROOT.OOM = ROOT.OOM || {};
  var TOOLKIT = OOM.TOOLKIT = OOM.TOOLKIT || {};
  var Class = OOM.Achoom = ($traceurRuntime.createClass)(function() {
    var config = arguments[0] !== (void 0) ? arguments[0] : {};
    var hub = arguments[1] !== (void 0) ? arguments[1] : OOM.hub;
    var $__3 = this;
    Object.defineProperty(this, 'id', {value: '123456'.replace(/./g, function(c) {
        return TOOLKIT.rndCh(48, 122);
      }).replace(/[:-@\[-`]/g, function(c) {
        return TOOLKIT.rndCh(97, 122);
      })});
    Object.defineProperty(this, 'hub', {value: hub});
    this._validateConstructor(config);
    this.validConstructor.forEach(function(valid) {
      var value = config[valid.name];
      if (null == value)
        throw Error('I am unreachable?');
      Object.defineProperty($__3, valid.name, {value: value});
    });
    Object.defineProperty(this, 'ready', {value: this._getReady()});
  }, {
    _getReady: function() {
      var $__3 = this;
      if (this.setupStart)
        throw new Error("Achoom._getReady(): Can only run once");
      Object.defineProperty(this, 'setupStart', {value: TOOLKIT.getNow()});
      return new Promise(function(resolve, reject) {
        setTimeout(function() {
          Object.defineProperty($__3, 'setupEnd', {value: TOOLKIT.getNow()});
          resolve({setupDelay: $__3.setupEnd - $__3.setupStart});
        }, 0);
      });
    },
    _validateConstructor: function(config) {
      var err,
          value,
          ME = "Achoom._validateConstructor(): ";
      if ('object' !== (typeof config === 'undefined' ? 'undefined' : $traceurRuntime.typeof(config)))
        throw new Error(ME + ("config is type " + (typeof config === 'undefined' ? 'undefined' : $traceurRuntime.typeof(config)) + " not object"));
      this.validConstructor.forEach(function(valid) {
        if (!TOOLKIT.applyDefault(valid, config))
          throw new TypeError(ME + ("config." + valid.name + " is mandatory"));
        value = config[valid.name];
        if (err = TOOLKIT.validateType(valid, value))
          throw new TypeError(ME + ("config." + valid.name + " " + err));
        if (err = TOOLKIT.validateRange(valid, value))
          throw new RangeError(ME + ("config." + valid.name + " " + err));
      });
    },
    get validConstructor() {
      return [{
        title: 'First Param',
        name: 'firstParam',
        alias: 'fp',
        tooltip: 'An example numeric parameter, intended as a placeholder',
        devtip: 'You should replace this placeholder with a real parameter',
        form: 'range',
        power: 1,
        suffix: 'Units',
        type: 'number',
        min: 1,
        max: 100,
        step: 1,
        default: 50
      }, {
        title: 'Second Param',
        name: 'secondParam',
        alias: 'sp',
        tooltip: 'An example object parameter, intended as a placeholder',
        devtip: 'You should replace this placeholder with a real parameter',
        form: 'hidden',
        type: Date
      }];
    },
    xxx: function(config) {
      var $__4 = this,
          hub = $__4.hub,
          a = $__4.a,
          b = $__4.b,
          c = $__4.c;
      var $__5 = config,
          xx = $__5.xx,
          yy = $__5.yy,
          zz = $__5.zz;
    }
  }, {});
  Object.defineProperties(Class, META);
  TOOLKIT.rndCh = TOOLKIT.rndCh || (function(s, e) {
    return String.fromCharCode(Math.random() * (e - s) + s);
  });
  TOOLKIT.applyDefault = TOOLKIT.applyDefault || (function(valid, config) {
    if (config.hasOwnProperty(valid.name))
      return true;
    if (!valid.hasOwnProperty('default'))
      return false;
    config[valid.name] = 'function' === typeof valid.default ? valid.default(config) : valid.default;
    return true;
  });
  TOOLKIT.validateType = TOOLKIT.validateType || (function(valid, value) {
    switch ($traceurRuntime.typeof(valid.type)) {
      case 'string':
        return ((typeof value === 'undefined' ? 'undefined' : $traceurRuntime.typeof(value)) === valid.type) ? null : ("is type " + (typeof value === 'undefined' ? 'undefined' : $traceurRuntime.typeof(value)) + " not " + valid.type);
      case 'function':
        return (value instanceof valid.type) ? null : ("is not an instance of " + valid.type.name);
      case 'object':
        return (value === valid.type) ? null : "is not the expected object";
    }
    throw new TypeError("TOOLKIT.validateType: " + ("valid.type for " + valid.name + " is " + $traceurRuntime.typeof(valid.type)));
  });
  TOOLKIT.validateRange = TOOLKIT.validateRange || (function(valid, value) {
    if (null != valid.min && valid.min > value)
      return ("is less than the minimum " + valid.min);
    if (null != valid.max && valid.max < value)
      return ("is greater than the maximum " + valid.max);
    if (null != valid.step && ((value / valid.step) % 1))
      return (value + " ÷ " + valid.step + " leaves " + (value / valid.step) % 1);
  });
  TOOLKIT.getNow = TOOLKIT.getNow || (function() {
    var now;
    if ('object' === $traceurRuntime.typeof(ROOT.process) && 'function' === typeof ROOT.process.hrtime) {
      var hrtime = ROOT.process.hrtime();
      now = ((hrtime[0] * 1e9) + hrtime[1]) / 1e6;
    } else {
      now = ROOT.performance.now();
    }
    return now;
  });
}('object' === (typeof global === 'undefined' ? 'undefined' : $traceurRuntime.typeof(global)) ? global : this);




//// Made by Oomtility Make 1.0.14 //\\//\\ http://oomtility.loop.coop /////////
