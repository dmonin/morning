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

goog.provide('monin.net.Navigator');

goog.require('goog.Timer');
goog.require('goog.async.ConditionalDelay');
goog.require('goog.dom.iframe');
goog.require('goog.events.EventTarget');
goog.require('goog.net.XhrIo');

/**
 * @param {string=} opt_fetchUrl
 * @constructor
 * @extends {goog.events.EventTarget}
 */
monin.net.Navigator = function(opt_fetchUrl)
{
    goog.base(this);

    /**
     * @type {string}
     * @private
     */
    this.fetchUrl_ = opt_fetchUrl || '/fetch/?url=';

    var body = /** @type {!Element} */ (goog.dom.getDocument().body);

    /**
     * @type {Element}
     * @private
     */
    this.iframe_ = /** @type {Element} */ (goog.dom.iframe.createWithContent(body));
    this.iframe_.style.width = '0px';
    this.iframe_.style.height = '0px';
    this.iframe_.style.position = 'absolute';
    this.iframe_.style.left = '-1000px';
    this.iframe_.style.top = '-1000px';


    this.iframeDoc_ = goog.dom.getFrameContentDocument(this.iframe_);

    /**
     * @type {goog.net.XhrIo}
     * @private
     */
    this.xhr_ = new goog.net.XhrIo();
    this.xhr_.setParentEventTarget(this);

    /**
     * @type {string}
     */
    this.rawBody = '';

    /**
     * @type {goog.events.EventHandler}
     * @private
     */
    this.handler_ = new goog.events.EventHandler(this);

    /**
     * @type {goog.async.ConditionalDelay}
     * @private
     */
    this.readyDelay_ = new goog.async.ConditionalDelay(this.iframeReady_, this);
    this.readyDelay_.onSuccess = goog.bind(this.dispatchLoad_, this);
    this.readyDelay_.onFailure = goog.bind(this.dispatchFailure_, this);

    this.handler_.listen(this.xhr_, goog.net.EventType.COMPLETE,
        this.handleDataLoad_);

    /**
     * @type {string}
     */
    this.url = '';
};
goog.inherits(monin.net.Navigator, goog.events.EventTarget);

/** @inheritDoc */
monin.net.Navigator.prototype.disposeInternal = function()
{
    goog.dom.removeNode(this.iframe_);
    this.iframe_ = null;
    this.iframeDoc_ = null;
    goog.dispose(this.xhr_);
    goog.dispose(this.handler_);
    this.rawBody = '';
};

/**
 * @private
 */
monin.net.Navigator.prototype.dispatchLoad_ = function()
{
    this.dispatchEvent(monin.net.Navigator.EventType.LOAD_COMPLETE);
};

/**
 * @private
 */
monin.net.Navigator.prototype.dispatchFailure_ = function()
{
    this.dispatchEvent(monin.net.Navigator.EventType.LOAD_FAILURE);
};

/**
 * @param {goog.events.Event} e
 * @private
 */
monin.net.Navigator.prototype.handleDataLoad_ = function(e)
{
    var body = e.target.getResponseText();
    this.rawBody = body;

    this.iframe_.onload = goog.bind(function() {
        if (goog.DEBUG)
        {
            console.info('Navigator: IFrame Loaded');
        }
        this.readyDelay_.start(500, 15000);
    }, this);

    if (goog.DEBUG)
    {
        console.info('Navigator: Writing content');
    }

    var iframe = /** @type {!HTMLIFrameElement} */ (this.iframe_);
    goog.dom.iframe.writeContent(iframe, body);

};

/**
 * @return {boolean}
 */
monin.net.Navigator.prototype.iframeReady_ = function()
{
    return !!this.iframeDoc_.body;
};

/**
 * @param {string} url
 */
monin.net.Navigator.prototype.navigate = function(url)
{
    this.url = url;
    this.xhr_.send(this.fetchUrl_ + encodeURIComponent(url));
};

/**
 * @param {string} selector
 * @return {Element}
 */
monin.net.Navigator.prototype.querySelector = function(selector)
{
    return goog.dom.getFrameContentDocument(this.iframe_).querySelector(selector);
};

/**
 * @param {string} selector
 * @return {NodeList}
 */
monin.net.Navigator.prototype.querySelectorAll = function(selector)
{
    return goog.dom.getFrameContentDocument(this.iframe_).querySelectorAll(selector);
};

monin.net.Navigator.EventType = {
    LOAD_COMPLETE: 'loadcomplete',
    LOAD_FAILURE: 'loadfailure'
};
