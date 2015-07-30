goog.provide('monin.parallax.WindowScrollStrategy');

goog.require('goog.dom');
goog.require('goog.events.EventTarget');
goog.require('monin.parallax.registry');
goog.require('monin.parallax.AbstractScrollStrategy');

/**
 * @constructor
 * @extends {monin.parallax.AbstractScrollStrategy}
 */
monin.parallax.WindowScrollStrategy = function()
{
  goog.base(this);

  /**
   * @type {goog.events.EventHandler}
   * @private
   */
  this.handler_ = new goog.events.EventHandler(this);
};

goog.inherits(monin.parallax.WindowScrollStrategy,
  monin.parallax.AbstractScrollStrategy);

/**
 * @param {Element} element
 */
monin.parallax.WindowScrollStrategy.prototype.attach = function(element)
{
  this.handler_.listen(window, goog.events.EventType.SCROLL,
    this.handleScroll_);
};

monin.parallax.WindowScrollStrategy.prototype.detach = function(element)
{
  this.handler_.removeAll();
};

/**
 * @param {goog.events.BrowserEvent} e
 * @private
 */
monin.parallax.WindowScrollStrategy.prototype.handleScroll_ = function(e)
{
  var docScroll = goog.dom.getDocumentScroll();
  this.dispatchEvent({
    type: goog.events.EventType.SCROLL,
    position: docScroll.y
  });
};

/**
 * Register new scroll strategy
 */
monin.parallax.registry.registerStrategy(
    'scroll-strategy-window',
    function() {
        return new monin.parallax.WindowScrollStrategy();
    });
