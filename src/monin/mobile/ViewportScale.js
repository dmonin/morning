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
 * @fileoverview Controls viewport meta scaling attribute
 * https://developer.mozilla.org/en-US/docs/Mozilla/Mobile/Viewport_meta_tag
 */
goog.provide('monin.mobile.ViewportScale');

goog.require('goog.dom');
goog.require('goog.math.Size');
goog.require('goog.style');
goog.require('monin.mobile');

/**
 * ViewportScale contructor
 *
 * @constructor
 * @extends {goog.ui.Component}
 */
monin.mobile.ViewportScale = function(elementId)
{
    this.element_ = goog.dom.getElement(elementId);


};

/**
 * Returns current scale
 *
 * @return {number}
 */
monin.mobile.ViewportScale.prototype.getScale = function()
{
    // Get the orientation corrected screen width
    var screenSize = monin.mobile.getScreenSize();
    var viewportSize = goog.dom.getViewportSize();

    return (screenSize.aspectRatio() > 1) ?
                    screenSize.width / viewportSize.width :
                    screenSize.height / viewportSize.height;
};

/**
 * Sets viewport scale
 *
 * @param  {number} scale
 */
monin.mobile.ViewportScale.prototype.setScale = function(scale)
{
    var content = this.element_.getAttribute('content');
    content = content.replace(/initial-scale=([0-9.]+)/, 'initial-scale=' + scale);
    this.element_.setAttribute('content', content);
};

/**
 * Pans viewport to specified element
 *
 * @param {Element} el
 */
monin.mobile.ViewportScale.prototype.panToElement = function(el)
{
    var screenSize = monin.mobile.getScreenSize();
    var elementSize = goog.style.getSize(el);

    var newElementSize = elementSize.clone();
    newElementSize.scaleToFit(screenSize);
    this.setScale(newElementSize.width / elementSize.width);

    var elementPositon = goog.style.getPageOffset(el);
    window.scrollTo(0, 0);
};
