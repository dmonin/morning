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
 * @fileoverview Toggle button
 */
goog.provide('morning.ui.ToggleButton');

goog.require('goog.dom.classlist');
goog.require('goog.ui.registry');
goog.require('morning.ui.Button');

/**
 * Toggle button
 *
 * @constructor
 * @extends {morning.ui.Button}
 */
morning.ui.ToggleButton = function()
{
    goog.base(this);

    /**
     * @type {boolean}
     * @protected
     */
    this.isPressed_ = false;
};
goog.inherits(morning.ui.ToggleButton, morning.ui.Button);

/** @inheritDoc */
morning.ui.ToggleButton.prototype.enterDocument = function()
{
    goog.base(this, 'enterDocument');

    this.getHandler().listen(this, goog.ui.Component.EventType.ACTION,
        this.handleAction_);
};

/**
 * Returns click handler event
 *
 * @return {Element}
 */
morning.ui.ToggleButton.prototype.getHandlerElement = function()
{
    return this.getElement();
};

/**
 * Handles action event
 *
 * @param {goog.events.BrowserEvent} e
 * @private
 */
morning.ui.ToggleButton.prototype.handleAction_ = function(e)
{
    if (this.isPressed_)
    {
        this.remove();
    }
    else
    {
        this.add();
    }
};

/**
 * Performs add action
 * @protected
 */
morning.ui.ToggleButton.prototype.add = function()
{
    this.setPressed(true);
};

/**
 * Returns true if button is pressed
 *
 * @return {boolean}
 */
morning.ui.ToggleButton.prototype.isPressed = function()
{
    return this.isPressed_;
};

/**
 * Performs remove action
 * @protected
 */
morning.ui.ToggleButton.prototype.remove = function()
{
    this.setPressed(false);
};

/**
 * Sets button pressed state
 *
 * @param {boolean} isPressed
 */
morning.ui.ToggleButton.prototype.setPressed = function(isPressed)
{
    this.isPressed_ = isPressed;
    if (this.getElement() !== null)
    {
        goog.dom.classlist.enable(this.getElement(), 'pressed', isPressed);
    }
};
