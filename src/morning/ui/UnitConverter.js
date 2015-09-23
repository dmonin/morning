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
 * @fileoverview Unit converter.
 */

goog.provide('morning.ui.UnitConverter');

goog.require('goog.dom.classlist');
goog.require('goog.dom.dataset');
goog.require('goog.string');
goog.require('goog.ui.Component');
goog.require('goog.ui.Tooltip');
goog.require('morning.measure.Length');
goog.require('morning.measure.Temperature');

/**
 * Unit Converter
 *
 * @constructor
 * @param {string=} opt_unitType
 * @extends {goog.ui.Component}
 */
morning.ui.UnitConverter = function(opt_unitType)
{
    goog.base(this);

    /**
     * Unit type
     *
     * @type {string}
     * @private
     */
    this.unitType_ = opt_unitType || '';

    /**
     * Number of decimals
     *
     * @type {number}
     * @private
     */
    this.decimals_ = 0;

    /**
     * Measure converter
     *
     * @type {morning.measure.AbstractMeasure}
     * @private
     */
    this.measure_ = null;

    /**
     * Tooltip component which shows switches
     *
     * @type {goog.ui.Tooltip}
     * @private
     */
    this.tooltip_ = null;

    /**
     * @type {Function}
     * @private
     */
    this.messageProvider_ = null;
};
goog.inherits(morning.ui.UnitConverter, goog.ui.Component);

/** @inheritDoc */
morning.ui.UnitConverter.prototype.createDom = function()
{
    var domHelper = this.getDomHelper();
    var el = domHelper.createDom('div', 'unit-converter');

    this.decorateInternal(el);
};

/** @inheritDoc */
morning.ui.UnitConverter.prototype.decorateInternal = function(el)
{
    goog.base(this, 'decorateInternal', el);

    if (typeof this.messageProvider_ != 'function')
    {
        throw new Error(
            'morning.ui.UnitConverter: Message provider is not specified.');
    }

    var ds = goog.dom.dataset;
    var unitType = /** @type {string} */ (ds.get(el, 'unittype')) ||
        this.unitType_;
    var value = parseFloat(ds.get(el, 'value')) || 0;
    var decimals = parseInt(ds.get(el, 'decimals'), 10) || 0;

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
morning.ui.UnitConverter.prototype.enterDocument = function()
{
    goog.base(this, 'enterDocument');

    this.getHandler().listen(this.tooltip_.getElement(),
        goog.events.EventType.CLICK, this.handleClick_);
};

/**
 * Returns current unit type
 *
 * @return {string}
 */
morning.ui.UnitConverter.prototype.getType = function()
{
    return this.unitType_;
};

/**
 * Handles click event
 *
 * @param {goog.events.BrowserEvent} e
 * @private
 */
morning.ui.UnitConverter.prototype.handleClick_ = function(e)
{
    if (!goog.dom.classlist.contains(e.target, 'unit-type'))
    {
        return;
    }

    var ds = goog.dom.dataset;
    var element = /** @type {Element} */ (e.target);
    var unitType = /** @type {string} */ (ds.get(element, 'unittype'));
    this.setType(unitType);
};

/**
 * Returns measure converter by type
 *
 * @param {string} unitType
 * @private
 * @return {morning.measure.AbstractMeasure}
 */
morning.ui.UnitConverter.prototype.measureFactory_ = function(unitType)
{
    switch (unitType)
    {
        case 'km':
        case 'mile':
            return new morning.measure.Length();

        case 'celcius':
        case 'fahrenheit':
            return new morning.measure.Temperature();
    }

    return null;
};

/**
 * Sets message provider method
 *
 * @param  {Function} messageProvider function(msg) {return translatedMsg;}
 */
morning.ui.UnitConverter.prototype.setMessageProvider = function(messageProvider)
{
    this.messageProvider_ = messageProvider;
};

/**
 * Sets measuring type
 *
 * @param {string} type
 */
morning.ui.UnitConverter.prototype.setType = function(type)
{
    this.unitType_ = type;

    var value = this.measure_.getValue(this.unitType_, this.decimals_);
    goog.dom.dataset.set(this.getElement(), 'unittype', type);
    goog.dom.dataset.set(this.getElement(), 'value', String(value));

    var tooltipTypes = this.tooltip_.getElement().
                        querySelectorAll('.unit-type');
    var isActive;

    goog.array.forEach(tooltipTypes, function(tooltipType) {
        isActive = goog.dom.dataset.get(tooltipType, 'unittype') == type;
        goog.dom.classlist.enable(tooltipType, 'selected', isActive);
    });

    this.setHtml_(String(value));

    this.dispatchEvent({
        type: morning.ui.UnitConverter.EventType.TYPE_CHANGE,
        unitType: type
    });
};

/**
 * Displays current value
 *
 * @param {string} value
 * @private
 */
morning.ui.UnitConverter.prototype.setHtml_ = function(value)
{
    if (typeof this.messageProvider_ != 'function')
    {
        throw new Error('morning.ui.UnitConverter: Message provider is not specified.');
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
morning.ui.UnitConverter.prototype.setValue = function(value, opt_unitType)
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
morning.ui.UnitConverter.prototype.setVisible = function(isVisible)
{
    goog.dom.classlist.enable(this.getElement(), 'visible', isVisible);
};

morning.ui.UnitConverter.EventType = {
    TYPE_CHANGE: 'typechange'
};