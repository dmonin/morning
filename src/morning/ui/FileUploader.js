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
 * @fileoverview Abstract file uploader
 */

goog.provide('morning.ui.FileUploader');

goog.require('goog.json');
goog.require('goog.ui.Component');
goog.provide('morning.ui.FileUploader.EventType');
goog.provide('morning.ui.FileUploader.File');

/**
 * Abstract file uploader
 *
 * @constructor
 * @extends {goog.ui.Component}
 */
morning.ui.FileUploader = function()
{
    goog.base(this);
};
goog.inherits(morning.ui.FileUploader, goog.ui.Component);

/** @inheritDoc */
morning.ui.FileUploader.prototype.createDom = function()
{
    var el = this.getDomHelper().createDom('div', 'file-uploader');
    this.decorateInternal(el);
};

/**
 * Sends file to server
 *
 * @param {string} url
 * @param {Array.<Object>} files
 * @param {Object=} opt_data
 */
morning.ui.FileUploader.prototype.send = goog.abstractMethod;

/**
 * Enumiration for event types
 *
 * @enum {string}
 */
morning.ui.FileUploader.EventType = {
    ERROR: 'error',
    PROGRESS: 'progress',
    COMPLETE: 'complete',
    SELECT: 'select'
};

/**
 * File model
 *
 * @constructor
 * @param {string} name
 * @param {number} size
 * @param {Object} original
 */
morning.ui.FileUploader.File = function(name, size, original)
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
