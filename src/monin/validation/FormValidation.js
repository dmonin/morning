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
 * @fileoverview Form Validation. Validates form values for correct format.
 */

goog.provide('monin.validation.FormValidation');
goog.provide('monin.validation.FormValidationError');
goog.require('goog.events.EventHandler');
goog.require('goog.events.EventTarget');
goog.require('monin.validation.Validator');
goog.require('monin.validation.FormValidationResult');

/**
 * Form Validation contructor
 *
 * @param {Array.<monin.validation.Validator>} validators
 *
 * @constructor
 * @extends {goog.events.EventTarget}
 */
monin.validation.FormValidation = function(validators)
{
    goog.base(this);

    /**
     * @type {goog.events.EventHandler}
     * @private
     */
    this.handler_ = new goog.events.EventHandler(this);

    goog.array.forEach(validators, function(validator) {
        validator.setParentEventTarget(this);
    }, this);

    /**
     * @type {Array.<monin.validation.Validator>}
     * @private
     */
    this.validators = validators;

    this.handler_.listen(this,
        monin.validation.Validator.EventType.VALIDATOR_COMPLETE,
        this.handleValidateComplete_);
};
goog.inherits(monin.validation.FormValidation, goog.events.EventTarget);

/**
 * Handles validation complete event
 *
 * @param {goog.events.Event} e
 * @private
 */
monin.validation.FormValidation.prototype.handleValidateComplete_ =
    function(e)
{
    var errors = [], error;
    e.target.isValidating = false;
    for (var i = 0; i < this.validators.length; i++)
    {
        if (this.validators[i].isValidating)
        {
            return;
        }

        if (!this.validators[i].isValid)
        {
            error = /** @lends {monin.validation.FormValidationError} */ {
                fieldName: this.validators[i].fieldName,
                message: this.validators[i].errorMessage
            };
            errors.push(error);
        }
    }


    this.dispatchEvent({
        type: monin.validation.FormValidation.EventType.VALIDATION_COMPLETE,
        result: new monin.validation.FormValidationResult(errors)
    });
};

/**
 * Performs validation of form data
 *
 * @param {Object} formData
 */
monin.validation.FormValidation.prototype.validate = function(formData)
{
    for (var i = 0; i < this.validators.length; i++)
    {
        this.validators[i].isValidating = true;
        this.validators[i].isValid = false;
    }

    for (i = 0; i < this.validators.length; i++)
    {
        this.validators[i].validate(formData);
    }
};

/**
 * Enumeration for event types
 *
 * @enum {string}
 */
monin.validation.FormValidation.EventType = {
    VALIDATION_COMPLETE: 'validation_complete'
};

/**
 * @typedef {{
 *   fieldName: (string),
 *   message: (string)
 * }}
 */
monin.validation.FormValidationError;
