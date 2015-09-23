goog.provide('morning.parallax.AbstractScrollStrategy');
goog.require('goog.events.EventTarget');

/**
 * @constructor
 * @extends {goog.events.EventTarget}
 */
morning.parallax.AbstractScrollStrategy = function()
{
  goog.base(this);
};

goog.inherits(morning.parallax.AbstractScrollStrategy,
  goog.events.EventTarget);

/**
 * @param  {Element} el
 */
morning.parallax.AbstractScrollStrategy.prototype.attach = function(el) {};

/**
 * @param  {Element} el
 */
morning.parallax.AbstractScrollStrategy.prototype.detach = function(el) {};