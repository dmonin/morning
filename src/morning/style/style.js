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
 * @fileoverview Collection of helpful methods for css style manipulation.
 */

goog.provide('morning.style');
goog.require('goog.style.transform');


/**
 * Returns true if element visible in screen
 *
 * @param {Element} el
 * @param {goog.math.Size} viewportSize
 * @param {goog.math.Coordinate} docScroll
 * @return {boolean}
 */
morning.style.isVerticallyVisible = function(el, viewportSize, docScroll)
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
morning.style.getTransform = function(el)
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
 * @param {Element|Node} el
 * @param {string} filter
 */
morning.style.setFilter = function(el, filter)
{
  if (typeof Modernizr.csstransforms3d == 'undefined')
  {
    throw new Error("morning.style: Modernizr.csstransforms3d is not defined.");
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
morning.style.setTransform = function(el, transform)
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
morning.style.setTransformOrigin = function(el, transformOrigin)
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
 * @param {number} x
 * @param {number} y
 * @param {string=} opt_units
 */
morning.style.translate = function(el, x, y, opt_units)
{
  if (!goog.style.transform.isSupported())
  {
    return false;
  }
  var units = opt_units || 'px';

  var is3dSupported = goog.style.transform.is3dSupported();
  var start = is3dSupported ? 'translate3d(' : 'translate(';
  var end = is3dSupported ? ', 0)' : ')';

  el.style.msTransform = start + x + units + ', ' + y + units + end;
  el.style.MozTransform = start + x + units + ', ' + y + units + end;
  el.style.webkitTransform = start + x + units + ', ' + y + units + end;

};
