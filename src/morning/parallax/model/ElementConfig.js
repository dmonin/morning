goog.provide('morning.parallax.models.ElementConfig');

goog.require('morning.models.BaseModel');

/**
 * @constructor
 * @extends {morning.models.BaseModel}
 */
morning.parallax.models.ElementConfig = function()
{
  /**
   * @type {boolean}
   */
  this.logOffset = false;
}

goog.inherits(morning.parallax.models.ElementConfig, morning.models.BaseModel);

/**
 * @param {Object} config
 * @return {morning.parallax.models.ElementConfig}
 */
morning.parallax.models.ElementConfig.factory = function(config)
{
  var elementConfig = new morning.parallax.models.ElementConfig();
  elementConfig.logOffset = !!config['logOffset'];

  return elementConfig;
}