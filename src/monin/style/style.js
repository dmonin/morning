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
 * @fileoverview Collection of helpful methods for css style manipulation.
 */

goog.provide('monin.style');
goog.require('goog.style');


/**
 * Returns true if element visible in screen
 *
 * @param {Element} el
 * @param {goog.math.Size} viewportSize
 * @param {goog.math.Coordinate} docScroll
 * @return {boolean}
 */
monin.style.isVerticallyVisible = function(el, viewportSize, docScroll)
{
    var pos = goog.style.getPageOffset(el);
    var size = goog.style.getSize(el);
    return pos.y + size.height > docScroll.y && pos.y < docScroll.y + viewportSize.height;
};

/**
 * Returns current transform style
 *
 * @param {Element} el
 * @return {string}
 */
monin.style.getTransform = function(el)
{
    var properties = [
        'transform',
        'WebkitTransform',
        'msTransform',
        'MozTransform',
        'OTransform'
    ];
    var p;
    while (p = properties.shift())
    {
        if (el.style[p])
        {
            return el.style[p];
        }
    }

    return '';
};

/**
 * Applies element filter
 *
 * @param {Element} el
 * @param {string} filter
 */
monin.style.setFilter = function(el, filter)
{
    if (typeof Modernizr.csstransforms3d == 'undefined')
    {
        throw new Error("monin.style: Modernizr.csstransforms3d is not defined.");
    }

    // It means old browser / old graphic card = slow!
    if (!Modernizr.csstransforms3d)
    {
        return;
    }

    var properties = [
        'webkitFilter',
        'mozFilter'
    ];

    var p;
    while (p = properties.shift())
    {
        el.style[p] = filter;
    }
};

/**
 * Sets element css transformation
 *
 * @param {Element} el
 * @param {string} transform
 */
monin.style.setTransform = function(el, transform)
{
    var properties = [
        'transform',
        'WebkitTransform',
        'msTransform',
        'MozTransform',
        'OTransform'
    ];
    var p;
    while (p = properties.shift())
    {
        el.style[p] = transform;
    }
};

/**
 * Sets transform origin
 *
 * @param {Element} el
 * @param {string} transformOrigin
 */
monin.style.setTransformOrigin = function(el, transformOrigin)
{
    var properties = [
        'transformOrigin',
        'WebkitTransformOrigin',
        'msTransformOrigin',
        'MozTransformOrigin',
        'OTransformOrigin'
    ];
    var p;
    while (p = properties.shift())
    {
        el.style[p] = transformOrigin;
    }
};

/**
 * Translates element position
 *
 * @param {Element} el
 * @param {number=} opt_x
 * @param {number=} opt_y
 * @param {goog.math.Coordinate=} opt_initialPosition
 * @param {string=} opt_units
 */
monin.style.translate = function(el, opt_x, opt_y, opt_initialPosition, opt_units)
{
    var x = opt_x || 0;
    var y = opt_y || 0;

    var units = opt_units || 'px';

    if (Modernizr.csstransforms3d)
    {
        el.style.msTransform = 'translate3d(' + x + units + ', ' +
            y + units + ', 0)';

        el.style.MozTransform = 'translate3d(' + x + units + ', ' +
            y + units + ', 0)';

        el.style.webkitTransform = 'translate3d(' + x + units + ', ' +
            y + units + ', 0)';
    }
    else
    {
        if (opt_initialPosition)
        {
            x += opt_initialPosition.x;
            y += opt_initialPosition.y;
        }
        if (typeof opt_x == 'number')
        {
            el.style.marginLeft = x + units;
        }

        if (typeof opt_y == 'number')
        {
            el.style.marginTop = y +  units;
        }
    }
};
