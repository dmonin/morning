goog.provide('monin.parallax.effects.AbstractPropertyEffect');

goog.require('monin.parallax.effects.Effect');

/**
 * @constructor
 * @extends {monin.parallax.effects.Effect}
 */
monin.parallax.effects.AbstractPropertyEffect = function()
{
    /**
     * @type {number}
     */
    this.from = 0;

    /**
     * @type {number}
     */
    this.to = 0;

    /**
     * @type {Function}
     */
    this.easing = null;

    /**
     * @type {number}
     * @private
     */
    this.decimals = -1;
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

    var value = goog.math.lerp(this.from, this.to, percent);
    var decimals = this.decimals;
    if (decimals != -1)
    {
        var exp = Math.pow(10, decimals);
        value = Math.round(value *  exp) / exp;
    }

    this.setProperty(element, value);

    return true;
};



/**
 * @param {monin.parallax.ui.Element} element
 * @param {number} value
 */
monin.parallax.effects.AbstractPropertyEffect.prototype.setProperty = goog.abstractMethod;