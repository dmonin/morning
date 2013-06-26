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
 * @fileoverview Overlay component
 * Displayed darked / lighten overlay over the page. Prevents other elements from clicking.
 */
goog.provide('monin.ui.Overlay');

goog.require('goog.ui.Component');

/**
 * Overlay component
 *
 * @constructor
 * @extends {goog.ui.Component}
 */
monin.ui.Overlay = function()
{
    goog.base(this);
};
goog.inherits(monin.ui.Overlay, goog.ui.Component);

goog.addSingletonGetter(monin.ui.Overlay);

/** @inheritDoc */
monin.ui.Overlay.prototype.createDom = function()
{
    var domHelper = this.getDomHelper();
    var el = domHelper.createDom('div', 'overlay');

    this.decorateInternal(el);
};

/** @inheritDoc */
monin.ui.Overlay.prototype.enterDocument = function()
{
    this.getHandler().listen(this.getElement(), goog.events.EventType.CLICK,
        this.handleClick_);
};

/**
 * Handles click events
 *
 * @param {goog.events.Event} e
 * @private
 */
monin.ui.Overlay.prototype.handleClick_ = function(e)
{
    this.dispatchEvent(goog.ui.Component.EventType.CLOSE);
    this.setVisible(false);
};

/**
 * Controls overlay visibility
 *
 * @param {boolean} isVisible
 */
monin.ui.Overlay.prototype.setVisible = function(isVisible)
{
    if (!this.isInDocument())
    {
        this.render(document.body);
    }

    goog.dom.classes.enable(this.getElement(), 'visible', isVisible);
    goog.dom.classes.enable(document.body, 'body-overlay', isVisible);
};
