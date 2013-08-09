goog.provide('monin.parallax.effects.Effect');
goog.require('goog.fx.easing');
goog.require('goog.math.Range');

/**
 * @constructor
 */
monin.parallax.effects.Effect = function()
{
    /**
     * @type {goog.math.Range}
     * @protected
     */
    this.range = null;

    /**
     * @type {boolean}
     * @protected
     */
    this.strictToRange = false;

    /**
     * @type {boolean}
     * @protected
     */
    this.isActive = true;
};

/**
 * @param {monin.parallax.ui.Element} element
 * @param {number} offset
 * @param {goog.math.Size} size
 * @param {number} position
 */
monin.parallax.effects.Effect.prototype.apply = goog.abstractMethod;

/**
 * @return {Function}
 */
monin.parallax.effects.Effect.prototype.easingFactory = function(type)
{
    switch (type)
    {
        case 'in':
            return goog.fx.easing.easeIn;
        case 'out':
            return goog.fx.easing.easeOut;
        case 'both':
            return goog.fx.easing.inAndOut;
    }

    return null;
};

/**
 * @param {number} offset
 * @return {boolean}
 * @protected
 */
monin.parallax.effects.Effect.prototype.isInRange = function(offset)
{
    return goog.math.Range.containsPoint(this.range, offset);
};

/**
 * @param  {boolean} isActive
 */
monin.parallax.effects.Effect.prototype.setActive = function(isActive)
{
    this.isActive = isActive;
};

/**
 * Sets effect configuration
 *
 * @param {Object} config
 */
monin.parallax.effects.Effect.prototype.setConfig = function(config)
{
    if (config['range'])
    {
        this.range = new goog.math.Range(config['range'][0], config['range'][1]);
    }

    this.strictToRange = !!config['strictToRange'];
};

/**
 * @param {number} offset
 * @return {number}
 * @protected
 */
monin.parallax.effects.Effect.prototype.strictRange = function(offset)
{
    if (this.range)
    {
        offset = Math.max(offset, this.range.start);
        offset = Math.min(offset, this.range.end);
    }

    return offset;
};
