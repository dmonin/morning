goog.provide('monin.parallax.effects.CounterEffect');

goog.require('goog.dom.dataset');
goog.require('monin.parallax.effects.Effect');

/**
 * @constructor
 * @extends {monin.parallax.effects.Effect}
 */
monin.parallax.effects.CounterEffect = function()
{
    /**
     * @type {Function}
     * @private
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
};
goog.inherits(monin.parallax.effects.CounterEffect, monin.parallax.effects.Effect);

/** @inheritDoc */
monin.parallax.effects.CounterEffect.prototype.apply = function(parallaxElement, offset, size, position)
{
    if (goog.base(this, 'apply', parallaxElement, offset, size, position))
    {
        return false;
    }

    var element = parallaxElement.getElement();

    if (this.selector)
    {
        element = element.querySelector(this.selector);
    }

    offset = this.strictRange(offset);

    var percent = (offset - this.range.start) / (this.range.end - this.range.start);
    if (this.easing)
    {
        percent = this.easing(percent);
    }

    var from = Number(goog.dom.dataset.get(element, 'from'));
    var to = Number(goog.dom.dataset.get(element, 'to'));

    var value = goog.math.lerp(from, to, percent);
    element[this.property] = Math.round(value);

    return true;
};

/** @inheritDoc */
monin.parallax.effects.CounterEffect.prototype.setConfig = function(config)
{
    goog.base(this, 'setConfig', config);

    this.easing = this.easingFactory(config['easing']);
    this.property = config['property'] || 'innerHTML';
    this.selector = config['selector'];

};
