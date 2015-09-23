// Copyright 2012 Dmitry morning. All Rights Reserved.
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
 * @fileoverview Zipcode Validator.
 * Validates post code for correct format.
 */

goog.provide('morning.validation.ZipcodeValidator');

goog.require('morning.validation.Validator');

/**
 * Validates post code for correct format.
 *
 * @constructor
 * @param {string} fieldName
 * @param {string} errorMessage
 * @param {Array=} opt_countries Allowed countries, default: any
 * @extends {morning.validation.Validator}
 */
morning.validation.ZipcodeValidator = function(fieldName, errorMessage, opt_countries)
{
    goog.base(this, fieldName, errorMessage);

    /**
     * List of regular expression patterns for different countries.
     * Source: Wikipedia
     *
     * @type {Object}
     * @private
     */
    this.zipcodesRegexp_ = {
            'ar': /^[B-T]{1}[0-9]{4}[A-Z]{3}$/i,
            'at': /^[0-9]{4}$/i,
            'au': /^[0-9]{4}$/i,
            'be': /^[1-9][0-9]{3}$/i,
            'ca': /^[a-z][0-9][a-z][\s\t\-]*[0-9][a-z][0-9]$/i,
            'ch': /^[0-9]{4}$/i,
            'cn': /^[0-9]{6}$/,
            'de': /^[0-9]{5}$/i,
            'dk': /^(DK-)?[0-9]{4}$/i,
            'ee': /^[0-9]{5}$/,
            'es': /^[0-4][0-9]{4}$/,
            'fi': /^(FI-)?[0-9]{5}$/i,
            'fr': /^(0[1-9]|[1-9][0-9])[0-9][0-9][0-9]$/i,
            'in': /^[1-9]{1}[0-9]{2}(\s|-)?[0-9]{3}$/i,
            'it': /^[0-9]{5}$/,
            'is': /^[0-9]{3}$/,
            'lv': /^(LV-)?[1-9][0-9]{3}$/i,
            'mx': /^[0-9]{5}$/,
            'nl': /^[0-9]{4}.?[a-z]{2}$/i,
            'no': /^[0-9]{4}$/,
            'nz': /^[0-9]{4}$/,
            'pl': /^[0-9]{2}-[0-9]{3}$/,
            'pt': /^[0-9]{4}-[0-9]{3}$/,
            'ru': /^[0-9]{6}$/,
            'se': /^[0-9]{3}\s?[0-9]{2}$/,
            'tr': /^[0-9]{5}$/,
            'uk': /^[a-z][a-z0-9]{1,3}\s?[0-9][a-z]{2}$/i,
            'us': /^[0-9]{5}((-| )[0-9]{4})?$/
    };

    /**
     * List of allowed countries
     *
     * @type {Array.<string>}
     * @private
     */
    this.countries_ = null;

    if (opt_countries)
    {
        this.countries_ = opt_countries;
    }
};
goog.inherits(morning.validation.ZipcodeValidator,
    morning.validation.Validator);

/** @inheritDoc */
morning.validation.ZipcodeValidator.prototype.validate = function(formData)
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

    if (this.isEmpty(value))
    {
        this.isValid = true;
        this.dispatchEvent(morning.validation.Validator.EventType.VALIDATOR_COMPLETE);
        return;
    }

    var countries = this.countries_ || goog.object.getKeys(this.zipcodesRegexp_),
        regExp;
    this.isValid = false;

    for (var i = 0; i < countries.length; i++)
    {
        regExp = this.zipcodesRegexp_[countries[i]];
        this.isValid = this.isValid || !!value.match(regExp);
    }

    this.dispatchEvent(morning.validation.Validator.EventType.VALIDATOR_COMPLETE);
};
