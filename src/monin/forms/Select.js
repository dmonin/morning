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
 * @fileoverview Select controls.
 * Extends google closure native control to support monin.forms.IControl interface
 */

goog.provide('monin.forms.Select');

goog.require('goog.dom.dataset');
goog.require('goog.ui.Select');
goog.require('goog.ui.Option');

/**
 * @constructor
 * @extends {goog.ui.Select}
 * @implements {monin.forms.IControl}
 */
monin.forms.Select = function()
{
    goog.base(this, '');

    /**
     * @type {string}
     * @private
     */
    this.fieldName_ = '';
};
goog.inherits(monin.forms.Select, goog.ui.Select);

/** @inheritDoc */
monin.forms.Select.prototype.decorateInternal = function(el)
{
    goog.base(this, 'decorateInternal', el);

    this.fieldName_ = /** @type {string} */ (goog.dom.dataset.get(el, 'name'));
};

/**
 * Returns field name
 *
 * @return {string}
 */
monin.forms.Select.prototype.getFieldName = function()
{
    return this.fieldName_;
};

/**
 * Returns select box value
 *
 * @return {*}
 */
monin.forms.Select.prototype.getValue = function()
{
    return this.getSelectedItem() ?
                this.getSelectedItem().getValue() : null;
};

/**
 * Resets select value to default
 */
monin.forms.Select.prototype.reset = function()
{
    this.setSelectedIndex(0);
};

/**
 * @param {Object} config
 */
monin.forms.Select.prototype.setConfig = function(config)
{
    if (config.caption)
    {
        this.setCaption(config.caption);
    }

    if (config.options && config.options instanceof Array)
    {
        var options = config.options;
        for (var i = 0; i < options.length; i++)
        {
            this.addItem(new goog.ui.Option(options[i].text, options[i].model));
        }
    }
};

/**
 * Defines whether control is in invalid state
 */
monin.forms.Select.prototype.setInvalid = goog.nullFunction;

/**
 * Register this control so it can be created from markup.
 */
goog.ui.registry.setDecoratorByClassName(
    'select',
    function() {
      return new monin.forms.Select();
    });
