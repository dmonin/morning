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
 * @fileoverview Placeholder support for old browsers
 */
goog.provide('morning.forms.TextboxPlaceholderHandler');
goog.require('goog.events.EventHandler');

/**
 * @constructor
 */
morning.forms.TextboxPlaceholderHandler = function()
{
    /**
     * @type {goog.events.EventHandler}
     * @private
     */
    this.handler_ = new goog.events.EventHandler(this);

    if (typeof Modernizr == 'undefined' || typeof Modernizr.placeholder == 'undefined')
    {
        throw new Error('Modernizr.placeholder test couldnt be found.');
    }
};

goog.addSingletonGetter(morning.forms.TextboxPlaceholderHandler);

/**
 * @param {Element} input
 */
morning.forms.TextboxPlaceholderHandler.prototype.attach = function(input)
{
    if (Modernizr.placeholder)
    {
        return;
    }

    input.defaultValue = input.getAttribute('placeholder');
    input.value = input.defaultValue;

    this.handler_.listen(input, goog.events.EventType.FOCUS,
        this.handleFocus_);

    this.handler_.listen(input, goog.events.EventType.BLUR,
        this.handleBlur_);
};

morning.forms.TextboxPlaceholderHandler.prototype.detach = function(input)
{
    if (Modernizr.placeholder)
    {
        return;
    }

    this.handler_.unlisten(input, goog.events.EventType.FOCUS,
        this.handleFocus_);

    this.handler_.unlisten(input, goog.events.EventType.BLUR,
        this.handleBlur_);
};

/**
 * @param {goog.events.BrowserEvent} e
 * @private
 */
morning.forms.TextboxPlaceholderHandler.prototype.handleFocus_ = function(e)
{
    if (Modernizr.placeholder)
    {
        return;
    }

    if (e.target.value == e.target.getAttribute('placeholder'))
    {
        e.target.value = '';
    }
};


/**
 * @param {goog.events.BrowserEvent} e
 * @private
 */
morning.forms.TextboxPlaceholderHandler.prototype.handleBlur_ = function(e)
{
    if (Modernizr.placeholder)
    {
        return;
    }

    if (e.target.value == '')
    {
        e.target.value = e.target.getAttribute('placeholder');
    }
};
