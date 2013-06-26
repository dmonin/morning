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
 * @fileoverview Draggable Gallery component, user can move items to left / right
 */
goog.provide('monin.ui.DraggableGallery');

goog.require('goog.fx.anim');
goog.require('goog.fx.anim.Animated');
goog.require('goog.math.Coordinate');
goog.require('goog.ui.Component');

goog.require('monin.events');

/**
 * Draggable Gallery
 *
 * @constructor
 * @extends {goog.ui.Component}
 * @implements {goog.fx.anim.Animated}
 */
monin.ui.DraggableGallery = function()
{
    goog.base(this);

    /**
     * Verifies whether touch events are available
     *
     * @type {boolean}
     * @private
     */
    this.isTouchAvailable_ = 'ontouchstart' in goog.dom.getDocument();

    /**
     * Is Gallery currently dragging
     *
     * @type {boolean}
     * @private
     */
    this.isDragging_ = false;

    /**
     * Position where user has touched / pressed mouse down
     *
     * @type {goog.math.Coordinate}
     * @private
     */
    this.pointerDownPos_ = null;

    /**
     * Click position offset
     *
     * @type {goog.math.Coordinate}
     * @private
     */
    this.offset_ = new goog.math.Coordinate();

    /**
     * Start position coordinate
     *
     * @type {goog.math.Coordinate}
     * @private
     */
    this.start_ = new goog.math.Coordinate();

    /**
     * End position coordinate
     *
     * @type {goog.math.Coordinate}
     * @private
     */
    this.end_ = new goog.math.Coordinate();

    /**
     * Content element
     *
     * @type {Element}
     * @private
     */
    this.contentEl_ = null;

    /**
     * Defines whether dragging should snap to item positions
     *
     * @type {boolean}
     */
    this.snapToItems = true;

    /**
     * Current drag speed
     *
     * @type {number}
     */
    this.velocity_ = 0;

    /**
     * Last Drag X Position
     *
     * @type {number}
     */
    this.lastPosX_ = 0;

    this.checkDependencies_();
};
goog.inherits(monin.ui.DraggableGallery, goog.ui.Component);

/**
 * @private
 */
monin.ui.DraggableGallery.prototype.checkDependencies_ = function()
{
    if (typeof Modernizr == 'undefined' || typeof Modernizr.csstransforms == 'undefined')
    {
        throw new Error('Modernizer library with support for csstransforms couldn\'t be found');
    }
};

/** @inheritDoc */
monin.ui.DraggableGallery.prototype.createDom = function()
{
    var domHelper = this.getDomHelper();

    var el = domHelper.createDom('div', 'draggable-gallery', [
        domHelper.createDom('div', 'draggable-gallery-content')
    ]);

    this.decorateInternal(el);
};

/** @inheritDoc */
monin.ui.DraggableGallery.prototype.decorateInternal = function(el)
{
    goog.base(this, 'decorateInternal', el);

    this.contentEl_ = this.getElementByClass('draggable-gallery-content');

    var images = this.getElementsByClass('draggable-gallery-item');
    var renderer = monin.ui.DraggableItemPhotoRenderer.getInstance();
    var item;
    for (var i = 0; i < images.length; i++)
    {
        item = new monin.ui.DraggableGalleryItem(renderer);
        this.addChild(item);
        item.decorate(images[i]);
    }
    this.updateWidth();
};

/** @inheritDoc */
monin.ui.DraggableGallery.prototype.enterDocument = function()
{
    goog.base(this, 'enterDocument');

    var evtType = this.isTouchAvailable_ ? goog.events.EventType.TOUCHSTART :
            goog.events.EventType.MOUSEDOWN;


    this.getHandler().listen(this.getElement(), evtType,
        this.handlePointerDown_);
};

/** @inheritDoc */
monin.ui.DraggableGallery.prototype.getContentElement = function()
{
    return this.contentEl_;
};

/**
 * Returns touch / mousedown position from browser event
 *
 * @param {goog.events.BrowserEvent} e
 * @return {goog.math.Coordinate}
 * @private
 */
monin.ui.DraggableGallery.prototype.getPointerPosition_ = function(e)
{
    return monin.events.getPointerPosition(e);
};

/**
 * Handles pointer down event
 *
 * @param {goog.events.BrowserEvent} e
 * @private
 */
monin.ui.DraggableGallery.prototype.handlePointerDown_ = function(e)
{
    this.pointerDownPos_ = this.getPointerPosition_(e);

    if (!this.pointerDownPos_)
    {
        return;
    }

    e.preventDefault();

    if (this.isTouchAvailable_)
    {
        this.getHandler().listen(window, goog.events.EventType.TOUCHMOVE,
            this.handlePointerMove_);

        this.getHandler().listen(window, goog.events.EventType.TOUCHEND,
            this.handlePointerUp_);
    }
    else
    {
        this.getHandler().listen(document, goog.events.EventType.MOUSEMOVE,
            this.handlePointerMove_);

        this.getHandler().listen(document, goog.events.EventType.MOUSEUP,
            this.handlePointerUp_);

        this.getHandler().listen(document, goog.events.EventType.SELECTSTART,
            this.handleSelectionStart_);
    }

    goog.dom.classes.add(document.body, 'draggable-gallery-dragging', 'unselectable');
};

/**
 * Handles pointer move events
 *
 * @param {goog.events.BrowserEvent} e
 * @private
 */
monin.ui.DraggableGallery.prototype.handlePointerMove_ = function(e)
{
    var pos = this.getPointerPosition_(e);

    if (!pos || !this.pointerDownPos_)
    {
        return;
    }

    if (!this.isDragging_)
    {
        var delta = goog.math.Coordinate.difference(pos, this.pointerDownPos_);

        if (Math.abs(delta.y) > 10)
        {
            this.stopDragging_();
        }
        else if (Math.abs(delta.x) > 15)
        {
            this.startDragging_();
        }

        return;
    }

    e.preventDefault();

    this.end_.x = -(this.pointerDownPos_.x - this.start_.x - pos.x);
    this.velocity_ = pos.x - this.lastPosX_;
    this.lastPosX_ = pos.x;
};

/**
 * Handles pointer up event
 *
 * @param {goog.events.BrowserEvent} e
 * @private
 */
monin.ui.DraggableGallery.prototype.handlePointerUp_ = function(e)
{
    this.stopDragging_();

    if (this.isTouchAvailable_)
    {
        this.getHandler().unlisten(window, goog.events.EventType.TOUCHMOVE,
            this.handlePointerMove_);

        this.getHandler().unlisten(window, goog.events.EventType.TOUCHEND,
            this.handlePointerUp_);
    }
    else
    {
        this.getHandler().unlisten(document, goog.events.EventType.MOUSEMOVE,
            this.handlePointerMove_);

        this.getHandler().unlisten(document, goog.events.EventType.MOUSEUP,
            this.handlePointerUp_);

        this.getHandler().unlisten(document, goog.events.EventType.SELECTSTART,
            this.handleSelectionStart_);
    }


    if (this.snapToItems)
    {
        // Getting current item
        var x = 0, selectedIndex = -1, finalX = 0;
        this.forEachChild(function(child, index) {
            x += child.getWidth();
            if (selectedIndex == -1 && x >= -this.end_.x)
            {
                selectedIndex = index;
                finalX = x;
            }
        }, this);

        if (selectedIndex == -1)
        {
            selectedIndex = this.getChildCount() - 1;
            finalX = x;
        }

        if (this.velocity_ > 0 && selectedIndex != -1)
        {
            finalX -= this.getChildAt(selectedIndex).getWidth();
        }

        finalX = Math.min(finalX, this.getContentElement().offsetWidth - this.getElement().offsetWidth);
        if (this.getContentElement().offsetWidth < this.getElement().offsetWidth)
        {
            finalX = 0;
        }

        this.end_.x = -finalX;
    }

    this.velocity_ = 0;

    this.isDragging_ = false;
};

/**
 * Disables browser selection
 *
 * @param {goog.events.BrowserEvent} e
 * @private
 */
monin.ui.DraggableGallery.prototype.handleSelectionStart_ = function(e)
{
    e.preventDefault();
    return false;
};


/**
 * Handles animation frame
 *
 * @param {number} t
 */
monin.ui.DraggableGallery.prototype.onAnimationFrame = function(t)
{
    // http://en.wikipedia.org/wiki/Hooke's_law
    var k = 0.16;
    var x = this.end_.x - this.offset_.x;
    var f = k * x;

    // close enough, stop
    if (!this.isDragging_ && Math.abs(f) < 0.01)
    {
        this.offset_.x = this.end_.x;
        goog.fx.anim.unregisterAnimation(this);
    }

    // Offset
    this.offset_.x += f;
    this.updateCss_();
};

/**
 * Starts dragging
 *
 * @private
 */
monin.ui.DraggableGallery.prototype.startDragging_ = function()
{
    this.start_.x = this.offset_.x;
    this.end_.x = this.offset_.x;
    this.isDragging_ = true;

    goog.fx.anim.registerAnimation(this);
};

/**
 * Stops dragging
 *
 * @private
 */
monin.ui.DraggableGallery.prototype.stopDragging_ = function()
{
    this.isDragging_ = false;
    goog.dom.classes.remove(document.body, 'draggable-gallery-dragging', 'unselectable');
};

/**
 * Updates position css
 *
 * @private
 */
monin.ui.DraggableGallery.prototype.updateCss_ = function()
{
    var container = this.getContentElement();

    container.style.msTransform = 'translate(' + this.offset_.x + 'px)';
    container.style.MozTransform = 'translate3d(' + this.offset_.x + 'px, 0, 0)';
    container.style.webkitTransform = 'translate3d(' + this.offset_.x + 'px, 0, 0)';

    if (!Modernizr.csstransforms)
    {
        container.style.marginRight = -this.offset_.x + 'px';
    }
};

/**
 * Updates draggable container width
 */
monin.ui.DraggableGallery.prototype.updateWidth = function()
{
   var width = 0;
   this.forEachChild(function(child) {
       width += child.getWidth();
   }, this);

   this.getContentElement().style.width = width + 'px';
};
