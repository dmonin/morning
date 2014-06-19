goog.provide('monin.parallax.registry');

/**
 * @constructor
 */
monin.parallax.registry = function()
{

};

/**
 * Map of strategy names to registry factory functions.
 * @type {Object}
 * @private
 */
monin.parallax.registry.strategies_ = {};

/**
 * @return {monin.parallax.AbstractScrollStrategy}
 */
monin.parallax.registry.getStrategy = function(name)
{
  if (monin.parallax.registry.strategies_[name])
  {
    return name in monin.parallax.registry.strategies_ ?
      monin.parallax.registry.strategies_[name]() : null;
  }
  return null;
};

/**
 * @param  {string}   name
 * @param  {Function} fn
 */
monin.parallax.registry.registerStrategy = function(name, fn)
{
  monin.parallax.registry.strategies_[name] = fn;
};