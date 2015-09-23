goog.provide('morning.parallax.registry');

/**
 * @constructor
 */
morning.parallax.registry = function()
{

};

/**
 * Map of strategy names to registry factory functions.
 * @type {Object}
 * @private
 */
morning.parallax.registry.strategies_ = {};

/**
 * @return {morning.parallax.AbstractScrollStrategy}
 */
morning.parallax.registry.getStrategy = function(name)
{
  if (morning.parallax.registry.strategies_[name])
  {
    return name in morning.parallax.registry.strategies_ ?
      morning.parallax.registry.strategies_[name]() : null;
  }
  return null;
};

/**
 * @param  {string}   name
 * @param  {Function} fn
 */
morning.parallax.registry.registerStrategy = function(name, fn)
{
  morning.parallax.registry.strategies_[name] = fn;
};