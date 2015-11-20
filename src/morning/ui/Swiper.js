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
  this.swiper = null;
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

  var readCfg = {
    'number': ['slidesPerView', 'spaceBetween'],
    'boolean': ['loop', 'paginationClickable', 'centerSlides'],
    'string': ['pagination', 'nextButton', 'prevButton'],
    'closure': ['paginationBulletRender']
  };

  var cfg = {};
  for (var type in readCfg)
  {
    for (var i = 0; i < readCfg[type].length; i++)
    {
      var key = readCfg[type][i];
      var val = goog.dom.dataset.get(el, key);

      if (!val)
      {
        continue;
      }

      switch (type)
      {
        case 'number':
          cfg[key] = Number(val);
          break;
        case 'boolean':
          cfg[key] = val == 'true';
          break;
        case 'closure':
          cfg[key] = goog.getObjectByName(val);
          break;
        default:
          cfg[key] = val;
          break;
      }
    }
  }

  cfg['onSlideChangeEnd'] = this.handleSlideChangeEnd_.bind(this);

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
  if (this.swiper)
  {
    goog.Timer.callOnce(function() {
      this.swiper.destroy();
    }, 1000, this);
  }
};

/**
 * @param  {goog.events.Event} e
 * @private
 */
morning.ui.Swiper.prototype.handleSwiperReady_ = function(e)
{
  this.swiper = new Swiper(this.getElement(), this.config_);

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
 * Handles slide change event and propagates it.
 *
 * @param  {goog.events.Event} e
 * @private
 */
morning.ui.Swiper.prototype.handleSlideChangeEnd_ = function(e)
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
  return this.swiper.activeIndex;
};


/**
 * Run transition to the slide with index number equal to 'index'
 * parameter for the duration equal to 'speed' parameter.
 *
 * @param  {number} index
 * @param  {number=} speed
 * @param  {boolean=} runCallbacks
 */
morning.ui.Swiper.prototype.swipeTo = function(index, speed, runCallbacks)
{
  if (this.swiper)
  {
    this.swiper.slideTo(index, speed, runCallbacks);
  }
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
