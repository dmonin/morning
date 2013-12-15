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
 * @fileoverview Form component
 * Collection of form items. Handles form validation
 */

goog.provide('monin.forms.Form');

goog.require('goog.structs.Map');
goog.require('goog.ui.Component');
goog.require('goog.ui.registry');
goog.require('monin.forms.FormItem');
goog.require('monin.validation.FormValidation');

/**
 * Form component
 *
 * @constructor
 * @param {monin.forms.ControlFactory=} opt_controlFactory
 * @extends {goog.ui.Component}
 */
monin.forms.Form = function(opt_controlFactory)
{
    goog.base(this);

    /**
     * Form validation
     *
     * @type {monin.validation.FormValidation}
     */
    this.validation = null;

    /**
     * Form error provider
     *
     * @type {monin.forms.IErrorProvider}
     */
    this.errorProvider = null;
};
goog.inherits(monin.forms.Form, goog.ui.Component);


/**
 * Adds form item to form
 *
 * @param {string} label
 * @param {string} className
 * @param {Object=} controlConfig
 */
monin.forms.Form.prototype.addFormItem = function(label, className, controlConfig)
{
    controlConfig = controlConfig || {};

    var formItem = new monin.forms.FormItem();
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
    formItem.setControl(control);
    this.addChild(formItem, true);

    return formItem;
};

/** @inheritDoc */
monin.forms.Form.prototype.decorateInternal = function(el)
{
    goog.base(this, 'decorateInternal', el);

    var items = this.getElementsByClass('form-item');
    goog.array.forEach(items, function(itemEl) {
        var formItem = goog.ui.registry.getDecorator(itemEl);
        this.addChild(formItem);
        formItem.decorate(itemEl);

        if (goog.DEBUG)
        {
            if (formItem.getControl())
            {
                console.info('Form: Initialized Control %s: %o %o', formItem, formItem.getControl().getFieldName(), formItem.getControl());
            }
            else
            {
                console.warn('Form: no control found for form item: %o', formItem);
            }
        }
    }, this);
};

/** @inheritDoc */
monin.forms.Form.prototype.disposeInternal = function()
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
 * @return {monin.forms.IControl}
 */
monin.forms.Form.prototype.getControlByName = function(name)
{
    var found = null;
    this.forEachChild(function(child) {
        if (child.getFieldName && child.getFieldName() == name)
        {
            found = child;
        }
        else if (child instanceof monin.forms.FormItem && child.getControl().getFieldName() == name)
        {
            found = child.getControl();
        }

    }, this);

    return found;
};

/**
 * Returns form item by specified control name
 *
 * @param {string} name
 * @return {monin.forms.FormItem}
 */
monin.forms.Form.prototype.getFormItemByName = function(name)
{
    var found = null;
    this.forEachChild(function(child) {
        if (child instanceof monin.forms.FormItem && child.getControl().getFieldName() == name)
        {
            found = child;
        }

    }, this);

    return found;
};

/**
 * Returns form data as object
 *
 * @return {Object}
 */
monin.forms.Form.prototype.getData = function()
{
    var data = {}, control;
    this.forEachChild(function(child) {
        if (child instanceof monin.forms.FormItem)
        {
            control = child.getControl();
            if (control)
            {
                data[control.getFieldName()] = control.getValue();
            }
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
monin.forms.Form.prototype.handleValidationComplete = function(e)
{
    var result = /** @type {monin.validation.FormValidationResult} */ (e.result);

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
monin.forms.Form.prototype.bind = function(bind)
{
    var formItem;
    for (var fieldName in bind)
    {
        formItem = this.getFormItemByName(fieldName);
        if (!formItem)
        {
            console.warn('Form: Form item not found: %s', fieldName);
        }

        this.getFormItemByName(fieldName).bind(bind[fieldName]);
    }
};

/**
 * Resets form
 */
monin.forms.Form.prototype.reset = function()
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
monin.forms.Form.prototype.validate = function()
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
                monin.validation.FormValidation.EventType.VALIDATION_COMPLETE,
                this.handleValidationComplete);

        this.validation.validate(this.getData());
    }
};

/**
 * Unbinds model
 *
 * @param {Object} bind
 * @private
 */
monin.forms.Form.prototype.unbind = function(bind)
{
    for (var fieldName in bind)
    {
        this.getFormItemByName(fieldName).unbind(bind[fieldName]);
    }
};

/**
 * Unbinds all models
 *
 * @return {monin.forms.Form}
 */
monin.forms.Form.prototype.unbindAll = function()
{
    this.forEachChild(function(child) {
        if (child instanceof monin.forms.FormItem)
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
      return new monin.forms.Form();
    });
