// Copyright 2012 Dmitry morning. All Rights Reserved.
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

goog.provide('morning.ui.Swiper');
goog.require('goog.ui.Component');
goog.require('morning.net.ExternalApi');
goog.require('goog.dom.dataset');
goog.require('goog.Timer');
goog.require('goog.ui.registry');

/**
 * @constructor
 * @extends {goog.ui.Component}
 */
morning.ui.Swiper = function()
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
goog.inherits(morning.ui.Swiper, goog.ui.Component);

/**
 * @type {boolean}
 */
morning.ui.Swiper.loaded = false;

/**
 * @type {string}
 */
morning.ui.Swiper.scriptUrl = 'asset/swiper/idangerous.swiper.min.js';

/** @inheritDoc */
morning.ui.Swiper.prototype.decorateInternal = function(el)
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
morning.ui.Swiper.prototype.enterDocument = function()
{
  goog.base(this, 'enterDocument');

  if (!morning.ui.Swiper.loaded && !goog.getObjectByName('Swiper'))
  {
    this.load_();
  }

  var externalApi = morning.net.ExternalApi.getInstance();
  externalApi.onAvailable('Swiper', this.handleSwiperReady_, this);
};

/**
 * @inheritDoc
 */
morning.ui.Swiper.prototype.disposeInternal = function()
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
morning.ui.Swiper.prototype.getActiveSlide = function()
{
  return this.swiper_.activeSlide();
};

/**
 * Returns the touched/clicked slide (slide instance, HTMLElement). For use only
 * with "onSlideTouch" and "onSlideClick" callbacks.
 *
 * @return {Element}
 */
morning.ui.Swiper.prototype.getClickedSlide = function()
{
  return this.swiper_ ? this.swiper_.clickedSlide : null;
};

/**
 * Returns index of currently displayed slide
 *
 * @return {number}
 */
morning.ui.Swiper.prototype.getActiveIndex = function()
{
  return this.swiper_.activeLoopIndex;
};


/**
 * Returns the index number of touched/clicked slide. For use only with
 * "onSlideTouch" and "onSlideClick" callbacks.
 *
 * @return {number}
 */
morning.ui.Swiper.prototype.getClickedSlideIndex = function()
{
  return this.swiper_.clickedSlideIndex;
};

/**
 * @param  {goog.events.Event} e
 * @private
 */
morning.ui.Swiper.prototype.handleSwiperReady_ = function(e)
{
  this.swiper_ = new Swiper(this.getElement(), this.config_);
};

/**
 * @private
 */
morning.ui.Swiper.prototype.load_ = function()
{
  var externalApi = morning.net.ExternalApi.getInstance();
  externalApi.addScript(document.body, morning.ui.Swiper.scriptUrl);
};

/**
 * Handles an event when Swiper is moved
 *
 * @param  {morning.ui.Swiper} swiper
 * @param  {Object} coords
 */
morning.ui.Swiper.prototype.onSetWrapperTransform = function(swiper, coords)
{
  this.dispatchEvent({
    type: morning.ui.Swiper.EventType.SET_WRAPPER_TRANSFORM,
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
morning.ui.Swiper.prototype.onSlideClick = function(e)
{
  this.dispatchEvent(goog.events.EventType.CLICK);
};

/**
 * @param  {goog.events.Event} e
 */
morning.ui.Swiper.prototype.onSlideTouch = function(e)
{
  this.dispatchEvent(goog.events.EventType.TOUCHSTART);
};

/**
 * @param  {goog.events.Event} e
 */
morning.ui.Swiper.prototype.onTouchMove = function(e)
{
  this.dispatchEvent(goog.events.EventType.TOUCHMOVE);
};


/**
 * @param  {goog.events.Event} e
 */
morning.ui.Swiper.prototype.onTouchEnd = function(e)
{
  this.dispatchEvent(goog.events.EventType.TOUCHEND);
};

/**
 * @param  {goog.events.Event} e
 */
morning.ui.Swiper.prototype.onSlideChangeEnd = function(e)
{
  this.dispatchEvent(morning.ui.Swiper.EventType.SLIDE_CHANGE_END);
};

/**
 * Swipes to next item
 */
morning.ui.Swiper.prototype.reInit = function()
{
  this.swiper_.reInit();
};

/**
 * Sets the config
 *
 * @param {Object} cfg
 */
morning.ui.Swiper.prototype.setConfig = function(cfg)
{
  goog.mixin(this.config_, cfg);
};

/**
 * Swipes to next item
 */
morning.ui.Swiper.prototype.swipeNext = function()
{
  this.swiper_.swipeNext();
};

/**
 * Swipes to next item
 */
morning.ui.Swiper.prototype.swipePrev = function()
{
  this.swiper_.swipePrev();
};

/**
 * @param  {number} index
 * @param  {number} speed
 * @param  {boolean} runCallbacks
 */
morning.ui.Swiper.prototype.swipeTo = function(index, speed, runCallbacks)
{
  if (this.swiper_)
  {
    this.swiper_.swipeTo(index, speed, runCallbacks);
  }
};

/**
 * @enum {string}
 */
morning.ui.Swiper.EventType = {
  SLIDE_CHANGE_END: 'slidechangeend',
  SET_WRAPPER_TRANSFORM: 'setwrappertransform'
};

/**
 * Register this control so it can be created from markup.
 */
goog.ui.registry.setDecoratorByClassName(
    'swiper-container',
    function() {
      return new morning.ui.Swiper();
    });
