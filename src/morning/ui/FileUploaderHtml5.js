goog.provide('morning.ui.FileUploaderHtml5');

goog.require('goog.events.FileDropHandler');
goog.require('goog.json');
goog.require('goog.ui.Component');
goog.require('morning.ui.FileUploader');
goog.require('goog.dom.classlist');

/**
* @fileoverview SWF File Uploader, based on YUI SWF Uploader
*/

/**
* HTML5 File Uploader
*
* @constructor
* @extends {morning.ui.FileUploader}
*/
morning.ui.FileUploaderHtml5 = function()
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

  /**
   * Drop Target
   *
   * @type {Element}
   * @private
   */
  this.dropTarget_ = null;
};
goog.inherits(morning.ui.FileUploaderHtml5, morning.ui.FileUploader);

/**
* @inheritDoc
*/
morning.ui.FileUploaderHtml5.prototype.createDom = function()
{
  var domHelper = this.getDomHelper();
  var el = domHelper.createDom('div', 'file-uploader');
  this.decorateInternal(el);
};

/** @inheritDoc */
morning.ui.FileUploaderHtml5.prototype.decorateInternal = function(el)
{
  goog.base(this, 'decorateInternal', el);

  this.fileInput_ = this.getDomHelper().createDom('input', {
    type: 'file'
  });
  el.appendChild(this.fileInput_);
  this.fileInput_.style.left = '0';
  this.fileInput_.style.right = '0';
  this.fileInput_.style.top = '0';
  this.fileInput_.style.bottom = '0';
  this.fileInput_.style.opacity = '0';
  this.fileInput_.style.position = 'absolute';

  if (this.allowMultiple_)
  {
    this.setMultiple(this.allowMultiple_);
  }
};

/** @inheritDoc */
morning.ui.FileUploaderHtml5.prototype.enterDocument = function()
{
  goog.base(this, 'enterDocument');

  this.getHandler().listen(this.fileInput_, goog.events.EventType.CHANGE,
    this.handleSelect_);


  var doc = goog.dom.getDocument();

  // Add dragover listener to the owner document of the element only if the
  // document is not the element itself.
  this.getHandler().listen(doc, goog.events.EventType.DRAGENTER,
    this.handleDocDragStart_);

  this.getHandler().listen(doc, goog.events.EventType.DRAGLEAVE,
    this.handleDocDragEnd_);
};



/**
* Creates File Model from File data
*
* @param {Array.<Object>} fileData
* @private
*/
morning.ui.FileUploaderHtml5.prototype.filesFactory_ = function(fileData)
{
  var files = [];

  for (var i = 0; i < fileData.length; i++)
  {
    files.push(new morning.ui.FileUploader.File(fileData[i]['name'],
      fileData[i]['size'], fileData[i]));
  }

  return files;
};

/**
* @param {goog.events.Event} e
* @private
*/
morning.ui.FileUploaderHtml5.prototype.handleDocDragStart_ = function(e)
{
  console.debug('doc drag start');
  goog.dom.classlist.add(this.dropTarget_, 'file-doc-drag-ready');
};

/**
* @param  {goog.events.Event} e
* @private
*/
morning.ui.FileUploaderHtml5.prototype.handleDocDragEnd_ = function(e)
{
  console.debug('doc drag end');
  goog.dom.classlist.remove(this.dropTarget_, 'file-doc-drag-ready');
};

/**
* @param  {goog.events.Event} e
* @private
*/
morning.ui.FileUploaderHtml5.prototype.handleElemDragOver_ = function(e)
{
  console.debug('over', this.dropTarget_);
  goog.dom.classlist.add(this.dropTarget_, 'file-drag-over');
};

/**
* @param  {goog.events.Event} e
* @private
*/
morning.ui.FileUploaderHtml5.prototype.handleElemDragLeave_ = function(e)
{
  console.debug('leave', this.dropTarget_);
  goog.dom.classlist.remove(this.dropTarget_, 'file-drag-over');
};

/**
* Handles dropped file
*
* @param {goog.events.BrowserEvent} e
* @private
*/
morning.ui.FileUploaderHtml5.prototype.handleFileDrop_ = function(e)
{
  var browserEvt = e.getBrowserEvent();
  var files = browserEvt.dataTransfer.files;

  this.dispatchEvent({
    type: morning.ui.FileUploaderHtml5.EventType.DROP,
    files: this.filesFactory_(files)
  });
};

/**
* Handles upload complete event
*
* @param {goog.events.Event} e
* @private
*/
morning.ui.FileUploaderHtml5.prototype.handleLoadComplete_ = function(e)
{
  var success = false;
  try
  {
    var responseText = /** @type {string} */ (e.target.responseText);
    var response = goog.json.parse(responseText);
    if (e.target['status'] != 200)
    {
      var msg = response['error'] ? response['error']['message'] : 'Unknown error';
      throw new Error('Upload error: ' + msg);
    }
    success = true;
  }
  catch (exc)
  {
    if (goog.DEBUG)
    {
      console.warn('File upload error: ' + exc.message);
    }
    this.dispatchEvent({
      type: morning.ui.FileUploader.EventType.ERROR,
      data: response
    });
  }

  if (success)
  {
    this.dispatchEvent({
      type: morning.ui.FileUploader.EventType.COMPLETE,
      data: response
    });
  }

};

/**
* Handles upload progress event
*
* @param {goog.events.BrowserEvent} e
* @private
*/
morning.ui.FileUploaderHtml5.prototype.handleProgress_ = function(e)
{
  var browserEvt = e.getBrowserEvent();
  var progress = browserEvt['total'] > 0 ?
    (browserEvt['loaded'] / browserEvt['total']) : 0;

  this.dispatchEvent({
    type: morning.ui.FileUploader.EventType.PROGRESS,
    progress: progress
  });
};

/**
* Handles File Select event
*
* @param {goog.events.BrowserEvent} e
* @private
*/
morning.ui.FileUploaderHtml5.prototype.handleSelect_ = function(e)
{
  this.dispatchEvent({
    type: morning.ui.FileUploader.EventType.SELECT,
    files: this.filesFactory_(e.target.files)
  });
};

/**
 * Resets selected value
 */
morning.ui.FileUploaderHtml5.prototype.resetValue = function()
{
  this.fileInput_.value = '';
};

/**
 * Opens file select dialog.
 */
morning.ui.FileUploaderHtml5.prototype.openFileSelectDialog = function()
{
  this.fileInput_.click();
};

/** @inheritDoc */
morning.ui.FileUploaderHtml5.prototype.send = function(url, files, opt_data)
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
morning.ui.FileUploaderHtml5.prototype.setDropTarget = function(target)
{
  if (this.fileDropHandler_)
  {
    this.fileDropHandler_.dispose();
  }
  this.dropTarget_ = target;

  this.fileDropHandler_ = new goog.events.FileDropHandler(target, true);
  this.getHandler().listen(this.fileDropHandler_,
  goog.events.FileDropHandler.EventType.DROP, this.handleFileDrop_);

  // Add dragover and drop listeners to the element.
  this.getHandler().listen(target, goog.events.EventType.DRAGENTER,
    this.handleElemDragOver_);

  this.getHandler().listen(target, goog.events.EventType.DRAGLEAVE,
    this.handleElemDragLeave_);
};

/**
* @param {boolean} isMultiple
*/
morning.ui.FileUploaderHtml5.prototype.setMultiple = function(isMultiple)
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
morning.ui.FileUploaderHtml5.EventType = {
  DROP: 'drop'
};
