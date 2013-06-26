goog.provide('monin.parallax.effects.StyleEffect');

goog.require('monin.parallax.effects.Effect');

/**
 * @constructor
 * @extends {monin.parallax.effects.Effect}
 */
monin.parallax.effects.StyleEffect = function()
{
    /**
     * @type {string}
     */
    this.from = '';

    /**
     * @type {string}
     */
    this.to = '';

    /**
     * @type {Function}
     * @private
     */
    this.easing = null;

    /**
     * @type {string}
     */
    this.property = 'top';

    /**
     * @type {string}
     */
    this.selector = '';
};

goog.inherits(monin.parallax.effects.StyleEffect, monin.parallax.effects.Effect);

/** @inheritDoc */
monin.parallax.effects.StyleEffect.prototype.apply = function(element, offset, size)
{
    if (!this.isInRange(offset) && this.strictToRange)
    {
        return;
    }

    offset = this.strictRange(offset);

    var percent = (offset - this.range.start) / (this.range.end - this.range.start);
    if (this.easing)
    {
        percent = this.easing(percent);
    }

    var node = element.getElement();
    if (this.selector)
    {
        node = node.querySelector(this.selector);
    }

    var numRe = /[-0-9.]+/;
    var from = Number(String(this.from).match(numRe)[0]);
    var to = Number(String(this.to).match(numRe)[0]);

    var value = String(goog.math.lerp(from, to, percent));

    this.setStyle_(node, this.property, String(this.from).replace(numRe, value));
};



/** @inheritDoc */
monin.parallax.effects.StyleEffect.prototype.setConfig = function(config)
{
    goog.base(this, 'setConfig', config);

    this.from = config['from'];
    this.to = config['to'];
    this.easing = this.easingFactory(config['easing']);
    this.selector = config['selector'];
    this.property = config['property'];

};

/**
 * @param {Element} element
 * @param {string} property
 * @param {string} value
 * @private
 */
monin.parallax.effects.StyleEffect.prototype.setStyle_ = function(element, property, value)
{
    switch (property)
    {
        case 'blur':
            // too slow on ipad
            if (!goog.userAgent.IPAD)
            {
                monin.style.setFilter(element, 'blur(' + Math.round(value) + 'px)');
            }
            break;

        case 'rotate':
            monin.style.setTransform(element, 'rotate(' + Math.round(value) + 'deg)');
            break;

        case 'scale':
            monin.style.setTransform(element, 'scale(' + value + ')');
            break;

        default:
            element.style[this.property] = value;
            break;
    }

};
