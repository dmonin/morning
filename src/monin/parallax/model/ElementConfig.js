goog.provide('monin.parallax.model.ElementConfig');

goog.require('monin.model.BaseModel');

/**
 * @constructor
 * @extends {monin.model.BaseModel}
 */
monin.parallax.model.ElementConfig = function()
{    
    /**
     * @type {boolean}
     */
    this.logOffset = false;
}

goog.inherits(monin.parallax.model.ElementConfig, monin.model.BaseModel);

/**
 * @param {Object} config
 * @return {monin.parallax.model.ElementConfig}
 */
monin.parallax.model.ElementConfig.factory = function(config)
{
    var elementConfig = new monin.parallax.model.ElementConfig();
    elementConfig.logOffset = !!config['logOffset'];    
    
    return elementConfig;
}