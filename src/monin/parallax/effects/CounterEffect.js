goog.provide('monin.parallax.effects.CounterEffect');

goog.require('goog.dom.dataset');
goog.require('monin.parallax.effects.Effect');
goog.require('goog.i18n.NumberFormat');

/**
 * @constructor
 * @extends {monin.parallax.effects.Effect}
 */
monin.parallax.effects.CounterEffect = function()
{
  goog.base(this);

  /**
   * @type {Function}
   */
  this.easing = null;

  /**
   * @type {string}
   */
  this.property = 'innerHTML';

  /**
   * @type {string}
   */
  this.selector = '';

  /**
   * @type {number}
   */
  this.from = 0;

  /**
   * @type {number}
   */
  this.to = 0;

  /**
   * @type {goog.i18n.NumberFormat}
   */
  this.numberFormatter = new goog.i18n.NumberFormat('#,##0');
};
goog.inherits(monin.parallax.effects.CounterEffect, monin.parallax.effects.Effect);

/** @inheritDoc */
monin.parallax.effects.CounterEffect.prototype.apply = function(parallaxElement, offset, size, position)
{
  if (!goog.base(this, 'apply', parallaxElement, offset, size, position))
  {
    return false;
  }

  var element = parallaxElement.getElement();

  if (this.selector)
  {
    element = element.querySelector(this.selector);
  }

  offset = this.strictRange(offset);

  var percent = (offset - this.range.start) /
    (this.range.end - this.range.start);
  if (this.easing)
  {
    percent = this.easing(percent);
  }

  var value = this.calculateValue(this.from, this.to, percent);
  element[this.property] = this.numberFormatter.format(value);

  return true;
};

/** @inheritDoc */
monin.parallax.effects.CounterEffect.prototype.setConfig = function(config)
{
  goog.base(this, 'setConfig', config);

  this.easing = this.easingFactory(config['easing']);
  this.property = config['property'] || 'innerHTML';
  this.selector = config['selector'];
  this.from = config['from'];
  this.to = config['to'];
};
