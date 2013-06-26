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
 * @fileoverview Control factory
 */
goog.provide('monin.forms.ControlFactory');

goog.require('monin.forms.Checkbox');
goog.require('monin.forms.Textarea');
goog.require('monin.forms.Textbox');

/**
 * Control factory
 *
 * @extends {goog.ui.Component}
 * @constructor
 */
monin.forms.ControlFactory = function()
{

};

/**
 * Returns instance of user control
 *
 * @param {string} type control type
 * @param {Object} config control's configuration
 * @return {goog.ui.Component}
 */
monin.forms.ControlFactory.prototype.getInstance = function(type, config)
{
    var control = null;
    switch (type)
    {
        case 'textbox':
            control = new monin.forms.Textbox('');
            break;

        case 'checkbox':
            control = new monin.forms.Checkbox();
            break;

        case 'textarea':
            control = new monin.forms.Textarea('');
            break;

        default:
            throw new Error('FormItem type not found: ' + type);
    }

    if (control)
    {
        control.setConfig(config);
    }

    return control;
};
