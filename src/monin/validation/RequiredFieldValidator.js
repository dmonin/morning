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
 * @fileoverview Required Field Validator.
 * Verifies whether field value is not empty.
 */

goog.provide('monin.validation.RequiredFieldValidator');

goog.require('monin.validation.Validator');

/**
 * Required Field Validator
 *
 * @constructor
 * @param {string} fieldName
 * @param {string} errorMessage
 * @extends {monin.validation.Validator}
 */
monin.validation.RequiredFieldValidator = function(fieldName, errorMessage)
{
    goog.base(this, fieldName, errorMessage);
};

goog.inherits(monin.validation.RequiredFieldValidator,
    monin.validation.Validator);

/** @inheritDoc */
monin.validation.RequiredFieldValidator.prototype.validate = function(formData)
{
    if (!formData || typeof formData[this.fieldName] != 'string')
    {
        if (goog.DEBUG)
        {
            console.warn(formData, this.fieldName);
        }

        throw new Error('RequiredFieldValidator: Couldn\'t get control value for field ' + this.fieldName + '.');
    }
    this.isValid = !this.isEmpty(formData[this.fieldName]);

    this.dispatchEvent(monin.validation.Validator.EventType.VALIDATOR_COMPLETE);
};
