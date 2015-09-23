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
 * @fileoverview Interface for form control element
 */

goog.provide('morning.forms.IControl');

/**
 * @interface
 */
morning.forms.IControl = function() {};

/**
 * @return {Element}
 */
morning.forms.IControl.prototype.getElement = function() {};

/**
 * @return {*}
 */
morning.forms.IControl.prototype.getValue = function() {};

/**
 * @return {string}
 */
morning.forms.IControl.prototype.getFieldName = function() {};

/**
 */
morning.forms.IControl.prototype.reset = function() {};

/**
 * @param {Object} config
 */
morning.forms.IControl.prototype.setConfig = function(config) {};

/**
 * @param {boolean} isInvalid
 */
morning.forms.IControl.prototype.setInvalid = function(isInvalid) {};

/**
 * @param {*} value
 */
morning.forms.IControl.prototype.setValue = function(value) {};