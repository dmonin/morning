goog.provide('monin.parallax.models.ElementConfig');

goog.require('monin.models.BaseModel');

/**
 * @constructor
 * @extends {monin.models.BaseModel}
 */
monin.parallax.models.ElementConfig = function()
{
    /**
     * @type {boolean}
     */
    this.logOffset = false;
}

goog.inherits(monin.parallax.models.ElementConfig, monin.models.BaseModel);

/**
 * @param {Object} config
 * @return {monin.parallax.models.ElementConfig}
 */
monin.parallax.models.ElementConfig.factory = function(config)
{
    var elementConfig = new monin.parallax.models.ElementConfig();
    elementConfig.logOffset = !!config['logOffset'];

    return elementConfig;
}