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
 * @fileoverview A component which is animated. Used together with InView
 * Controller, to start / stop animations.
 */
goog.provide('morning.ui.AnimatedComponent');
goog.require('goog.dom.dataset');
goog.require('goog.math.Box');
goog.require('goog.ui.Component');

/**
 * @constructor
 * @extends {goog.ui.Component}
 * @implements {morning.controllers.InViewComponent}
 */
morning.ui.AnimatedComponent = function()
{
  goog.base(this);

  /**
   * Name of the component.
   * @type {string}
   */
  this.name = '';

  /**
   * Defines whether component is inView
   * @type {boolean}
   */
  this.inView = false;

  /**
   * Defines whether component is currently animated.
   * @type {boolean}
   */
  this.isAnimated = false;

  /**
   * Changes bounds of the component in each direction.
   *
   * @type {goog.math.Box}
   */
  this.changeBoundsBy = new goog.math.Box(0, 0, 0, 0);
};
goog.inherits(morning.ui.AnimatedComponent, goog.ui.Component);

/** @inheritDoc */
morning.ui.AnimatedComponent.prototype.decorateInternal = function(el)
{
  goog.base(this, 'decorateInternal', el);

  var reduceBounds = goog.dom.dataset.get(el, 'reduceBounds');

  if (reduceBounds)
  {
    var numbers = reduceBounds.split(' ');
    this.changeBoundsBy.top = Number(numbers[0]);
    this.changeBoundsBy.right = Number(numbers[1]);
    this.changeBoundsBy.bottom = Number(numbers[2]);
    this.changeBoundsBy.left = Number(numbers[3]);
  }
};


/** @inheritDoc */
morning.ui.AnimatedComponent.prototype.enterDocument = function()
{
  goog.base(this, 'enterDocument');

  daesk.app.getController('inview').register(this);
};

/** @inheritDoc */
morning.ui.AnimatedComponent.prototype.exitDocument = function()
{
  goog.base(this, 'exitDocument');

  daesk.app.getController('inview').unregister(this);
};

/**
 * Returns bounds of the component.
 *
 * @return {goog.math.Rect}
 */
morning.ui.AnimatedComponent.prototype.getBounds = function()
{
  return daesk.app.getController('inview').getBounds(this);
};

/**
 * Sets whether component is active.
 *
 * @param {boolean} isActive
 */
morning.ui.AnimatedComponent.prototype.setActive = function(isActive)
{
  goog.base(this, 'setActive', isActive);

  this.updateAnimated();
};

/**
 * Sets whether component is in visible in current browser view.
 * @param {boolean} isInView
 */
morning.ui.AnimatedComponent.prototype.setInView = function(isInView)
{
  this.forEachChild(function(child) {
    if (child instanceof morning.ui.AnimatedComponent)
    {
      child.setInView(isInView);
    }
  }, this);

  this.inView = isInView;
  this.updateAnimated();
};

/**
 * Sets animated status of the component.
 *
 * @param {boolean} isAnimated
 */
morning.ui.AnimatedComponent.prototype.setAnimated = function(isAnimated)
{
  this.isAnimated = isAnimated;

  this.forEachChild(function(child) {
    if (child instanceof morning.ui.AnimatedComponent)
    {
      child.setAnimated(isAnimated);
    }
  }, this);
};

/**
 * Updates animated after certain amount of time.
 *
 * @protected
 */
morning.ui.AnimatedComponent.prototype.updateAnimated = function()
{
  var isAnimated = this.isActive && this.inView;

  if (isAnimated == this.isAnimated)
  {
    return;
  }
  this.setAnimated(isAnimated);
};

/**
 * Events enum.
 *
 * @enum {string}
 */
morning.ui.AnimatedComponent.EventType = {
  BOUNDS_UPDATE: 'bounds_update'
};
