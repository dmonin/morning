/**
 * @fileoverview Provides a basic route for Router which matches a route with
 * exact name.
 */
goog.provide('monin.routing.Route');
goog.provide('monin.routing.Route.EventType');
goog.require('goog.events.EventTarget');

/**
 * @constructor
 * @param {string} name name of the route
 * @extends {goog.events.EventTarget}
 */
monin.routing.Route = function(name)
{
  goog.base(this);

  /**
   * Name of the route
   *
   * @type {string}
   */
  this.name = name;
};
goog.inherits(monin.routing.Route, goog.events.EventTarget);

/**
 * Checks whether route matches
 *
 * @param {string} token
 * @return {boolean}
 */
monin.routing.Route.prototype.match = goog.abstractMethod;


/**
 * @enum {string}
 */
monin.routing.Route.EventType = {
  ROUTE_MATCH: 'route_match'
};
