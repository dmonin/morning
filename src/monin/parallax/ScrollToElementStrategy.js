goog.provide('monin.parallax.ScrollToElementStrategy');

goog.require('goog.dom');
goog.require('goog.events.EventTarget');
goog.require('monin.parallax.registry');
goog.require('monin.parallax.AbstractScrollStrategy');

/**
 * @constructor
 * @extends {monin.parallax.AbstractScrollStrategy}
 */
monin.parallax.ScrollToElementStrategy = function()
{
  goog.base(this);

  /**
   * @type {goog.events.EventHandler}
   * @private
   */
  this.handler_ = new goog.events.EventHandler(this);

  /**
   * @type {number}
   * @private
   */
  this.offsetTop_ = 0;
};

goog.inherits(monin.parallax.ScrollToElementStrategy,
  monin.parallax.AbstractScrollStrategy);

/**
 * @param  {Element} element
 * @private
 */
monin.parallax.ScrollToElementStrategy.prototype.attach = function(element)
{
  this.offsetTop_ = goog.style.getPageOffset(element).y;
  if (goog.DEBUG)
  {
    console.info("Initialized Scroll to Top strategy with %d offset.",
      this.offsetTop_);
  }

  this.handler_.listen(window, goog.events.EventType.SCROLL,
    this.handleScroll_);
};

monin.parallax.ScrollToElementStrategy.prototype.detach = function()
{
  this.handler_.removeAll();
};

/**
 * @inheritDoc
 */
monin.parallax.ScrollToElementStrategy.prototype.disposeInternal = function()
{
  goog.base(this, 'disposeInternal');

  this.detach();
};

/**
 * @param {goog.events.BrowserEvent} e
 * @private
 */
monin.parallax.ScrollToElementStrategy.prototype.handleScroll_ = function(e)
{
  var docScroll = goog.dom.getDocumentScroll();
  this.dispatchEvent({
    type: goog.events.EventType.SCROLL,
    position: docScroll.y - this.offsetTop_
  });
};


/**
 * Register new scroll strategy
 */
monin.parallax.registry.registerStrategy(
    'scroll-strategy-element',
    function() {
        return new monin.parallax.ScrollToElementStrategy();
    });
