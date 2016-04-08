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
 * @fileoverview Overlay component
 * Displayed darked / lighten overlay over the page. Prevents other elements from clicking.
 */
goog.provide('morning.ui.Overlay');

goog.require('goog.ui.Component');

/**
 * Overlay component
 *
 * @constructor
 * @extends {goog.ui.Component}
 */
morning.ui.Overlay = function()
{
  goog.base(this);
};
goog.inherits(morning.ui.Overlay, goog.ui.Component);

goog.addSingletonGetter(morning.ui.Overlay);

/** @inheritDoc */
morning.ui.Overlay.prototype.createDom = function()
{
  var domHelper = this.getDomHelper();
  var el = domHelper.createDom('div', 'overlay');

  this.decorateInternal(el);
};

/** @inheritDoc */
morning.ui.Overlay.prototype.enterDocument = function()
{
  goog.base(this, 'enterDocument');

  this.getHandler().listen(this.getElement(), goog.events.EventType.CLICK,
    this.handleClick_);
};

/** @inheritDoc */
morning.ui.Overlay.prototype.exitDocument = function()
{
  goog.base(this, 'exitDocument');

  goog.dom.classlist.remove(document.body, 'body-overlay');
};

/**
 * Handles click events
 *
 * @param {goog.events.Event} e
 * @private
 */
morning.ui.Overlay.prototype.handleClick_ = function(e)
{
  if (this.dispatchEvent(goog.ui.Component.EventType.CLOSE))
  {
    this.setVisible(false);
  }
};

/**
 * Controls overlay visibility
 *
 * @param {boolean} isVisible
 */
morning.ui.Overlay.prototype.setVisible = function(isVisible)
{
  if (!this.isInDocument())
  {
    this.render(document.body);
  }

  goog.dom.classlist.enable(this.getElement(), 'visible', isVisible);
  goog.dom.classlist.enable(document.body, 'body-overlay', isVisible);
};
