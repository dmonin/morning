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
 * @fileoverview Provides set of utilities for working with browser events
 *
 */

goog.provide('morning.events');

/**
 * Returns mousedown / touch position from specified event
 *
 * @param {goog.events.BrowserEvent} e
 * @param {boolean=} opt_relativeToPage
 * @return {goog.math.Coordinate}
 */
morning.events.getPointerPosition = function(e, opt_relativeToPage)
{
    var nativeEvt = e.getBrowserEvent();
    var position = new goog.math.Coordinate(0, 0);

    var xProp = opt_relativeToPage ? 'pageX' : 'clientX';
    var yProp = opt_relativeToPage ? 'pageY' : 'clientY';

    if (nativeEvt.touches)
    {
        if (nativeEvt.touches.length > 1)
        {
            return null;
        }
        else if (nativeEvt.touches.length == 1)
        {
            var touch = /** @type {Object} */ (nativeEvt['touches'][0]);
            position.x = /** @type {number} */ (touch[xProp]);
            position.y = /** @type {number} */ (touch[yProp]);
        }
    }
    else
    {
        position.x = /** @type {number} */ (nativeEvt[xProp]);
        position.y = /** @type {number} */ (nativeEvt[yProp]);
    }

    return position;
};


/**
 * Adds cross platform listener of pointer event
 *
 * @param {goog.events.EventHandler} handler
 * @param {goog.events.ListenableType} target
 * @param {string} type
 * @param {Function} listener
 */
morning.events.listenPointerEvent = function(handler, target, type, listener)
{
    var isTouch = goog.events.BrowserFeature.TOUCH_ENABLED;
    var isMsPointerTouch = !!window.navigator.msPointerEnabled;
    var isPointerEnabled = !!window.navigator['pointerEnabled'];
    var evtType = null;

    switch (type)
    {
        case morning.events.EventType.POINTERDOWN:
            if (isTouch && isMsPointerTouch)
            {
                evtType = goog.events.EventType.MSPOINTERDOWN;
            }
            else if (isTouch && isPointerEnabled)
            {
                evtType = goog.events.EventType.POINTERDOWN;
            }
            else
            {
                evtType = isTouch ? goog.events.EventType.TOUCHSTART :
                    goog.events.EventType.MOUSEDOWN;
            }
            break;

        case morning.events.EventType.POINTERMOVE:
            if (isTouch && isMsPointerTouch)
            {
                evtType = goog.events.EventType.MSPOINTERMOVE;
            }
            else if (isTouch && isPointerEnabled)
            {
                evtType = goog.events.EventType.POINTERDOWN;
            }
            else
            {
                evtType = isTouch ? goog.events.EventType.TOUCHMOVE :
                    goog.events.EventType.MOUSEMOVE;
            }

            break;

        case morning.events.EventType.POINTERUP:
            if (isTouch && isMsPointerTouch)
            {
                evtType = goog.events.EventType.MSPOINTERUP;
            }
            else if (isTouch && isPointerEnabled)
            {
                evtType = goog.events.EventType.POINTERUP;
            }
            else
            {
                evtType = isTouch ? goog.events.EventType.TOUCHEND :
                    goog.events.EventType.MOUSEUP;
            }

            handler.listen(target, evtType, listener);
            break;
    }

    handler.listen(target, evtType, listener);
};


/**
 * Removes cross platform listener of pointer event
 *
 * @param {goog.events.EventHandler} handler
 * @param {goog.events.ListenableType} target
 * @param {string} type
 * @param {Function} listener
 */
morning.events.unlistenPointerEvent = function(handler, target, type, listener)
{
    var isTouch = goog.events.BrowserFeature.TOUCH_ENABLED;
    var isMsPointerTouch = !!window.navigator.msPointerEnabled;
    var evtType = null;

    switch (type)
    {
        case morning.events.EventType.POINTERDOWN:
            if (isTouch && isMsPointerTouch)
            {
                handler.unlisten(target,
                    goog.events.EventType.MSPOINTERDOWN, listener);
            }
            evtType = isTouch ? goog.events.EventType.TOUCHSTART :
                goog.events.EventType.MOUSEDOWN;

            handler.unlisten(target, evtType, listener);
            break;

        case morning.events.EventType.POINTERMOVE:
            if (isTouch && isMsPointerTouch)
            {
                handler.unlisten(target,
                    goog.events.EventType.MSPOINTERMOVE, listener);
            }

            evtType = isTouch ? goog.events.EventType.TOUCHMOVE :
                goog.events.EventType.MOUSEMOVE;

            handler.unlisten(target, evtType, listener);
            break;

        case morning.events.EventType.POINTERUP:
            if (isTouch && isMsPointerTouch)
            {
                handler.unlisten(target,
                    goog.events.EventType.MSPOINTERUP, listener);
            }

            evtType = isTouch ? goog.events.EventType.TOUCHEND :
                goog.events.EventType.MOUSEUP;

            handler.unlisten(target, evtType, listener);

            break;
    }
};

/**
 * @enum {string}
 */
morning.events.EventType = {
    POINTERDOWN: 'pointerdown',
    POINTERMOVE: 'pointermove',
    POINTERUP: 'pointerup'
};