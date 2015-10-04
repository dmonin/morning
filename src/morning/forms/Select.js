// Copyright 2012 Dmitry morning. All Rights Reserved.
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
 * @fileoverview Select controls.
 * Extends google closure native control to support morning.forms.IControl interface
 */

goog.provide('morning.forms.Select');

goog.require('goog.dom.dataset');
goog.require('goog.ui.Select');
goog.require('goog.ui.Option');

/**
 * @constructor
 * @extends {goog.ui.Select}
 * @implements {morning.forms.IControl}
 */
morning.forms.Select = function()
{
  goog.base(this, '');

  /**
   * @type {string}
   * @private
   */
  this.fieldName_ = '';
};
goog.inherits(morning.forms.Select, goog.ui.Select);

/** @inheritDoc */
morning.forms.Select.prototype.decorateInternal = function(el)
{
  goog.base(this, 'decorateInternal', el);

  this.fieldName_ = /** @type {string} */ (goog.dom.dataset.get(el, 'name'));

  // set value if data-value is set
  var value = goog.dom.dataset.get(el, 'value');
  if (value) {
    var items = this.getSelectionModel().getItems();
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      if (item.getValue() == value ||
        goog.dom.dataset.get(item.getElement(), 'value') == value) {
        this.setSelectedIndex(i);
      }
    }
  }
};


/**
 * Returns field name
 *
 * @return {string}
 */
morning.forms.Select.prototype.getFieldName = function()
{
  return this.fieldName_;
};

/**
 * Returns select box value
 *
 * @return {*}
 */
morning.forms.Select.prototype.getValue = function()
{
  var selectedItem = this.getSelectedItem();

  if (selectedItem) {
    return this.getItemValue(selectedItem);
  }

  return null;
};


/**
 * Returns value of item
 *
 * @param {goog.ui.MenuItem} item
 * @return {*}
 */
morning.forms.Select.prototype.getItemValue = function(item)
{
  var val = item.getValue();

  if (val && val != item.getCaption()) {
    return val;
  }

  var el = item.getElement();
  if (el)
  {
    var dataValue = goog.dom.dataset.get(el, 'value');
    if (dataValue)
    {
      return dataValue;
    }
  }

  return val;
};

/**
 * Resets select value to default
 */
morning.forms.Select.prototype.reset = function()
{
  this.setSelectedIndex(0);
};

/**
 * @param {Object} config
 */
morning.forms.Select.prototype.setConfig = function(config)
{
  if (config['caption'])
  {
    this.setCaption(config['caption']);
  }

  if (config['options'] && config['options'] instanceof Array)
  {
    var options = config['options'];
    for (var i = 0; i < options.length; i++)
    {
      this.addItem(new goog.ui.Option(options[i]['text'], options[i]['model']));
    }
  }

  if (goog.isDef(config['fieldName']))
  {
    this.fieldName_ = config['fieldName'];
  }
};

/**
 * Defines whether control is in invalid state
 */
morning.forms.Select.prototype.setInvalid = goog.nullFunction;

/**
 * Register this control so it can be created from markup.
 */
goog.ui.registry.setDecoratorByClassName(
  'select',
  function() {
    return new morning.forms.Select();
  });
