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
 * @fileoverview Arrow button renderer
 *
 */
goog.provide('morning.ui.ArrowButtonRenderer');

goog.require('goog.dom');
goog.require('goog.dom.TagName');
goog.require('goog.dom.classlist');
goog.require('goog.ui.Button');
goog.require('goog.ui.ButtonRenderer');
goog.require('goog.ui.ControlContent');
goog.require('goog.ui.INLINE_BLOCK_CLASSNAME');



/**
 * Custom renderer for {@link goog.ui.Button}s.
 *
 * @constructor
 * @extends {goog.ui.ButtonRenderer}
 */
morning.ui.ArrowButtonRenderer = function() {
    goog.ui.ButtonRenderer.call(this);
};
goog.inherits(morning.ui.ArrowButtonRenderer, goog.ui.ButtonRenderer);


/**
 * The singleton instance of this renderer class.
 * @type {morning.ui.ArrowButtonRenderer?}
 * @private
 */
morning.ui.ArrowButtonRenderer.instance_ = null;
goog.addSingletonGetter(morning.ui.ArrowButtonRenderer);


/**
 * Default CSS class to be applied to the root element of components rendered
 * by this renderer.
 * @type {string}
 */
morning.ui.ArrowButtonRenderer.CSS_CLASS = goog.getCssName('arrow-button');


/** @override */
morning.ui.ArrowButtonRenderer.prototype.getContentElement = function(element) {
    return /** @type {Element} */ ((element));
};


/**
 * Returns the button's contents.
 * Overrides {@link goog.ui.ButtonRenderer#createDom}.
 * @param {goog.ui.Control} control goog.ui.Button to render.
 * @return {Element} Root element for the button.
 * @override
 */
morning.ui.ArrowButtonRenderer.prototype.createDom = function(control) {
    var button = /** @type {goog.ui.Button} */ ((control));
    var classNames = this.getClassNames(button);
    var attr = {
        'class': classNames.join(' '),
        'title': button.getTooltip() || ''
    };

    var domHelper = button.getDomHelper();
    return domHelper.createDom('div', attr,
        domHelper.createDom('div', 'arrow-button-wrap', button.getContent()));
};


/**
 * Returns true if this renderer can decorate the element.  Overrides
 * {@link goog.ui.ButtonRenderer#canDecorate} by returning true if the
 * element is a DIV, false otherwise.
 * @param {Element} element Element to decorate.
 * @return {boolean} Whether the renderer can decorate the element.
 * @override
 */
morning.ui.ArrowButtonRenderer.prototype.canDecorate = function(element) {
    return element.tagName == goog.dom.TagName.DIV;
};


/** @override */
morning.ui.ArrowButtonRenderer.prototype.decorate = function(button, element) {
    goog.dom.classlist.add(element, goog.ui.INLINE_BLOCK_CLASSNAME,
        this.getCssClass());
    return morning.ui.ArrowButtonRenderer.superClass_.decorate.call(this, button,
        element);
};


/**
 * Returns the CSS class to be applied to the root element of components
 * rendered using this renderer.
 * @return {string} Renderer-specific CSS class.
 * @override
 */
morning.ui.ArrowButtonRenderer.prototype.getCssClass = function() {
    return morning.ui.ArrowButtonRenderer.CSS_CLASS;
};

