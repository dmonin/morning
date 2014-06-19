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
 * @fileoverview Swiffy Animation, small sized vector animations.
 * @see https://www.google.com/doubleclick/studio/swiffy/
 *
 * Export SWF in ActionScript 2.0 with following code in the first frame:
 * _root.stop();
 * _root.onEnterFrame = function(){
 *   if(_level0.gotoframe) {
 *     _root.gotoAndStop(_level0.gotoframe);
 *   }
 *   _level0.gotoframe = undefined;
 * }
 *
 * Alternatively export SWF in ActionScript 3.0 with following code in
 * the first frame:
 *
 * stop();
 * addEventListener(Event.ENTER_FRAME, onEnterFrame);
 * function onEnterFrame(e:Event):void {
 *   if(stage.loaderInfo.parameters["gotoframe"]) {
 *     gotoAndStop(stage.loaderInfo.parameters["gotoframe"]);
 *   }
 *   stage.loaderInfo.parameters["gotoframe"] = undefined;
 * }
 *
 */
goog.provide('monin.ui.Swiffy');
goog.require('monin.parallax.ui.Element');
goog.require('goog.dom.dataset');
goog.require('goog.net.XhrIo');
goog.require('goog.Timer');
goog.require('monin.net.ExternalApi');
goog.require('goog.fx.Animation');
goog.require('goog.fx.Transition');

/**
 * Constructor for Swiffy animation
 *
 * @constructor
 * @extends {goog.ui.Component}
 */
monin.ui.Swiffy = function()
{
    goog.base(this);

   /**
    * Current frame
    *
    * @type {number}
    * @private
    */
    this.frame_ = 1;

    /**
     * Number of frame
     *
     * @type {number}
     * @private
     */
    this.frameCount_ = 1;

    /**
     * Loads Swiffy data over XHR
     *
     * @type {goog.net.XhrIo}
     * @private
     */
    this.xhrIo_ = new goog.net.XhrIo();

    /**
     * Swiffy Stage
     *
     * @type {swiffy.Stage}
     * @private
     */
    this.stage_ = null;

    /**
     * Animation Configuration (JSON), loaded over XhrIo request
     *
     * @type {Object}
     * @private
     */
    this.data_ = null;

    /**
     * Defines whether swiffy has been initialized
     *
     * @type {boolean}
     * @private
     */
    this.isInitialized_ = false;

    /**
     * Timer for playing of animation
     *
     * @type {goog.Timer}
     * @private
     */
    this.timer_ = new goog.Timer(1000/25);


    /**
     * Defines whether animation should be looped
     *
     * @type {boolean}
     */
    this.loop = true;
};

goog.inherits(monin.ui.Swiffy, goog.ui.Component);

/** @inheritDoc */
monin.ui.Swiffy.prototype.createDom = function()
{
    var el = this.getDomHelper().createDom('div', 'swiffy');
    this.decorateInternal(el);
};

/** @inheritDoc */
monin.ui.Swiffy.prototype.decorateInternal = function(el)
{
    goog.base(this, 'decorateInternal', el);

    var src = goog.dom.dataset.get(el, 'src');
    if (src)
    {
        this.load(src);
    }
};

/** @inheritDoc */
monin.ui.Swiffy.prototype.enterDocument = function()
{
    goog.base(this, 'enterDocument');

    if (!this.stage_ && this.data_)
    {
        this.initialize_();
    }

    this.getHandler().listen(this.timer_, goog.Timer.TICK,
        this.handleTick_);

};

/**
 * Handles JSON Response and initializes
 * animation configuration if already rendered
 *
 * @param  {goog.events.Event} e
 * @private
 */
monin.ui.Swiffy.prototype.handleData_ = function(e)
{
    this.data_ = e.target.getResponseJson();

    if (this.isInDocument())
    {
        this.initialize_();
    }
};

/**
 * @private
 */
monin.ui.Swiffy.prototype.handleTick_ = function()
{
    var frame = this.frame_;
    frame++;
    frame = frame % this.frameCount_;
    if (this.frame_ == this.frameCount_ - 1)
    {
        this.dispatchEvent(goog.fx.Transition.EventType.END);
        if (!this.loop)
        {
            this.stop();
        }
    }
    this.setFrame(frame);
};

/**
 * Returns current frame
 *
 * @return {number}
 */
monin.ui.Swiffy.prototype.getFrame = function()
{
    return this.frame_;
};

/**
 * Initializes Swiffy stage
 *
 * @private
 */
monin.ui.Swiffy.prototype.initialize_ = function()
{
    if (!this.stage_ && this.getElement() && this.data_)
    {
        this.stage_ = new swiffy.Stage(this.getElement(), this.data_);
        this.stage_.setBackground('transparent');
        this.stage_.start();
        this.setFrame(this.frame_);

        this.frameCount_ = Number(this.data_['frameCount']);
        this.timer_.setInterval(1000 / this.data_['frameRate']);
    }
};

/**
 * Loads JSON Configuration
 *
 * @param  {string} src
 */
monin.ui.Swiffy.prototype.load = function(src)
{
    goog.net.XhrIo.send(src, goog.bind(this.handleData_, this));
};

/**
 * Plays Swiffy Animation
 */
monin.ui.Swiffy.prototype.play = function()
{
    this.timer_.start();
};


/**
 * Sets Swiffy frame
 *
 * @param {number} frame
 */
monin.ui.Swiffy.prototype.setFrame = function(frame)
{
    if (!this.stage_)
    {
        this.frame_ = frame;
        return;
    }

    if (frame == this.frame_ && this.isInitialized_)
    {
        return;
    }

    this.stage_.setFlashVars('gotoframe=' + frame);
    this.frame_ = frame;

    this.isInitialized_ = true;

    this.dispatchEvent(goog.fx.Animation.EventType.ANIMATE);
};

/**
 * Stop Swiffy Animation
 */
monin.ui.Swiffy.prototype.stop = function()
{
    this.timer_.stop();
};

/**
 * Register this control so it can be created from markup.
 */
goog.ui.registry.setDecoratorByClassName(
    'swiffy',
    function() {
      return new monin.ui.Swiffy();
    });
