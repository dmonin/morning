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
 * @fileoverview Form component
 * Collection of form items. Handles form validation
 */

goog.provide('morning.forms.Form');

goog.require('goog.structs.Map');
goog.require('goog.ui.Component');
goog.require('goog.ui.registry');
goog.require('morning.forms.FormItem');
goog.require('morning.validation.FormValidation');

/**
 * Form component
 *
 * @constructor
 * @param {morning.forms.ControlFactory=} opt_controlFactory
 * @extends {goog.ui.Component}
 */
morning.forms.Form = function(opt_controlFactory)
{
  goog.base(this);

  /**
   * Form validation
   *
   * @type {morning.validation.FormValidation}
   */
  this.validation = null;

  /**
   * Form error provider
   *
   * @type {morning.forms.IErrorProvider}
   */
  this.errorProvider = null;
};
goog.inherits(morning.forms.Form, goog.ui.Component);


/**
 * Adds form item to form
 *
 * @param {string} label
 * @param {string} className
 * @param {Object=} controlConfig
 * @param {number=} opt_index
 * @return {!morning.forms.FormItem}
 */
morning.forms.Form.prototype.addFormItem = function(label, className,
  controlConfig, opt_index)
{
  controlConfig = controlConfig || {};

  var formItem = new morning.forms.FormItem();
  if (label)
  {
    formItem.setLabel(label);
  }

  var control = goog.ui.registry.getDecoratorByClassName(className);
  if (!control)
  {
    throw new Error('Decorator not found for control type "' + className + '"');
  }

  control.setConfig(controlConfig);
  formItem.addChild(control, true);

  if (typeof opt_index == 'number')
  {
    this.addChildAt(formItem, opt_index, true);
  }
  else
  {
    this.addChild(formItem, true);
  }


  return formItem;
};

/**
 * Removes all form items
 */
morning.forms.Form.prototype.removeFormItems = function()
{
  var formItems = [];
  this.forEachChild(function(child) {
    if (child instanceof morning.forms.FormItem)
    {
      formItems.push(child);
    }
  }, this);

  for (var i = 0; i < formItems.length; i++)
  {
    this.removeChild(formItems[i], true);
  }

  return formItems;
};

/**
 * @inheritDoc
 */
morning.forms.Form.prototype.createDom = function()
{
  var form = this.getDomHelper().createDom('form', 'form');
  this.decorateInternal(form);
};

/** @inheritDoc */
morning.forms.Form.prototype.decorateInternal = function(el)
{
  goog.base(this, 'decorateInternal', el);

  var items = this.getElementsByClass('form-item');
  goog.array.forEach(items, function(itemEl) {
    var formItem = goog.ui.registry.getDecorator(itemEl);
    this.addChild(formItem);
    formItem.decorate(itemEl);
  }, this);
};

/** @inheritDoc */
morning.forms.Form.prototype.disposeInternal = function()
{
  goog.base(this, 'disposeInternal');

  if (this.errorProvider)
  {
    goog.dispose(this.errorProvider);
  }

  this.unbindAll();
};

/**
 * Returns form control by specified control name
 *
 * @param {string} name
 * @return {morning.forms.IControl}
 */
morning.forms.Form.prototype.getControlByName = function(name)
{
  var found = null;
  this.forEachChild(function(formItem) {
    if (formItem.getFieldName && formItem.getFieldName() == name)
    {
      found = formItem;
    }
    else if (formItem instanceof morning.forms.FormItem)
    {
      formItem.forEachChild(function(child) {
        if (child.getFieldName && child.getFieldName() == name)
        {
          found = child;
        }
      }, this);
    }

  }, this);

  return found;
};

/**
 * Returns form item by specified control name
 *
 * @param {string} name
 * @return {morning.forms.FormItem}
 */
morning.forms.Form.prototype.getFormItemByName = function(name)
{
  var found = null;
  this.forEachChild(function(formItem) {
    if (formItem instanceof morning.forms.FormItem)
    {
      formItem.forEachChild(function(child) {
        if (child.getFieldName && child.getFieldName() == name)
        {
          found = formItem;
        }
      });
    }

  }, this);

  return found;
};

/**
 * Returns form data as object
 *
 * @return {Object}
 */
morning.forms.Form.prototype.getData = function()
{
  var data = {}, control;
  this.forEachChild(function(child) {
    if (child instanceof morning.forms.FormItem)
    {
      child.populateWithData(data);
    }
    else if (child.getFieldName)
    {
      data[child.getFieldName()] = child.getValue();
    }
  }, this);

  return data;
};

/**
 * Handles validation complete event and displays error messages
 *
 * @param {Object} e
 * @protected
 */
morning.forms.Form.prototype.handleValidationComplete = function(e)
{
  var result = /** @type {morning.validation.FormValidationResult} */ (e.result);

  if (this.errorProvider)
  {
    this.errorProvider.display(result, this);
  }
};

/**
 * Binds model to form controls
 *
 * @param {Object} bind
 */
morning.forms.Form.prototype.bind = function(bind)
{
  var formItem;
  for (var fieldName in bind)
  {
    formItem = this.getFormItemByName(fieldName);
    if (!formItem && goog.DEBUG)
    {
      console.warn('Form: Form item not found: %s', fieldName);
    }

    this.getFormItemByName(fieldName).bind(bind[fieldName]);
  }
};

/**
 * Resets form
 */
morning.forms.Form.prototype.reset = function()
{
  this.forEachChild(function(child) {
    if (typeof child.reset == 'function')
    {
      child.reset();
    }
  }, this);
};

/**
 * Validates form
 *
 */
morning.forms.Form.prototype.validate = function()
{
  if (this.errorProvider)
  {
    this.errorProvider.setVisible(false);
  }

  this.forEachChild(function(child) {
    if (typeof child.setInvalid == 'function')
    {
      child.setInvalid(false);
    }
  }, this);

  if (this.validation)
  {
    this.getHandler().listenOnce(this.validation,
        morning.validation.FormValidation.EventType.VALIDATION_COMPLETE,
        this.handleValidationComplete);

    this.validation.validate(this.getData());
  }
};

/**
 * Returns form data as object
 *
 * @param {Object} data
 */
morning.forms.Form.prototype.setData = function(data)
{
  var control;
  this.forEachChild(function(child) {
    if (child instanceof morning.forms.FormItem)
    {
      child.setData(data);
    }
    else if (child.getFieldName)
    {
      control.setValue(data[child.getFieldName()]);
    }
  }, this);
};

/**
 * Unbinds model
 *
 * @param {Object} bind
 */
morning.forms.Form.prototype.unbind = function(bind)
{
  for (var fieldName in bind)
  {
    this.getFormItemByName(fieldName).unbind(bind[fieldName]);
  }
};

/**
 * Unbinds all models
 *
 * @return {morning.forms.Form}
 */
morning.forms.Form.prototype.unbindAll = function()
{
  this.forEachChild(function(child) {
    if (child instanceof morning.forms.FormItem)
    {
      child.unbindAll();
    }
  }, this);

  return this;
};

/**
 * Register this control so it can be created from markup.
 */
goog.ui.registry.setDecoratorByClassName(
  'form',
  function() {
    return new morning.forms.Form();
  });
