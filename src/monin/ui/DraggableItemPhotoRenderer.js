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
 * @fileoverview Draggable Item Photo Renderer
 */

goog.provide('monin.ui.DraggableItemPhotoRenderer');
goog.require('goog.style');
goog.require('monin.ui.IDraggableItemPhotoRenderer');

/**
 * Draggable Item Photo Renderer
 *
 * @constructor
 * @implements {monin.ui.IDraggableItemPhotoRenderer}
 */
monin.ui.DraggableItemPhotoRenderer = function()
{

};

goog.addSingletonGetter(monin.ui.DraggableItemPhotoRenderer);

/**
 * @param {goog.ui.Component} component
 * @return {Element}
 */
monin.ui.DraggableItemPhotoRenderer.prototype.createDom = function(component)
{
    var domHelper = component.getDomHelper();
    var photo = /** @type {lindalino.model.Photo} */ (component.getModel());
    var image = photo.images.get('medium-smaller');

    var size = image.size.clone().scaleToFit(new goog.math.Size(10000, 200));
    if (size.height > image.size.height)
    {
        image = photo.images.get('medium');
    }

    var element = domHelper.createDom('div', 'draggable-gallery-item', [
        domHelper.createDom('img', {
            src: image.src,
            width: size.width,
            height: size.height
        })
    ]);

    return element;
};

/**
 * @param {goog.ui.Component} component
 * @param {Element} element
 */
monin.ui.DraggableItemPhotoRenderer.prototype.decorate = function(component, element)
{
    goog.style.setUnselectable(element, true);
    return element;
};
