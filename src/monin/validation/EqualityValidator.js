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
 * @fileoverview Equality Validator.
 * Checks whether to values are equals (i.e. email repeat, password repeat)
 */

goog.provide('monin.validation.EqualityValidator');

goog.require('monin.validation.Validator');

/**
 * Equality Validator
 * Checks whether to values are equals (i.e. email repeat, password repeat)
 *
 * @constructor
 * @param {string} fieldName
 * @param {string} errorMessage
 * @param {string} targetField
 * @extends {monin.validation.Validator}
 */
monin.validation.EqualityValidator = function(fieldName, errorMessage, targetField)
{
    goog.base(this, fieldName, errorMessage);

    /**
     * @type {string}
     * @private
     */
    this.targetField_ = targetField;
};
goog.inherits(monin.validation.EqualityValidator, monin.validation.Validator);

/** @inheritDoc */
monin.validation.EqualityValidator.prototype.validate = function(formData)
{
    if (!formData || typeof formData[this.fieldName] != 'string')
    {
        if (goog.DEBUG)
        {
            console.warn(formData, this.fieldName);
        }

        throw new Error('RequiredFieldValidator: Couldn\'t get control value.');
    }


    this.isValid = formData[this.fieldName] == formData[this.targetField_];

    this.dispatchEvent(monin.validation.Validator.EventType.VALIDATOR_COMPLETE);
};
