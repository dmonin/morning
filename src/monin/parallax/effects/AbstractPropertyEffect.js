goog.provide('monin.parallax.effects.AbstractPropertyEffect');

goog.require('monin.parallax.effects.Effect');

/**
 * @constructor
 * @extends {monin.parallax.effects.Effect}
 */
monin.parallax.effects.AbstractPropertyEffect = function()
{
  /**
   * @type {number|Array<number>}
   */
  this.from = 0;

  /**
   * @type {number|Array<number>}
   */
  this.to = 0;

  /**
   * @type {Function}
   */
  this.easing = null;
};

goog.inherits(monin.parallax.effects.AbstractPropertyEffect, monin.parallax.effects.Effect);


/** @inheritDoc */
monin.parallax.effects.AbstractPropertyEffect.prototype.setConfig = function(config)
{
  goog.base(this, 'setConfig', config);

  this.from = config['from'];
  this.to = config['to'];
  this.decimals = typeof config['decimals'] == 'number' ? config['decimals'] : -1;
  this.easing = this.easingFactory(config['easing']);
};


/** @inheritDoc */
monin.parallax.effects.AbstractPropertyEffect.prototype.apply = function(element, offset, size, position)
{
  if (!goog.base(this, 'apply', element, offset, size, position))
  {
    return false;
  }

  offset = this.strictRange(offset);

  var percent = (offset - this.range.start) / (this.range.end - this.range.start);
  if (this.easing)
  {
    percent = this.easing(percent);
  }

  if (goog.isArray(this.from))
  {
    var value = [];
    for (var i = 0; i < this.from.length; i++)
    {
      value.push(this.calculateValue(this.from[i], this.to[i], percent))
    }

    this.setProperty(element, value);
  }
  else
  {
    var from = /** @type {number} */ (this.from);
    var to = /** @type {number} */ (this.to);
    this.setProperty(element, this.calculateValue(from, to, percent));
  }


  return true;
};

/**
 * @param {monin.parallax.ui.Element} element
 * @param {number|Array.<number>} value
 */
monin.parallax.effects.AbstractPropertyEffect.prototype.setProperty = goog.abstractMethod;