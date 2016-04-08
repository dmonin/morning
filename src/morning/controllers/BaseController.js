// Copyright 2012 Dmitry Monin. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

goog.provide('morning.controllers.BaseController');

goog.require('goog.events.EventTarget');
goog.require('goog.events.EventHandler');

/**
 *
 * @constructor
 * @extends {goog.events.EventTarget}
 */
morning.controllers.BaseController = function()
{
  goog.base(this);

  /**
   * Event Handler
   *
   * @type {goog.events.EventHandler}
   * @private
   */
  this.handler_ = new goog.events.EventHandler(this);
};

goog.inherits(morning.controllers.BaseController,
  goog.events.EventTarget);

/** @inheritDoc */
morning.controllers.BaseController.prototype.disposeInternal = function()
{
  goog.base(this, 'disposeInternal');
  goog.dispose(this.handler_);
};

/**
 * Initializes controller
 *
 * @param {Object} config
 */
morning.controllers.BaseController.prototype.initialize = function(config)
{

};

/**
 * Returns the Event handler for this controller
 *
 * @return {goog.events.EventHandler}
 */
morning.controllers.BaseController.prototype.getHandler = function()
{
  return this.handler_;
};
