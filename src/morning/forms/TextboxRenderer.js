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
 * @fileoverview Textbox Renderer
 */
goog.provide('morning.forms.TextboxRenderer');

goog.require('goog.ui.ControlRenderer');

/**
 * Textbox Renderer
 *
 * @constructor
 * @extends {goog.ui.ControlRenderer}
 */
morning.forms.TextboxRenderer = function()
{
    goog.base(this);
};

goog.inherits(morning.forms.TextboxRenderer, goog.ui.ControlRenderer);
goog.addSingletonGetter(morning.forms.TextboxRenderer);

/**
 * Default CSS class to be applied to the root element of components rendered
 * by this renderer.
 * @type {string}
 */
morning.forms.TextboxRenderer.CSS_CLASS = goog.getCssName('textbox');


/**
 * @param {goog.ui.Control} textbox
 * @return {Element}
 * @override
 */
morning.forms.TextboxRenderer.prototype.createDom = function(textbox) {
    this.setUpTextbox_(textbox);

    var element = textbox.getDomHelper().createDom('input', {
        'type': 'text',
        'class': this.getClassNames(textbox).join(' '),
        'disabled': !textbox.isEnabled(),
        'value': textbox.getContent()
    });

    return element;
};

/** @override */
morning.forms.TextboxRenderer.prototype.decorate = function(control, element)
{
  this.setUpTextbox_(control);
  goog.base(this, 'decorate', control, element);

  control.setContent(element.value);

  return element;
};

/** @override */
morning.forms.TextboxRenderer.prototype.setFocusable = goog.nullFunction;

/** @override */
morning.forms.TextboxRenderer.prototype.setState = function(textbox, state,
    enable)
{
    goog.base(this, 'setState', textbox, state, enable);
    var element = textbox.getElement();
    if (element && state == goog.ui.Component.State.DISABLED)
    {
        element.disabled = enable;
    }
};


/**
 * @override
 */
morning.forms.TextboxRenderer.prototype.updateAriaState = goog.nullFunction;


/**
 * @param {goog.ui.Control} textbox Textbox control to configure
 * @private
 */
morning.forms.TextboxRenderer.prototype.setUpTextbox_ = function(textbox)
{
    textbox.setHandleMouseEvents(false);
    textbox.setAutoStates(goog.ui.Component.State.ALL, false);
    textbox.setSupportedState(goog.ui.Component.State.FOCUSED, false);
};


/** @override **/
morning.forms.TextboxRenderer.prototype.setContent = function(element, value)
{
    if (element)
    {
        element.value = value;
    }
};

/** @override **/
morning.forms.TextboxRenderer.prototype.getCssClass = function()
{
    return morning.forms.TextboxRenderer.CSS_CLASS;
};
