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
 * @fileoverview SWF File Uploader, based on YUI SWF Uploader
 */
goog.provide('morning.ui.FileUploaderHtml4');

goog.require('goog.Uri');
goog.require('goog.dom.classlist');
goog.require('goog.json');
goog.require('goog.structs.Map');
goog.require('goog.style');
goog.require('goog.ui.Component');
goog.require('goog.ui.media.FlashObject');
goog.require('morning.ui.FileUploader');
goog.require('morning.ui.FileUploader.EventType');

/**
 * Contructor for HTML4 File Uploader
 *
 * @constructor
 * @extends {morning.ui.FileUploader}
 */
morning.ui.FileUploaderHtml4 = function()
{
    goog.base(this);

    /**
     * @type {goog.ui.media.FlashObject}
     * @private
     */
    this.swf_ = null;

    /**
     * @type {string}
     * @private
     */
    this.swfId_ = this.makeId('swf');

    /**
     * @type {boolean}
     * @private
     */
    this.isAllowMultipleFiles_ = false;

    morning.ui.FileUploaderHtml4.instances.set(this.swfId_, this);

};
goog.inherits(morning.ui.FileUploaderHtml4, morning.ui.FileUploader);


/**
 * Path to YUI Uploader SWF
 *
 * @define {string}
 */
morning.ui.FileUploaderHtml4.SWF_PATH = 'assets/swf/uploader.swf';

/**
 * Hash map with instances of uploader
 *
 * @type {goog.structs.Map}
 */
morning.ui.FileUploaderHtml4.instances = new goog.structs.Map();


/** @inheritDoc */
morning.ui.FileUploaderHtml4.prototype.decorateInternal = function(el)
{
    goog.base(this, 'decorateInternal', el);

    var swf = new goog.ui.media.FlashObject(morning.ui.FileUploaderHtml4.SWF_PATH);
    swf.setRequiredVersion('10.0.45');
    swf.setAllowScriptAccess('always');
    swf.setFlashVar('allowNetworking', 'all');
    swf.setWmode(goog.ui.media.FlashObject.Wmodes.TRANSPARENT);
    swf.setFlashVar('yId', this.swfId_);
    swf.setFlashVar('YUIBridgeCallback', 'YUIBridgeCallback');
    swf.setFlashVar('YUISwfId', this.swfId_);
    swf.render(this.getElement());

    this.swf_ = swf;
};

/** @inheritDoc */
morning.ui.FileUploaderHtml4.prototype.enterDocument = function()
{
    goog.base(this, 'enterDocument');

    var el = this.getElement();
    this.swf_.setSize(el.offsetWidth, el.offsetHeight);
};


/**
 * Returns new instance of File model by specified configuration
 *
 * @param {Array.<Object>} fileData
 * @private
 */
morning.ui.FileUploaderHtml4.prototype.filesFactory_ = function(fileData)
{
    var files = [];

    for (var i = 0; i < fileData.length; i++)
    {
        files.push(new morning.ui.FileUploader.File(fileData[i]['fileReference']['name'],
            fileData[i]['fileReference']['size'], fileData[i]));
    }

    return files;
};

/**
 * Handles file select
 *
 * @param {Object} e
 * @private
 */
morning.ui.FileUploaderHtml4.prototype.handleFileSelect_ = function(e)
{
    this.dispatchEvent({
        type: morning.ui.FileUploader.EventType.SELECT,
        files: this.filesFactory_(e['fileList'])
    });
};


/**
 * Handles SWF Events
 *
 * @param {Object} e
 */
morning.ui.FileUploaderHtml4.prototype.handleSwfEvent = function(e)
{
    switch (e.type)
    {
        case 'swfReady':
            this.initialize_();
            break;
        case 'uploadprogress':
            this.handleUploadProgress_(e);
            break;
        case 'uploadcompletedata':
            this.handleUploadCompleteData_(e);
            break;
        case 'fileselect':
            this.handleFileSelect_(e);
            break;
        default:
            if (goog.DEBUG)
            {
                console.info('SWF Event %o', e);
            }
            break;
    }
};


/**
 * Handles Upload progress
 *
 * @param {Object} e
 * @private
 */
morning.ui.FileUploaderHtml4.prototype.handleUploadProgress_ = function(e)
{
    var bytesLoaded = /** @type {number} */ e['bytesLoaded'];
    var bytesTotal = /** @type {number} */ e['bytesTotal'];

    var progress = bytesTotal > 0 ? bytesLoaded / bytesTotal : 0;
    this.dispatchEvent({
        type: morning.ui.FileUploader.EventType.PROGRESS,
        progress: progress
    });
};


/**
 * Handles upload complete event
 *
 * @param {Object} e
 * @private
 */
morning.ui.FileUploaderHtml4.prototype.handleUploadCompleteData_ = function(e)
{
    try
    {
        var response = goog.json.parse(e['data']);
        this.dispatchEvent({
            type: morning.ui.FileUploader.EventType.COMPLETE,
            data: response
        });
    }
    catch (err)
    {

    }
};

/**
 * Handles SWF initialization complete
 *
 * @private
 */
morning.ui.FileUploaderHtml4.prototype.initialize_ = function()
{
    this.swf_.getFlashElement()['setAllowMultipleFiles'](this.isAllowMultipleFiles_);
};

/** @inheritDoc */
morning.ui.FileUploaderHtml4.prototype.send = function(url, files, opt_data)
{
    try
    {
        var uri = new goog.Uri(url);

        if (opt_data)
        {
            for (var key in opt_data)
            {
                uri.setParameterValue(key, opt_data[key]);
            }
        }

    for (var i = 0; i < files.length; i++)
        {
            var file = files[i].original;

            this.swf_.getFlashElement()['upload'](file['fileId'], uri.toString(), [], 'file' + i);
        }
    }
    catch (e)
    {
        //@todo implement error handling
    }
};

/**
 * @param  {boolean} isMultiple
 */
morning.ui.FileUploaderHtml4.prototype.setMultiple = function(isMultiple)
{
    this.isAllowMultipleFiles_ = isMultiple;
    if (this.isInitialized_)
    {
        this.swf_.getFlashElement()['setAllowMultipleFiles'](isMultiple);
    }
};

/**
 * Bridge to YUI SWF
 *
 * @param {string} yId
 * @param {string} YUIBridgeCallback
 * @param {Array.<Object>} args
 */
morning.ui.FileUploaderHtml4.yuiBridge = function(yId, YUIBridgeCallback, args)
{
    var uploader = morning.ui.FileUploaderHtml4.instances.get(yId);
    uploader.handleSwfEvent(args[1]);
};

goog.exportSymbol('YUI.applyTo', morning.ui.FileUploaderHtml4.yuiBridge);

