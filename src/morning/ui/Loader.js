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
 * @fileoverview Bridge for Canvas Loader class
 * http://heartcode.robertpataki.com/canvasloader/
 * @deprecated Use CSS Loaders
 */
goog.provide('morning.ui.Loader');

goog.require('goog.ui.Component');
goog.require('morning.net.ExternalApi');

/**
 * Loader class
 *
 * @constructor
 * @extends {goog.ui.Component}
 */
morning.ui.Loader = function()
{
    goog.base(this);

    /**
     * @type {CanvasLoader}
     * @private
     */
    this.cl_ = null;

    /**
     * @type {string}
     * @private
     */
    this.color_ = '#000000';

    /**
     * @type {number}
     * @private
     */
    this.density_ = 40;

    /**
     * @type {number}
     * @private
     */
    this.fps_ = 24;

    /**
     * @type {number}
     * @private
     */
    this.diameter_ = 24;

    /**
     * @type {number}
     * @private
     */
    this.range_ = 1.3;

    /**
     * @type {number}
     * @private
     */
    this.speed_ = 2;

    /**
     * @type {string}
     * @private
     */
    this.shape_ = 'oval';

    /**
     * @type {boolean}
     * @private
     */
    this.isVisible_ = false;

    /**
     * @type {boolean}
     * @private
     */
    this.isInitialized_ = false;
};
goog.inherits(morning.ui.Loader, goog.ui.Component);

/**
 * Constructs default loader
 *
 * @param {string=} opt_color
 * @param {number=} opt_diameter
 * @return {morning.ui.Loader}
 */
morning.ui.Loader.factory = function(opt_color, opt_diameter)
{
    opt_color = opt_color || '#f2b607';
    opt_diameter = opt_diameter || 30;

    var loader = new morning.ui.Loader();
    loader.setColor(opt_color); // default is '#000000'
    loader.setDiameter(opt_diameter); // default is 40
    loader.setDensity(30); // default is 40
    loader.setRange(1.1); // default is 1.3
    loader.setFps(30); // default is 24
    return loader;
};

/** @inheritDoc */
morning.ui.Loader.prototype.createDom = function()
{
    this.decorateInternal(this.getDomHelper().createDom('div', 'loader'));

    var ext = morning.net.ExternalApi.getInstance();
    ext.onAvailable('CanvasLoader', this.initializeLoader_, this);
};

/** @inheritDoc */
morning.ui.Loader.prototype.enterDocument = function()
{
    goog.base(this, 'enterDocument');

};

/** @inheritDoc */
morning.ui.Loader.prototype.disposeInternal = function()
{
    goog.base(this, 'disposeInternal');

    if (this.cl_)
    {
        this.cl_.kill();
    }
};

/**
 * Initializes loader, when canvasloader api is available
 *
 * @private
 */
morning.ui.Loader.prototype.initializeLoader_ = function()
{
    if (this.isDisposed())
    {
        return;
    }

    this.getElement().id = this.makeId('loader');

    var cl = new CanvasLoader(this.getElement().id, {
        id: this.makeId('loader-canvas')
    });

    cl.setColor(this.color_); // default is '#000000'
    cl.setDiameter(this.diameter_); // default is 40
    cl.setDensity(this.density_); // default is 40
    cl.setRange(this.range_); // default is 1.3
    cl.setShape(this.shape_);
    cl.setSpeed(this.speed_);
    cl.setFPS(this.fps_); // default is 24

    if (this.isVisible_)
    {
        cl.show();
    }

    this.cl_ = cl;

    this.isInitialized_ = true;
    this.dispatchEvent(morning.ui.Loader.EventType.INITIALIZE);
};

/**
 * Returns true if loader is initialized
 *
 * @return {boolean}
 */
morning.ui.Loader.prototype.isInitialized = function()
{
    return this.isInitialized_;
};

/**
 * Sets loader color
 *
 * @param {string} color
 */
morning.ui.Loader.prototype.setColor = function(color)
{
    this.color_ = color;
    if (this.cl_)
    {
        this.cl_.setColor(color);
    }
};

/**
 * Sets loader diameter
 *
 * @param {number} diameter
 */
morning.ui.Loader.prototype.setDiameter = function(diameter)
{
    this.diameter_ = diameter;
    if (this.cl_)
    {
        this.cl_.setDiameter(diameter);
    }
};

/**
 * Sets loader range
 *
 * @param {number} range
 */
morning.ui.Loader.prototype.setRange = function(range)
{
    this.range_ = range;
    if (this.cl_)
    {
        this.cl_.setRange(range);
    }
};

/**
 * Sets loader density
 *
 * @param {number} density
 */
morning.ui.Loader.prototype.setDensity = function(density)
{
    this.density_ = density;
    if (this.cl_)
    {
        this.cl_.setDensity(density);
    }
};

/**
 * Sets loader FPS
 *
 * @param {number} fps
 */
morning.ui.Loader.prototype.setFps = function(fps)
{
    this.fps_ = fps;
    if (this.cl_)
    {
        this.cl_.setFPS(fps);
    }
};

/**
 * Sets loader shape
 *
 * @param {string} shape
 */
morning.ui.Loader.prototype.setShape = function(shape)
{
    this.shape_ = shape;
    if (this.cl_)
    {
        this.cl_.setShape(this.shape_);
    }
};

/**
 * Sets loader speed
 *
 * @param {number} speed
 */
morning.ui.Loader.prototype.setSpeed = function(speed)
{
    this.speed_ = speed;
    if (this.cl_)
    {
        this.cl_.setSpeed(this.speed_);
    }
};

/**
 * Sets loader visibility
 *
 * @param {boolean} isVisible
 */
morning.ui.Loader.prototype.setVisible = function(isVisible)
{
    this.isVisible_ = isVisible;


    if (this.cl_)
    {
        if (isVisible)
        {
            this.cl_.show();
        }
        else
        {
            this.cl_.hide();
        }
    }
};

/**
 * Enumiration for loader events
 *
 * @enum {string}
 */
morning.ui.Loader.EventType = {
    INITIALIZE: 'initialize'
};
