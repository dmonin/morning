goog.provide('morning.parallax.effects.CounterEffect');

goog.require('goog.dom.dataset');
goog.require('morning.parallax.effects.Effect');
goog.require('goog.i18n.NumberFormat');

/**
 * @constructor
 * @extends {morning.parallax.effects.Effect}
 */
morning.parallax.effects.CounterEffect = function()
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
goog.inherits(morning.parallax.effects.CounterEffect, morning.parallax.effects.Effect);

/** @inheritDoc */
morning.parallax.effects.CounterEffect.prototype.apply = function(parallaxElement, offset, size, position)
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
morning.parallax.effects.CounterEffect.prototype.setConfig = function(config)
{
  goog.base(this, 'setConfig', config);

  this.easing = this.easingFactory(config['easing']);
  this.property = config['property'] || 'innerHTML';
  this.selector = config['selector'];
  this.from = config['from'];
  this.to = config['to'];
};
