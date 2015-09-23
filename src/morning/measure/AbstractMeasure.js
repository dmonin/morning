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
 * @fileoverview Abstract measure converter class
 */

goog.provide('morning.measure.AbstractMeasure');

/**
 * Abstract measure converter class
 *
 * @constructor
 * @extends {goog.ui.Component}
 */
morning.measure.AbstractMeasure = function()
{
    /**
     * @type {number}
     * @private
     */
    this.value_ = 0;

    /**
     * @type {Object}
     * @protected
     */
    this.units_ = {};
};

/**
 * Performs unit conversion and returns converted value
 *
 * @param  {string} type
 * @param  {number} decimals amount of decimals after comma
 * @return {number}
 */
morning.measure.AbstractMeasure.prototype.getValue = function(type, decimals)
{
    var operations = this.units_[type],
        i = operations.length,
        result = this.value_;

    while (--i >= 0)
    {
        switch (operations[i][0])
        {
            case '/':
                result /= operations[i][1];
                break;

            case '+':
                result += operations[i][1];
                break;

            case '-':
                result -= operations[i][1];
                break;

            case '*':
                result *= operations[i][1];
                break;
        }
    }

    var k = Math.pow(10, decimals);

    return Math.round(result * k) / k;
};

/**
 * Sets new value in specified units
 *
 * @param {number} value
 * @param {string} type unit type
 */
morning.measure.AbstractMeasure.prototype.setValue = function(value, type)
{
    var operations = this.units_[type], i = -1, result = value;

    while (++i < operations.length)
    {
        switch (operations[i][0])
        {
            case '/':
                result *= operations[i][1];
                break;

            case '+':
                result -= operations[i][1];
                break;

            case '-':
                result += operations[i][1];
                break;

            case '*':
                result /= operations[i][1];
                break;
        }
    }

    this.value_ = result;
};
