/**
 * @fileoverview Provides a router functionality, selects best
 * matching route, agains a list of added routes.
 */
goog.provide('morning.routing.Router');

goog.require('goog.events.EventTarget');

/**
 * @constructor
 * @extends {goog.events.EventTarget}
 */
morning.routing.Router = function()
{
  goog.base(this);

  /**
   * @type {Array.<morning.routing.RegexRoute>}
   * @private
   */
  this.routes_ = [];
};
goog.inherits(morning.routing.Router, goog.events.EventTarget);

/**
 * Adds a new route to list
 *
 * @param {morning.routing.RegexRoute} route
 */
morning.routing.Router.prototype.addRoute = function(route)
{
  this.routes_.push(route);
  route.setParentEventTarget(this);
};

/**
 * Matches a route agains specified url token
 *
 * @param  {string} token
 * @return {boolean}
 */
morning.routing.Router.prototype.match = function(token)
{
  for (var i = 0; i < this.routes_.length; i++)
  {
    if (this.routes_[i].match(token))
    {
      return true;
    }
  }

  return false;
};
