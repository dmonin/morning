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
 * @fileoverview Unit converter.
 */

goog.provide('monin.ui.UnitConverter');

goog.require('goog.dom.classes');
goog.require('goog.dom.dataset');
goog.require('goog.string');
goog.require('goog.ui.Component');
goog.require('goog.ui.Tooltip');
goog.require('monin.measure.Length');
goog.require('monin.measure.Temperature');

/**
 * Unit Converter
 *
 * @constructor
 * @extends {goog.ui.Component}
 */
monin.ui.UnitConverter = function()
{
    goog.base(this);

    /**
     * Unit type
     *
     * @type {string}
     */
    this.unitType_ = '';

    /**
     * Number of decimals
     *
     * @type {number}
     */
    this.decimals_ = 0;

    /**
     * Measure converter
     *
     * @type {monin.measure.AbstractMeasure}
     */
    this.measure_ = null;

    /**
     * Tooltip component which shows switches
     *
     * @type {goog.ui.Tooltip}
     */
    this.tooltip_ = null;

    /**
     * @type {Function}
     */
    this.messageProvider_ = null;
};
goog.inherits(monin.ui.UnitConverter, goog.ui.Component);

/** @inheritDoc */
monin.ui.UnitConverter.prototype.decorateInternal = function(el)
{
    goog.base(this, 'decorateInternal', el);

    if (typeof this.messageProvider_ != 'function')
    {
        throw new Error('monin.ui.UnitConverter: Message provider is not specified.');
    }

    var unitType = /** @type {string} */ (goog.dom.dataset.get(el, 'unittype'));
    var value = parseFloat(goog.dom.dataset.get(el, 'value'));
    var decimals = parseInt(goog.dom.dataset.get(el, 'decimals'), 10);

    if (goog.DEBUG && !unitType)
    {
        console.warn('UnitConverter: UnitType not specified %o', el);
    }

    value = value || 0;

    this.unitType_ = unitType;
    this.decimals_ = decimals || 0;
    this.measure_ = this.measureFactory_(unitType);
    this.measure_.setValue(value, unitType);


    var html = [],
        unitTypes = this.measure_.getUnitTypes(), i = 0, cls = '';

    for (; i < unitTypes.length; i++)
    {
        cls = unitTypes[i] == unitType ? 'selected' : '';
        html.push('<span class="unit-type ' + cls + '" data-unittype="' +
                unitTypes[i] + '">' +
            goog.string.trim(this.messageProvider_('unit.' + unitTypes[i])) +
            '</span>');
    }

    this.tooltip_ = new goog.ui.Tooltip(el);
    this.tooltip_.setHtml(html.join(' | '));
    this.tooltip_.setShowDelayMs(300);
    this.tooltip_.setHideDelayMs(600);
};


/** @inheritDoc */
monin.ui.UnitConverter.prototype.enterDocument = function()
{
    goog.base(this, 'enterDocument');

    this.getHandler().listen(this.tooltip_.getElement(),
        goog.events.EventType.CLICK, this.handleClick_);
};

/**
 * Handles click event
 *
 * @param {goog.events.BrowserEvent} e
 * @private
 */
monin.ui.UnitConverter.prototype.handleClick_ = function(e)
{
    if (!goog.dom.classes.has(e.target, 'unit-type'))
    {
        return;
    }

    var element = /** @type {Element} */ (e.target);
    var unitType = /** @type {string} */ (goog.dom.dataset.get(element, 'unittype'));
    this.setType(unitType);
};

/**
 * Returns measure converter by type
 *
 * @param {string} unitType
 * @private
 * @return {monin.measure.AbstractMeasure}
 */
monin.ui.UnitConverter.prototype.measureFactory_ = function(unitType)
{
    switch (unitType)
    {
        case 'km':
        case 'mile':
            return new monin.measure.Length();

        case 'celcius':
        case 'fahrenheit':
            return new monin.measure.Temperature();
    }

    return null;
};

/**
 * Sets message provider method
 *
 * @param  {Function} messageProvider function(msg) {return translatedMsg;}
 */
monin.ui.UnitConverter.prototype.setMessageProvider = function(messageProvider)
{
    this.messageProvider_ = messageProvider;
};

/**
 * Sets measuring type
 *
 * @param {string} type
 */
monin.ui.UnitConverter.prototype.setType = function(type)
{
    this.unitType_ = type;

    var value = this.measure_.getValue(this.unitType_, this.decimals_);
    goog.dom.dataset.set(this.getElement(), 'unittype', type);
    goog.dom.dataset.set(this.getElement(), 'value', String(value));

    var tooltipTypes = this.tooltip_.getElement().querySelectorAll('.unit-type'),
        isActive;

    goog.array.forEach(tooltipTypes, function(tooltipType) {
        isActive = goog.dom.dataset.get(tooltipType, 'unittype') == type;
        goog.dom.classes.enable(tooltipType, 'selected', isActive);
    });

    this.setHtml_(String(value));
};

/**
 * Displays current value
 *
 * @param {string} value
 * @private
 */
monin.ui.UnitConverter.prototype.setHtml_ = function(value)
{
    if (typeof this.messageProvider_ != 'function')
    {
        throw new Error('monin.ui.UnitConverter: Message provider is not specified.');
    }

    if (!this.getElement())
    {
        return;
    }

    this.getElement().innerHTML = value + this.messageProvider_('unit.' +
        this.unitType_);
};

/**
 * Sets value
 *
 * @param {number} value
 * @param {string=} opt_unitType
 */
monin.ui.UnitConverter.prototype.setValue = function(value, opt_unitType)
{
    opt_unitType = opt_unitType || this.unitType_;
    this.measure_.setValue(value, opt_unitType);
    var html = this.measure_.getValue(this.unitType_, this.decimals_);
    this.setHtml_(String(html));
};

/**
 * Sets visibility
 *
 * @param {boolean} isVisible
 */
monin.ui.UnitConverter.prototype.setVisible = function(isVisible)
{
    goog.dom.classes.enable(this.getElement(), 'visible', isVisible);
};
