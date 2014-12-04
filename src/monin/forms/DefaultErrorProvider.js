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
 * @fileoverview Form error provider
 */

goog.provide('monin.forms.DefaultErrorProvider');

goog.require('goog.Timer');
goog.require('goog.dom');
goog.require('goog.dom.classes');
goog.require('goog.ui.Component');
goog.require('monin.forms.Textbox');
goog.require('monin.forms.IErrorProvider');

/**
 * Form error provider. Shows error message under input field-
 *
 * @constructor
 * @extends {goog.ui.Component}
 * @implements {monin.forms.IErrorProvider}
 */
monin.forms.DefaultErrorProvider = function()
{
    goog.base(this);
};
goog.inherits(monin.forms.DefaultErrorProvider, goog.ui.Component);

/** @inheritDoc */
monin.forms.DefaultErrorProvider.prototype.createDom = function()
{
    this.decorateInternal(this.getDomHelper().createDom('div', 'form-error'));
};


/**
 * Display an error message form form validation result.
 *
 * @param {monin.validation.FormValidationResult} result
 * @param {monin.forms.Form} form
 */
monin.forms.DefaultErrorProvider.prototype.display = function(result, form)
{
    if (!result.isValid())
    {
        var error = result.errors[0];
        var control = form.getControlByName(error.fieldName);
        control.setInvalid(true);

        if (control instanceof monin.forms.Textbox)
        {
            control.focus();
        }

        this.displayError(control.getElement(), error.message);
        goog.Timer.callOnce(function() {
            this.setVisible(!result.isValid());
        }, 100, this);
    }
};

/**
 * Displays error message
 *
 * @param {Element} element
 * @param {string} message
 */
monin.forms.DefaultErrorProvider.prototype.displayError = function(element, message)
{
    this.getElement().innerHTML = message;
    goog.dom.insertSiblingAfter(this.getElement(), element);

    goog.Timer.callOnce(function() {
        this.setVisible(true);
    }, 100, this);
};

/**
 * Shows / Hides error provider
 *
 * @param {boolean} isVisible
 */
monin.forms.DefaultErrorProvider.prototype.setVisible = function(isVisible)
{
    goog.dom.classes.enable(this.getElement(), 'visible', isVisible);
};
