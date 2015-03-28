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
 * @fileoverview Base Controller for content pages, supports dynamic,
 * loading of pages by url.
 */

goog.provide('monin.controllers.ContentController');
goog.require('goog.fx.easing');
goog.require('goog.module.ModuleManager');
goog.require('monin.controllers.ComponentController');
goog.require('monin.controllers.BaseController');
goog.require('monin.fx.WindowScroll');

/**
 * @constructor
 * @extends {monin.controllers.ComponentController}
 */
monin.controllers.ContentController = function()
{
  goog.base(this);

  /**
   * Content element
   *
   * @type {Element}
   * @private
   */
  this.contentElement_ = null;

  /**
   * Controls XHR Requests
   *
   * @type {goog.net.XhrIo}
   * @private
   */
  this.xhr_ = new goog.net.XhrIo();

  /**
   * Controls initialization of components.
   *
   * @type {goog.structs.Map}
   * @private
   */
  this.componentController_ = new monin.controllers.ComponentController();

  /**
   * Current state of the component.
   *
   * @type {Object}
   * @private
   */
  this.state_ = null;
};
goog.inherits(monin.controllers.ContentController,
  monin.controllers.BaseController);

/**
 * @inheritDoc
 */
monin.controllers.ContentController.prototype.disposeInternal = function()
{
  goog.base(this, 'disposeInternal');

  this.componentController_.destroy(this.contentElement_);

  this.contentElement_.innerHTML = '';

  this.xhr_.dispose();
};

/**
 * Handles load of content, renders them and initializes the content components.
 *
 * @param {goog.events.Event} e
 * @protected
 */
monin.controllers.ContentController.prototype.handleLoadComplete = function(e)
{
  // Displaying error
  if (e.target.getStatus() != 200)
  {
    if (e.target.getStatus() > 0)
    {
      this.contentElement_.innerHTML = e.target.getResponseJson().error;
    }
    return;
  }

  // Parsing response
  var xhr = e.target, response;
  try
  {
    response = xhr.getResponseJson();
  }
  catch (exc)
  {
    this.contentElement_.innerHTML = xhr.getResponseText();
    return;
  }

  this.contentElement_.innerHTML = response['html'];

  // Initializing components
  var cmpController = monin.controllers.ComponentController.getInstance();
  cmpController.initialize(this.contentElement_);

  this.dispatchEvent(goog.net.EventType.COMPLETE);
};

/**
 * Returns component by specified name
 *
 * @param  {string} name
 * @return {goog.ui.Component}
 */
monin.controllers.ContentController.prototype.getComponent = function(name)
{
  var cmp = monin.controllers.ComponentController.getInstance();
  return cmp.getComponentByName(name);
};

/**
 * Initializes controller
 *
 * @param {Object} config
 */
monin.controllers.ContentController.prototype.initialize = function(config)
{
  this.getHandler().listen(this.xhr_, goog.net.EventType.COMPLETE,
    this.handleLoadComplete);

  this.contentElement_ = document.documentElement.querySelector(
    config['container']);
  this.componentController_.initialize(this.contentElement_);
};

/**
 * Loads content from specified url
 *
 * @param  {string} url
 */
monin.controllers.ContentController.prototype.load = function(url)
{
  this.xhr_.send(url);
};

/**
 * Sets the controller's state
 *
 * @param {Object} state
 * @param {boolean} isInitial
 */
monin.controllers.ContentController.prototype.setState = function(state, isInitial)
{
  if ((!isInitial && !this.state_) ||
      (this.state_ && this.state_.token != state.token))
  {
    this.load('/' + state.token + '?format=json');

    var scrollPos = goog.dom.getDocumentScroll();
    var viewportSize = goog.dom.getViewportSize();
    var windowScroll = new monin.fx.WindowScroll(document.documentElement,
      [0, scrollPos.y], [0, 0], 500,
      goog.fx.easing.easeOut);
    windowScroll.play();
  }

  this.state_ = state;
};

goog.exportSymbol('app.module.content', monin.controllers.ContentController);

if (les.MODULAR)
{
    goog.module.ModuleManager.getInstance().setLoaded('content');
}
