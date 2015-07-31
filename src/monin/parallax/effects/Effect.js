goog.provide('monin.parallax.effects.Effect');
goog.require('goog.fx.easing');
goog.require('goog.math.Range');
goog.require('monin.fx.easing');
goog.require('goog.math');

/**
 * @constructor
 */
monin.parallax.effects.Effect = function()
{
  /**
   * @type {goog.math.Range}
   * @protected
   */
  this.range = null;

  /**
   * @type {boolean}
   * @protected
   */
  this.strictToRange = false;

  /**
   * @type {boolean}
   * @protected
   */
  this.isActive = true;

  /**
   * @type {number}
   * @protected
   */
  this.decimals = -1;
};

/**
 * @param {monin.parallax.ui.Element} element
 * @param {number} offset
 * @param {goog.math.Size} size
 * @param {number} position
 * @return {boolean}
 */
monin.parallax.effects.Effect.prototype.apply = function(element, offset, size, position)
{
  if (!this.isInRange(offset) && this.strictToRange)
  {
    return false;
  }

  return true;
};

/**
 * Calculates value between minimum & maximum.
 *
 * @param {number} from
 * @param {number} to
 * @param {number} percent
 * @return {number}
 */
monin.parallax.effects.Effect.prototype.calculateValue =
  function(from, to, percent)
{
  var value = goog.math.lerp(from, to, percent);
  var decimals = this.decimals;

  if (decimals != -1)
  {
    var exp = Math.pow(10, decimals);
    value = Math.round(value * exp) / exp;
  }

  return value;
};

/**
 * Easing factory.
 *
 * @param {string} type
 * @return {Function}
 */
monin.parallax.effects.Effect.prototype.easingFactory = function(type)
{
  switch (type)
  {
    case 'in':
      return goog.fx.easing.easeIn;

    case 'out':
      return goog.fx.easing.easeOut;

    case 'both':
      return goog.fx.easing.inAndOut;

    case 'elasticOut':
      return monin.fx.easing.elasticOut;

    case 'elasticIn':
      return monin.fx.easing.elasticIn;
  }

  return null;
};

/**
 * @param {number} offset
 * @return {boolean}
 * @protected
 */
monin.parallax.effects.Effect.prototype.isInRange = function(offset)
{
  return goog.math.Range.containsPoint(this.range, offset);
};

/**
 * @param  {boolean} isActive
 */
monin.parallax.effects.Effect.prototype.setActive = function(isActive)
{
  this.isActive = isActive;
};

/**
 * Sets effect configuration
 *
 * @param {Object} config
 */
monin.parallax.effects.Effect.prototype.setConfig = function(config)
{
  if (config['range'])
  {
    this.range = new goog.math.Range(config['range'][0], config['range'][1]);
  }

  this.strictToRange = !!config['strictToRange'];
};

/**
 * @param {number} offset
 * @return {number}
 * @protected
 */
monin.parallax.effects.Effect.prototype.strictRange = function(offset)
{
  if (this.range)
  {
    offset = goog.math.clamp(offset, this.range.start, this.range.end);
  }

  return offset;
};
