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
 * @fileoverview Abstract form control
 *
 */
goog.provide('monin.forms.AbstractControl');

goog.require('goog.ui.Component');
goog.require('monin.forms.IControl');
goog.require('goog.dom.classes');

/**
 * Abstract form control
 *
 * @constructor
 * @param {string=} opt_fieldName
 * @implements {monin.forms.IControl}
 * @extends {goog.ui.Component}
 */
monin.forms.AbstractControl = function(opt_fieldName)
{
    goog.base(this);

    /**
     * @type {string}
     * @protected
     */
    this.fieldName_ = opt_fieldName || '';
};

goog.inherits(monin.forms.AbstractControl, goog.ui.Component);

/**
 * Returns control's name
 *
 * @return {string}
 */
monin.forms.AbstractControl.prototype.getFieldName = function()
{
    return this.fieldName_;
};

/**
 * Returns control's value
 *
 * @return {*}
 */
monin.forms.AbstractControl.prototype.getValue = goog.abstractMethod;

/**
 * Resets control value to it's default value
 */
monin.forms.AbstractControl.prototype.reset = goog.abstractMethod;

/**
 * Sets control configuration
 *
 * @param {Object} config
 */
monin.forms.AbstractControl.prototype.setConfig = goog.abstractMethod;

/**
 * Sets control value
 *
 * @param {*} value
 */
monin.forms.AbstractControl.prototype.setValue = goog.abstractMethod;

/**
 * Sets control state to invalid
 * @param {boolean} isInvalid
 */
monin.forms.AbstractControl.prototype.setInvalid = function(isInvalid)
{
    goog.dom.classes.enable(this.getElement(), 'invalid', isInvalid);
};
