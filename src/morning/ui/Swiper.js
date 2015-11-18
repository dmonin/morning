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
   * @protected
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
morning.ui.Swiper.scriptUrl = '/asset/morning/third-party/swiper.min.js';

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
  var paginationBulletRender = goog.dom.dataset.get(el, 'paginationbulletrenderer') || null;

  var slidesPerView = goog.dom.dataset.get(el, 'slidesperview') || null;

  var centeredSlides = goog.dom.dataset.get(el, 'centeredslides') || null;
  var spaceBetween = goog.dom.dataset.get(el, 'spacebetween') || null;

  var nextBtn = goog.dom.dataset.get(el, 'nextBtn') || null;
  var prevBtn = goog.dom.dataset.get(el, 'prevBtn') || null;

  var cfg = {
    'loop': loop,
    'paginationClickable': paginationClickable
  };

  if (pagination)
  {
    cfg['pagination'] = pagination;
  }

  if (paginationBulletRender)
  {
    cfg['paginationBulletRender'] = goog.getObjectByName(paginationBulletRender);
  }

  if (slidesPerView)
  {
    cfg['slidesPerView'] = slidesPerView;
  }

  if (centeredSlides)
  {
    cfg['centeredSlides'] = centeredSlides;
  }

  if (spaceBetween)
  {
    cfg['spaceBetween'] = Number(spaceBetween);
  }

  if (nextBtn)
  {
    cfg['nextButton'] = nextBtn;
  }
  if (prevBtn)
  {
    cfg['prevButton'] = prevBtn;
  }

  cfg['onSlideChangeEnd'] = goog.bind(this.onSlideChangeEnd, this);

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
 * @param  {goog.events.Event} e
 * @private
 */
morning.ui.Swiper.prototype.handleSwiperReady_ = function(e)
{
  this.swiper_ = new Swiper(this.getElement(), this.config_);

  this.dispatchEvent(morning.ui.Swiper.EventType.SWIPER_READY);
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
 * Sets the config
 *
 * @param {Object} cfg
 */
morning.ui.Swiper.prototype.setConfig = function(cfg)
{
  goog.mixin(this.config_, cfg);
};


/**
 * @param  {goog.events.Event} e
 */
morning.ui.Swiper.prototype.onSlideChangeEnd = function(e)
{
  this.dispatchEvent(morning.ui.Swiper.EventType.SLIDE_CHANGE_END);
};



/**
 * Returns index of currently displayed slide
 *
 * @return {number}
 */
morning.ui.Swiper.prototype.getActiveIndex = function()
{
  return this.swiper_.activeIndex;
};


/**
 * @enum {string}
 */
morning.ui.Swiper.EventType = {
  SWIPER_READY: 'swiperready',
  SLIDE_CHANGE_END: 'slidechangeend'
};

/**
 * Register this control so it can be created from markup.
 */
goog.ui.registry.setDecoratorByClassName(
    'swiper-container',
    function() {
      return new morning.ui.Swiper();
    });
