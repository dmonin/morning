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
 * @fileoverview 3-state checkbox widget. Fires CHECK or UNCHECK events before toggled and
 * CHANGE event after toggled by user.
 * The checkbox can also be enabled/disabled and get focused and highlighted.
 */
goog.provide('monin.forms.Checkbox');

goog.require('goog.dom.dataset');
goog.require('goog.ui.Checkbox');
goog.require('monin.forms.IControl');

/**
 * 3-state checkbox widget. Fires CHECK or UNCHECK events before toggled and
 * CHANGE event after toggled by user.
 * The checkbox can also be enabled/disabled and get focused and highlighted.
 *
 * @param {goog.ui.Checkbox.State=} opt_checked Checked state to set.
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper, used for
 *     document interaction.
 * @param {goog.ui.CheckboxRenderer=} opt_renderer Renderer used to render or
 *     decorate the checkbox; defaults to {@link goog.ui.CheckboxRenderer}.
 * @constructor
 * @implements {monin.forms.IControl}
 * @extends {goog.ui.Checkbox}
 */
monin.forms.Checkbox = function(opt_checked, opt_domHelper, opt_renderer)
{
    goog.base(this, opt_checked, opt_domHelper, opt_renderer);
    /**
     * @type {string}
     * @private
     */
    this.fieldName_ = '';
};
goog.inherits(monin.forms.Checkbox, goog.ui.Checkbox);

/** @inheritDoc */
monin.forms.Checkbox.prototype.decorateInternal = function(el)
{
    goog.base(this, 'decorateInternal', el);

    this.fieldName_ = /** @type {string} */ (goog.dom.dataset.get(el, 'name'));
};

/**
 * Returns checkbox field name
 *
 * @return {string}
 */
monin.forms.Checkbox.prototype.getFieldName = function()
{
    return this.fieldName_;
};

/**
 * Returns checkbox value
 *
 * @return {*} value.
 */
monin.forms.Checkbox.prototype.getValue = function()
{
    return this.isChecked() ? '1' : '0';
};

/** @inheritDoc */
monin.forms.Checkbox.prototype.reset = function()
{
    this.setChecked(false);
};

/**
 * Sets control display to invalid state
 *
 * @param {boolean} isInvalid
 */
monin.forms.Checkbox.prototype.setInvalid = function(isInvalid)
{
    goog.dom.classes.enable(this.getElement(), 'invalid', isInvalid);
};

/**
 * Sets checkbox configugration (no configration options currently)
 */
monin.forms.Checkbox.prototype.setConfig = goog.nullFunction;

/**
 * @param {*} value
 */
monin.forms.Checkbox.prototype.setValue = function(value)
{
    value = /** @type {number} */ (value);
    this.setChecked(value == 1);
};

/**
 * Register this control so it can be created from markup.
 */
goog.ui.registry.setDecoratorByClassName(
    'checkbox',
    function() {
      return new monin.forms.Checkbox();
    });
