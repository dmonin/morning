/**
 * @fileoverview An event, which is fired when route matches
 */
goog.provide('monin.routing.RouteMatchEvent');
goog.require('goog.events.Event');

/**
 * A route match event
 *
 * @param {string|!goog.events.EventId} type Event Type.
 * @param {string} token URL token
 * @param {Object=} opt_target Reference to the object that is the target of
 *     this event. It has to implement the {@code EventTarget} interface
 *     declared at {@link http://developer.mozilla.org/en/DOM/EventTarget}.
 * @param {Object=} opt_data
 * @extends {goog.events.Event}
 * @constructor
 */
monin.routing.RouteMatchEvent = function(type, token, opt_target, opt_data)
{
  goog.base(this, type, opt_target);

  /**
   * @type {string}
   */
  this.token = token;

  /**
   * @type {Object}
   */
  this.data = opt_data || null;
};
goog.inherits(monin.routing.RouteMatchEvent, goog.events.Event);
