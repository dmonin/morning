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
 * @fileoverview Defines a controller for automatic initialization of
 * page components.
 */

goog.provide('morning.controllers.ComponentController');
goog.require('morning.controllers.BaseController');
goog.require('goog.ui.decorate');
goog.require('goog.structs.Map');
goog.require('goog.dom.dataset');

/**
 * @constructor
 * @extends {morning.controllers.BaseController}
 */
morning.controllers.ComponentController = function()
{
  goog.base(this);

  /**
   * @type {goog.structs.Map}
   * @private
   */
  this.components_ = new goog.structs.Map();
};
goog.inherits(morning.controllers.ComponentController,
  morning.controllers.BaseController);

goog.addSingletonGetter(morning.controllers.ComponentController);

/**
 * Destroys component with specified name.
 *
 * @param  {Element} element
 * @param  {string=} opt_selector
 */
morning.controllers.ComponentController.prototype.destroy = function(element,
  opt_selector)
{
  var selector = opt_selector || '.cmp';
  var elements = element.querySelectorAll(selector);

  for (var i = 0; i < elements.length; i++)
  {
    var name = goog.dom.dataset.get(elements[i], 'name');
    var cmp = this.components_.get(name);
    if (name && cmp)
    {
      if (goog.DEBUG)
      {
        console.info('Destroyed component %o', cmp);
      }

      cmp.dispose();
      this.components_.remove(name);
    }
  }
};

/** @inheritDoc */
morning.controllers.ComponentController.prototype.disposeInternal = function()
{
  goog.base(this, 'disposeInternal');

  if (goog.DEBUG)
  {
    console.info('Disposing components: %o', this.components_.getValues());
  }

  goog.disposeAll(this.components_.getValues());
};

/**
 * Returns list of all components
 *
 * @return {Array.<goog.ui.Component>}
 */
morning.controllers.ComponentController.prototype.getAll = function()
{
  return this.components_.getValues();
};

/**
 * Returns component by specified name
 *
 * @param {string} name
 * @return {goog.ui.Component}
 */
morning.controllers.ComponentController.prototype.getComponentByName =
  function(name)
{
  return this.components_.get(name);
};


/**
 * Initializes components
 *
 * @param {Object} config
 */
morning.controllers.ComponentController.prototype.initialize =
  function(config)
{
  var element = config.element || document.body;
  var selector = config.selector || '.cmp';
  var elements = element.querySelectorAll(selector);

  for (var i = 0; i < elements.length; i++)
  {
    var name = goog.dom.dataset.get(elements[i], 'name');

    // Component already initialized.
    if (name && this.components_.get(name))
    {
      if (goog.DEBUG)
      {
        console.warn('Product with the same name already exists.');
      }
      continue;
    }
    var cmp = goog.ui.decorate(elements[i]);

    if (!cmp)
    {
      console.warn('Couldn\'t initialize component %o', elements[i]);
      continue;
    }
    else if (goog.DEBUG)
    {
      console.info('Initialized component %s: %o %o', name, cmp, elements[i]);
    }

    this.components_.set(name, cmp);
    cmp.setParentEventTarget(this);
  }
};
