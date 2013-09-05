goog.provide('monin.parallax.effects.EffectFactory');

goog.require('monin.parallax.effects.CounterEffect');
goog.require('monin.parallax.effects.ParallaxEffect');
goog.require('monin.parallax.effects.StyleEffect');

/**
 * @constructor
 */
monin.parallax.effects.EffectFactory = function()
{

};

/**
 * @param {Object} config
 * @return {monin.parallax.effects.Effect}
 */
monin.parallax.effects.EffectFactory.prototype.getEffect = function(config)
{
    var effect = null;

    switch (config['type'])
    {
        case 'parallax':
            effect = new monin.parallax.effects.ParallaxEffect();
            effect.setConfig(config);
            break;

        case 'style':
            effect = new monin.parallax.effects.StyleEffect();
            effect.setConfig(config);
            break;

        case 'counter':
            effect = new monin.parallax.effects.CounterEffect();
            effect.setConfig(config);
            break;
    }

    return effect;
};
