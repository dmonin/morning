goog.provide('morning.parallax.ui.ParallaxContainer');

goog.require('goog.dom.dataset');
goog.require('goog.events.KeyCodes');
goog.require('goog.fx.anim');
goog.require('morning.parallax.ui.Element');
goog.require('goog.net.XhrIo');
goog.require('morning.parallax.registry');
goog.require('goog.structs.Map');
goog.require('goog.ui.Component');
goog.require('morning.parallax.ui.Scene');
goog.require('morning.events');
goog.require('morning.parallax.effects.EffectFactory');


/**
 * @constructor
 * @extends {goog.ui.Component}
 * @implements {goog.fx.anim.Animated}
 */
morning.parallax.ui.ParallaxContainer = function()
{
  goog.base(this);

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
   * Defines whether smooth scrolling should be enabled.
   * @type {boolean}
   */
  this.smoothScrolling = false;

  /**
   * @type {boolean}
   * @private
   */
  this.initialized_ = false;

  /**
   * @type {morning.parallax.effects.EffectFactory}
   * @private
   */
  this.effectFactory_ = new morning.parallax.effects.EffectFactory();

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

  /**
   * @type {morning.parallax.AbstractScrollStrategy}
   * @private
   */
  this.scrollStrategy_ = null;

  /**
   * @type {number}
   * @private
   */
  this.minScroll_ = 0;
};

goog.inherits(morning.parallax.ui.ParallaxContainer, goog.ui.Component);

/**
 * @param {string} name
 * @param {morning.parallax.ui.Scene} scene
 */
morning.parallax.ui.ParallaxContainer.prototype.addScene = function(name, scene)
{
  if (!this.scenes_.containsValue(scene))
  {
    this.scenes_.set(name, scene);
  }
};

/**
 * @private
 */
morning.parallax.ui.ParallaxContainer.prototype.calculateBottom_ = function()
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
      type: morning.parallax.ui.ParallaxContainer.EventType.MAX_POSITION_CHANGED,
      max: bottom
    });
  }
};

/** @inheritDoc */
morning.parallax.ui.ParallaxContainer.prototype.createDom = function()
{
  var domHelper = this.getDomHelper();
  var el = domHelper.createDom('div', 'parallax-container');
  this.decorateInternal(el);
};

/** @inheritDoc */
morning.parallax.ui.ParallaxContainer.prototype.decorateInternal = function(el)
{
  goog.base(this, 'decorateInternal', el);

  // Initializing scroll strategy
  var scrollType = goog.dom.dataset.get(el, 'scroll') || 'window';
  scrollType = 'scroll-strategy-' + scrollType;
  this.scrollStrategy_ = /** @type {morning.parallax.AbstractScrollStrategy} */
    (morning.parallax.registry.getStrategy(scrollType));
  this.scrollStrategy_.attach(el);

  this.minScroll_ = Number(goog.dom.dataset.get(el, 'min')) || 0;

  // Initializing scenes
  var sceneElements = this.getElementsByClass('scene');
  if (sceneElements.length == 0)
  {
    sceneElements = [this.getElement()];
  }
  var cmp, sceneName;

  for (var i = 0; i < sceneElements.length; i++)
  {
    cmp = this.sceneFactory_(sceneElements[i]);
    if (!cmp)
    {
      cmp = new morning.parallax.ui.Scene();
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

  // Initializing animation config
  var config = goog.dom.dataset.get(el, 'config');
  if (config)
  {
    this.loadConfig(config);
  }

  if (goog.DEBUG)
  {
    console.info('ParallaxContainer: Scenes initialized');
  }
};

/** @inheritDoc */
morning.parallax.ui.ParallaxContainer.prototype.disposeInternal = function()
{
  goog.base(this, 'disposeInternal');

  goog.disposeAll(
    this.scrollStrategy_,
    this.snapDelay_,
    this.effectFactory_,
    this.xhrIo_,
    this.scenes_.getValues());

  goog.disposeAll(this.removeChildren(true));
};

/** @inheritDoc */
morning.parallax.ui.ParallaxContainer.prototype.enterDocument = function()
{
  goog.base(this, 'enterDocument');

  this.getHandler().listen(this,
    morning.parallax.ui.Scene.EventType.UPDATE_REQUIRED,
    this.handleSceneUpdateRequired_);

  this.getHandler().listen(this.getElement(),
    goog.events.EventType.TOUCHSTART,
    this.handleTouchStart_);

  this.getHandler().listen(document,
    goog.events.EventType.KEYDOWN,
    this.handleKey_);

  this.getHandler().listen(this.scrollStrategy_,
    goog.events.EventType.SCROLL,
    this.handleScroll_);

  goog.fx.anim.registerAnimation(this);
};

/**
 * @return {number}
 */
morning.parallax.ui.ParallaxContainer.prototype.getMaxPosition = function()
{
  return this.bottomPosition_;
};

/**
 * @param {goog.events.Event} e
 * @private
 */
morning.parallax.ui.ParallaxContainer.prototype.handleConfigLoad_ = function(e)
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

  this.initialized_ = true;


  if (goog.DEBUG)
  {
    console.info('ParallaxContainer: Performing first update...');
  }

  this.updateScenes_();

  this.dispatchEvent(morning.parallax.ui.ParallaxContainer.EventType.INITIALIZED);

};

/**
 * @param  {Object} e
 * @private
 */
morning.parallax.ui.ParallaxContainer.prototype.handleScroll_ = function(e)
{
  this.setTargetPosition(e.position);

  if (!this.smoothScrolling)
  {
    this.onAnimationFrame();
  }
};

/**
 * @param {string} url
 */
morning.parallax.ui.ParallaxContainer.prototype.loadConfig = function(url)
{
  this.getHandler().listenOnce(this.xhrIo_, goog.net.EventType.COMPLETE,
    this.handleConfigLoad_);
  this.xhrIo_.send(url);
};

/**
 * @return {morning.parallax.ui.Scene}
 */
morning.parallax.ui.ParallaxContainer.prototype.getCurrentScene = function()
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
morning.parallax.ui.ParallaxContainer.prototype.getLoadProgress = function()
{
  var loadProgress = 0;
  var sceneCount = 0;
  this.forEachChild(function(child) {
    if (child instanceof morning.parallax.ui.Scene)
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
morning.parallax.ui.ParallaxContainer.prototype.getPosition = function()
{
  return this.endScrollPos_;
};

/**
 * @param {string} sceneName
 * @return {morning.parallax.ui.Scene}
 */
morning.parallax.ui.ParallaxContainer.prototype.getScene = function(sceneName)
{
  return /** @type {morning.parallax.ui.Scene} */ (this.scenes_.get(sceneName));
};

/**
 * @return {Array.<morning.parallax.ui.Scene>}
 */
morning.parallax.ui.ParallaxContainer.prototype.getScenes = function()
{
  return this.scenes_.getValues();
};

/**
 * @param {string} sceneName
 * @return {morning.parallax.ui.Scene}
 */
morning.parallax.ui.ParallaxContainer.prototype.getSceneByNavigationName = function(sceneName)
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
morning.parallax.ui.ParallaxContainer.prototype.getSize = function()
{
  return this.size_;
};

/**
 *
 */
morning.parallax.ui.ParallaxContainer.prototype.onAnimationFrame = function()
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
    type: morning.parallax.ui.ParallaxContainer.EventType.SCROLL_POSITION_CHANGED,
    position: this.scrollPos_
  });
};

/**
 * @param {goog.events.BrowserEvent} e
 * @private
 */
morning.parallax.ui.ParallaxContainer.prototype.handleKey_ = function(e)
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
 * @param {goog.events.BrowserEvent} e
 * @private
 */
morning.parallax.ui.ParallaxContainer.prototype.handleTouchStart_ = function(e)
{
  e.preventDefault();

  this.touchStartPos_ = /** @type {goog.math.Coordinate} */ (morning.events.getPointerPosition(e));

  this.getHandler().listen(document.body, goog.events.EventType.TOUCHMOVE,
    this.handleTouchMove_);

  this.getHandler().listen(document.body, goog.events.EventType.TOUCHEND,
    this.handleTouchEnd_);
};

/**
 * @param {goog.events.BrowserEvent} e
 * @private
 */
morning.parallax.ui.ParallaxContainer.prototype.handleTouchMove_ = function(e)
{
  var touchPos = /** @type {goog.math.Coordinate!} */ (morning.events.getPointerPosition(e));
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
morning.parallax.ui.ParallaxContainer.prototype.handleTouchEnd_ = function(e)
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
morning.parallax.ui.ParallaxContainer.prototype.handleSceneUpdateRequired_ = function(e)
{
  this.calculateBottom_();
  this.strictPos_();
  this.updateScenes_();
};

/**
 *
 */
morning.parallax.ui.ParallaxContainer.prototype.moveToNext = function()
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
morning.parallax.ui.ParallaxContainer.prototype.moveToPrevious = function()
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
 * @param {morning.parallax.effects.EffectFactory} effectFactory
 */
morning.parallax.ui.ParallaxContainer.prototype.setEffectFactory = function(effectFactory)
{
  this.effectFactory_ = effectFactory;
};

/**
 * @param {number} newPos
 */
morning.parallax.ui.ParallaxContainer.prototype.setPosition = function(newPos)
{
  this.scrollPos_ = newPos - 1;
  this.endScrollPos_ = newPos;
  this.strictPos_();
};

/**
 * @param {number} newPos
 */
morning.parallax.ui.ParallaxContainer.prototype.setTargetPosition = function(newPos)
{
  if (newPos != this.endScrollPos_)
  {
    this.dispatchEvent({
      type: morning.parallax.ui.ParallaxContainer.EventType.TARGET_SCROLL_POSITION_CHANGED,
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
 * @private
 */
morning.parallax.ui.ParallaxContainer.prototype.sceneFactory_ = function(el)
{
  return el != this.getElement() ? goog.ui.registry.getDecorator(el) : null;
};


/**
 * Snaps scrolling to specified position.
 *
 * @private
 */
morning.parallax.ui.ParallaxContainer.prototype.snap_ = function()
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
 * Stricting scroll position.
 *
 * @private
 */
morning.parallax.ui.ParallaxContainer.prototype.strictPos_ = function()
{
  var endScrollPos = Math.max(this.minScroll_,
    Math.min(this.bottomPosition_, this.endScrollPos_));

  var isChanged = this.endScrollPos_ != endScrollPos;

  this.endScrollPos_ = endScrollPos;

  if (isChanged)
  {
    this.dispatchEvent({
      type: morning.parallax.ui.ParallaxContainer.EventType.TARGET_SCROLL_POSITION_CHANGED,
      position: this.endScrollPos_
    });
  }

};

/**
 * @param {goog.math.Size} size
 */
morning.parallax.ui.ParallaxContainer.prototype.setSize = function(size)
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
morning.parallax.ui.ParallaxContainer.prototype.setVisible = function(isVisible)
{
  goog.dom.classlist.enable(this.getElement(), 'visible', isVisible);
};

/**
 * @param {number} pos
 * @param {Object} config
 * @private
 */
morning.parallax.ui.ParallaxContainer.prototype.addEffects_ = function(pos, config)
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
morning.parallax.ui.ParallaxContainer.prototype.updateScenes_ = function()
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
        type: morning.parallax.ui.ParallaxContainer.EventType.ADDED_TO_STAGE,
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
morning.parallax.ui.ParallaxContainer.EventType = {
  ADDED_TO_STAGE: 'added_to_stage',
  INITIALIZED: 'initialized',
  MAX_POSITION_CHANGED: 'maxPositionChanged',
  SCROLL_POSITION_CHANGED: 'scrollpositionchanged',
  TARGET_SCROLL_POSITION_CHANGED: 'targetscrollpositionchanged'
};

/**
 * Register this control so it can be created from markup.
 */
goog.ui.registry.setDecoratorByClassName(
  'parallax-container',
  function() {
    return new morning.parallax.ui.ParallaxContainer();
  });
