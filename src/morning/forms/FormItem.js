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

/**
 * @fileoverview Form item, consists of label + control
 * Bindable to model for change events.
 */

goog.provide('morning.forms.FormItem');

goog.require('goog.ui.Component');
goog.require('goog.ui.registry');

/**
 * Form item
 *
 * @constructor
 * @extends {goog.ui.Component}
 */
morning.forms.FormItem = function()
{
  goog.base(this);

  /**
   * Label
   *
   * @type {string}
   * @private
   */
  this.label_ = '';

  /**
   * Bindings for change events
   *
   * @type {Object}
   * @private
   */
  this.bind_ = null;

  /**
   * Binding handler, manages listeners attached to change events
   *
   * @type {goog.events.EventHandler}
   * @private
   */
  this.bindHandler_ = new goog.events.EventHandler(this);
};
goog.inherits(morning.forms.FormItem, goog.ui.Component);

/** @inheritDoc */
morning.forms.FormItem.prototype.createDom = function()
{
  var dom = this.getDomHelper(),
  el = dom.createDom('div', 'form-item', [
      dom.createDom('div', 'form-item-label', this.label_),
      dom.createDom('div', 'form-item-control'),
      dom.createDom('div', 'clear')
  ]);

  this.decorateInternal(el);
};

/**
 * Binds form item to data model (allowed only if form item has just one
 * control)
 *
 * @param {Object} bind Binding object
 * @return {morning.forms.FormItem}
 */
morning.forms.FormItem.prototype.bind = function(bind)
{
  this.bind_ = bind;
  var key, model;

  if (this.getChildCount() !== 1)
  {
    throw new Error("FormItem: Data binding allowed only for form items with just one control.");
  }

  for (key in bind)
  {
    model = bind[key];
    var control = this.getChildAt(0);

    if (control)
    {
      control.setValue(model[key]);
      var binding = {};
      binding[key] = function() {
        control.setValue(model[key]);
      };
      model.bind(this.bindHandler_, binding);
    }
  }

  return this;
};

/** @inheritDoc */
morning.forms.FormItem.prototype.decorateInternal = function(el)
{
  goog.base(this, 'decorateInternal', el);

  var controlEls = this.getElementsByClass('form-control');
  for (var i = 0; i < controlEls.length; i++)
  {
    var control = goog.ui.registry.getDecorator(controlEls[i]);
    if (!control)
    {
      if (goog.DEBUG)
      {
        console.warn('Decorator not found for %o', controlEls[i]);
      }
      continue;
    }
    this.addChild(control);
    control.decorate(controlEls[i]);
  }

  if (goog.DEBUG && controlEls.length === 0)
  {
    console.warn('No control found: %o', el);
  }

};

/** @inheritDoc */
morning.forms.FormItem.prototype.disposeInternal = function()
{
  goog.base(this, 'disposeInternal');

  this.unbindAll();
};

/** @inheritDoc */
morning.forms.FormItem.prototype.enterDocument = function()
{
  goog.base(this, 'enterDocument');

  this.getHandler().listen(this, goog.events.EventType.CHANGE,
    this.handleChange_);
};

/** @inheritDoc */
morning.forms.FormItem.prototype.getContentElement = function()
{
  return this.getElementByClass('form-item-control');
};

/**
 * Returns control with specified field name.
 *
 * @param  {string} name
 * @return {morning.forms.IControl}
 */
morning.forms.FormItem.prototype.getControlByName = function(name)
{
  var control = null;
  this.forEachChild(function(child) {
    if (child.getFieldName && child.getFieldName() == name)
    {
      control = child;
    }
  });

  return control;
};

/**
 * Handles change event and updates attached models.
 *
 * @param {goog.events.Event} e
 * @private
 */
morning.forms.FormItem.prototype.handleChange_ = function(e)
{
  if (e.target.getValue)
  {
    var value = e.target.getValue();

    for (var key in this.bind_)
    {
      var updateData = {};
      updateData[key] = value;
      this.bind_[key].update(updateData);
    }
  }

};

/**
 * Populates data object with controls data.
 *
 * @param {Object} data
 */
morning.forms.FormItem.prototype.populateWithData = function(data)
{
  this.forEachChild(function(child) {
    var control = /** @type {morning.forms.IControl} */ (child);
    if (control.getFieldName)
    {
      data[control.getFieldName()] = control.getValue();
    }
  });
};

/**
 * Sets form data
 *
 * @param {Object} data
 */
morning.forms.FormItem.prototype.setData = function(data)
{
  this.forEachChild(function(child) {
    var control = /** @type {morning.forms.IControl} */ (child);
    if (control.getFieldName)
    {
      control.setValue(data[control.getFieldName()] || null);
    }
  });
};

/**
 * Unbinds models.
 *
 * @param {Object} bind
 * @return {morning.forms.FormItem}
 */
morning.forms.FormItem.prototype.unbind = function(bind)
{
  this.bind_ = bind;
  var key, model;
  var control = /** @type {morning.forms.IControl} */ (this.getChildAt(0));
  for (key in bind)
  {
    model = bind[key];

    if (control)
    {
      var binding = {};
      binding[key] = function() {
        control.setValue(model[key]);
      };
      model.unbind(this.bindHandler_, binding);
    }
  }

  return this;
};

/**
 * Resets form controls to their default values.
 */
morning.forms.FormItem.prototype.reset = function()
{
  this.forEachChild(function(child) {
    if (child.reset)
    {
      child.reset();
    }
  }, this);
};

/**
 * Sets form item label.
 *
 * @param {string} label
 */
morning.forms.FormItem.prototype.setLabel = function(label)
{
  this.label_ = label;

  var el = this.getElement();
  if (el)
  {
    this.getElementByClass('form-item-label').innerHTML = label;
  }
};

/**
 * Sets or removes invalid state.
 *
 * @param {boolean} isInvalid
 */
morning.forms.FormItem.prototype.setInvalid = function(isInvalid)
{
  this.forEachChild(function(child) {
    if (child.setInvalid)
    {
      child.setInvalid(isInvalid);
    }
  }, this);
};

/**
 * Unbinds all event listeners.
 *
 * @return {morning.forms.FormItem}
 */
morning.forms.FormItem.prototype.unbindAll = function()
{
  this.bindHandler_.removeAll();
  return this;
};

/**
 * Register this control so it can be created from markup.
 */
goog.ui.registry.setDecoratorByClassName(
  'form-item',
  function() {
    return new morning.forms.FormItem();
  });
