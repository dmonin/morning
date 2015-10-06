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
 * @fileoverview Tooltip Error Provider
 * Shows validation as tooltips above the field
 */

goog.provide('morning.forms.TooltipErrorProvider');
goog.require('morning.forms.IErrorProvider');
goog.require('morning.fx.WindowScroll');
goog.require('goog.fx.easing');

/**
 * @param {morning.ui.Tooltip} tooltip
 * @constructor
 * @implements {morning.forms.IErrorProvider}
 */
morning.forms.TooltipErrorProvider = function(tooltip)
{
  /**
   * Tooltip component
   *
   * @type {morning.ui.Tooltip}
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

  /**
   *
   * @type {morning.fx.WindowScroll}
   * @private
   */
  this.scroll_ = new morning.fx.WindowScroll(window, [0, 0], [0, 0], 1000,
    goog.fx.easing.inAndOut);
};

/**
 * Shows error message above input fields from FormValidation Result
 *
 * @param {morning.validation.FormValidationResult} result
 * @param {morning.forms.Form} form
 */
morning.forms.TooltipErrorProvider.prototype.display = function(result, form)
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
morning.forms.TooltipErrorProvider.prototype.displayError = function(element, message)
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
  else
  {
    var pos = goog.style.getPageOffset(element);
    var docScroll = goog.dom.getDocumentScroll();
    this.scroll_.setStartPoint([docScroll.x, docScroll.y]);
    this.scroll_.setEndPoint([pos.x, pos.y]);
    this.scroll_.play();
  }

  this.hideDelay_.start();
};

/**
 * Hides tooltip
 *
 * @private
 */
morning.forms.TooltipErrorProvider.prototype.hideTooltipDelayed_ = function()
{
  this.setVisible(false);
};

/**
 * Sets tooltip
 *
 * @param {morning.ui.Tooltip} tooltip
 */
morning.forms.TooltipErrorProvider.prototype.setTooltip = function(tooltip)
{
  this.tooltip_ = tooltip;
};

/**
 * Shows / Hides error provider (tooltip)
 *
 * @param {boolean} isVisible
 */
morning.forms.TooltipErrorProvider.prototype.setVisible = function(isVisible)
{
  this.tooltip_.setVisible(isVisible);
};
