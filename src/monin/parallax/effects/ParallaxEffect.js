goog.provide('monin.parallax.effects.ParallaxEffect');

goog.require('monin.parallax.effects.Effect');
goog.require('monin.style');

/**
 * @constructor
 * @extends {monin.parallax.effects.Effect}
 */
monin.parallax.effects.ParallaxEffect = function()
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
    this.property = "top";
}
goog.inherits(monin.parallax.effects.ParallaxEffect, monin.parallax.effects.Effect);

/**
 * @param {monin.parallax.ui.Element} element
 * @param {number} offset
 * @param {goog.math.Size} size
 */
monin.parallax.effects.ParallaxEffect.prototype.apply = function(element, offset, size)
{
    var position = element.getInitialPosition();
    offset = this.strictRange(offset);
    switch (this.property)
    {
        case 'top':
            var y = -this.ratio * offset * 1000;
            monin.style.translate(element.getElement(), undefined, y, position);
            break;
    }
}

/**
 * @param {Object} config
 */
monin.parallax.effects.ParallaxEffect.prototype.setConfig = function(config)
{
    goog.base(this, 'setConfig', config);

    this.ratio = config['ratio'];
    this.property = config['property'];
}