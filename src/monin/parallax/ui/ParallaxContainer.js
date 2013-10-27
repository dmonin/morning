goog.provide('monin.parallax.ui.ParallaxContainer');

goog.require('goog.dom.dataset');
goog.require('goog.events.KeyCodes');
goog.require('goog.events.MouseWheelHandler');
goog.require('goog.fx.anim');
goog.require('goog.net.XhrIo');
goog.require('goog.storage.Storage');
goog.require('goog.storage.mechanism.mechanismfactory');
goog.require('goog.structs.Map');
goog.require('goog.ui.Component');
goog.require('monin.events');


/**
 * @constructor
 * @extends {goog.ui.Component}
 * @implements {goog.fx.anim.Animated}
 */
monin.parallax.ui.ParallaxContainer = function()
{
    goog.base(this);

    /**
     * @type {goog.events.MouseWheelHandler}
     * @private
     */
    this.mouseWheelHandler_ = null;

    /**
     * @type {goog.math.Size}
     * @private
     */
    this.size_ = null;

    /**
     * @type {number}
     * @private
     */
    this.scrollPos_ = 0;

    /**
     * @type {number}
     * @private
     */
    this.endScrollPos_ = 0;

    /**
     * @type {number}
     * @private
     */
    this.bottomPosition_ = 0;

    /**
     * @type {goog.structs.Map}
     * @private
     */
    this.scenes_ = new goog.structs.Map();

    /**
     * @type {goog.net.XhrIo}
     * @private
     */
    this.xhrIo_ = new goog.net.XhrIo();

    /**
     * @type {boolean}
     */
    this.smoothScrolling = true;//!('ontouchstart' in goog.dom.getDocument());

    /**
     * @type {boolean}
     */
    this.saveLastPosition = false;

    /**
     * @type {boolean}
     * @private
     */
    this.initialized_ = false;

    /**
     * @type {Element}
     * @private
     */
    this.mouseWheelTarget_ = null;

    /**
     * @type {monin.parallax.effects.EffectFactory}
     * @private
     */
    this.effectFactory_ = new monin.parallax.effects.EffectFactory();

    var mechanism = /** @type {goog.storage.mechanism.Mechanism!} */
        (goog.storage.mechanism.mechanismfactory.createHTML5SessionStorage('grad17'));

    /**
     * @type {goog.storage.Storage}
     * @private
     */
    this.storage_ = new goog.storage.Storage(mechanism);

    /**
     * @type {goog.async.Delay}
     * @private
     */
    this.snapDelay_ = new goog.async.Delay(this.snap_, 1000, this);

    /**
     * @type {boolean}
     */
    this.snappable = true;

    /**
     * @type {number}
     */
    this.speedFactor = 8;
};
goog.inherits(monin.parallax.ui.ParallaxContainer, goog.ui.Component);

/**
 * @param {string} name
 * @param {monin.parallax.ui.Scene} scene
 */
monin.parallax.ui.ParallaxContainer.prototype.addScene = function(name, scene)
{
    if (!this.scenes_.containsValue(scene))
    {
        this.scenes_.set(name, scene);
    }
};

/**
 * @private
 */
monin.parallax.ui.ParallaxContainer.prototype.calculateBottom_ = function()
{
    if (goog.DEBUG)
    {
        console.info('ParallaxContainer: Calculating bottom position...');
    }

    var bottom = 0;
    goog.array.forEach(this.scenes_.getValues(), function(scene) {
        bottom = Math.max(scene.getBottom(this.size_), bottom);
    }, this);

    if (this.bottomPosition_ != bottom)
    {
        this.bottomPosition_ = bottom;
        this.dispatchEvent({
            type: monin.parallax.ui.ParallaxContainer.EventType.MAX_POSITION_CHANGED,
            max: bottom
        });
    }
};

/** @inheritDoc */
monin.parallax.ui.ParallaxContainer.prototype.createDom = function()
{
    var domHelper = this.getDomHelper();
    var el = domHelper.createDom('div', 'parallax-container');
    this.decorateInternal(el);
};

/** @inheritDoc */
monin.parallax.ui.ParallaxContainer.prototype.decorateInternal = function(el)
{
    goog.base(this, 'decorateInternal', el);

    var mouseWheelTarget = this.mouseWheelTarget_ || el;
    this.mouseWheelHandler_ = new goog.events.MouseWheelHandler(mouseWheelTarget);

    var sceneElements = this.getElementsByClass('scene');
    var cmp, sceneName;

    for (var i = 0; i < sceneElements.length; i++)
    {
        cmp = this.sceneFactory_(sceneElements[i]);
        if (goog.DEBUG && !cmp)
        {
            console.error('Component couldn\'t be fetched %o', sceneElements[i]);
        }
        this.addChild(cmp);
        cmp.decorate(sceneElements[i]);

        cmp.name = goog.dom.dataset.get(sceneElements[i], 'name');

        if (!cmp.name)
        {
            if (goog.DEBUG)
            {
                console.warn('Scene %o element omits data-name attribute.', sceneElements[i]);
            }
            throw new Error('Scene element omits data-name attribute.');
        }

        this.scenes_.set(cmp.name, cmp);
    }

    if (goog.DEBUG)
    {
        console.info('ParallaxContainer: Scenes initialized');
    }
};

/** @inheritDoc */
monin.parallax.ui.ParallaxContainer.prototype.enterDocument = function()
{
    goog.base(this, 'enterDocument');

    this.getHandler().listen(this.mouseWheelHandler_,
            goog.events.MouseWheelHandler.EventType.MOUSEWHEEL,
            this.handleMouseWheel_);

    this.getHandler().listen(this,
        monin.parallax.ui.Scene.EventType.UPDATE_REQUIRED,
        this.handleSceneUpdateRequired_);

    this.getHandler().listen(this.getElement(),
        goog.events.EventType.TOUCHSTART,
        this.handleTouchStart_);



    this.getHandler().listen(document,
        goog.events.EventType.KEYDOWN,
        this.handleKey_);

    goog.fx.anim.registerAnimation(this);
};

/**
 * @return {number}
 */
monin.parallax.ui.ParallaxContainer.prototype.getMaxPosition = function()
{
    return this.bottomPosition_;
};

/**
 * @param {goog.events.Event} e
 * @private
 */
monin.parallax.ui.ParallaxContainer.prototype.handleConfigLoad_ = function(e)
{
    var config = e.target.getResponseJson();

    if (goog.DEBUG)
    {
        console.info('ParallaxContainer: Config Loaded');
    }

    for (var key in config)
    {
        var sceneConfig = config[key];
        var scene = this.scenes_.get(key);
        if (!scene)
        {
            throw new Error('Scene with ID: ' + key + ', couldn\'t be found.');
        }

        scene.setConfig(sceneConfig, this.effectFactory_);
        if (sceneConfig['addEffects'])
        {
            this.addEffects_(sceneConfig['position'],
                sceneConfig['addEffects']);
        }
    }

    if (goog.DEBUG)
    {
        console.info('ParallaxContainer: Config Updated');
    }

    this.calculateBottom_();

    if (this.size_)
    {
        this.setSize(this.size_);
    }

    if (this.saveLastPosition)
    {
        var scrollPos = this.storage_.get('scrollpos');

        if (scrollPos)
        {
            this.scrollPos_ = Number(scrollPos);
            this.setTargetPosition(Number(scrollPos));
        }
    }

    this.initialized_ = true;


    if (goog.DEBUG)
    {
        console.info('ParallaxContainer: Performing first update...');
    }

    this.updateScenes_();

    this.dispatchEvent(monin.parallax.ui.ParallaxContainer.EventType.INITIALIZED);

};

/**
 * @param {string} url
 */
monin.parallax.ui.ParallaxContainer.prototype.loadConfig = function(url)
{
    this.getHandler().listenOnce(this.xhrIo_, goog.net.EventType.COMPLETE,
        this.handleConfigLoad_);
    this.xhrIo_.send(url);
};

/**
 * @return {monin.parallax.ui.Scene}
 */
monin.parallax.ui.ParallaxContainer.prototype.getCurrentScene = function()
{
    var found = null;
    goog.array.forEach(this.scenes_.getValues(), function(scene) {
        if (typeof scene.getConfig().navigationName != 'undefined' && scene.getPosition() <= this.endScrollPos_)
        {
            found = scene;
        }
    }, this);

    return found;
};

/**
 * @return {number}
 */
monin.parallax.ui.ParallaxContainer.prototype.getLoadProgress = function()
{
    var loadProgress = 0;
    var sceneCount = 0;
    this.forEachChild(function(child) {
        if (child instanceof monin.parallax.ui.Scene)
        {
            loadProgress += child.getLoadProgress();
            sceneCount++;
        }
    }, this);

    return loadProgress / sceneCount;
};

/**
 * @return {number}
 */
monin.parallax.ui.ParallaxContainer.prototype.getPosition = function()
{
    return this.endScrollPos_;
};

/**
 * @param {string} sceneName
 * @return {monin.parallax.ui.Scene}
 */
monin.parallax.ui.ParallaxContainer.prototype.getScene = function(sceneName)
{
    return /** @type {monin.parallax.ui.Scene} */ (this.scenes_.get(sceneName));
};

/**
 * @return {Array.<monin.parallax.ui.Scene>}
 */
monin.parallax.ui.ParallaxContainer.prototype.getScenes = function()
{
    return this.scenes_.getValues();
};

/**
 * @param {string} sceneName
 * @return {monin.parallax.ui.Scene}
 */
monin.parallax.ui.ParallaxContainer.prototype.getSceneByNavigationName = function(sceneName)
{
    var found = null;
    goog.array.forEach(this.scenes_.getValues(), function(scene) {
        if (scene.getConfig().navigationName == sceneName)
        {
            found = scene;
        }
    }, this);

    return found;
};

/**
 * @return {goog.math.Size}
 */
monin.parallax.ui.ParallaxContainer.prototype.getSize = function()
{
    return this.size_;
};

/**
 * @private
 */
monin.parallax.ui.ParallaxContainer.prototype.onAnimationFrame = function(e)
{
    if (this.scrollPos_ == this.endScrollPos_)
    {
        return;
    }

    var delta = (this.endScrollPos_ - this.scrollPos_) / this.speedFactor;

    if (Math.abs(delta) < 1 || !this.smoothScrolling)
    {
        this.scrollPos_ = this.endScrollPos_;
    }
    else
    {
        this.scrollPos_ += delta;
    }

    this.updateScenes_();

    this.dispatchEvent({
        type: monin.parallax.ui.ParallaxContainer.EventType.SCROLL_POSITION_CHANGED,
        position: this.scrollPos_
    });
};

/**
 * @param {goog.events.BrowserEvent} e
 */
monin.parallax.ui.ParallaxContainer.prototype.handleKey_ = function(e)
{
    switch (e.keyCode)
    {
        case goog.events.KeyCodes.HOME:
            this.setTargetPosition(0);
            break;
        case goog.events.KeyCodes.END:
            this.setTargetPosition(this.bottomPosition_);
            break;
        case goog.events.KeyCodes.PAGE_UP:
            this.setTargetPosition(this.endScrollPos_ - this.size_.height);
            break;
        case goog.events.KeyCodes.PAGE_DOWN:
            this.setTargetPosition(this.endScrollPos_ + this.size_.height);
            break;

        case goog.events.KeyCodes.RIGHT:
        case goog.events.KeyCodes.DOWN:
            this.setTargetPosition(this.endScrollPos_ + 30);
            break;
        case goog.events.KeyCodes.UP:
        case goog.events.KeyCodes.LEFT:
            this.setTargetPosition(this.endScrollPos_ - 30);
            break;
    }
};

/**
 * @param {goog.events.Event} e
 * @private
 */
monin.parallax.ui.ParallaxContainer.prototype.handleMouseWheel_ = function(e)
{
    var delta = this.smoothScrolling ? 300 : 100;
    var offset = e.deltaY > 0 ? delta : -delta;

    this.setTargetPosition(this.scrollPos_ + offset);



    if (this.saveLastPosition)
    {
        this.storage_.set('scrollpos', this.endScrollPos_);
    }
//    if (!this.smoothScrolling)
//    {
//        this.scrollPos_ = this.endScrollPos_;
//    }
};

/**
 * @param {goog.events.BrowserEvent} e
 * @private
 */
monin.parallax.ui.ParallaxContainer.prototype.handleTouchStart_ = function(e)
{
    e.preventDefault();

    this.touchStartPos_ = /** @type {goog.math.Coordinate} */ (monin.events.getPointerPosition(e));

    this.getHandler().listen(document.body, goog.events.EventType.TOUCHMOVE,
        this.handleTouchMove_);

    this.getHandler().listen(document.body, goog.events.EventType.TOUCHEND,
        this.handleTouchEnd_);
};

/**
 * @param {goog.events.BrowserEvent} e
 * @private
 */
monin.parallax.ui.ParallaxContainer.prototype.handleTouchMove_ = function(e)
{
    var touchPos = /** @type {goog.math.Coordinate!} */ (monin.events.getPointerPosition(e));
    var previousPos = /** @type {goog.math.Coordinate!} */ (this.touchStartPos_);
    var delta = goog.math.Coordinate.difference(previousPos, touchPos);
    if (Math.abs(delta.y) > Math.abs(delta.x))
    {
        this.endScrollPos_ = this.endScrollPos_ + delta.y * 2;
        this.strictPos_();
    }

    this.touchStartPos_ = touchPos;
};

/**
 * @param {goog.events.Event} e
 * @private
 */
monin.parallax.ui.ParallaxContainer.prototype.handleTouchEnd_ = function(e)
{
    this.getHandler().unlisten(document.body, goog.events.EventType.TOUCHMOVE,
        this.handleTouchMove_);

    this.getHandler().unlisten(document.body, goog.events.EventType.TOUCHEND,
        this.handleTouchEnd_);
};

/**
 * @param {goog.events.Event} e
 * @private
 */
monin.parallax.ui.ParallaxContainer.prototype.handleSceneUpdateRequired_ = function(e)
{
    this.calculateBottom_();
    this.strictPos_();
    this.updateScenes_();
};

/**
 *
 */
monin.parallax.ui.ParallaxContainer.prototype.moveToNext = function()
{
    var found = false;
    goog.array.forEach(this.scenes_.getValues(), function(scene) {
        if (!found && scene.getConfig().snappable && scene.getPosition() > this.endScrollPos_)
        {
            this.setTargetPosition(scene.getPosition());
            found = true;
        }
    }, this);
};

/**
 *
 */
monin.parallax.ui.ParallaxContainer.prototype.moveToPrevious = function()
{
    var found = false;
    goog.array.forEachRight(this.scenes_.getValues(), function(scene) {
        if (!found && scene.getConfig().snappable && scene.getPosition() < this.endScrollPos_)
        {
            this.setTargetPosition(scene.getPosition());
            found = true;
        }
    }, this);
};

/**
 * @param {monin.parallax.effects.EffectFactory} effectFactory
 */
monin.parallax.ui.ParallaxContainer.prototype.setEffectFactory = function(effectFactory)
{
    this.effectFactory_ = effectFactory;
};

/**
 * @param {number} newPos
 */
monin.parallax.ui.ParallaxContainer.prototype.setPosition = function(newPos)
{
    this.scrollPos_ = newPos - 1;
    this.endScrollPos_ = newPos;
    this.strictPos_();
};

/**
 * @param {number} newPos
 */
monin.parallax.ui.ParallaxContainer.prototype.setTargetPosition = function(newPos)
{
    if (newPos != this.endScrollPos_)
    {
        this.dispatchEvent({
            type: monin.parallax.ui.ParallaxContainer.EventType.TARGET_SCROLL_POSITION_CHANGED,
            position: newPos
        });
        this.snapDelay_.start();
    }

    this.endScrollPos_ = newPos;
    this.strictPos_();
};

/**
 * @param {Element} el
 * @return {goog.ui.Component}
 */
monin.parallax.ui.ParallaxContainer.prototype.sceneFactory_ = function(el)
{
    return goog.ui.registry.getDecorator(el);
};

/**
 * @param  {Element} el
 */
monin.parallax.ui.ParallaxContainer.prototype.setMouseWheelTarget = function(el)
{
    this.mouseWheelTarget_ = el;
};


/**
 * @private
 */
monin.parallax.ui.ParallaxContainer.prototype.snap_ = function()
{
    if (!this.snappable)
    {
        return;
    }
    goog.array.forEach(this.scenes_.getValues(), function(scene) {
        if (scene.getConfig().snappable && Math.abs(scene.getPosition() - this.scrollPos_) < 500)
        {
            this.setTargetPosition(scene.getPosition());
        }
    }, this);
};

/**
 * @private
 */
monin.parallax.ui.ParallaxContainer.prototype.strictPos_ = function()
{
    var endScrollPos = Math.max(0,
        Math.min(this.bottomPosition_, this.endScrollPos_));

    var isChanged = this.endScrollPos_ != endScrollPos;

    this.endScrollPos_ = endScrollPos;

    if (isChanged)
    {
        this.dispatchEvent({
            type: monin.parallax.ui.ParallaxContainer.EventType.TARGET_SCROLL_POSITION_CHANGED,
            position: this.endScrollPos_
        });
    }

};

/**
 * @param {goog.math.Size} size
 */
monin.parallax.ui.ParallaxContainer.prototype.setSize = function(size)
{
    if (this.size_ && goog.math.Size.equals(this.size_, size))
    {
        return;
    }

    this.size_ = size;

    this.getElement().style.width = size.width + 'px';
    this.getElement().style.height = size.height + 'px';

    goog.array.forEach(this.scenes_.getValues(), function(scene) {
        scene.adjustToSize(this.size_);
    }, this);


    this.calculateBottom_();
    this.strictPos_();
    this.updateScenes_();
};

/**
 * @param {boolean} isVisible
 */
monin.parallax.ui.ParallaxContainer.prototype.setVisible = function(isVisible)
{
    goog.dom.classes.enable(this.getElement(), 'visible', isVisible);
};

/**
 * @param {number} pos
 * @param {Object} config
 * @private
 */
monin.parallax.ui.ParallaxContainer.prototype.addEffects_ = function(pos, config)
{
    var parts, element, scene, effect, effectsCfg;
    for (var key in config)
    {
        parts = key.split('/');
        scene = this.scenes_.get(parts[0]);
        if (!scene)
        {
            console.error('Scene not found', parts);
        }
        element = scene.getElementById(parts[1]);
        effectsCfg = config[key];
        for (var i = 0; i < effectsCfg.length; i++)
        {
            effectsCfg[i]['range'][0] += pos / 1000;
            effectsCfg[i]['range'][1] += pos / 1000;
            effect = this.effectFactory_.getEffect(effectsCfg[i]);
            element.getEffects().push(effect);
        }
    }
};

/**
 * @private
 */
monin.parallax.ui.ParallaxContainer.prototype.updateScenes_ = function()
{
    if (!this.initialized_)
    {
        return;
    }

    var processed = {
        effectsProcessed: 0,
        elementsProcessed: 0
    };
    var isVisible, result;

    goog.array.forEach(this.scenes_.getValues(), function(scene) {
        isVisible = scene.isVisible(this.scrollPos_);
        if (isVisible && !scene.isInDocument())
        {
            this.addChild(scene, true);
            scene.setActive(true);

            this.dispatchEvent({
                type: monin.parallax.ui.ParallaxContainer.EventType.ADDED_TO_STAGE,
                scene: scene
            });
        }
        else if (!isVisible && scene.isInDocument())
        {
            this.removeChild(scene, true);
            scene.setActive(false);
        }

        if (isVisible)
        {
            scene.update(this.scrollPos_, this.size_);
        }
    }, this);
};

/**
 * @enum {string}
 */
monin.parallax.ui.ParallaxContainer.EventType = {
    ADDED_TO_STAGE: 'added_to_stage',
    INITIALIZED: 'initialized',
    MAX_POSITION_CHANGED: 'maxPositionChanged',
    SCROLL_POSITION_CHANGED: 'scrollpositionchanged',
    TARGET_SCROLL_POSITION_CHANGED: 'targetscrollpositionchanged'
};
