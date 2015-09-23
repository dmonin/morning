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
 * @fileoverview Length Unit Conversion
 * Currently supports miles / km
 */
goog.provide('morning.measure.Length');

goog.require('morning.measure.AbstractMeasure');

/**
 * Length Unit Conversion
 *
 * @constructor
 * @extends {morning.measure.AbstractMeasure}
 */
morning.measure.Length = function()
{
    goog.base(this);

    var unitType = morning.measure.Length.UnitType;

    this.units_ = {};
    this.units_[unitType.KM] = [];
    this.units_[unitType.MILE] = [['/', 1.609344]];
};
goog.inherits(morning.measure.Length, morning.measure.AbstractMeasure);

/**
 * @return {Array.<string>}
 */
morning.measure.Length.prototype.getUnitTypes = function()
{
    return goog.object.getValues(morning.measure.Length.UnitType);
};

morning.measure.Length.UnitType = {
    KM: 'km',
    MILE: 'mile'
};
