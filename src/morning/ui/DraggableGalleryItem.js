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
 * @fileoverview Draggable Gallery Item component
 */

goog.provide('morning.ui.DraggableGalleryItem');
goog.provide('morning.ui.IDraggableItemPhotoRenderer');
goog.require('goog.style');

/**
 * Draggable Gallery Item component
 *
 * @constructor
 * @param {!morning.ui.IDraggableItemPhotoRenderer} renderer
 * @extends {goog.ui.Component}
 */
morning.ui.DraggableGalleryItem = function(renderer)
{
    goog.base(this);

    /**
     * @type {!morning.ui.IDraggableItemPhotoRenderer}
     * @private
     */
    this.renderer_ = renderer;
};
goog.inherits(morning.ui.DraggableGalleryItem, goog.ui.Component);

/** @inheritDoc */
morning.ui.DraggableGalleryItem.prototype.createDom = function()
{
    this.decorateInternal(this.renderer_.createDom(this));
};

/** @inheritDoc */
morning.ui.DraggableGalleryItem.prototype.decorateInternal = function(el)
{
    goog.base(this, 'decorateInternal', el);

    this.renderer_.decorate(this, el);
};

/**
 * Returns width of draggable gallery item
 *
 * @return {number}
 */
morning.ui.DraggableGalleryItem.prototype.getWidth = function()
{
    var marginBox = goog.style.getMarginBox(this.getElement());
    return this.getElement().offsetWidth + marginBox.left + marginBox.right;
};

/**
 * @interface
 */
morning.ui.IDraggableItemPhotoRenderer = function() {};

/**
 * Returns the control's contents wrapped in a DIV, with the renderer's own
 * CSS class and additional state-specific classes applied to it.
 * @param {goog.ui.Component} component Control to render.
 * @return {Element} Root element for the control.
 */
morning.ui.IDraggableItemPhotoRenderer.prototype.createDom = function(component) {};

/**
 * Default implementation of {@code decorate} for {@link goog.ui.Control}s.
 * Initializes the control's ID, content, and state based on the ID of the
 * element, its child nodes, and its CSS classes, respectively.  Returns the
 * element.
 * @param {goog.ui.Component} component Component instance to decorate the element.
 * @param {Element} element Element to decorate.
 * @return {Element} Decorated element.
 * @suppress {visibility} setContentInternal and setStateInternal
 */
morning.ui.IDraggableItemPhotoRenderer.prototype.decorate = function(component, element) {};
