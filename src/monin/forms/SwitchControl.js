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
 * @fileoverview Switch control defines, similar to checkbox.
 */
goog.provide('monin.forms.SwitchControl');

goog.require('monin.forms.AbstractControl');
goog.require('goog.ui.registry');
goog.require('monin.forms.IControl');


/**
 * A switch control
 *
 * @extends {monin.forms.AbstractControl}
 * @implements {monin.forms.IControl}
 * @constructor
 */
monin.forms.SwitchControl = function()
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
goog.inherits(monin.forms.SwitchControl, monin.forms.AbstractControl);

/** @inheritDoc */
monin.forms.SwitchControl.prototype.enterDocument = function()
{
  goog.base(this, 'enterDocument');

  this.getHandler().listen(this.getElement(),
    goog.events.EventType.CLICK,
    this.handleClick_);
};

/**
 * @inheritDoc
 */
monin.forms.SwitchControl.prototype.getValue = function()
{
  return this.isChecked_ ? "1" : "0";
};

/**
 * Handles click on the element
 *
 * @param  {goog.events.Event} e
 * @private
 */
monin.forms.SwitchControl.prototype.handleClick_ = function(e)
{
  this.setChecked_(!this.isChecked_);
};

/** @inheritDoc */
monin.forms.SwitchControl.prototype.setValue = function(value)
{
  this.setChecked_(!!value);
};

/**
 * Sets whether switch is currently active (checked).
 *
 * @param {boolean} isChecked
 * @private
 */
monin.forms.SwitchControl.prototype.setChecked_ = function(isChecked)
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
    return new monin.forms.SwitchControl();
});
