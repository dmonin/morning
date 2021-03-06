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
goog.provide('morning.ui.Button');

goog.require('goog.style');
goog.require('goog.ui.Component');
goog.require('goog.ui.Component.EventType');
goog.require('morning.events.TapProvider');
goog.require('goog.ui.registry');
goog.require('goog.dom.dataset')

/**
* Button component
*
* @constructor
* @param {string=} opt_text
* @param {string=} opt_value
* @extends {goog.ui.Component}
* @deprecated Use goog.ui.Button instead
*/
morning.ui.Button = function(opt_text, opt_value)
{
  goog.base(this);

  /**
  * Provides tap functionality for button
  *
  * @type {morning.events.TapProvider}
  * @private
  */
  this.tapProvider_ = null;

  /**
  * Button value
  *
  * @type {string}
  * @private
  */
  this.value_ = opt_value || '';

  /**
  * Defines internally whether button is enabled
  *
  * @type {boolean}
  * @private
  */
  this.isEnabled_ = true;

  /**
  * Defines button text label
  *
  * @type {string}
  * @private
  */
  this.text_ = opt_text || '';
};
goog.inherits(morning.ui.Button, goog.ui.Component);

/** @inheritDoc */
morning.ui.Button.prototype.createDom = function()
{
  var cls = 'button';
  if (this.value_)
  {
    cls += ' button-' + this.value_.replace(/[^a-z]/gi, '');
  }

  if (this.isEnabled_)
  {
    cls += ' enabled';
  }

  var el = this.getDomHelper().createDom('div', cls, this.text_);
  this.decorateInternal(el);
};

/** @inheritDoc */
morning.ui.Button.prototype.decorateInternal = function(el)
{
  goog.base(this, 'decorateInternal', el);

  if (goog.dom.dataset.get(el, 'value'))
  {
    this.value_ = /** @type {string} */ (goog.dom.dataset.get(el, 'value'));
  }
  else
  {
    var matches = el.className.match('button-([a-z-]+)');
    if (matches)
    {
      this.value_ = matches[1];
    }
  }

  if (this.getHandlerElement())
  {
    this.isEnabled_ = goog.dom.classlist.contains(this.getHandlerElement(), 'enabled');
  }
};

/** @inheritDoc */
morning.ui.Button.prototype.disposeInternal = function()
{
  goog.base(this, 'disposeInternal');
  goog.dispose(this.tapProvider_);
};

/**
* Returns button value
*
* @return {string}
*/
morning.ui.Button.prototype.getValue = function()
{
  return this.value_;
};

/** @inheritDoc */
morning.ui.Button.prototype.enterDocument = function()
{
  goog.base(this, 'enterDocument');

  this.tapProvider_ = morning.events.TapProvider.attach(this.getElement());

  this.getHandler().listen(this.getHandlerElement(),
    goog.events.EventType.CLICK,
    this.getClickHandler());
};

/**
* Returns click handler function
*
* @return {Function}
* @protected
*/
morning.ui.Button.prototype.getClickHandler = function()
{
  return this.handleClick;
};

/**
* Returns click handler element
*
* @return {Element}
*/
morning.ui.Button.prototype.getHandlerElement = function()
{
  return this.getElement();
};

/**
* Handles click event
*
* @param {goog.events.BrowserEvent=} e
* @protected
*/
morning.ui.Button.prototype.handleClick = function(e)
{
  if (e)
  {
    e.preventDefault();
  }

  if (this.isEnabled_)
  {
    this.dispatchEvent(goog.ui.Component.EventType.ACTION);
  }
};

/**
 * Returns true if button is enabled
 *
 * @return {boolean}
 */
morning.ui.Button.prototype.isEnabled = function()
{
  return this.isEnabled_;
}

/**
* Specifies whether element is enabled
*
* @param {boolean} isEnabled
*/
morning.ui.Button.prototype.setEnabled = function(isEnabled)
{
  this.isEnabled_ = isEnabled;
  if (this.getElement())
  {
    goog.dom.classlist.enable(this.getElement(), 'enabled', isEnabled);
  }
};

/**
* Specifies element visibility
*
* @param {boolean} isVisible
*/
morning.ui.Button.prototype.setVisible = function(isVisible)
{
  goog.dom.classlist.enable(this.getElement(), 'visible', isVisible);
};

/**
* Sets button text
*
* @param {string} text
*/
morning.ui.Button.prototype.setText = function(text)
{
  this.text_ = text;

  if (this.getElement())
  {
    this.getContentElement().innerHTML = text;
  }
};

/**
* Sets button value
*
* @param {string} value
*/
morning.ui.Button.prototype.setValue = function(value)
{
  this.value_ = value;
};

/**
 * Register this control so it can be created from markup.
 */
goog.ui.registry.setDecoratorByClassName(
  'button',
  function() {
    return new morning.ui.Button();
});
