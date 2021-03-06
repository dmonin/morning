// Copyright 2012 Dmitry Monin. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Image model class.
 */
goog.provide('morning.models.Image');
goog.require('goog.math.Size');
goog.require('goog.net.ImageLoader');
goog.require('goog.events.EventTarget');

/**
 * Image model
 *
 * @constructor
 * @param {string} src
 * @param {goog.math.Size=} opt_size
 * @extends {goog.events.EventTarget}
 */
morning.models.Image = function(src, opt_size)
{
  goog.base(this);

  /**
   * Image source
   *
   * @type {string}
   */
  this.src = src;

  /**
   * Image node
   *
   * @type {Element}
   */
  this.element = null;

  /**
   * Size of the image
   *
   * @type {goog.math.Size}
   */
  this.size = opt_size || null;

  /**
   * Defines whether image is already loaded.
   *
   * @type {boolean}
   */
  this.isLoaded = false;

  /**
   * Defines whether image is currently loading.
   *
   * @type {boolean}
   * @private
   */
  this.isLoading_ = false;

  /**
   * List of callbacks which are called after image is loaded.
   *
   * @type {Array.<Function>}
   * @private
   */
  this.afterLoadCallbacks_ = [];
};
goog.inherits(morning.models.Image, goog.events.EventTarget);

/**
 * Creates a new
 *
 * @param {Object} data object with image attributes (width, height, src)
 * @return {morning.models.Image}
 */
morning.models.Image.create = function(data)
{
  var size = data['width'] ? new goog.math.Size(data['width'], data['height']) : null;
  return new morning.models.Image(data['src'], size);

};

/**
 * Handles Image load complete event
 * @param  {goog.events.BrowserEvent} e
 * @private
 */
morning.models.Image.prototype.handleLoadComplete_ = function(e)
{
  this.size = new goog.math.Size(e.target.naturalWidth, e.target.naturalHeight);
  this.isLoaded = true;
  this.isLoading_ = false;

  this.element = /** @type {Element} */ (e.target);

  goog.array.forEach(this.afterLoadCallbacks_, function(callback) {
    callback(this);
  }, this);

  this.dispatchEvent(goog.events.EventType.LOAD);
};

/**
 * Loads image
 *
 * @param {Function=} opt_callback
 * @param {Object=} opt_handler
 */
morning.models.Image.prototype.load = function(opt_callback, opt_handler)
{
  if (opt_callback && opt_handler)
  {
    opt_callback = goog.bind(opt_callback, opt_handler);
  }

  if (this.isLoaded)
  {
    if (opt_callback)
    {
      opt_callback(this);
    }
    return;
  }

  if (opt_callback)
  {
    this.afterLoadCallbacks_.push(opt_callback);
  }

  if (this.isLoading_)
  {
    return;
  }

  this.isLoading_ = true;

  var loader = new goog.net.ImageLoader();
  loader.addImage(this.src.replace(/[^a-z]/, ''), this.src);

  goog.events.listen(loader, goog.events.EventType.LOAD,
    this.handleLoadComplete_, false, this);

  loader.start();
};
