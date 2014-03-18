// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

var _ = require('underscore');
var Moment = require('moment');

var extend = function(protoProps, staticProps) {
  var parent = this;
  var child;

  if (protoProps && _.has(protoProps, 'constructor')) {
    child = protoProps.constructor;
  } else {
    child = function(){ return parent.apply(this, arguments); };
  }

  _.extend(child, parent, staticProps);

  var Surrogate = function(){ this.constructor = child; };
  Surrogate.prototype = parent.prototype;
  child.prototype = new Surrogate();

  if (protoProps) _.extend(child.prototype, protoProps);

  child.__super__ = parent.prototype;

  child.prototype.super = function(name, params) {
    if (child.__super__[name])
      return child.__super__[name].call(this, params);
    else if (child.__super__.super)
      child.__super__.super(name, params);
  };

  return child;
};

var zeroPad = function(number, size) {
  return (new Array(size + 1 - number.toString().length)).join('0') + number;
};

var formatTime = function(time, showMillis) {
  var duration = Moment.duration(time * 1000);
  var str = duration.minutes() + ':' + zeroPad(duration.seconds(), 2);
  if (duration.hours())
    str = duration.hours() + ':' + str;
  if (showMillis)
    str += '.' + duration.milliseconds();
  return str;
};

module.exports = {
  extend: extend,
  zeroPad: zeroPad,
  formatTime: formatTime
};
