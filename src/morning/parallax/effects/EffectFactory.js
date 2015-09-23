goog.provide('morning.parallax.effects.EffectFactory');

goog.require('morning.parallax.effects.CounterEffect');
goog.require('morning.parallax.effects.ParallaxEffect');
goog.require('morning.parallax.effects.StyleEffect');

/**
 * @constructor
 */
morning.parallax.effects.EffectFactory = function()
{

};

/**
 * @param {Object} config
 * @return {morning.parallax.effects.Effect}
 */
morning.parallax.effects.EffectFactory.prototype.getEffect = function(config)
{
  var effect = null;

  switch (config['type'])
  {
    case 'parallax':
      effect = new morning.parallax.effects.ParallaxEffect();
      effect.setConfig(config);
      break;

    case 'style':
      effect = new morning.parallax.effects.StyleEffect();
      effect.setConfig(config);
      break;

    case 'counter':
      effect = new morning.parallax.effects.CounterEffect();
      effect.setConfig(config);
      break;
  }

  return effect;
};
