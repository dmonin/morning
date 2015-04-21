goog.provide('monin.parallax.AbstractScrollStrategy');
goog.require('goog.events.EventTarget');

/**
 * @constructor
 * @extends {goog.events.EventTarget}
 */
monin.parallax.AbstractScrollStrategy = function()
{
  goog.base(this);
};

goog.inherits(monin.parallax.AbstractScrollStrategy,
  goog.events.EventTarget);

/**
 * @param  {Element} el
 */
monin.parallax.AbstractScrollStrategy.prototype.attach = function(el) {};

/**
 * @param  {Element} el
 */
monin.parallax.AbstractScrollStrategy.prototype.detach = function(el) {};