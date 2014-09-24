goog.provide('monin.ui.FileUploaderHtml5');

goog.require('goog.events.FileDropHandler');
goog.require('goog.json');
goog.require('goog.ui.Component');
goog.require('monin.ui.FileUploader');

/**
 * @fileoverview SWF File Uploader, based on YUI SWF Uploader
 */

/**
 * HTML5 File Uploader
 *
 * @constructor
 * @extends {monin.ui.FileUploader}
 */
monin.ui.FileUploaderHtml5 = function()
{
    goog.base(this);

    /**
     * HTML5 File Drop handler
     *
     * @type {goog.events.FileDropHandler}
     * @private
     */
    this.fileDropHandler_ = null;

    /**
     * File Input element for file selection
     *
     * @type {Element}
     * @private
     */
    this.fileInput_ = null;

    /**
     * @type {boolean}
     * @private
     */
    this.allowMultiple_ = false;
};
goog.inherits(monin.ui.FileUploaderHtml5, monin.ui.FileUploader);

/**
 * @inheritDoc
 */
monin.ui.FileUploaderHtml5.prototype.createDom = function()
{
    var domHelper = this.getDomHelper();
    var el = domHelper.createDom('div', 'file-uploader');
    this.decorateInternal(el);
};

/** @inheritDoc */
monin.ui.FileUploaderHtml5.prototype.decorateInternal = function(el)
{
    goog.base(this, 'decorateInternal', el);

    this.fileInput_ = this.getDomHelper().createDom('input', {
        type: 'file'
    });
    el.appendChild(this.fileInput_);
    this.fileInput_.style.left = '-9999px';
    this.fileInput_.style.position = 'absolute';

    if (this.allowMultiple_)
    {
        this.setMultiple(this.allowMultiple_);
    }
};

/** @inheritDoc */
monin.ui.FileUploaderHtml5.prototype.enterDocument = function()
{
    goog.base(this, 'enterDocument');

    var evtType = goog.userAgent.MOBILE ? goog.events.EventType.TOUCHSTART :
                goog.events.EventType.CLICK;

    this.getHandler().listen(this.getElement(), evtType, this.handleClick_);

    this.getHandler().listen(this.fileInput_, goog.events.EventType.CHANGE,
        this.handleSelect_);


    var doc = goog.dom.getDocument();

     // Add dragenter listener to the owner document of the element.
    this.getHandler().listen(doc,
        goog.events.EventType.DRAGENTER,
        this.handleDocDragEnter_);

    // Add dragover listener to the owner document of the element only if the
    // document is not the element itself.
    this.getHandler().listen(doc,
      goog.events.EventType.DRAGOVER,
      this.handleDocDragOver_);


    // Add dragover and drop listeners to the element.
    this.getHandler().listen(this.getElement(),
                            goog.events.EventType.DRAGOVER,
                            this.handleElemDragOver_);
};



/**
 * Creates File Model from File data
 *
 * @param {Array.<Object>} fileData
 * @private
 */
monin.ui.FileUploaderHtml5.prototype.filesFactory_ = function(fileData)
{
    var files = [];

    for (var i = 0; i < fileData.length; i++)
    {
        files.push(new monin.ui.FileUploader.File(fileData[i]['name'], fileData[i]['size'], fileData[i]));
    }

    return files;
};

/**
 * Handles click event and opens file select dialog
 *
 * @param {goog.events.BrowserEvent} e
 * @private
 */
monin.ui.FileUploaderHtml5.prototype.handleClick_ = function(e)
{
    this.fileInput_.click();
};

/**
 * @param {goog.events.Event} e
 * @private
 */
monin.ui.FileUploaderHtml5.prototype.handleDocDragEnter_ = function(e)
{
    //console.log('doc drag enter');
};

/**
 * @param {goog.events.Event} e
 * @private
 */
monin.ui.FileUploaderHtml5.prototype.handleDocDragOver_ = function(e)
{
    //console.log('doc drag over');
};

/**
 * @param  {goog.events.Event} e
 * @private
 */
monin.ui.FileUploaderHtml5.prototype.handleElemDragOver_ = function(e)
{
    //console.log('elem drag over');
};

/**
 * Handles dropped file
 *
 * @param {goog.events.BrowserEvent} e
 * @private
 */
monin.ui.FileUploaderHtml5.prototype.handleFileDrop_ = function(e)
{
    var browserEvt = e.getBrowserEvent();
    var files = browserEvt.dataTransfer.files;

    this.dispatchEvent({
        type: monin.ui.FileUploaderHtml5.EventType.DROP,
        files: this.filesFactory_(files)
    });
};

/**
 * Handles upload complete event
 *
 * @param {goog.events.Event} e
 * @private
 */
monin.ui.FileUploaderHtml5.prototype.handleLoadComplete_ = function(e)
{
    var responseText = /** @type {string} */ (e.target.responseText);
    this.dispatchEvent({
        type: monin.ui.FileUploader.EventType.COMPLETE,
        data: goog.json.parse(responseText)
    });
};

/**
 * Handles upload progress event
 *
 * @param {goog.events.BrowserEvent} e
 * @private
 */
monin.ui.FileUploaderHtml5.prototype.handleProgress_ = function(e)
{
    var browserEvt = e.getBrowserEvent();
    var progress = browserEvt['total'] > 0 ? (browserEvt['loaded'] / browserEvt['total']) : 0;

    this.dispatchEvent({
        type: monin.ui.FileUploader.EventType.PROGRESS,
        progress: progress
    });
};

/**
 * Handles File Select event
 *
 * @param {goog.events.BrowserEvent} e
 * @private
 */
monin.ui.FileUploaderHtml5.prototype.handleSelect_ = function(e)
{
    this.dispatchEvent({
        type: monin.ui.FileUploader.EventType.SELECT,
        files: this.filesFactory_(e.target.files)
    });
};

/** @inheritDoc */
monin.ui.FileUploaderHtml5.prototype.send = function(url, files, opt_data)
{
    var formData = new FormData();

    for (var i = 0; i < files.length; i++)
    {
        formData.append('file' + i, files[i].original);
    }

    if (opt_data)
    {
        for (var i in opt_data)
        {
            formData.append(i, opt_data[i]);
        }
    }

    var xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);

    this.getHandler().listen(xhr, goog.events.EventType.LOAD, this.handleLoadComplete_);
    this.getHandler().listen(xhr.upload, 'progress', this.handleProgress_);

    xhr.send(formData);

    return xhr;
};

/**
 * Sets drop target
 *
 * @param {Element} target
 */
monin.ui.FileUploaderHtml5.prototype.setDropTarget = function(target)
{
    if (this.fileDropHandler_)
    {
        this.fileDropHandler_.dispose();
    }

    this.fileDropHandler_ = new goog.events.FileDropHandler(target, true);
    this.getHandler().listen(this.fileDropHandler_,
        goog.events.FileDropHandler.EventType.DROP,
        this.handleFileDrop_);
};

/**
 * @param {boolean} isMultiple
 */
monin.ui.FileUploaderHtml5.prototype.setMultiple = function(isMultiple)
{
    this.allowMultiple_ = isMultiple;

    if (this.fileInput_)
    {
        this.fileInput_.multiple = isMultiple ? 'true' : '';
    }
};

/**
 * Enumiration for Browser events
 *
 * @enum {string}
 */
monin.ui.FileUploaderHtml5.EventType = {
    DROP: 'drop'
};
