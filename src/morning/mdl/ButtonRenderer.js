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
 * @fileoverview A renderer for goog.ui.Button, based on http://getmdl.io/
 * Standards
 */

goog.provide('morning.mdl.ButtonRenderer');
goog.require('goog.ui.NativeButtonRenderer');

goog.require('goog.ui.ButtonSide');
goog.require('goog.ui.Component');
goog.require('goog.ui.ControlRenderer');



/**
 * Default renderer for {@link goog.ui.Button}s.  Extends the superclass with
 * the following button-specific API methods:
 * <ul>
 *   <li>{@code getValue} - returns the button element's value
 *   <li>{@code setValue} - updates the button element to reflect its new value
 *   <li>{@code getTooltip} - returns the button element's tooltip text
 *   <li>{@code setTooltip} - updates the button element's tooltip text
 *   <li>{@code setCollapsed} - removes one or both of the button element's
 *       borders
 * </ul>
 * For alternate renderers, see {@link goog.ui.NativeButtonRenderer},
 * {@link goog.ui.CustomButtonRenderer}, and {@link goog.ui.FlatButtonRenderer}.
 * @constructor
 * @extends {goog.ui.NativeButtonRenderer}
 */
morning.mdl.ButtonRenderer = function() {
  goog.ui.ControlRenderer.call(this);
};
goog.inherits(morning.mdl.ButtonRenderer, goog.ui.NativeButtonRenderer);
goog.addSingletonGetter(morning.mdl.ButtonRenderer);


/**
 * Default CSS class to be applied to the root element of components rendered
 * by this renderer.
 * @type {string}
 */
morning.mdl.ButtonRenderer.CSS_CLASS = goog.getCssName('mdl-button');


/** @inheritDoc */
morning.mdl.ButtonRenderer.prototype.initializeDom = function(control) {
  goog.base(this, 'initializeDom', control);

  this.enableClassName(control, 'mdl-button', true);
  this.enableClassName(control, 'mdl-js-button', true);


  // window['componentHandler']['upgradeElement'](control.getElement());
};

/**
 * Register this control so it can be created from markup.
 */
goog.ui.registry.setDecoratorByClassName(
  'mdl-button',
  function() {
    return new goog.ui.Button('', morning.mdl.ButtonRenderer.getInstance());
});
