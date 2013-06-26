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
 * @fileoverview Regular Expression Validator.
 * Validates value with specified Regular expression.
 */

goog.provide('monin.validation.RegexValidator');

goog.require('monin.validation.Validator');

/**
 * Regular Expression Validator.
 *
 * @constructor
 * @param {string} fieldName
 * @param {string} errorMessage
 * @param {RegExp} regex
 * @extends {monin.validation.Validator}
 */
monin.validation.RegexValidator = function(fieldName, errorMessage, regex)
{
    goog.base(this, fieldName, errorMessage);


    /**
     * @type {RegExp}
     * @private
     */
    this.regex_ = regex;
};
goog.inherits(monin.validation.RegexValidator,
    monin.validation.Validator);

/** @inheritDoc */
monin.validation.RegexValidator.prototype.validate = function(formData)
{
    if (!formData || typeof formData[this.fieldName] != 'string')
    {
        if (goog.DEBUG)
        {
            console.warn(formData, this.fieldName);
        }

        throw new Error('RegexValidator: Couldn\'t get control value.');
    }
    var value = formData[this.fieldName];

    this.isValid = this.isEmpty(value) || !!this.regex_.test(value);

    this.dispatchEvent(monin.validation.Validator.EventType.VALIDATOR_COMPLETE);
};
