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
 * @fileoverview File uploader factory
 */
goog.provide('monin.ui.FileUploaderFactory');

goog.require('monin.ui.FileUploaderHtml4');
goog.require('monin.ui.FileUploaderHtml5');
goog.require('goog.userAgent');

/**
 * File uploader facotry
 *
 * @constructor
 * @extends {goog.ui.Component}
 */
monin.ui.FileUploaderFactory = function()
{

};

/**
 * Returns new instance of abstract FileUploader.
 * If Browser supports HTML5 Upload features, returns HTML5 Uploader otherwise Flash.
 *
 * @return {monin.ui.FileUploader}
 */
monin.ui.FileUploaderFactory.prototype.getInstance = function()
{
    if (typeof Modernizr.filereader == 'undefined' || typeof Modernizr.draganddrop == 'undefined')
    {
        throw new Error("monin.ui.FileUploaderFactory: Modernizr.filereader / Modernizr.draganddrop properties are not defined.");
    }

    // Checking Browser support
    if (Modernizr.filereader && Modernizr.draganddrop && !goog.userAgent.IE)
    {
        return new monin.ui.FileUploaderHtml5();
    }
    else
    {
        return new monin.ui.FileUploaderHtml4();
    }
};

