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
 * @fileoverview Button component
 */
goog.provide('monin.ui.Button');

goog.require('goog.style');
goog.require('goog.ui.Component');
goog.require('goog.ui.Component.EventType');
goog.require('monin.ui.HoverEffect');

/**
 * Button component
 *
 * @constructor
 * @extends {goog.ui.Component}
 */
monin.ui.Button = function()
{
    goog.base(this);

    /**
     * Hover effect (mouse over, touchstart)
     *
     * @type {monin.ui.HoverEffect}
     * @private
     */
    this.hoverEffect_ = null;

    /**
     * Button value
     *
     * @type {string}
     * @private
     */
    this.value_ = '';

    /**
     * Defines internally whether button is enabled
     *
     * @type {boolean}
     * @private
     */
    this.isEnabled_ = true;
};
goog.inherits(monin.ui.Button, goog.ui.Component);

/** @inheritDoc */
monin.ui.Button.prototype.createDom = function()
{
    var el = this.getDomHelper().createDom('div', 'button');
    this.decorateInternal(el);
};

/** @inheritDoc */
monin.ui.Button.prototype.decorateInternal = function(el)
{
    goog.base(this, 'decorateInternal', el);

    var matches = el.className.match('button-([a-z-]+)');
    if (matches)
    {
        this.value_ = matches[1];
    }

    if (this.getHandlerElement())
    {
        this.isEnabled_ = goog.dom.classes.has(this.getHandlerElement(), 'enabled');
    }
};

/** @inheritDoc */
monin.ui.Button.prototype.disposeInternal = function()
{
    goog.base(this, 'disposeInternal');

    goog.dispose(this.hoverEffect_);
};

/**
 * Returns button value
 *
 * @return {string}
 */
monin.ui.Button.prototype.getValue = function()
{
    return this.value_;
};

/** @inheritDoc */
monin.ui.Button.prototype.enterDocument = function()
{
    goog.base(this, 'enterDocument');

    this.hoverEffect_ = monin.ui.HoverEffect.attach(this.getElement());

    var evtType = goog.userAgent.MOBILE ? goog.events.EventType.TOUCHSTART :
            goog.events.EventType.CLICK;

    this.getHandler().listen(this.getHandlerElement(), evtType,
        this.getClickHandler());
};

/**
 * Returns click handler function
 *
 * @return {Function}
 * @protected
 */
monin.ui.Button.prototype.getClickHandler = function()
{
    return this.handleClick;
};

/**
 * Returns click handler element
 *
 * @return {Element}
 */
monin.ui.Button.prototype.getHandlerElement = function()
{
    return this.getElement();
};

/**
 * Handles click event
 *
 * @param {goog.events.BrowserEvent} e
 * @protected
 */
monin.ui.Button.prototype.handleClick = function(e)
{
    if (this.isEnabled_)
    {
        this.dispatchEvent(goog.ui.Component.EventType.ACTION);
    }
};

/**
 * Specifies whether element is enabled
 *
 * @param {boolean} isEnabled
 */
monin.ui.Button.prototype.setEnabled = function(isEnabled)
{
    this.isEnabled_ = isEnabled;
    goog.dom.classes.enable(this.getElement(), 'enabled', isEnabled);
};

/**
 * Specifies element visibility
 *
 * @param {boolean} isVisible
 */
monin.ui.Button.prototype.setVisible = function(isVisible)
{
    goog.style.setElementShown(this.getElement(), isVisible);
};

/**
 * Sets button text
 *
 * @param {string} text
 */
monin.ui.Button.prototype.setText = function(text)
{
    this.getContentElement().innerHTML = text;
};

/**
 * Sets button value
 *
 * @param {string} value
 */
monin.ui.Button.prototype.setValue = function(value)
{
    this.value_ = value;
};

/**
 * Register this control so it can be created from markup.
 */
goog.ui.registry.setDecoratorByClassName(
    'button',
    function() {
      return new monin.ui.Button();
    });
