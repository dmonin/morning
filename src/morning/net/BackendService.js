/**
 * @fileoverview Provides an interface for communicating with backend server.
 */
goog.provide('morning.net.BackendService');
goog.provide('morning.net.BackendServiceEvent');
goog.require('goog.Uri');
goog.require('goog.events.EventHandler');
goog.require('goog.events.EventTarget');
goog.require('goog.net.XhrIoPool');
goog.require('goog.structs.Map');
goog.require('goog.ui.IdGenerator');
goog.require('goog.uri.utils');

/**
 * @constructor
 * @param {string} apiEndPoint URL to Backend API Endpoint.
 * @param {boolean=} opt_withCredentials
 * @extends {goog.events.EventTarget}
 */
morning.net.BackendService = function(apiEndPoint, opt_withCredentials)
{
  goog.base(this);

  /**
   * Event Handler
   *
   * @type {goog.events.EventHandler}
   * @private
   */
  this.handler_ = new goog.events.EventHandler(this);

  /**
   * End point for the backend API
   *
   * @type {string}
   * @private
   */
  this.apiEndpoint_ = apiEndPoint;

  /**
   * Flag if credentials should be send with each request.
   *
   * @type {boolean}
   * @private
   */
  this.xhrWithCredentials_ = !!opt_withCredentials;

  /**
   * HTTP Headers which are sent with every request
   *
   * @type {goog.structs.Map}
   * @private
   */
  this.headers_ = new goog.structs.Map();

  /**
   * Stores currently open transactions into the map
   *
   * @type {goog.structs.Map}
   * @private
   */
  this.requests_ = new goog.structs.Map();

  /**
   * XHR Pool for managing connections
   *
   * @type {goog.net.XhrIoPool}
   * @private
   */
  this.xhrPool_ = new goog.net.XhrIoPool(this.headers_, 1, 15);

  /**
   * Request timeout in milliseconds.
   *
   * @type {number}
   */
  this.requestTimeout = 5000;
};
goog.inherits(morning.net.BackendService, goog.events.EventTarget);

/**
 * Sends an API-Request to the server, and calls specified callback
 * with raw json response after completion. Use morning.models.DataParser
 * class to parse response into common models.
 *
 * @param {morning.net.BackendService.ApiRequest} request
 * @param {Function=} opt_callback Callback function to be called after response
 * @param {Function=} opt_errorCallback Error-Callback function, in case
 * something went wrong and we don't have response.
 */
morning.net.BackendService.prototype.api = function(request, opt_callback,
  opt_errorCallback)
{
  var callback = opt_callback || goog.nullFunction;

  if (goog.DEBUG)
  {
    console.info('Api: Used: %d, Free: %d', this.xhrPool_.getInUseCount(),
      this.xhrPool_.getFreeCount());
  }

  if (!request)
  {
    console.error('No request object found.');
  }

  // Before request sent, maybe caching controller will cancel it and deliver
  // the data to callback function
  if (!this.dispatchEvent(new morning.net.BackendServiceEvent(
    morning.net.BackendService.EventType.BEFORE_REQUEST,
    request,
    callback,
    opt_errorCallback)))
  {
    return;
  }

  this.xhrPool_.getObject(goog.bind(this.handleXhrReady_, this,
    request, callback, opt_errorCallback));
};

/** @inheritDoc */
morning.net.BackendService.prototype.disposeInternal = function()
{
  goog.base(this, 'disposeInternal');

  goog.disposeAll(this.handler_, this.headers_, this.requests_);
};

/**
 * Returns event handler
 *
 * @return {goog.events.EventHandler}
 * @protected
 */
morning.net.BackendService.prototype.getHandler = function()
{
  return this.handler_;
};

/**
 * Handles server response, authorizes user if necessary and calls callback
 * function.
 *
 * @param  {string} transactionId unique transaction id
 * @param  {Function} callback callback for success
 * @param  {Function} errorCallback callback for errors, if not defined a global
 * error handling will be displayed
 * @param  {goog.events.Event} e
 * @private
 */
morning.net.BackendService.prototype.handleResponse_ = function(transactionId,
  callback, errorCallback, e)
{
  // Request was aborted
  var request = this.requests_.get(transactionId);
  var xhr = /** @type {goog.net.XhrIo} */ (e.target);

  // Getting request object
  // try
  // {
    // Parsing response
    var response = e.target.getResponseJson();
    if (goog.DEBUG)
    {
      console.info('API: Got response %o', response);
    }

    // Response is fine, checking what does server says
    if (response['success'] &&
      this.dispatchEvent(new morning.net.BackendServiceEvent(
        morning.net.BackendService.EventType.RESPONSE,
        request,
        callback,
        errorCallback,
        response)))
    {
      // Calling callback
      callback(response);

      if (goog.DEBUG)
      {
        console.log('%s: API: Response processed successfully', request.path);
      }

      // Dispatching an event that response has been successfully processed,
      // other controllers may cache it.
      this.dispatchEvent(new morning.net.BackendServiceEvent(
        morning.net.BackendService.EventType.RESPONSE_PROCESSED,
        request,
        callback,
        errorCallback,
        response)
      );
    }
    else
    {
      if (goog.DEBUG)
      {
        console.warn('Api: Bad response code %o', response);
      }

      // Something went wrong, dispatching error
      if (this.dispatchEvent(new morning.net.BackendServiceEvent(
          morning.net.BackendService.EventType.ERROR,
          request,
          callback,
          errorCallback,
          response)) && errorCallback)
      {
        errorCallback(response);
      }
    }
  // }
  // catch (exc)
  // {
  //   // In debug mode, we want to see it right: in browser console.
  //   if (goog.DEBUG)
  //   {
  //     console.log(xhr.getResponseText());
  //     console.error(exc);
  //     // throw exc;
  //   }

  //   if (e.target.isAbortedByUser)
  //   {
  //     this.releaseRequest_(xhr, transactionId);
  //     return;
  //   }

  //   // Something went wrong in processing of response (parsing or executing the
  //   // callback function), in case no one can solve the problem, calling
  //   // the error callback
  //   if (this.dispatchEvent(new morning.net.BackendServiceEvent(
  //       morning.net.BackendService.EventType.PROCESSING_ERROR,
  //       request,
  //       callback,
  //       errorCallback,
  //       response)) && errorCallback)
  //   {
  //     errorCallback();
  //   }
  // }
  // finally
  // {
  //   this.releaseRequest_(xhr, transactionId);
  // }
};

/**
 * Releases resources for request
 *
 * @param {goog.net.XhrIo} xhr
 * @param {string} transactionId
 * @private
 */
morning.net.BackendService.prototype.releaseRequest_ = function(xhr, transactionId)
{
  // Releasing XHR Object for futher use
  this.xhrPool_.releaseObject(xhr);
  this.requests_.remove(transactionId);
};

/**
 * Handles an event when new xhr object is ready to use.
 *
 * @param {morning.net.BackendService.ApiRequest} request
 * @param {Function} callback
 * @param {Function} errorCallback
 * @param {goog.net.XhrIo} xhr
 * @private
 */
morning.net.BackendService.prototype.handleXhrReady_ = function(request,
  callback, errorCallback, xhr)
{
  if (goog.DEBUG)
  {
    console.log('%s, Api: Preparing request %o', request.path, request);
  }

  var transactionId = request.transactionId || 'vp:' +
        goog.ui.IdGenerator.getInstance().getNextUniqueId();

  // Storing request to current request pool
  this.requests_.set(transactionId, request);
  request.xhr = xhr;

  // Chekcing if request with the same transaction id already running,
  // if yes, it's old request and we aborting that.
  var runningRequest = this.requests_.get(transactionId);
  if (runningRequest && runningRequest.xhr.isActive())
  {
    try
    {
      runningRequest.xhr.isAbortedByUser = true;
      runningRequest.xhr.abort();
    }
    catch (err)
    {
      if (goog.DEBUG)
      {
        console.warn('Abortion error: %o', err);
      }
    }
  }

  // Generating URL
  var hostAndPath = this.apiEndpoint_ + request.path;
  var url = new goog.Uri(hostAndPath);

  // GET Parameters
  var getParams = request.getParams || {};
  var getParamsStr = goog.uri.utils.buildQueryDataFromMap(getParams);
  url.setQueryData(getParamsStr, true);

  // Request-Method
  var method = request.method || 'get';

  // POST Data
  var postData = request.postData || {};
  var postDataStr = typeof postData == 'object' ?
    goog.uri.utils.buildQueryDataFromMap(postData) : postData;

  // Sending Request
  if (goog.DEBUG)
  {
    console.info('Api: Sending request %s %o %s', transactionId, request,
      url.toString());
  }

  xhr.setTimeoutInterval(this.requestTimeout);

  if (this.xhrWithCredentials_) {
    xhr.setWithCredentials(true);
  }

  this.getHandler().listenOnce(xhr, goog.net.EventType.COMPLETE,
    goog.partial(this.handleResponse_, transactionId, callback, errorCallback));

  var urlStr = url.toString();
  xhr.send(urlStr, request.method, postDataStr);

  // Request sent, dispatching event
  this.dispatchEvent(new morning.net.BackendServiceEvent(
    morning.net.BackendService.EventType.REQUEST,
    request,
    callback,
    errorCallback)
  );
};

/** @typedef {{
  path: string,
  method: (string|undefined),
  getParams: (Object|undefined),
  postData: (Object|undefined),
  transactionId: (string|undefined),
  xhr: (goog.net.XhrIo|undefined)
}} */
morning.net.BackendService.ApiRequest;

/**
 * @enum {string}
 */
morning.net.BackendService.EventType = {
  BEFORE_REQUEST: 'before_request',
  REQUEST: 'request',
  RESPONSE: 'response',
  RESPONSE_PROCESSED: 'response_processed',
  PROCESSING_ERROR: 'processing_error',
  ERROR: 'error'
};

/**
 * Backend event
 *
 * @constructor
 * @param {morning.net.BackendService.EventType} type
 * @param {morning.net.BackendService.ApiRequest} request
 * @param {Function} callback
 * @param {Function=} opt_errorCallback
 * @param {Object=} opt_response
 * @extends {goog.events.Event}
 */
morning.net.BackendServiceEvent = function(type, request, callback, opt_errorCallback,
  opt_response)
{
  goog.base(this, type);

  /**
   * @type {Object}
   */
  this.request = request;

  /**
   * @type {Function}
   */
  this.callback = callback;

  /**
   * @type {Function}
   */
  this.errorCallback = opt_errorCallback || null;

  /**
   * @type {Object}
   */
  this.response = opt_response || null;
};
goog.inherits(morning.net.BackendServiceEvent,
  goog.events.Event);
