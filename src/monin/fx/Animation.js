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
 * @fileoverview Animation extensions to native google closure animation clasees
 * Adds getters / setters goog.fx.Animation
 */

goog.provide('monin.fx.Animation');

goog.require('goog.fx.Animation');

/**
 * Constructor for an animation object.
 * @param {Array.<number>} start Array for start coordinates.
 * @param {Array.<number>} end Array for end coordinates.
 * @param {number} duration Length of animation in milliseconds.
 * @param {Function=} opt_acc Acceleration function, returns 0-1 for inputs 0-1.
 * @constructor
 * @extends {goog.fx.Animation}
 */
monin.fx.Animation = function(start, end, duration, opt_acc)
{
    goog.base(this, start, end, duration, opt_acc);
};

goog.inherits(monin.fx.Animation, goog.fx.Animation);



/**
 * Returns animation end point
 *
 * @return  {Array.<number>}
 */
monin.fx.Animation.prototype.getEndPoint = function()
{
    return this.endPoint;
};

/**
 * Returns animation duration
 *
 * @return  {number}
 */
monin.fx.Animation.prototype.getDuration = function()
{
    return this.duration;
};

/**
 * Returns animation start point
 *
 * @return  {Array.<number>}
 */
monin.fx.Animation.prototype.getStartPoint = function()
{
    return this.startPoint;
};

/**
 * Sets animation duration
 *
 * @param  {number} duration
 */
monin.fx.Animation.prototype.setDuration = function(duration)
{
    this.duration = duration;
};

/**
 * Sets animation end point
 *
 * @param  {Array.<number>} endPoint
 */
monin.fx.Animation.prototype.setEndPoint = function(endPoint)
{
    this.endPoint = endPoint;
};

/**
 * Sets animation start point
 *
 * @param  {Array.<number>} startPoint
 */
monin.fx.Animation.prototype.setStartPoint = function(startPoint)
{
    this.startPoint = startPoint;
};