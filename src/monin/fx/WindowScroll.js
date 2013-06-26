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

goog.provide('monin.fx.WindowScroll');

goog.require('monin.fx.dom.PredefinedEffect');


/**
 * Creates an animation object that will scroll an element from A to B.
 *
 * Start and End should be 2 dimensional arrays
 *
 * @param {Element} element Dom Node to be used in the animation.
 * @param {Array.<number>} start 2D array for start scroll left and top.
 * @param {Array.<number>} end 2D array for end scroll left and top.
 * @param {number} time Length of animation in milliseconds.
 * @param {Function=} opt_acc Acceleration function, returns 0-1 for inputs 0-1.
 * @extends {monin.fx.dom.PredefinedEffect}
 * @constructor
 */
monin.fx.WindowScroll = function(element, start, end, time, opt_acc) {
    if (start.length != 2 || end.length != 2)
    {
        throw Error('Start and end points must be 2D');
    }
    monin.fx.dom.PredefinedEffect.apply(this, arguments);
};
goog.inherits(monin.fx.WindowScroll, monin.fx.dom.PredefinedEffect);


/**
 * Animation event handler that will set the scroll posiiton of an element
 * @protected
 * @override
 */
monin.fx.WindowScroll.prototype.updateStyle = function() {
    window.scrollTo(this.coords[0], this.coords[1]);
};
