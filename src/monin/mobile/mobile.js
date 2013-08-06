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
 * @fileoverview Set of utilities for mobile browsers
 */
goog.provide('monin.mobile');
goog.require('goog.events.BrowserFeature');
goog.require('goog.math.Size');

/**
 * Returns screen size
 *
 * @return {goog.math.Size}
 */
monin.mobile.getScreenSize = function()
{
    return new goog.math.Size(screen.width, screen.height);
};

/**
 * Returns whether user agent supports touch events
 *
 * @return {boolean}
 */
monin.mobile.isTouchDevice = function()
{
    return goog.events.BrowserFeature.TOUCH_ENABLED;
};

/**
 * Returns click event type
 *
 * @return {string}
 */
monin.mobile.getClickEventType = function()
{
    return monin.mobile.isTouchDevice() ? goog.events.EventType.TOUCHSTART :
        goog.events.EventType.CLICK;
};