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
 * @fileoverview Tooltip Error Provider
 * Shows validation as tooltips above the field
 */

goog.provide('monin.forms.TooltipErrorProvider');
goog.require('monin.forms.IErrorProvider');

/**
 * @param {monin.ui.Tooltip} tooltip
 * @constructor
 * @implements {monin.forms.IErrorProvider}
 */
monin.forms.TooltipErrorProvider = function(tooltip)
{
    /**
     * Tooltip component
     *
     * @type {monin.ui.Tooltip}
     * @private
     */
    this.tooltip_ = tooltip;

    /**
     * Hide tooltip delay, after tooltip has been displayed
     *
     * @type {goog.async.Delay}
     * @private
     */
    this.hideDelay_ = new goog.async.Delay(this.hideTooltipDelayed_, 3000, this);
};

/**
 * Shows error message above input fields from FormValidation Result
 *
 * @param {monin.validation.FormValidationResult} result
 * @param {monin.forms.Form} form
 */
monin.forms.TooltipErrorProvider.prototype.display = function(result, form)
{
    this.hideDelay_.stop();

    if (!result.isValid())
    {
        var control;

        for (var i = 0; i < result.errors.length; i++)
        {
            control = form.getControlByName(result.errors[i].fieldName);
            control.setInvalid(true);

            if (i === 0)
            {
                this.displayError(control.getElement(), result.errors[i].message);
            }
        }
    }
};

/**
 * Displays single error message
 *
 * @param {Element} element
 * @param {string} message
 */
monin.forms.TooltipErrorProvider.prototype.displayError = function(element, message)
{
    if (!element.offsetHeight)
    {
        return;
    }
    this.tooltip_.setBody(message);
    this.tooltip_.positionateToElement(element);
    this.tooltip_.setVisible(true);

    if (element.type == 'text')
    {
        element.focus();
    }

    this.hideDelay_.start();
};

/**
 * Hides tooltip
 *
 * @private
 */
monin.forms.TooltipErrorProvider.prototype.hideTooltipDelayed_ = function()
{
    this.setVisible(false);
};

/**
 * Sets tooltip
 *
 * @param {monin.ui.Tooltip} tooltip
 */
monin.forms.TooltipErrorProvider.prototype.setTooltip = function(tooltip)
{
    this.tooltip_ = tooltip;
};

/**
 * Shows / Hides error provider (tooltip)
 *
 * @param {boolean} isVisible
 */
monin.forms.TooltipErrorProvider.prototype.setVisible = function(isVisible)
{
    this.tooltip_.setVisible(isVisible);
};
