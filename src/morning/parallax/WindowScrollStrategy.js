goog.provide('morning.parallax.WindowScrollStrategy');

goog.require('goog.dom');
goog.require('goog.events.EventTarget');
goog.require('morning.parallax.registry');
goog.require('morning.parallax.AbstractScrollStrategy');

/**
 * @constructor
 * @extends {morning.parallax.AbstractScrollStrategy}
 */
morning.parallax.WindowScrollStrategy = function()
{
  goog.base(this);

  /**
   * @type {goog.events.EventHandler}
   * @private
   */
  this.handler_ = new goog.events.EventHandler(this);
};

goog.inherits(morning.parallax.WindowScrollStrategy,
  morning.parallax.AbstractScrollStrategy);

/**
 * @param {Element} element
 */
morning.parallax.WindowScrollStrategy.prototype.attach = function(element)
{
  this.handler_.listen(window, goog.events.EventType.SCROLL,
    this.handleScroll_);
};

morning.parallax.WindowScrollStrategy.prototype.detach = function(element)
{
  this.handler_.removeAll();
};

/**
 * @param {goog.events.BrowserEvent} e
 * @private
 */
morning.parallax.WindowScrollStrategy.prototype.handleScroll_ = function(e)
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
morning.parallax.registry.registerStrategy(
    'scroll-strategy-window',
    function() {
        return new morning.parallax.WindowScrollStrategy();
    });
