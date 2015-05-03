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
 * @fileoverview Scales and re-positions image to specified size.
 */

goog.provide('monin.ui.CoverBackground');

goog.require('goog.math.Size');
goog.require('goog.ui.Component');
goog.require('monin.models.Image');

/**
 * Scales and re-positions image to specified size.
 *
 * @constructor
 * @param {monin.models.Image=} opt_image
 * @extends {goog.ui.Component}
 */
monin.ui.CoverBackground = function(opt_image)
{
    goog.base(this);

    /**
     * @type {Element}
     * @protected
     */
    this.imgEl = null;

    /**
     * @type {goog.math.Size}
     * @protected
     */
    this.coverSize = null;

    /**
     * @type {monin.models.Image}
     */
    this.image = opt_image || null;

    if (this.image)
    {
        this.image.setParentEventTarget(this);
    }

    /**
     * @type {Array.<monin.models.Image>}
     * @private
     */
    this.images_ = null;

    /**
     * @type {string}
     */
    this.alignment = 'center';
};
goog.inherits(monin.ui.CoverBackground, goog.ui.Component);


/**
 * Name of base CSS class
 * @type {string}
 * @private
 */
monin.ui.CoverBackground.BASE_CSS_CLASS_ = goog.getCssName('cover-background');

/**
 * Returns base CSS class. This getter is used to get base CSS class part.
 * All CSS class names in component are created as:
 *   goog.getCssName(this.getBaseCssClass(), 'CLASS_NAME')
 * @return {string} Base CSS class.
 */
monin.ui.CoverBackground.prototype.getBaseCssClass = function()
{
    return monin.ui.CoverBackground.BASE_CSS_CLASS_;
};

/**
 * Returns source image size
 *
 * @return {goog.math.Size}
 */
monin.ui.CoverBackground.prototype.getOriginalSize = function()
{
    return this.image.size;
};

/**
 * Returns current destination size
 *
 * @return {goog.math.Size}
 */
monin.ui.CoverBackground.prototype.getSize = function()
{
    return this.coverSize;
};

/** @inheritDoc */
monin.ui.CoverBackground.prototype.createDom = function()
{
    var baseClass = this.getBaseCssClass();
    var domHelper = this.getDomHelper();

    var el = domHelper.createDom('div', baseClass, [
        this.imgEl = domHelper.createDom('img', {
            className: goog.getCssName(baseClass, 'img')
        })]
    );

    if (this.image)
    {
        this.imgEl.src = this.image.src;
        if (!this.image.size)
        {
            this.image.load(function() {
                this.imgEl.width = this.image.size.width;
                this.imgEl.height = this.image.size.height;
            }, this);
        }
        else
        {
            this.imgEl.width = this.image.size.width;
            this.imgEl.height = this.image.size.height;
        }
    }

    this.decorateInternal(el);
};

/** @inheritDoc */
monin.ui.CoverBackground.prototype.decorateInternal = function(el)
{
    goog.base(this, 'decorateInternal', el);

    // Component was not rendered by itself
    if (!this.image && !this.imgEl)
    {
        var imgEl = this.getElementByClass('cover-background-img');

        if (imgEl)
        {
            var width = Number(imgEl.getAttribute('width'));
            var height = Number(imgEl.getAttribute('height'));
            var size = null;

            if (width > 0 && height > 0)
            {
                size = new goog.math.Size(width, height);
            }

            this.image = new monin.models.Image(imgEl.src, size);
            this.image.setParentEventTarget(this);

            this.imgEl = imgEl;
        }
    }
};

/** @inheritDoc */
monin.ui.CoverBackground.prototype.enterDocument = function()
{
    goog.base(this, 'enterDocument');

    if (this.image)
    {
        this.image.load(this.handleImageLoad_, this);
    }
};

/**
 * @private
 */
monin.ui.CoverBackground.prototype.handleImageLoad_ = function()
{
    if (this.coverSize)
    {
        this.setSize(this.coverSize);
    }
};

/**
 * Resizes element to specified size
 *
 * @param {Element} element element to be resized
 * @param {goog.math.Size} srcSize original size
 * @param {goog.math.Size} dstSize destination size
 * @protected
 */
monin.ui.CoverBackground.prototype.resize = function(element, srcSize, dstSize)
{
    srcSize = srcSize.clone();

    var fitSize = dstSize.clone();
    if (dstSize.aspectRatio() - srcSize.aspectRatio() > 0)
    {
        fitSize.height = 10000;
    }
    else
    {
        fitSize.width = 10000;
    }

    srcSize.scaleToFit(fitSize);

    element.width = srcSize.width;
    element.height = srcSize.height;

    element.style.width = Math.round(srcSize.width) + 'px';
    element.style.height = Math.round(srcSize.height) + 'px';

    element.style.left = Math.floor((dstSize.width - srcSize.width)) / 2 + 'px';

    if (this.alignment == 'center')
    {
        element.style.top = Math.floor((dstSize.height - srcSize.height)) / 2 + 'px';
    }
    else if (this.alignment == 'bottom')
    {
        element.style.top = (dstSize.height - srcSize.height) + 'px';
    }
    else if (this.alignment == 'top')
    {
        element.style.top = '0px';
    }
};

/**
 * Sets images
 *
 * @param {Array.<monin.models.Image>} images
 */
monin.ui.CoverBackground.prototype.setImages = function(images)
{
    images.sort(function(imgA, imgB) {
        return imgA.size.width > imgB.size.width ? 1 : -1;
    });

    this.images_ = images;
};

/**
 * Specifies destination size
 *
 * @param {goog.math.Size} coverSize
 */
monin.ui.CoverBackground.prototype.setSize = function(coverSize)
{
    var el = this.getElement();
    if (!el)
    {
        throw new Error("CoverBackground is not yet rendered.");
    }
    el.style.width = coverSize.width + 'px';
    el.style.height = coverSize.height + 'px';

    this.coverSize = coverSize;

    if (!this.image.size)
    {
        return;
    }

    this.resize(this.imgEl, this.image.size, coverSize);
    var imgSize = /** @type {goog.math.Size!} */ (this.image.size);
    if (!coverSize.fitsInside(imgSize))
    {
        this.tryImproveImage_();
    }
};

/**
 * Sets visibility state
 *
 * @param {boolean} isVisible
 */
monin.ui.CoverBackground.prototype.setVisible = function(isVisible)
{
    if (!this.getElement())
    {
        return;
    }
    goog.dom.classlist.enable(this.getElement(), 'visible', isVisible);
};

/**
 * Goes through available images and updates image source to best
 * possible resolution
 *
 * @private
 */
monin.ui.CoverBackground.prototype.tryImproveImage_ = function()
{
    if (!this.images_)
    {
        return;
    }

    var i, bestMatchingImage;
    var imgSize, coverSize = /** @type {goog.math.Size} */ (this.coverSize);

    for (i = 0; i < this.images_.length; i++)
    {
        bestMatchingImage = this.images_[i];
        imgSize = /** @type {goog.math.Size!} */ (this.images_[i].size);

        if (coverSize.fitsInside(imgSize))
        {
            break;
        }
    }

    if (bestMatchingImage.src != this.image.src)
    {
        this.image = bestMatchingImage;
        this.image.load();
        this.image.setParentEventTarget(this);
        this.imgEl.src = this.image.src;
    }
};