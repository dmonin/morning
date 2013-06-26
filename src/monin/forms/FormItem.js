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
 * @fileoverview Form item, consists of label + control
 * Bindable to model for change events.
 */

goog.provide('monin.forms.FormItem');

goog.require('goog.ui.Component');
goog.require('goog.ui.registry');

/**
 * Form item
 *
 * @constructor
 * @extends {goog.ui.Component}
 */
monin.forms.FormItem = function()
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
     * User Control
     *
     * @type {goog.ui.Component}
     * @private
     */
    this.control_ = null;

    /**
     * Binding handler, manages listeners attached to change events
     *
     * @type {goog.events.EventHandler}
     * @private
     */
    this.bindHandler_ = new goog.events.EventHandler(this);
};
goog.inherits(monin.forms.FormItem, goog.ui.Component);

/** @inheritDoc */
monin.forms.FormItem.prototype.createDom = function()
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
 * @param {Object} bind
 * @return {monin.forms.FormItem}
 */
monin.forms.FormItem.prototype.bind = function(bind)
{
    this.bind_ = bind;
    var key, model;
    for (key in bind)
    {
        model = bind[key];
        var control = /** @type {monin.forms.IControl} */ (this.control_);

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
monin.forms.FormItem.prototype.decorateInternal = function(el)
{
    goog.base(this, 'decorateInternal', el);

    if (this.getControl())
    {
        return;
    }

    var controlEl = this.getElementByClass('form-control');

    if (controlEl)
    {
        this.control_ = goog.ui.registry.getDecorator(controlEl);
        if (this.control_)
        {
            this.addChild(this.control_);
            this.control_.decorate(controlEl);
        }
        else
        {
            console.warn('Decorator not found for %o', controlEl);
        }
    }
    else if (goog.DEBUG)
    {
        console.warn('No control found: %o', controlEl);
    }

};

/** @inheritDoc */
monin.forms.FormItem.prototype.disposeInternal = function()
{
    goog.base(this, 'disposeInternal');

    this.unbindAll();
};

/** @inheritDoc */
monin.forms.FormItem.prototype.enterDocument = function()
{
    goog.base(this, 'enterDocument');

    this.getHandler().listen(this, goog.events.EventType.CHANGE,
        this.handleChange_);
};

/** @inheritDoc */
monin.forms.FormItem.prototype.getContentElement = function()
{
    return this.getElementByClass('form-item-control');
};

/**
 * Returns form item control
 *
 * @return {goog.ui.Component}
 */
monin.forms.FormItem.prototype.getControl = function()
{
    return this.control_;
};

/**
 * Handles change event and updates attached models
 *
 * @param {goog.events.Event} e
 */
monin.forms.FormItem.prototype.handleChange_ = function(e)
{
    var val = e.target.getValue();

    for (var key in this.bind_)
    {
        var updateData = {};
        updateData[key] = val;
        this.bind_[key].update(updateData);
    }
};



/**
 * Unbinds models
 *
 * @param {Object} bind
 * @return {monin.forms.FormItem}
 */
monin.forms.FormItem.prototype.unbind = function(bind)
{
    this.bind_ = bind;
    var key, model;
    var control = /** @type {monin.forms.IControl} */ (this.control_);
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
 * Unbinds all event listeners
 *
 * @return {monin.forms.FormItem}
 */
monin.forms.FormItem.prototype.unbindAll = function()
{
    this.bindHandler_.removeAll();
    return this;
};

/**
 * Resets form controls to their default values
 */
monin.forms.FormItem.prototype.reset = function()
{
    if (this.control_)
    {
        this.control_.reset();
    }
};

/**
 * Sets form item control
 *
 * @param {goog.ui.Component} control
 */
monin.forms.FormItem.prototype.setControl = function(control)
{
    if (this.control_)
    {
        this.removeChild(this.control_, true);
    }

    this.control_ = control;
    this.addChild(this.control_, true);
};

/**
 * Sets form item label
 *
 * @param {string} label
 */
monin.forms.FormItem.prototype.setLabel = function(label)
{
    this.label_ = label;

    var el = this.getElement();
    if (el)
    {
        this.getElementByClass('form-item-label').innerHTML = label;
    }
};

/**
 * Sets / Removes invalid state
 *
 * @param {boolean} isInvalid
 */
monin.forms.FormItem.prototype.setInvalid = function(isInvalid)
{
    var control = this.getControl();
    if (control)
    {
        control.setInvalid(isInvalid);
    }
};

/**
 * Register this control so it can be created from markup.
 */
goog.ui.registry.setDecoratorByClassName(
    'form-item',
    function() {
      return new monin.forms.FormItem();
    });
