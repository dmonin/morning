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
 * @fileoverview Arrow Navigation component
 */
goog.provide('monin.ui.ArrowNavigation');
goog.provide('monin.ui.ArrowNavigationEvent');

goog.require('goog.dom.classes');
goog.require('goog.ui.Component');

/**
 * Arrow Navigation component
 *
 * @constructor
 * @extends {goog.ui.Component}
 */
monin.ui.ArrowNavigation = function()
{
    goog.base(this);

    /**
     * Previous button element
     *
     * @type {Element}
     * @private
     */
    this.prev_ = null;

    /**
     * Next button element
     *
     * @type {Element}
     * @private
     */
    this.next_ = null;
};
goog.inherits(monin.ui.ArrowNavigation, goog.ui.Component);

/** @inheritDoc */
monin.ui.ArrowNavigation.prototype.createDom = function()
{
    var dom = this.getDomHelper(),
        el = dom.createDom('div', 'arrow-nav', [
            dom.createDom('div', 'nav-prev'),
            dom.createDom('div', 'nav-next')
        ]);

    this.decorateInternal(el);
};

/** @inheritDoc */
monin.ui.ArrowNavigation.prototype.decorateInternal = function(el)
{
    goog.base(this, 'decorateInternal', el);

    this.prev_ = el.querySelector('.nav-prev');
    this.next_ = el.querySelector('.nav-next');
};


/** @inheritDoc */
monin.ui.ArrowNavigation.prototype.enterDocument = function()
{
    goog.base(this, 'enterDocument');
    var el = this.getElement();

    if (goog.userAgent.MOBILE)
    {
        this.getHandler().listen(el, goog.events.EventType.TOUCHSTART,
            this.handleMouseDown_);
    }
    else
    {
        this.getHandler().listen(el, goog.events.EventType.MOUSEDOWN,
            this.handleMouseDown_);
    }


};

/**
 * Handles mouse down / touchstart events
 *
 * @param {goog.events.BrowserEvent} e
 * @private
 */
monin.ui.ArrowNavigation.prototype.handleMouseDown_ = function(e)
{
    if (!goog.dom.classes.has(e.target, 'active') || e.button == 2)
    {
        return;
    }

    e.preventDefault();

    var dir = 0;
    if (goog.dom.classes.has(e.target, 'nav-prev'))
    {
        dir = -1;
    }
    else if (goog.dom.classes.has(e.target, 'nav-next'))
    {
        dir = 1;
    }

    if (dir !== 0)
    {
        var evt = new monin.ui.ArrowNavigationEvent(
                        goog.ui.Component.EventType.ACTION, this);
        evt.dir = dir;

        this.dispatchEvent(evt);
    }
};

/**
 * Sets active states to navigation
 *
 * @param {boolean} left
 * @param {boolean} right
 */
monin.ui.ArrowNavigation.prototype.setActive = function(left, right)
{
    goog.dom.classes.enable(this.prev_, 'active', left);
    goog.dom.classes.enable(this.next_, 'active', right);
};

/**
 * @constructor
 * @param {string} type Event Type.
 * @param {Object=} opt_target Reference to the object that is the target of
 *     this event. It has to implement the {@code EventTarget} interface
 *     declared at {@link http://developer.mozilla.org/en/DOM/EventTarget}.
 * @extends {goog.events.Event} e
 */
monin.ui.ArrowNavigationEvent = function(type, opt_target)
{
    goog.base(this, type, opt_target);

    /**
     * @type {number}
     */
    this.dir = 0;
};
goog.inherits(monin.ui.ArrowNavigationEvent, goog.events.Event);