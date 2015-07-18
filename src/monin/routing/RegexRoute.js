/**
 * @fileoverview Route based on matching against regular expression
 */
goog.provide('monin.routing.RegexRoute');
goog.require('monin.routing.Route');
goog.require('monin.routing.RouteMatchEvent');

/**
 * @constructor
 * @param {string} name Name of the route
 * @param {RegExp} regex Regular Expression to be matched against the route
 * @param {string} controllerName name of controller assigned to the route
 * @extends {monin.routing.Route}
 */
monin.routing.RegexRoute = function(name, regex, controllerName)
{
  goog.base(this, name);

  /**
   * Regex Pattern to be match against
   *
   * @type {RegExp}
   */
  this.regex = regex;

  /**
   * Name of controller
   *
   * @type {string}
   */
  this.controllerName = controllerName;
};
goog.inherits(monin.routing.RegexRoute, monin.routing.Route);

/** @inheritDoc */
monin.routing.RegexRoute.prototype.match = function(token)
{
  var matches = token.match(this.regex);
  if (matches)
  {
    this.dispatchEvent(
      new monin.routing.RouteMatchEvent(
        monin.routing.Route.EventType.ROUTE_MATCH,
        token, this, {
          matches: matches
        }
      )
    );

    return true;
  }

  return false;
};
