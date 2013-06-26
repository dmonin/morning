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
 * @fileoverview Tooltip Action Component.
 */

goog.provide('monin.ui.TooltipAction');

goog.require('goog.ui.Component');

/**
 * Tooltip Action Component
 *
 * @constructor
 * @extends {goog.ui.Component}
 */
monin.ui.TooltipAction = function(text, name)
{
    goog.base(this);

    /**
     * Action text
     *
     * @type {string}
     * @private
     */
    this.text_ = text;

    /**
     * Action name
     *
     * @type {string}
     */
    this.name = name;
};
goog.inherits(monin.ui.TooltipAction, goog.ui.Component);

/** @inheritDoc */
monin.ui.TooltipAction.prototype.createDom = function()
{
    var domHelper = this.getDomHelper();
    var el = domHelper.createDom('span', 'tooltip-action', this.text_);
    this.decorateInternal(el);
};

/** @inheritDoc */
monin.ui.TooltipAction.prototype.enterDocument = function()
{
    goog.base(this, 'enterDocument');

    this.getHandler().listen(this.getElement(), goog.events.EventType.CLICK,
        this.handleClick_);
};

/**
 * Handles click event
 *
 * @param {goog.events.Event} e
 * @private
 */
monin.ui.TooltipAction.prototype.handleClick_ = function(e)
{
    this.dispatchEvent(goog.ui.Component.EventType.ACTION);
};