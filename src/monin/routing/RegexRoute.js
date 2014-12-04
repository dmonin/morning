/**
 * @fileoverview Route based on matching against regular expression
 */
goog.provide('monin.routing.RegexRoute');
goog.require('monin.routing.Route');
goog.require('monin.routing.RouteMatchEvent');

/**
 * @constructor
 * @param {string} name
 * @param {RegExp} regex
 * @param {string} controllerName
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
  if (token.match(this.regex))
  {
    this.dispatchEvent(
      new monin.routing.RouteMatchEvent(
        monin.routing.Route.EventType.ROUTE_MATCH,
        token, this
      )
    );
  }
};
