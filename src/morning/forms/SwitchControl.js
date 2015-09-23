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
 * @fileoverview Switch control defines, similar to checkbox.
 */
goog.provide('morning.forms.SwitchControl');

goog.require('morning.forms.AbstractControl');
goog.require('goog.ui.registry');
goog.require('morning.forms.IControl');
goog.require('goog.dom.dataset');


/**
 * A switch control
 *
 * @extends {morning.forms.AbstractControl}
 * @implements {morning.forms.IControl}
 * @constructor
 */
morning.forms.SwitchControl = function()
{
  goog.base(this);

  /**
   * Defines whether control is currently checked
   *
   * @type {boolean}
   * @private
   */
  this.isChecked_ = false;
};
goog.inherits(morning.forms.SwitchControl, morning.forms.AbstractControl);


/**
 * @inheritDoc
 */
morning.forms.SwitchControl.prototype.decorateInternal = function(el)
{
  goog.base(this, 'decorateInternal', el);

  var name = goog.dom.dataset.get(el, 'name');
  if (name)
  {
    this.fieldName = name;
  }
};

/** @inheritDoc */
morning.forms.SwitchControl.prototype.enterDocument = function()
{
  goog.base(this, 'enterDocument');

  this.getHandler().listen(this.getElement(),
    goog.events.EventType.CLICK,
    this.handleClick_);
};

/**
 * @inheritDoc
 */
morning.forms.SwitchControl.prototype.getValue = function()
{
  return this.isChecked_ ? "1" : "0";
};

/**
 * Handles click on the element
 *
 * @param  {goog.events.Event} e
 * @private
 */
morning.forms.SwitchControl.prototype.handleClick_ = function(e)
{
  this.setChecked_(!this.isChecked_);
};

/** @inheritDoc */
morning.forms.SwitchControl.prototype.setValue = function(value)
{
  this.setChecked_(!!value);
};

/**
 * Sets whether switch is currently active (checked).
 *
 * @param {boolean} isChecked
 * @private
 */
morning.forms.SwitchControl.prototype.setChecked_ = function(isChecked)
{
  if (isChecked != this.isChecked_)
  {
    this.isChecked_ = isChecked;
    goog.dom.classlist.enable(this.getElement(), 'on', this.isChecked_);

    this.dispatchEvent(goog.events.EventType.CHANGE);
    this.dispatchEvent(goog.ui.Component.EventType.ACTION);
  }
};

/**
* Register this control so it can be created from markup.
*/
goog.ui.registry.setDecoratorByClassName(
  'switch-control',
  function() {
    return new morning.forms.SwitchControl();
});
