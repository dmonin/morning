// Copyright 2012 Dmitry morning. All Rights Reserved.
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
 * @fileoverview Number renderer.
 * Formats and animates number changes.
 */

goog.provide('morning.ui.NumberRenderer');

goog.require('goog.fx.easing');
goog.require('goog.i18n.NumberFormat');
goog.require('goog.ui.Component');
goog.require('morning.fx.Animation');

/**
 * Number renderer
 *
 * @constructor
 * @extends {goog.ui.Component}
 */
morning.ui.NumberRenderer = function()
{
    goog.base(this);

    /**
     * Number formatting
     *
     * @type {goog.i18n.NumberFormat}
     * @private
     */
    this.formatter_ = new goog.i18n.NumberFormat('#,##0');

    /**
     * Current value
     *
     * @type {number}
     * @private
     */
    this.value_ = 0;

    /**
     * Animation
     *
     * @type {morning.fx.Animation}
     * @private
     */
    this.animation_ = new morning.fx.Animation([0], [0], 1000, goog.fx.easing.easeOut);
};
goog.inherits(morning.ui.NumberRenderer, goog.ui.Component);

/** @inheritDoc */
morning.ui.NumberRenderer.prototype.enterDocument = function()
{
    goog.base(this, 'enterDocument');

    this.getHandler().listen(this.animation_, goog.fx.Animation.EventType.ANIMATE,
        this.handleAnimation_);
};

/**
 * Displays value
 *
 * @param {number} value
 * @private
 */
morning.ui.NumberRenderer.prototype.displayValue_ = function(value)
{
    this.getElement().innerHTML = this.formatter_.format(value);
};


/**
 * Handles animation frame event
 *
 * @param {goog.fx.AnimationEvent} e
 * @private
 */
morning.ui.NumberRenderer.prototype.handleAnimation_ = function(e)
{
    this.displayValue_(e.coords[0]);
};

/**
 * Sets and animates value
 *
 * @param {number} value value
 * @param {number} duration animation duration
 */
morning.ui.NumberRenderer.prototype.setValue = function(value,
    duration)
{
    if (duration)
    {
        if (this.animation_.isPlaying())
        {
            this.animation_.stop();
        }

        this.animation_.setStartPoint([this.value_]);
        this.animation_.setEndPoint([value]);
        this.animation_.setDuration(duration);

        this.animation_.play();
        this.value_ = value;
    }
    else
    {
        this.displayValue_(value);
        this.value_ = value;
    }
};