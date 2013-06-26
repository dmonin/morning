goog.provide('monin.parallax.model.SceneConfig');

/**
 * @constructor
 */
monin.parallax.model.SceneConfig = function()
{
    /**
     * @type {boolean}
     */
    this.snappable = false;
    
    /**
     * @type {number}
     */
    this.position = 0;
    
    /**
     * @type {Array.<number>}
     */
    this.rangeOffset = [0, 0];
    
    /**
     * @type {goog.math.Range}
     */
    this.range = null;
    
    /**
     * @type {number}
     */
    this.zIndex = 0;
}

//goog.inherits(monin.parallax.model.SceneConfig, monin.paralax.)

/**
 * @param {Object} config
 * @return {monin.parallax.model.SceneConfig}
 */
monin.parallax.model.SceneConfig.factory = function(config)
{
    var sceneConfig = new monin.parallax.model.SceneConfig();
    sceneConfig.position = config['position'];
    sceneConfig.zIndex = config['zIndex'];
    sceneConfig.snappable = config['snappable'];
    var range = config['range'];
    sceneConfig.range = new goog.math.Range(
        sceneConfig.position + range[0], 
        sceneConfig.position + range[1]);
    sceneConfig.rangeOffset = range;
    return sceneConfig;
}