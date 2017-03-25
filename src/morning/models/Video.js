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

};
goog.inherits(morning.models.Video, goog.events.EventTarget);

morning.models.Video.prototype.load = function()
{
  this.element = goog.dom.getDomHelper().createDom('video', {
    'src': this.src
  });

  goog.events.listen(this.element, 'canplay', function() {
    this.isLoaded = true;
    this.element.width = this.element['videoWidth'];
    this.element.height = this.element['videoHeight'];
  }.bind(this));

};