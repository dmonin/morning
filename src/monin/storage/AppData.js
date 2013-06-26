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
 * @fileoverview Client storage to be used as registry for local user settings.
 */

goog.provide('monin.storage.AppData');
goog.require('goog.storage.ExpiringStorage');
goog.require('goog.storage.mechanism.mechanismfactory');

/**
 * @constructor
 * @extends {goog.storage.ExpiringStorage}
 */
monin.storage.AppData = function()
{
    var mechanism = /** @type {!goog.storage.mechanism.Mechanism} */ (goog.storage.mechanism.mechanismfactory.create('appdata'));
    goog.base(this, mechanism);
};
goog.inherits(monin.storage.AppData, goog.storage.ExpiringStorage);

goog.addSingletonGetter(monin.storage.AppData);
