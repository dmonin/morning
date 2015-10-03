/**
 * @fileoverview Route based on matching against regular expression
 */
goog.provide('morning.routing.RegexRoute');
goog.require('morning.routing.Route');
goog.require('morning.routing.RouteMatchEvent');

/**
 * @constructor
 * @param {string} name Name of the route
 * @param {RegExp} regex Regular Expression to be matched against the route
 * @param {string} module name of controller assigned to the route
 * @extends {morning.routing.Route}
 */
morning.routing.RegexRoute = function(name, regex, module)
{
  goog.base(this, name, module);

  /**
   * Regex Pattern to be match against
   *
   * @type {RegExp}
   */
  this.regex = regex;
};
goog.inherits(morning.routing.RegexRoute, morning.routing.Route);

/** @inheritDoc */
morning.routing.RegexRoute.prototype.match = function(token)
{
  var matches = token.match(this.regex);
  if (matches)
  {
    this.dispatchEvent(
      new morning.routing.RouteMatchEvent(
        morning.routing.Route.EventType.ROUTE_MATCH,
        token, this, {
          matches: matches
        }
      )
    );
    return true;
  }

  return false;
};
