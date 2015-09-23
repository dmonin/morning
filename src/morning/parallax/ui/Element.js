goog.provide('morning.parallax.ui.Element');

goog.require('goog.math.Coordinate');
goog.require('goog.math.Range');
goog.require('goog.style');
goog.require('goog.ui.Component');
goog.require('goog.ui.registry');
goog.require('morning.parallax.models.ElementConfig');

/**
 * @constructor
 * @extends {goog.ui.Component}
 */
morning.parallax.ui.Element = function()
{
  goog.base(this);

  /**
   * @type {morning.parallax.models.ElementConfig}
   * @private
   */
  this.config_ = null;

  /**
   * @type {goog.math.Range}
   * @protected
   */
  this.range = null;

  /**
   * @type {Array.<morning.parallax.effects.Effect>}
   * @private
   */
  this.effects_ = [];

  /**
   * @type {goog.math.Coordinate}
   * @private
   */
  this.position_ = new goog.math.Coordinate(0, 0);


  /**
   * @type {boolean}
   * @protected
   */
  this.isActive = true;

};
goog.inherits(morning.parallax.ui.Element, goog.ui.Component);

/**
 * Adjusts element to viewport size
 *
 * @param {goog.math.Size} size
 */
morning.parallax.ui.Element.prototype.adjustToSize = function(size)
{
  // No default implementation
};

/**
 * @return {Array.<morning.parallax.effects.Effect>}
 */
morning.parallax.ui.Element.prototype.getEffects = function()
{
  return this.effects_;
};

/** @inheritDoc */
morning.parallax.ui.Element.prototype.enterDocument = function()
{
  goog.base(this, 'enterDocument');

  this.position_ = goog.style.getPosition(this.getElement());
};

/**
 * Returns initial position
 *
 * @return {goog.math.Coordinate}
 */
morning.parallax.ui.Element.prototype.getInitialPosition = function()
{
  return this.position_;
};

/**
 * Returns true if element needs to be loaded
 *
 * @return {boolean}
 */
morning.parallax.ui.Element.prototype.isLoadable = function()
{
  return false;
};

/**
 * @param  {number} offset
 */
morning.parallax.ui.Element.prototype.isVisible = function(offset)
{
  return !this.range || goog.math.Range.containsPoint(this.range, offset);
};

/**
 * Sets whether element is currently active / inactive
 *
 * @param {boolean} isActive
 */
morning.parallax.ui.Element.prototype.setActive = function(isActive)
{
  this.isActive = isActive;

  for (var i = 0; i < this.effects_.length; i++)
  {
    this.effects_[i].setActive(isActive);
  }
};

/**
 * Sets element configuration
 *
 * @param {Object} config
 * @param {morning.parallax.effects.EffectFactory} effectFactory
 */
morning.parallax.ui.Element.prototype.setConfig = function(config, effectFactory)
{
  this.config_ = morning.parallax.models.ElementConfig.factory(config);

  if (config['range'])
  {
    this.range = new goog.math.Range(config['range'][0], config['range'][1]);
  }

  if (config['effects'])
  {
    var effect;
    for (var i = 0; i < config['effects'].length; i++)
    {
      effect = effectFactory.getEffect(config['effects'][i]);
      if (!effect)
      {
        if (goog.DEBUG)
        {
          console.error('Effect couldn\'t be found %o, %o', config['effects'][i], effectFactory);
        }
        throw new Error('Effect not found.');
      }
      this.effects_.push(effect);
    }
  }
};


/**
 * Updates parallax properties
 *
 * @param {number} offset
 * @param {goog.math.Size} size
 * @param {number} position
 */
morning.parallax.ui.Element.prototype.update = function(offset, size, position)
{
  if (goog.DEBUG && this.config_ && this.config_.logOffset)
  {
    console.info('Element offset %o, %f', this, offset);
  }

  for (var i = 0; i < this.effects_.length; i++)
  {
    this.effects_[i].apply(this, offset, size, position);
  }
};

/**
 * Enumiration for event types
 *
 * @enum {string}
 */
morning.parallax.ui.Element.EventType = {
  LOAD: 'elementload'
};
