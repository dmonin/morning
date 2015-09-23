goog.provide('morning.parallax.model.SceneConfig');

/**
 * @constructor
 */
morning.parallax.model.SceneConfig = function()
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

  /**
   * @type {string}
   */
  this.navigationName = "";
};

//goog.inherits(morning.parallax.model.SceneConfig, morning.paralax.)

/**
 * @param {Object} config
 * @return {morning.parallax.model.SceneConfig}
 */
morning.parallax.model.SceneConfig.factory = function(config)
{
  var sceneConfig = new morning.parallax.model.SceneConfig();
  sceneConfig.position = config['position'];
  sceneConfig.zIndex = config['zIndex'];
  sceneConfig.snappable = config['snappable'];
  sceneConfig.navigationName = config['navigationName'];

  var range = config['range'];
  if (range)
  {
    sceneConfig.range = new goog.math.Range(
      sceneConfig.position + range[0],
      sceneConfig.position + range[1]);
    sceneConfig.rangeOffset = range;
  }

  return sceneConfig;
};