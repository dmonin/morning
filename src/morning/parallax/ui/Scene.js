goog.provide('morning.parallax.ui.Scene');
goog.require('goog.dom.classlist');
goog.require('goog.fx.Animation');
goog.require('goog.fx.easing');
goog.require('goog.ui.Component');
goog.require('goog.ui.registry');
goog.require('morning.parallax.model.SceneConfig');

/**
 * Scene constructor
 *
 * @constructor
 * @extends {goog.ui.Component}
 */
morning.parallax.ui.Scene = function()
{
  goog.base(this);

  /**
   * Scene Configuration
   *
   * @type {morning.parallax.model.SceneConfig}
   * @private
   */
  this.config_ = null;


  /**
   * Loaded elements count
   *
   * @type {number}
   * @private
   */
  this.loadedCount_ = 0;

  /**
   * Total element count, which need to be loaded.
   *
   * @type {number}
   * @private
   */
  this.loadedTotalCount_ = 0;

  /**
   * Hashmap with elements
   *
   * @type {goog.structs.Map}
   * @private
   */
  this.elements_ = new goog.structs.Map();

  /**
   * @type {string}
   */
  this.name = '';


  /**
   * @type {boolean}
   * @protected
   */
  this.isActive = true;
};
goog.inherits(morning.parallax.ui.Scene, goog.ui.Component);

/**
 * Adjusts container size and updates elements
 *
 * @param {goog.math.Size} size
 */
morning.parallax.ui.Scene.prototype.adjustToSize = function(size)
{
  goog.array.forEach(this.elements_.getValues(), function(el) {
    el.adjustToSize(size);
  });
};

/** @inheritDoc */
morning.parallax.ui.Scene.prototype.decorateInternal = function(el)
{
  goog.base(this, 'decorateInternal', el);

  var elements = this.getElementsByClass('prlx-element');
  var cmp;
  for (var i = 0; i < elements.length; i++)
  {
    if (!elements[i].id)
    {
      throw new Error("Element missing ID property.");
    }

    cmp = goog.ui.registry.getDecorator(elements[i]);
    if (!cmp)
    {
      cmp = new morning.parallax.ui.Element();
    }

    this.addChild(cmp);
    cmp.decorate(elements[i]);

    this.elements_.set(elements[i].id, cmp);
    if (goog.DEBUG)
    {
      console.info('Scene: Initializing element: %s %o', elements[i].id, cmp);
    }

    if (cmp.isLoadable())
    {
      this.getHandler().listen(cmp, morning.parallax.ui.Element.EventType.LOAD,
        this.handleElementLoad_);
      this.loadedTotalCount_++;
    }
  }

  if (goog.DEBUG)
  {
    console.info('Scene: Initialization complete');
  }

  if (this.loadedCount_ == this.loadedTotalCount_)
  {
    this.dispatchEvent(morning.parallax.ui.Scene.EventType.COMPLETE);
  }
};

/**
 * Returns bottom position of scene
 *
 * @param {goog.math.Size} size
 * @return {number}
 */
morning.parallax.ui.Scene.prototype.getBottom = function(size)
{
  if (!this.config_)
  {
    return 0;
  }

  return this.config_.range.end;
};

/**
 * Returns scene configuration
 *
 * @return {Object}
 */
morning.parallax.ui.Scene.prototype.getConfig = function()
{
  return this.config_;
};

/**
 * Returns element from scene with specified id
 *
 * @param {string} elementId
 * @return {morning.parallax.ui.Element}
 */
morning.parallax.ui.Scene.prototype.getElementById = function(elementId)
{
  return /** @type {morning.parallax.ui.Element} */ (this.elements_.get(elementId));
};

/**
 * Returns scene position
 *
 * @return {number}
 */
morning.parallax.ui.Scene.prototype.getPosition = function()
{
  return this.config_ && this.config_.position ? this.config_.position : 0;
};

/**
 * Handles element load event
 *
 * @param {goog.events.Event} e
 * @private
 */
morning.parallax.ui.Scene.prototype.handleElementLoad_ = function(e)
{
  this.loadedCount_++;
  this.dispatchEvent(morning.parallax.ui.Scene.EventType.PROGRESS);

  if (this.loadedCount_ == this.loadedTotalCount_)
  {
    this.dispatchEvent(morning.parallax.ui.Scene.EventType.COMPLETE);
  }
};

/**
 * Handles load progress
 *
 * @return {number}
 */
morning.parallax.ui.Scene.prototype.getLoadProgress = function()
{
  return this.loadedTotalCount_ > 0 ? this.loadedCount_ / this.loadedTotalCount_ : 1;
};

/**
 * Handles position change animation
 *
 * @param {goog.events.Event} e
 * @private
 */
morning.parallax.ui.Scene.prototype.handlePositionAnimation_ = function(e)
{
  this.config_.position = e.coords[0];
  this.dispatchEvent(morning.parallax.ui.Scene.EventType.UPDATE_REQUIRED);
};

/**
 * Returns true if scene is visible
 *
 * @param {number} position
 * @return {boolean}
 */
morning.parallax.ui.Scene.prototype.isVisible = function(position)
{
  return this.config_ && this.config_.range ?
    goog.math.Range.containsPoint(this.config_.range, position) : true;
};

/**
 * Sets whether scene is currently active / inactive
 *
 * @param {boolean} isActive
 */
morning.parallax.ui.Scene.prototype.setActive = function(isActive)
{
  this.isActive = isActive;

  goog.array.forEach(this.elements_.getValues(), function(el) {
    el.setActive(isActive);
  });
};

/**
 * Sets scene configuration
 *
 * @param {Object} config
 * @param {morning.parallax.effects.EffectFactory} effectFactory
 */
morning.parallax.ui.Scene.prototype.setConfig = function(config, effectFactory)
{
  this.config_ = morning.parallax.model.SceneConfig.factory(config);

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
 * Sets scene position
 *
 * @param {number} position
 * @param {number=} opt_duration
 */
morning.parallax.ui.Scene.prototype.setPosition = function(position, opt_duration)
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
    this.dispatchEvent(morning.parallax.ui.Scene.EventType.UPDATE_REQUIRED);
  }
};

/**
 * Updates scene view according to position and viewportsize
 *
 * @param {number} position
 * @param {goog.math.Size} size
 */
morning.parallax.ui.Scene.prototype.update = function(position, size)
{
  // Calculating offset
  var delta = position - this.config_.position;
  var offset = delta / 1000;
  var isVisible;
  var elementsProcessed = 0;
  var effectsProcessed = 0;
  goog.array.forEach(this.elements_.getValues(), function(el) {
    isVisible = el.isVisible(offset);
    if (!isVisible && el.isInDocument())
    {
      this.removeChild(el, true);
    }
    else if (isVisible && !el.isInDocument())
    {
      this.addChild(el, true);
    }

    if (!isVisible)
    {
      return;
    }

    el.update(offset, size, position);
  }, this);
};

/**
 * Event types
 *
 * @enum {string}
 */
morning.parallax.ui.Scene.EventType = {
  UPDATE_REQUIRED: 'scene:update_required',
  PROGRESS: 'scene:progress',
  COMPLETE: 'scene:complete'
};
