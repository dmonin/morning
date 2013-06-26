goog.provide('monin.parallax.ui.Scene');
goog.require('goog.dom.classes');
goog.require('goog.fx.Animation');
goog.require('goog.fx.easing');
goog.require('goog.ui.Component');
goog.require('goog.ui.registry');
goog.require('monin.parallax.model.SceneConfig');

/**
 * @constructor
 * @extends {goog.ui.Component}
 */
monin.parallax.ui.Scene = function()
{
    goog.base(this);

    /**
     * @type {monin.parallax.model.SceneConfig}
     * @private
     */
    this.config_ = null;

    /**
     * @type {number}
     * @private
     */
    this.loadedCount_ = 0;

    /**
     * @type {number}
     * @private
     */
    this.loadedTotalCount_ = 0;

    /**
     * @type {goog.structs.Map}
     * @private
     */
    this.elements_ = new goog.structs.Map();
};
goog.inherits(monin.parallax.ui.Scene, goog.ui.Component);

/**
 * @param {goog.math.Size} size
 */
monin.parallax.ui.Scene.prototype.adjustToSize = function(size)
{
    goog.array.forEach(this.elements_.getValues(), function(el) {
        el.adjustToSize(size);
    });
};

/** @inheritDoc */
monin.parallax.ui.Scene.prototype.decorateInternal = function(el)
{
    goog.base(this, 'decorateInternal', el);

    var elements = this.getElementsByClass('prlx-element');
    var cmp;
    for (var i = 0; i < elements.length; i++)
    {
        cmp = goog.ui.registry.getDecorator(elements[i]);
        this.addChild(cmp);
        cmp.decorate(elements[i]);

        this.elements_.set(elements[i].id, cmp);
        if (goog.DEBUG)
        {
            console.info('Initializing Element: %o', cmp);
        }

        if (cmp.isLoadable())
        {
            this.getHandler().listen(cmp, monin.parallax.ui.Element.EventType.LOAD,
                this.handleElementLoad_);
            this.loadedTotalCount_++;
        }
    }

    if (this.loadedCount_ == this.loadedTotalCount_)
    {
        this.dispatchEvent(monin.parallax.ui.Scene.EventType.COMPLETE);
    }
};

/**
 * @param {goog.math.Size} size
 * @return {number}
 */
monin.parallax.ui.Scene.prototype.getBottom = function(size)
{
    if (!this.config_)
    {
        return 0;
    }

    return this.config_.range.end;
};

/**
 * @return {Object}
 */
monin.parallax.ui.Scene.prototype.getConfig = function()
{
    return this.config_;
};

/**
 * @param {string} elementId
 * @return {monin.parallax.ui.Element}
 */
monin.parallax.ui.Scene.prototype.getElementById = function(elementId)
{
    return /** @type {monin.parallax.ui.Element} */ (this.elements_.get(elementId));
};

/**
 * @return {number}
 */
monin.parallax.ui.Scene.prototype.getPosition = function()
{
    return this.config_ && this.config_.position ? this.config_.position : 0;
};

/**
 * @param {goog.events.Event} e
 * @private
 */
monin.parallax.ui.Scene.prototype.handleElementLoad_ = function(e)
{
    this.loadedCount_++;
    this.dispatchEvent(monin.parallax.ui.Scene.EventType.PROGRESS);

    if (this.loadedCount_ == this.loadedTotalCount_)
    {
        this.dispatchEvent(monin.parallax.ui.Scene.EventType.COMPLETE);
    }
};

/**
 * @return {number}
 */
monin.parallax.ui.Scene.prototype.getLoadProgress = function()
{
    return this.loadedTotalCount_ > 0 ? this.loadedCount_ / this.loadedTotalCount_ : 1;
};

/**
 * @param {goog.events.Event} e
 * @private
 */
monin.parallax.ui.Scene.prototype.handlePositionAnimation_ = function(e)
{
    this.config_.position = e.coords[0];
    this.dispatchEvent(monin.parallax.ui.Scene.EventType.UPDATE_REQUIRED);
};

/**
 * @param {number} position
 * @return {boolean}
 */
monin.parallax.ui.Scene.prototype.isVisible = function(position)
{
    return this.config_ && this.config_.range ?
        goog.math.Range.containsPoint(this.config_.range, position) : true;
};

/**
 * @param {Object} config
 * @param {monin.parallax.effects.EffectFactory} effectFactory
 */
monin.parallax.ui.Scene.prototype.setConfig = function(config, effectFactory)
{
    this.config_ = monin.parallax.model.SceneConfig.factory(config);

    for (var id in config['elements'])
    {
        if (!this.elements_.get(id))
        {
            throw new Error('Element with id ' + id + ' doesn\'t exists.');
        }

        this.elements_.get(id).setConfig(config['elements'][id], effectFactory);
    }

    if (this.getElement() && this.config_.zIndex)
    {
        this.getElement().style.zIndex = this.config_.zIndex;
    }


};

/**
 * @param {number} position
 * @param {number=} opt_duration
 */
monin.parallax.ui.Scene.prototype.setPosition = function(position, opt_duration)
{
    if (opt_duration)
    {
        if (this.positionChangeAnim_)
        {
            this.positionChangeAnim_.stop();
            this.positionChangeAnim_.dispose();
        }

        this.positionChangeAnim_ = new goog.fx.Animation([this.config_.position],
            [position], opt_duration, goog.fx.easing.easeOut);

        this.getHandler().listen(this.positionChangeAnim_,
            [goog.fx.Animation.EventType.ANIMATE,
            goog.fx.Transition.EventType.FINISH],
            this.handlePositionAnimation_);

        this.positionChangeAnim_.play();
    }
    else
    {
        this.config_.position = position;
        this.config_.range = new goog.math.Range(
            this.config_.position + this.config_.rangeOffset[0],
            this.config_.position + this.config_.rangeOffset[1]);
        this.dispatchEvent(monin.parallax.ui.Scene.EventType.UPDATE_REQUIRED);
    }
};

/**
 * @param {number} position
 * @param {goog.math.Size} size
 */
monin.parallax.ui.Scene.prototype.update = function(position, size)
{
    // Calculating offset
    var delta = position - this.config_.position;
    var offset = delta / 1000;
    goog.array.forEach(this.elements_.getValues(), function(el) {
        el.update(offset, size, position);
    });


};

monin.parallax.ui.Scene.EventType = {
    UPDATE_REQUIRED: 'scene:update_required',
    PROGRESS: 'scene:progress',
    COMPLETE: 'scene:complete'
};


/**
 * Register this control so it can be created from markup.
 */
goog.ui.registry.setDecoratorByClassName(
    'scene-default',
    function() {
      return new monin.parallax.ui.Scene();
    });
