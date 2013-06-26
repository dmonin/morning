goog.provide('monin.parallax.effects.CounterEffect');

goog.require('monin.parallax.effects.Effect');
goog.require('goog.dom.dataset');

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
}

goog.inherits(monin.parallax.effects.CounterEffect, monin.parallax.effects.Effect);

/** @inheritDoc */
monin.parallax.effects.CounterEffect.prototype.apply = function(parallaxElement, offset, size)
{
    if (!this.isInRange(offset) && this.strictToRange)
    {
        return;
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
    
//    console.log(from, to, percent);
    
    var value = goog.math.lerp(from, to, percent);    
    element[this.property] = Math.round(value);
}

/** @inheritDoc */
monin.parallax.effects.CounterEffect.prototype.setConfig = function(config)
{
    goog.base(this, 'setConfig', config)
    
    this.easing = this.easingFactory(config['easing']);
    this.property = config['property'] || 'innerHTML';
    this.selector = config['selector'];
    
}