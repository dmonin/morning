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
 * @fileoverview Limits input / textarea to specified amount of characters
 * and displays remaining amount of characters to enter.
 */

goog.provide('monin.forms.CharacterLimiter');
goog.require('goog.dom.dataset');
goog.require('goog.events.KeyCodes');
goog.require('goog.ui.Component');

/**
 * Limits input / textarea to specified amount of characters
 * and displays remaining amount of characters to enter.
 *
 * @param {Element=} opt_textArea
 * @param {number=} opt_maxLength
 * @constructor
 * @extends {goog.ui.Component}
 */
monin.forms.CharacterLimiter = function(opt_textArea, opt_maxLength)
{
    goog.base(this);

    /**
     * Input / Textarea element
     *
     * @type {Element}
     * @private
     */
    this.textarea_ = opt_textArea || null;

    /**
     * Maximum allowed lenght
     *
     * @type {number}
     * @private
     */
    this.maxLength_ = opt_maxLength || 0;

    /**
     * Output element for remaining characters
     *
     * @type {Element}
     * @private
     */
    this.outputEl_ = null;

    /**
     * @type {string}
     */
    this.text = '{0} characters left';
};
goog.inherits(monin.forms.CharacterLimiter, goog.ui.Component);

/**
 * Attaches listeners
 *
 * @private
 */
monin.forms.CharacterLimiter.prototype.attachListeners_ = function()
{
    this.getHandler().listen(this.textarea_, goog.events.EventType.KEYDOWN,
        this.handleKeyDown_);

    this.getHandler().listen(this.textarea_, goog.events.EventType.KEYUP,
        this.handleKeyUp_);

    this.getHandler().listen(this.textarea_, goog.events.EventType.FOCUS,
        this.handleFocus_);

    this.getHandler().listen(this.textarea_, goog.events.EventType.BLUR,
        this.handleBlur_);
};


/**
 * Name of base CSS clase of datepicker.
 * @type {string}
 * @private
 */
monin.forms.CharacterLimiter.BASE_CSS_CLASS_ = goog.getCssName('character-limiter');

/**
 * Returns base CSS class. This getter is used to get base CSS class part.
 * All CSS class names in component are created as:
 *   goog.getCssName(this.getBaseCssClass(), 'CLASS_NAME')
 * @return {string} Base CSS class.
 */
monin.forms.CharacterLimiter.prototype.getBaseCssClass = function()
{
    return monin.forms.CharacterLimiter.BASE_CSS_CLASS_;
};

/** @inheritDoc */
monin.forms.CharacterLimiter.prototype.createDom = function()
{
    var domHelper = this.getDomHelper();
    var baseCls = this.getBaseCssClass();

    var el = domHelper.createDom('div', baseCls);

    var counterHtml = '<span class="' + goog.getCssName(baseCls, 'count') +
        '">0</span>';
    var html = this.text.replace('{0}', counterHtml);
    el.innerHTML = html;

    this.decorateInternal(el);
};

/** @inheritDoc */
monin.forms.CharacterLimiter.prototype.decorateInternal = function(el)
{
    goog.base(this, 'decorateInternal', el);

    var baseCls = this.getBaseCssClass();

    if (!this.textarea_)
    {
        var target = /**@type {string} */ (goog.dom.dataset.get(el, 'target'));
        if (target)
        {
            this.textarea_ = goog.dom.getElement(target);
        }
    }

    if (!this.maxLength_)
    {
        this.maxLength_ = Number(goog.dom.dataset.get(el, 'maxlength'));
    }

    var countCls = goog.getCssName(baseCls, 'count');
    this.outputEl_ = this.getElementByClass(countCls);
};

/** @inheritDoc */
monin.forms.CharacterLimiter.prototype.enterDocument = function()
{
    goog.base(this, 'enterDocument');

    if (this.textarea_)
    {
        this.attachListeners_();
        this.update_();
    }
};

/**
 * Handles blur event
 *
 * @param {goog.events.BrowserEvent} e
 * @private
 */
monin.forms.CharacterLimiter.prototype.handleBlur_ = function(e)
{
    goog.dom.classes.remove(this.getElement(), 'focused');
};

/**
 * Handles focus event
 *
 * @param {goog.events.BrowserEvent} e
 * @private
 */
monin.forms.CharacterLimiter.prototype.handleFocus_ = function(e)
{
    goog.dom.classes.add(this.getElement(), 'focused');
    this.update_();
};

/**
 * Handles key down event
 *
 * @param {goog.events.BrowserEvent} e
 * @private
 */
monin.forms.CharacterLimiter.prototype.handleKeyDown_ = function(e)
{
    var allowedKeys = [
        goog.events.KeyCodes.BACKSPACE,
        goog.events.KeyCodes.DELETE,
        goog.events.KeyCodes.LEFT,
        goog.events.KeyCodes.RIGHT,
        goog.events.KeyCodes.UP,
        goog.events.KeyCodes.DOWN,
        goog.events.KeyCodes.TAB,
        goog.events.KeyCodes.HOME,
        goog.events.KeyCodes.END,
        goog.events.KeyCodes.CTRL,
        goog.events.KeyCodes.SHIFT,
        goog.events.KeyCodes.ALT,
        goog.events.KeyCodes.ESC,
        goog.events.KeyCodes.CAPS_LOCK
    ];

    if (this.textarea_.value.length >= this.maxLength_ &&
            !goog.array.contains(allowedKeys, e.keyCode) &&
            !(e.ctrlKey && e.keyCode == 'A') &&
            !(e.ctrlKey && e.keyCode == 'V') &&
            !(e.ctrlKey && e.keyCode == 'X') &&
            !(e.ctrlKey && e.keyCode == 'C'))
    {
        e.preventDefault();
    }
};

/**
 * Handles key up
 *
 * @param {goog.events.BrowserEvent} e
 * @private
 */
monin.forms.CharacterLimiter.prototype.handleKeyUp_ = function(e)
{
    this.update_();
};

/**
 * Updates remaining characters
 *
 * @private
 */
monin.forms.CharacterLimiter.prototype.update_ = function()
{
    if (this.textarea_.value.length >= this.maxLength_)
    {
        this.textarea_.value = this.textarea_.value.substr(0, this.maxLength_);
    }

    this.output_();
};

/**
 * Outputs amount of remaining characters
 *
 * @private
 */
monin.forms.CharacterLimiter.prototype.output_ = function()
{
    this.outputEl_.innerHTML = this.maxLength_ - this.textarea_.value.length;
};


/**
 * Register this control so it can be created from markup.
 */
goog.ui.registry.setDecoratorByClassName(
    'character-limiter',
    function() {
      return new monin.forms.CharacterLimiter();
    });
