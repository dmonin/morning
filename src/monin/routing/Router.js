/**
 * @fileoverview Provides a router functionality, selects best
 * matching route, agains a list of added routes.
 */
goog.provide('monin.routing.Router');

goog.require('goog.events.EventTarget');

/**
 * @constructor
 * @extends {goog.events.EventTarget}
 */
monin.routing.Router = function()
{
  goog.base(this);

  /**
   * @type {Array.<monin.routing.RegexRoute>}
   * @private
   */
  this.routes_ = [];
};
goog.inherits(monin.routing.Router, goog.events.EventTarget);

/**
 * Adds a new route to list
 *
 * @param {monin.routing.RegexRoute} route
 */
monin.routing.Router.prototype.addRoute = function(route)
{
  this.routes_.push(route);
  route.setParentEventTarget(this);
};

/**
 * Matches a route agains specified url token
 *
 * @param  {string} token
 */
monin.routing.Router.prototype.match = function(token)
{
  for (var i = 0; i < this.routes_.length; i++)
  {
    this.routes_[i].match(token);
  }
};
