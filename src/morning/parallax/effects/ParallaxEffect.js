goog.provide('morning.parallax.effects.ParallaxEffect');

goog.require('morning.parallax.effects.Effect');
goog.require('morning.style');

/**
 * @constructor
 * @extends {morning.parallax.effects.Effect}
 */
morning.parallax.effects.ParallaxEffect = function()
{
  /**
   * @type {number}
   * @private
   */
  this.ratio = 1;

  /**
   * @type {string}
   * @private
   */
  this.property = 'top';
};
goog.inherits(morning.parallax.effects.ParallaxEffect, morning.parallax.effects.Effect);

/** @inheritDoc */
morning.parallax.effects.ParallaxEffect.prototype.apply = function(element, offset, size)
{
  var position = element.getInitialPosition();
  offset = this.strictRange(offset);
  switch (this.property)
  {
    case 'top':
      var y = -this.ratio * offset * 1000;
      morning.style.translate(element.getElement(), position.x + 0, position.y + y);
      break;
  }

  return true;
};

/**
 * @param {Object} config
 */
morning.parallax.effects.ParallaxEffect.prototype.setConfig = function(config)
{
  goog.base(this, 'setConfig', config);

  this.ratio = config['ratio'];
  this.property = config['property'];
};