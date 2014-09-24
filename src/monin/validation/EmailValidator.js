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
 * @fileoverview Email Validator.
 * Validates email for correct format.
 */

goog.provide('monin.validation.EmailValidator');

goog.require('goog.format.EmailAddress');
goog.require('monin.validation.Validator');

/**
 * Email Validator
 *
 * @constructor
 * @param {string} fieldName
 * @param {string} errorMessage
 * @extends {monin.validation.Validator}
 */
monin.validation.EmailValidator = function(fieldName, errorMessage)
{
    goog.base(this, fieldName, errorMessage);

};
goog.inherits(monin.validation.EmailValidator,
    monin.validation.Validator);

/** @inheritDoc */
monin.validation.EmailValidator.prototype.validate = function(formData)
{
    var value = formData[this.fieldName];

    var emailRe = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    this.isValid = this.isEmpty(value) ||
        !!value.match(emailRe);

    this.dispatchEvent(monin.validation.Validator.EventType.VALIDATOR_COMPLETE);
};
