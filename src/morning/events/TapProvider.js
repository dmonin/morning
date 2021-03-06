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
 * @fileoverview Touch / Desktop element hover handling.
 * Adds / Removes "hover" class to element on touch(start|end) / mouse(over|out) events.
 */

goog.provide('morning.events.TapProvider');

goog.require('goog.dom.classlist');
goog.require('goog.events.EventHandler');
goog.require('goog.events.EventTarget');
goog.require('morning.mobile');
goog.require('morning.events');
goog.require('goog.async.Delay');

/**
 * Tap handler or elements
 *
 * @param {Element} element
 *
 * @constructor
 * @extends {goog.events.EventTarget}
 */
morning.events.TapProvider = function(element)
{
  goog.base(this);

  /**
   * Event handler
   *
   * @type {goog.events.EventHandler}
   * @private
   */
  this.handler_ = new goog.events.EventHandler(this);

  /**
   * Element for which tap provider is attached
   *
   * @type {Element}
   * @private
   */
  this.element_ = element;

  /**
   * @type {goog.math.Coordinate!}
   * @private
   */
  this.touchPos_ = new goog.math.Coordinate(0, 0);

  this.handler_.listen(element, goog.events.EventType.CLICK,
    this.handleClick_);

  if (morning.mobile.isTouchDevice())
  {
    morning.events.listenPointerEvent(this.handler_, element,
      goog.events.EventType.POINTERDOWN, this.handleTouchEvents_);

    morning.events.listenPointerEvent(this.handler_, element,
      goog.events.EventType.POINTERMOVE, this.handleTouchMove_);

    morning.events.listenPointerEvent(this.handler_, element,
      goog.events.EventType.POINTERUP, this.handleTouchEvents_);
  }
  else
  {
    this.handler_.listen(element, [
      goog.events.EventType.MOUSEOVER,
      goog.events.EventType.MOUSEOUT], this.handleMouseEvents_);
  }

  /**
   * @type {goog.async.Delay}
   * @private
   */
  this.tapDelay_ = new goog.async.Delay(this.handleTouchDelay_, 500, this);

  /**
   * @type {number}
   * @private
   */
  this.lastTap_ = 0;

  /**
   * @type {Node}
   * @private
   */
  this.domTarget_ = null;

  /**
   * Defines whether event is caused by click
   *
   * @type {boolean}
   * @private
   */
  this.isClick_ = false;
};
goog.inherits(morning.events.TapProvider, goog.events.EventTarget);

/**
 * Creates hover effect for specified element
 *
 * @param {Element} el
 * @return {morning.events.TapProvider}
 */
morning.events.TapProvider.attach = function(el)
{
  return new morning.events.TapProvider(el);
};

/**
 * Dispatches tap event
 *
 * @private
 */
morning.events.TapProvider.prototype.dispatchTap_ = function()
{
  var minDelay = this.isClick_ ? 1500 : 300;
  var timeSinceLastTap = +new Date() - this.lastTap_;
  if (timeSinceLastTap < minDelay)
  {
    return;
  }

  this.dispatchEvent({
    type: morning.events.TapProvider.EventType.TAP,
    domTarget: this.domTarget_
  });

  this.domTarget_ = null;
  this.lastTap_ = +new Date();
};

/**
 * Disposes element
 */
morning.events.TapProvider.prototype.disposeInternal = function()
{
  goog.base(this, 'disposeInternal');

  goog.dispose(this.handler_);

  this.tapDelay_.stop();
  goog.dispose(this.handler_);

  this.tapDelay_ = null;
  this.handler_ = null;
  this.element_ = null;
};

/**
 * Returns attached element
 *
 * @return {Element}
 */
morning.events.TapProvider.prototype.getElement = function()
{
  return this.element_;
};

/**
 * Handles click event
 *
 * @param {goog.events.BrowserEvent} e
 * @private
 */
morning.events.TapProvider.prototype.handleClick_ = function(e)
{
  this.domTarget_ = e.target;
  this.isClick_ = true;
  this.dispatchTap_();
  this.isClick_ = false;
  this.setHover_(false);
};

/**
 * Restores hover state after some delay
 *
 * @private
 */
morning.events.TapProvider.prototype.handleTouchDelay_ = function()
{
  this.setHover_(false);
};

/**
 * Handles touch start / end events
 *
 * @param {goog.events.BrowserEvent} e
 * @private
 */
morning.events.TapProvider.prototype.handleTouchEvents_ = function(e)
{
  var isTouchStart = (
    e.type == goog.events.EventType.POINTERDOWN ||
    e.type == goog.events.EventType.TOUCHSTART
  );

  if (isTouchStart && e.getBrowserEvent().touches.length > 1)
  {
    return;
  }

  // Tap handling
  if (isTouchStart)
  {
    this.domTarget_ = e.target;
    this.touchPos_ = /** @type {goog.math.Coordinate!} */ (
      morning.events.getPointerPosition(e));
    this.tapDelay_.start();

    this.setHover_(isTouchStart);
  }
  else if (this.tapDelay_.isActive())
  {
    this.dispatchTap_();
  }
  else
  {
    this.setHover_(false);
  }
};

/**
 * Handles touch move
 *
 * @param {goog.events.BrowserEvent} e
 * @private
 */
morning.events.TapProvider.prototype.handleTouchMove_ = function(e)
{
  var pos = /** @type {goog.math.Coordinate!} */ (
    morning.events.getPointerPosition(e));
  var distance = goog.math.Coordinate.distance(pos, this.touchPos_);

  if (distance > 2)
  {
    this.tapDelay_.stop();
  }
};

/**
* Handles mouse events
*
* @param {goog.events.BrowserEvent} e
* @private
*/
morning.events.TapProvider.prototype.handleMouseEvents_ = function(e)
{
  var currentTarget = /** @type {Node} */ (e.currentTarget);
  var relatedTarget = /** @type {Node} */ (e.relatedTarget);

  if (!e.relatedTarget || goog.dom.contains(currentTarget, relatedTarget))
  {
    return;
  }

  this.setHover_(e.type == 'mouseover');
};

/**
 * Sets hover state
 *
 * @param {boolean} isTouched
 * @private
 */
morning.events.TapProvider.prototype.setHover_ = function(isTouched)
{
  if (this.isDisposed())
  {
    return;
  }

  goog.dom.classlist.enable(this.element_, 'hover', isTouched);

  var evtType = isTouched ? goog.ui.Component.EventType.HIGHLIGHT :
    goog.ui.Component.EventType.UNHIGHLIGHT;

  this.dispatchEvent(evtType);
};

/**
* @enum {string}
*/
morning.events.TapProvider.EventType = {
  TAP: 'tap'
};