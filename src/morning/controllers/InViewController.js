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
 * @fileoverview Defines a controller for starting / stopping animations of
 * the components on page, depending on their inview position.
 */
goog.provide('morning.controllers.InViewController');
goog.require('goog.async.Delay');
goog.require('morning.ui.AnimatedComponent');
goog.require('goog.dom');
goog.require('goog.style');
goog.require('goog.async.Throttle');
goog.require('morning.controllers.BaseController');
goog.require('morning.style');

/**
 * @constructor
 * @extends {morning.controllers.BaseController}
 */
morning.controllers.InViewController = function()
{
  goog.base(this);

  /**
   * Registered Components.
   *
   * @type {Array<morning.controllers.InViewComponent>}
   * @private
   */
  this.components_ = [];

  /**
   * Size of the View port
   * @type {goog.math.Size}
   */
  this.viewportSize = goog.dom.getViewportSize();

  /**
   * Updating Component Bounds
   *
   * @type {goog.async.Throttle}
   * @private
   */
  this.updateBoundsThrottle_ = new goog.async.Throttle(this.updateBounds, 100,
    this);
};
goog.inherits(morning.controllers.InViewController,
  morning.controllers.BaseController);
goog.addSingletonGetter(morning.controllers.InViewController);

/**
 * Returns bounds of specified component.
 *
 * @param {goog.ui.Component} cmp
 * @return {goog.math.Rect}
 */
morning.controllers.InViewController.prototype.getBounds = function(cmp)
{
  var item = this.components_.find(function(it) {
    return it.cmp == cmp;
  });
  return item ? item.bounds : null;
};

/** @inheritDoc */
morning.controllers.InViewController.prototype.initialize = function(config)
{
  this.getHandler().
    listen(window, goog.events.EventType.SCROLL, this.handleScroll).
    listen(window, goog.events.EventType.RESIZE, this.handleResize).
    listen(config.app, morning.ui.AnimatedComponent.EventType.BOUNDS_UPDATE,
      this.handleComponentBoundsUpdate_);

  this.updateBoundsThrottle_.fire();

  goog.Timer.callOnce(this.updateBounds, 2000, this);
};

/**
 * If component bounds has been updated, recalculating.
 * @private
 */
morning.controllers.InViewController.prototype.handleComponentBoundsUpdate_ =
  function()
  {
    this.updateBoundsThrottle_.fire();
  };

/**
 * Handles resize event.
 *
 * @param  {goog.events.BrowserEvent} e
 * @protected
 */
morning.controllers.InViewController.prototype.handleResize = function(e)
{
  this.vieportSize = goog.dom.getViewportSize();
  this.updateBoundsThrottle_.fire();

};

/**
 * Handles scroll events.
 *
 * @param  {goog.events.Event} e
 * @protected
 */
morning.controllers.InViewController.prototype.handleScroll = function(e)
{
  this.updateActive();
};

/**
 * Clears all the items.
 */
morning.controllers.InViewController.prototype.clear = function()
{
  this.components_ = [];
};

/**
 * Registers a new component to observe position.
 *
 * @param  {goog.ui.Component} cmp
 */
morning.controllers.InViewController.prototype.register = function(cmp)
{
  if (goog.DEBUG)
  {
    console.info('InView: register %o', cmp);
  }

  var id = cmp.getId();
  var item = goog.array.find(this.components_, function(item) {
    return item.cmp == cmp;
  });

  if (!item)
  {
    item = /** @type {morning.controllers.InViewComponent} */ ({
      cmp: cmp,
      bounds: null,
      isInView: false
    });

    this.components_.push(item);
    this.updateBoundsThrottle_.fire();
  }
};

/**
 * Unregisters component.
 *
 * @param  {goog.ui.Component} cmp
 */
morning.controllers.InViewController.prototype.unregister = function(cmp)
{
  if (goog.DEBUG)
  {
    console.info('InView: unregister %o', cmp);
  }

 var item = goog.array.find(this.components_, function(it) {
    return it.cmp == cmp;
  });

 if (item)
 {
  goog.array.remove(this.components_, item);
 }
};

/**
 * List all components
 */
morning.controllers.InViewController.prototype.listAll = function()
{
  console.debug(this.components_);
};

/**
 * Updates active state of the component.
 *
 * @protected
 */
morning.controllers.InViewController.prototype.updateActive = function()
{
  var docScroll = goog.dom.getDocumentScroll();

  this.components_.forEach(function(item) {
    if (!item.bounds)
    {
      if (goog.DEBUG)
      {
        console.warn('InViewController, no bounds %o', item);
      }
      return;
    }

    var isInView = morning.style.isVerticallyVisible(item.bounds,
      this.viewportSize, docScroll);

    if (item.isInView != isInView)
    {
      item.cmp.setInView(isInView);
      item.isInView = isInView;
    }

  }, this);

};

/**
 * Updates component bounds.
 * @protected
 */
morning.controllers.InViewController.prototype.updateBounds = function()
{
  this.components_.forEach(function(item) {
    var bounds = goog.style.getBounds(item.cmp.getElement());
    bounds.top += item.cmp.changeBoundsBy.top;
    bounds.left += item.cmp.changeBoundsBy.left;
    bounds.width -= item.cmp.changeBoundsBy.right;
    bounds.height -= item.cmp.changeBoundsBy.bottom;

    item.bounds = bounds;
  }, this);

  this.updateActive();
};

/**
 * An interface for programatically animated objects. I.e. rendered in
 * javascript frame by frame.
 *
 * @interface
 */
morning.controllers.InViewComponent = function() {};

/**
 * Sets whether component is currently inview
 *
 * @param {boolean} inView
 */
morning.controllers.InViewComponent.prototype.setInView;

/**
 * @return {Element}
 */
morning.controllers.InViewComponent.prototype.getElement;


/**
 * @typedef {{cmp:morning.controllers.InViewComponent, bounds: goog.math.Rect, isInView: boolean}}
 */
morning.controllers.InViewItem;
