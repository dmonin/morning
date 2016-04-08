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
 * @fileoverview Count down component.
 */
goog.provide('morning.ui.CountDown');
goog.require('goog.Timer');
goog.require('goog.dom.dataset');
goog.require('goog.string');
goog.require('goog.ui.Component');
goog.require('goog.ui.registry');

/**
 * Count down
 *
 * @constructor
 * @extends {goog.ui.Component}
 */
morning.ui.CountDown = function()
{
    goog.base(this);

    /**
     * Day element
     *
     * @type {Element}
     * @private
     */
    this.daysEl_ = null;

    /**
     * Hours element
     *
     * @type {Element}
     * @private
     */
    this.hoursEl_ = null;

    /**
     * Minutes element
     *
     * @type {Element}
     * @private
     */
    this.minutesEl_ = null;

    /**
     * Seconds element
     *
     * @type {Element}
     * @private
     */
    this.secondsEl_ = null;

    /**
     * Countdown timer
     *
     * @type {goog.Timer}
     * @private
     */
    this.timer_ = new goog.Timer(1000);

    /**
     * Time left in seconds
     *
     * @type {number}
     * @private
     */
    this.timeLeft_ = 0;


};
goog.inherits(morning.ui.CountDown, goog.ui.Component);


/** @inheritDoc */
morning.ui.CountDown.prototype.decorateInternal = function(el)
{
    goog.base(this, 'decorateInternal', el);

    this.daysEl_ = this.getElementByClass('countdown-days');
    this.hoursEl_ = this.getElementByClass('countdown-hours');
    this.minutesEl_ = this.getElementByClass('countdown-minutes');
    this.secondsEl_ = this.getElementByClass('countdown-seconds');


    var expires = Number(goog.dom.dataset.get(el, 'expirationdate'));
    this.timeLeft_ = expires - (+new Date()) / 1000;
};

/** @inheritDoc */
morning.ui.CountDown.prototype.enterDocument = function()
{
    goog.base(this, 'enterDocument');


    this.getHandler().listen(this.timer_, goog.Timer.TICK, this.handleTick_);
    this.timer_.start();
};


/**
 * Handles tick event (each second) and renders new remaining time
 *
 * @param {goog.events.BrowserEvent} e
 * @private
 */
morning.ui.CountDown.prototype.handleTick_ = function(e)
{
    this.timeLeft_--;

    this.renderTime_();
};

/**
 * Renders currently remaining time
 *
 * @private
 */
morning.ui.CountDown.prototype.renderTime_ = function()
{
    var timeLeft = this.timeLeft_;
    var days = Math.floor(this.timeLeft_ / 3600 / 24);
    timeLeft -= days * 3600 * 24;

    var hours = Math.floor(timeLeft / 3600);
    timeLeft -= hours * 3600;

    var minutes = Math.floor(timeLeft / 60);
    timeLeft -= minutes * 60;

    var seconds = Math.round(timeLeft);

    this.daysEl_.innerHTML = goog.string.padNumber(days, 2);
    this.hoursEl_.innerHTML = goog.string.padNumber(hours, 2);
    this.minutesEl_.innerHTML = goog.string.padNumber(minutes, 2);
    this.secondsEl_.innerHTML = goog.string.padNumber(seconds, 2);
};

/**
 * Register this control so it can be created from markup.
 */
goog.ui.registry.setDecoratorByClassName(
    'countdown',
    function() {
      return new morning.ui.CountDown();
    });
