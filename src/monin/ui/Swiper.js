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
 * @fileoverview This class serves as an adapter for the idangero.us swiper
 * class
 * @see http://www.idangero.us/sliders/swiper/api.php
 *
 */

goog.provide('monin.ui.Swiper');
goog.require('goog.ui.Component');
goog.require('monin.net.ExternalApi');
goog.require('goog.dom.dataset');
goog.require('goog.Timer');
goog.require('goog.ui.registry');

/**
 * @constructor
 * @extends {goog.ui.Component}
 */
monin.ui.Swiper = function()
{
  goog.base(this);

  /**
   * @type {Object}
   * @private
   */
  this.config_ = {};

  /**
   * @type {Swiper}
   * @private
   */
  this.swiper_ = null;
};
goog.inherits(monin.ui.Swiper, goog.ui.Component);

/**
 * @type {boolean}
 */
monin.ui.Swiper.loaded = false;

/**
 * @type {string}
 */
monin.ui.Swiper.scriptUrl = 'asset/swiper/idangerous.swiper.min.js';

/** @inheritDoc */
monin.ui.Swiper.prototype.decorateInternal = function(el)
{
  goog.base(this, 'decorateInternal', el);

  var pagination = /** @type {string} */
    (goog.dom.dataset.get(el, 'pagination')) != null ?
    goog.dom.dataset.get(el, 'pagination') : '';

  var loop = goog.dom.dataset.get(el, 'loop') == 'true';
  var paginationClickable =
    goog.dom.dataset.get(el, 'paginationclickable') == 'true';

  var slidesPerView = goog.dom.dataset.get(el, 'slidesperview') || null;
  var watchActiveIndex = goog.dom.dataset.get(el, 'watchactive') == 'true';

  var cfg = {
    'mode': 'horizontal',
    'loop': loop,
    'onSlideTouch': goog.bind(this.onSlideTouch, this),
    'onSlideClick': goog.bind(this.onSlideClick, this),
    'onTouchMove': goog.bind(this.onTouchMove, this),
    'onTouchEnd': goog.bind(this.onTouchEnd, this),
    'onSlideChangeEnd': goog.bind(this.onSlideChangeEnd, this),
    'paginationClickable': paginationClickable,
    'onSetWrapperTransform': this.onSetWrapperTransform.bind(this)
  };

  if (pagination)
  {
    cfg['pagination'] = pagination;
  }

  if (slidesPerView)
  {
    cfg['slidesPerView'] = slidesPerView;
  }

  this.setConfig(cfg);
};

/** @inheritDoc */
monin.ui.Swiper.prototype.enterDocument = function()
{
  goog.base(this, 'enterDocument');

  if (!monin.ui.Swiper.loaded && !goog.getObjectByName('Swiper'))
  {
    this.load_();
  }

  var externalApi = monin.net.ExternalApi.getInstance();
  externalApi.onAvailable('Swiper', this.handleSwiperReady_, this);
};

/**
 * @inheritDoc
 */
monin.ui.Swiper.prototype.disposeInternal = function()
{
  goog.base(this, 'disposeInternal');
  if (this.swiper_)
  {
    goog.Timer.callOnce(function() {
      this.swiper_.destroy();
    }, 1000, this);
  }
};

/**
 * Returns currently active slide
 *
 * @return {Element}
 */
monin.ui.Swiper.prototype.getActiveSlide = function()
{
  return this.swiper_.activeSlide();
};

/**
 * Returns the touched/clicked slide (slide instance, HTMLElement). For use only
 * with "onSlideTouch" and "onSlideClick" callbacks.
 *
 * @return {Element}
 */
monin.ui.Swiper.prototype.getClickedSlide = function()
{
  return this.swiper_ ? this.swiper_.clickedSlide : null;
};

/**
 * Returns index of currently displayed slide
 *
 * @return {number}
 */
monin.ui.Swiper.prototype.getActiveIndex = function()
{
  return this.swiper_.activeLoopIndex;
};


/**
 * Returns the index number of touched/clicked slide. For use only with
 * "onSlideTouch" and "onSlideClick" callbacks.
 *
 * @return {number}
 */
monin.ui.Swiper.prototype.getClickedSlideIndex = function()
{
  return this.swiper_.clickedSlideIndex;
};

/**
 * @param  {goog.events.Event} e
 * @private
 */
monin.ui.Swiper.prototype.handleSwiperReady_ = function(e)
{
  this.swiper_ = new Swiper(this.getElement(), this.config_);
};

/**
 * @private
 */
monin.ui.Swiper.prototype.load_ = function()
{
  var externalApi = monin.net.ExternalApi.getInstance();
  externalApi.addScript(document.body, monin.ui.Swiper.scriptUrl);
};

/**
 * Handles an event when Swiper is moved
 *
 * @param  {monin.ui.Swiper} swiper
 * @param  {Object} coords
 */
monin.ui.Swiper.prototype.onSetWrapperTransform = function(swiper, coords)
{
  this.dispatchEvent({
    type: monin.ui.Swiper.EventType.SET_WRAPPER_TRANSFORM,
    coords: {
      x: coords['x'],
      y: coords['y'],
      z: coords['z']
    },
    width: this.swiper_ ? this.swiper_.width : 0
  });
};

/**
 * @param  {goog.events.Event} e
 */
monin.ui.Swiper.prototype.onSlideClick = function(e)
{
  this.dispatchEvent(goog.events.EventType.CLICK);
};

/**
 * @param  {goog.events.Event} e
 */
monin.ui.Swiper.prototype.onSlideTouch = function(e)
{
  this.dispatchEvent(goog.events.EventType.TOUCHSTART);
};

/**
 * @param  {goog.events.Event} e
 */
monin.ui.Swiper.prototype.onTouchMove = function(e)
{
  this.dispatchEvent(goog.events.EventType.TOUCHMOVE);
};


/**
 * @param  {goog.events.Event} e
 */
monin.ui.Swiper.prototype.onTouchEnd = function(e)
{
  this.dispatchEvent(goog.events.EventType.TOUCHEND);
};

/**
 * @param  {goog.events.Event} e
 */
monin.ui.Swiper.prototype.onSlideChangeEnd = function(e)
{
  this.dispatchEvent(monin.ui.Swiper.EventType.SLIDE_CHANGE_END);
};

/**
 * Swipes to next item
 */
monin.ui.Swiper.prototype.reInit = function()
{
  this.swiper_.reInit();
};

/**
 * Sets the config
 *
 * @param {Object} cfg
 */
monin.ui.Swiper.prototype.setConfig = function(cfg)
{
  goog.mixin(this.config_, cfg);
};

/**
 * Swipes to next item
 */
monin.ui.Swiper.prototype.swipeNext = function()
{
  this.swiper_.swipeNext();
};

/**
 * Swipes to next item
 */
monin.ui.Swiper.prototype.swipePrev = function()
{
  this.swiper_.swipePrev();
};

/**
 * @param  {number} index
 * @param  {number} speed
 * @param  {boolean} runCallbacks
 */
monin.ui.Swiper.prototype.swipeTo = function(index, speed, runCallbacks)
{
  if (this.swiper_)
  {
    this.swiper_.swipeTo(index, speed, runCallbacks);
  }
};

/**
 * @enum {string}
 */
monin.ui.Swiper.EventType = {
  SLIDE_CHANGE_END: 'slidechangeend',
  SET_WRAPPER_TRANSFORM: 'setwrappertransform'
};

/**
 * Register this control so it can be created from markup.
 */
goog.ui.registry.setDecoratorByClassName(
    'swiper-container',
    function() {
      return new monin.ui.Swiper();
    });
