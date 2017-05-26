// Copyright 2017 Dmitry Monin. All Rights Reserved.
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
goog.provide('morning.models.Video');
goog.require('goog.events.EventTarget');

/**
 * Video
 *
 * @param {string} src
 * @constructor
 * @extends {goog.events.EventTarget}
 */
morning.models.Video = function(src)
{
  goog.base(this);

  /**
   * Video source
   *
   * @type {string}
   */
  this.src = src;

  /**
   * Video node
   *
   * @type {Element}
   */
  this.element = null;

  /**
   * Defines whether video is already loaded.
   *
   * @type {boolean}
   */
  this.isLoaded = false;

  /**
   * Size of the video.
   *
   * @type {goog.math.Size}
   */
  this.size = new goog.math.Size(10, 10);

  /**
   * List of callbacks which are called after video is loaded.
   *
   * @type {Array.<Function>}
   * @private
   */
  this.afterLoadCallbacks_ = [];

};
goog.inherits(morning.models.Video, goog.events.EventTarget);

/**
 * @param  {Function=} opt_callback
 * @param {Object=} opt_handler
 */
morning.models.Video.prototype.load = function(opt_callback, opt_handler)
{
  this.element = goog.dom.getDomHelper().createDom('video', {
    'src': this.src
  });

  if (opt_callback && opt_handler)
  {
    opt_callback = goog.bind(opt_callback, opt_handler);
  }

  if (opt_callback)
  {
    this.afterLoadCallbacks_.push(opt_callback);
  }

  goog.events.listen(this.element, 'canplay', function() {
    this.isLoaded = true;
    this.element.width = this.element['videoWidth'];
    this.element.height = this.element['videoHeight'];
    this.size.width = Number(this.element.width);
    this.size.height = Number(this.element.height);
    this.dispatchEvent(goog.events.EventType.LOAD);

    goog.array.forEach(this.afterLoadCallbacks_, function(callback) {
      callback(this);
    }, this);
  }.bind(this));

};