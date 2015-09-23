/**
 * @fileoverview Provides a basic route for Router which matches a route with
 * exact name.
 */
goog.provide('morning.routing.Route');
goog.provide('morning.routing.Route.EventType');
goog.require('goog.events.EventTarget');

/**
 * @constructor
 * @param {string} name name of the route
 * @extends {goog.events.EventTarget}
 */
morning.routing.Route = function(name)
{
  goog.base(this);

  /**
   * Name of the route
   *
   * @type {string}
   */
  this.name = name;
};
goog.inherits(morning.routing.Route, goog.events.EventTarget);

/**
 * Checks whether route matches
 *
 * @param {string} token
 * @return {boolean}
 */
morning.routing.Route.prototype.match = goog.abstractMethod;


/**
 * @enum {string}
 */
morning.routing.Route.EventType = {
  ROUTE_MATCH: 'route_match'
};
