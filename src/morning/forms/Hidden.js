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
 * @fileoverview Hidden control.
 */
goog.provide('morning.forms.Hidden');

goog.require('goog.ui.registry');
goog.require('goog.ui.Component');


/**
 * @constructor
 * @extends {goog.ui.Component}
 * @implements {morning.forms.IControl}
 */
morning.forms.Hidden = function()
{
  goog.base(this);

  /**
   * Field name
   *
   * @type {string}
   * @private
   */
  this.fieldName = '';

  /**
   * @type {string}
   * @private
   */
  this.value_ = '';
};
goog.inherits(morning.forms.Hidden, goog.ui.Component);

morning.forms.Hidden.prototype.createDom = function()
{
  var domHelper = this.getDomHelper();
  var el = domHelper.createDom('input', {
      'type': 'hidden',
      'name': this.fieldName,
      'value': this.value_
  });

  this.decorateInternal(el);
};

/** @inheritDoc */
morning.forms.Hidden.prototype.decorateInternal = function(el)
{
  goog.base(this, 'decorateInternal', el);

  this.fieldName = el.name;
};

/**
 * Returns field name
 *
 * @return {string}
 */
morning.forms.Hidden.prototype.getFieldName = function()
{
  return this.fieldName;
};

/**
 * Returns current value
 *
 * @return {*}
 */
morning.forms.Hidden.prototype.getValue = function()
{
  return this.getElement().value;
};

/** @inheritDoc */
morning.forms.Hidden.prototype.reset = function()
{
  this.setValue('');
};

/**
 * Sets config
 *
 * @param {Object} config
 */
morning.forms.Hidden.prototype.setConfig = function(config)
{
  if (goog.isDef(config['fieldName']))
  {
    this.fieldName = config['fieldName'];
  }
};

/**
 * Sets control state to invalid
 *
 * @param {boolean} isInvalid
 */
morning.forms.Hidden.prototype.setInvalid = function(isInvalid)
{
  // intentially left empty, because hidden control is invisible
};

/**
 * Sets control's value
 *
 * @param {*} value
 */
morning.forms.Hidden.prototype.setValue = function(value)
{
  if (this.getElement() && this.getElement().value != value)
  {
    this.getElement().value = value;
    this.dispatchEvent(goog.events.EventType.CHANGE);
  }

  this.value_ = /** @type {string} */ (value);
};



/**
 * Register this control so it can be created from markup.
 */
goog.ui.registry.setDecoratorByClassName(
    'hidden',
    function() {
      return new morning.forms.Hidden();
    });
