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
 * @fileoverview Length Unit Conversion
 * Currently supports miles / km
 */
goog.provide('monin.measure.Length');

goog.require('monin.measure.AbstractMeasure');

/**
 * Length Unit Conversion
 *
 * @constructor
 * @extends {monin.measure.AbstractMeasure}
 */
monin.measure.Length = function()
{
    goog.base(this);

    var unitType = monin.measure.Length.UnitType;

    this.units_ = {};
    this.units_[unitType.KM] = [];
    this.units_[unitType.MILE] = [['/', 1.609344]];
};
goog.inherits(monin.measure.Length, monin.measure.AbstractMeasure);

/**
 * @return {Array.<string>}
 */
monin.measure.Length.prototype.getUnitTypes = function()
{
    return goog.object.getValues(monin.measure.Length.UnitType);
};

monin.measure.Length.UnitType = {
    KM: 'km',
    MILE: 'mile'
};
