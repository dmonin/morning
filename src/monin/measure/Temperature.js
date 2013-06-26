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
 * @fileoverview Temperature Unit Conversion
 * Currently supports celcius / fahrenheit
 */

goog.provide('monin.measure.Temperature');

goog.require('monin.measure.AbstractMeasure');

/**
 * Temperature Unit Conversion
 *
 * @constructor
 * @extends {monin.measure.AbstractMeasure}
 */
monin.measure.Temperature = function()
{
    goog.base(this);

    var unitType = monin.measure.Temperature.UnitType;

    this.units_ = {};
    this.units_[unitType.CELCIUS] = [['-', 273.15]];
    this.units_[unitType.FAHRENHEIT] = [['+', 32], ['*', 1.8], ['-', 273.15]];
};
goog.inherits(monin.measure.Temperature, monin.measure.AbstractMeasure);

/**
 * @return {Array.<string>}
 */
monin.measure.Temperature.prototype.getUnitTypes = function()
{
    return goog.object.getValues(monin.measure.Temperature.UnitType);
};

/**
 * Unit type enumeration
 *
 * @enum {string}
 */
monin.measure.Temperature.UnitType = {
    CELCIUS: 'celcius',
    FAHRENHEIT: 'fahrenheit'
};
