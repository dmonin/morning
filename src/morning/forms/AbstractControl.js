// Copyright 2012 Dmitry morning. All Rights Reserved.
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
 * @fileoverview Abstract form control
 *
 */
goog.provide('morning.forms.AbstractControl');

goog.require('goog.ui.Component');
goog.require('morning.forms.IControl');
goog.require('goog.dom.classlist');
goog.require('goog.dom.dataset');

/**
 * Abstract form control
 *
 * @constructor
 * @param {string=} opt_fieldName
 * @implements {morning.forms.IControl}
 * @extends {goog.ui.Component}
 */
morning.forms.AbstractControl = function(opt_fieldName)
{
  goog.base(this);

  /**
   * @type {string}
   * @protected
   */
  this.fieldName = opt_fieldName || '';
};
goog.inherits(morning.forms.AbstractControl, goog.ui.Component);

/** @inheritDoc */
morning.forms.AbstractControl.prototype.decorateInternal = function(el)
{
  goog.base(this, 'decorateInternal', el);

  var name = /** @type {string} */ (goog.dom.dataset.get(el, 'name'));
  if (name)
  {
    this.fieldName = name;
  }
  else if (el.name)
  {
    this.fieldName = el.name;
  }
};

/**
 * Returns control's name
 *
 * @return {string}
 */
morning.forms.AbstractControl.prototype.getFieldName = function()
{
  return this.fieldName;
};

/**
 * Returns control's value
 *
 * @return {*}
 */
morning.forms.AbstractControl.prototype.getValue = goog.abstractMethod;

/**
 * Resets control value to it's default value
 */
morning.forms.AbstractControl.prototype.reset = goog.abstractMethod;

/**
 * Sets control configuration
 *
 * @param {Object} config
 */
morning.forms.AbstractControl.prototype.setConfig = function(config)
{
  if (config['fieldName'])
  {
    this.fieldName = config['fieldName'];
  }
};

/**
 * Sets control value
 *
 * @param {*} value
 */
morning.forms.AbstractControl.prototype.setValue = goog.abstractMethod;

/**
 * Sets control state to invalid
 * @param {boolean} isInvalid
 */
morning.forms.AbstractControl.prototype.setInvalid = function(isInvalid)
{
  goog.dom.classlist.enable(this.getElement(), 'invalid', isInvalid);
};
