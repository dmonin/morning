// Copyright 2012 Dmitry Monin. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Predefined DHTML animations such as slide, resize and fade.
 * Extends predefined animations to work with morning.fx.Animation class
 */
goog.provide('morning.fx.dom.PredefinedEffect');
goog.provide('morning.fx.dom.Slide');
goog.provide('morning.fx.dom.SlideFrom');
goog.require('goog.style.bidi');

goog.require('morning.fx.Animation');

/**
 * Abstract class that provides reusable functionality for predefined animations
 * that manipulate a single DOM element
 *
 * @param {Element} element Dom Node to be used in the animation.
 * @param {Array.<number>} start Array for start coordinates.
 * @param {Array.<number>} end Array for end coordinates.
 * @param {number} time Length of animation in milliseconds.
 * @param {Function=} opt_acc Acceleration function, returns 0-1 for inputs 0-1.
 * @extends {morning.fx.Animation}
 * @constructor
 */
morning.fx.dom.PredefinedEffect = function(element, start, end, time, opt_acc) {
  morning.fx.Animation.call(this, start, end, time, opt_acc);

  /**
   * DOM Node that will be used in the animation
   * @type {Element}
   */
  this.element = element;

  /**
   * Whether the element is rendered right-to-left. We cache this here for
   * efficiency.
   * @type {boolean|undefined}
   * @private
   */
  this.rightToLeft_;
};
goog.inherits(morning.fx.dom.PredefinedEffect, morning.fx.Animation);



/**
 * Called to update the style of the element.
 * @protected
 */
morning.fx.dom.PredefinedEffect.prototype.updateStyle = goog.nullFunction;


/**
 * Whether the element is rendered right-to-left. We initialize this lazily.
 * @type {boolean|undefined}
 * @private
 */
morning.fx.dom.PredefinedEffect.prototype.rightToLeft_;


/**
 * Whether the DOM element being manipulated is rendered right-to-left.
 * @return {boolean} True if the DOM element is rendered right-to-left, false
 *     otherwise.
 */
morning.fx.dom.PredefinedEffect.prototype.isRightToLeft = function() {
  if (!goog.isDef(this.rightToLeft_)) {
    this.rightToLeft_ = goog.style.isRightToLeft(this.element);
  }
  return this.rightToLeft_;
};


/** @override */
morning.fx.dom.PredefinedEffect.prototype.onAnimate = function() {
  this.updateStyle();
  morning.fx.dom.PredefinedEffect.superClass_.onAnimate.call(this);
};


/** @override */
morning.fx.dom.PredefinedEffect.prototype.onEnd = function() {
  this.updateStyle();
  morning.fx.dom.PredefinedEffect.superClass_.onEnd.call(this);
};


/** @override */
morning.fx.dom.PredefinedEffect.prototype.onBegin = function() {
  this.updateStyle();
  morning.fx.dom.PredefinedEffect.superClass_.onBegin.call(this);
};

/**
 * Creates an animation object that will slide an element from A to B.  (This
 * in effect automatically sets up the onanimate event for an Animation object)
 *
 * Start and End should be 2 dimensional arrays
 *
 * @param {Element} element Dom Node to be used in the animation.
 * @param {Array.<number>} start 2D array for start coordinates (X, Y).
 * @param {Array.<number>} end 2D array for end coordinates (X, Y).
 * @param {number} time Length of animation in milliseconds.
 * @param {Function=} opt_acc Acceleration function, returns 0-1 for inputs 0-1.
 * @extends {morning.fx.dom.PredefinedEffect}
 * @constructor
 */
morning.fx.dom.Slide = function(element, start, end, time, opt_acc) {
  if (start.length != 2 || end.length != 2) {
    throw Error('Start and end points must be 2D');
  }
  morning.fx.dom.PredefinedEffect.apply(this, arguments);
};
goog.inherits(morning.fx.dom.Slide, morning.fx.dom.PredefinedEffect);


/** @override */
morning.fx.dom.Slide.prototype.updateStyle = function() {
  var pos = (this.isRightPositioningForRtlEnabled() && this.isRightToLeft()) ?
      'right' : 'left';
  this.element.style[pos] = Math.round(this.coords[0]) + 'px';
  this.element.style.top = Math.round(this.coords[1]) + 'px';
};


/**
 * Slides an element from its current position.
 *
 * @param {Element} element DOM node to be used in the animation.
 * @param {Array.<number>} end 2D array for end coordinates (X, Y).
 * @param {number} time Length of animation in milliseconds.
 * @param {Function=} opt_acc Acceleration function, returns 0-1 for inputs 0-1.
 * @extends {morning.fx.dom.Slide}
 * @constructor
 */
morning.fx.dom.SlideFrom = function(element, end, time, opt_acc) {
  var offsetLeft = this.isRightPositioningForRtlEnabled() ?
      goog.style.bidi.getOffsetStart(element) : element.offsetLeft;
  var start = [offsetLeft, element.offsetTop];
  morning.fx.dom.Slide.call(this, element, start, end, time, opt_acc);
};
goog.inherits(morning.fx.dom.SlideFrom, morning.fx.dom.Slide);


/** @override */
morning.fx.dom.SlideFrom.prototype.onBegin = function() {
  var offsetLeft = this.isRightPositioningForRtlEnabled() ?
      goog.style.bidi.getOffsetStart(this.element) : this.element.offsetLeft;
  this.startPoint = [offsetLeft, this.element.offsetTop];
  morning.fx.dom.SlideFrom.superClass_.onBegin.call(this);
};