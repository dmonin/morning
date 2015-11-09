goog.provide('morning.parallax.effects.AbstractPropertyEffect');

goog.require('morning.parallax.effects.Effect');

/**
 * @constructor
 * @extends {morning.parallax.effects.Effect}
 */
morning.parallax.effects.AbstractPropertyEffect = function()
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
goog.inherits(morning.parallax.effects.AbstractPropertyEffect,
  morning.parallax.effects.Effect);


/** @inheritDoc */
morning.parallax.effects.AbstractPropertyEffect.prototype.setConfig = function(config)
{
  goog.base(this, 'setConfig', config);

  this.from = config['from'];
  this.to = config['to'];
  this.decimals = typeof config['decimals'] == 'number' ? config['decimals'] : -1;
  this.easing = this.easingFactory(config['easing']);

  if (config['randomize'])
  {
    this.from = this.randomize_(this.from, config['randomize']);
    this.to = this.randomize_(this.to, config['randomize']);
  }
};


/** @inheritDoc */
morning.parallax.effects.AbstractPropertyEffect.prototype.apply = function(element, offset, size, position)
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
 * Randomizes value
 *
 * @param  {number|Array.<number>} val
 * @private
 */
morning.parallax.effects.AbstractPropertyEffect.prototype.randomize_ = function(val, diff)
{
  var sign = Math.random() > 0.5 ? 1 : -1;

  if (val instanceof Array)
  {
    for (var i = 0; i < val.length; i++)
    {
      val[i] = val[i] + diff * val[i] * sign;
    }
  }
  else
  {
    val = val + diff * val * sign;
  }

  return val;
};

/**
 * @param {morning.parallax.ui.Element} element
 * @param {number|Array.<number>} value
 */
morning.parallax.effects.AbstractPropertyEffect.prototype.setProperty = goog.abstractMethod;