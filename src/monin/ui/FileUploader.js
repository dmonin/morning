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
 * @fileoverview Abstract file uploader
 */

goog.provide('monin.ui.FileUploader');

goog.require('goog.json');
goog.require('goog.ui.Component');
goog.provide('monin.ui.FileUploader.EventType');
goog.provide('monin.ui.FileUploader.File');

/**
 * Abstract file uploader
 *
 * @constructor
 * @extends {goog.ui.Component}
 */
monin.ui.FileUploader = function()
{
    goog.base(this);
};
goog.inherits(monin.ui.FileUploader, goog.ui.Component);

/**
 * Sends file to server
 *
 * @param {string} url
 * @param {Array.<Object>} files
 * @param {Object=} opt_data
 */
monin.ui.FileUploader.prototype.send = goog.abstractMethod;

/**
 * Enumiration for event types
 *
 * @enum {string}
 */
monin.ui.FileUploader.EventType = {
    PROGRESS: 'progress',
    COMPLETE: 'complete',
    SELECT: 'select'
};

/**
 * File model
 *
 * @constructor
 */
monin.ui.FileUploader.File = function(name, size, original)
{
    /**
     * @type {string}
     */
    this.name = name;

    /**
     * @type {number}
     */
    this.size = size;

    /**
     * @type {Object}
     */
    this.original = original;
};
