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
 * @fileoverview Abstract Validator class
 */


goog.provide('morning.validation.Validator');
goog.provide('morning.validation.Validator.EventType');

/**
 * @param {string} fieldName
 * @param {string} errorMessage
 * @constructor
 * @extends {goog.events.EventTarget}
 */
morning.validation.Validator = function(fieldName, errorMessage)
{
    goog.base(this);

    /**
     * Field name
     *
     * @type {string}
     */
    this.fieldName = fieldName;

    /**
     * Current validation state
     *
     * @type {boolean}
     */
    this.isValid = false;

    /**
     * @type {boolean}
     */
    this.isValidating = false;

    /**
     * @type {string}
     */
    this.errorMessage = errorMessage;
};
goog.inherits(morning.validation.Validator, goog.events.EventTarget);

/**
 * Returns true if value is empty string
 *
 * @param {string} value
 * @return {boolean}
 * @protected
 */
morning.validation.Validator.prototype.isEmpty = function(value)
{
    return !goog.string.trim(value);
};

/**
 * Performs validation
 *
 * @param {Object} formData
 */
morning.validation.Validator.prototype.validate = goog.abstractMethod;


morning.validation.Validator.EventType = {
    VALIDATOR_COMPLETE: 'validator_complete'
};
