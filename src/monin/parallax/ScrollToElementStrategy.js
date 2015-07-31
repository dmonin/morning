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
   * Event handler.
   *
   * @type {goog.events.EventHandler}
   * @private
   */
  this.handler_ = new goog.events.EventHandler(this);

  /**
   * Offset of the element to the top of the page.
   *
   * @type {number}
   * @private
   */
  this.offsetTop_ = 0;

  /**
   * This timer updates every 1.5s the y-offset of the element.
   *
   * @type {goog.Timer}
   * @private
   */
  this.timer_ = new goog.Timer(1500);
  this.handler_.listen(this.timer_, goog.Timer.TICK, this.handleTick_);

  /**
   * Attached element.
   *
   * @type {Element}
   * @private
   */
  this.element_ = null;
};

goog.inherits(monin.parallax.ScrollToElementStrategy,
  monin.parallax.AbstractScrollStrategy);

/**
 * Attaches element to scroll strategy
 *
 * @param  {Element} element
 */
monin.parallax.ScrollToElementStrategy.prototype.attach = function(element)
{
  if (this.element_)
  {
    throw new Error('An element is already attached to scroll strategy.');
  }

  this.offsetTop_ = goog.style.getPageOffset(element).y;
  if (goog.DEBUG)
  {
    console.info("Initialized Scroll to Top strategy with %d offset.",
      this.offsetTop_);
  }

  this.element_ = element;

  this.handler_.listen(window, goog.events.EventType.SCROLL,
    this.handleScroll_);

  this.timer_.start();
};

/**
 * Dettaches element from scroll strategy
 *
 * @param  {Element} element
 */
monin.parallax.ScrollToElementStrategy.prototype.detach = function()
{
  this.element_ = null;
  this.handler_.removeAll();
  this.timer_.stop();
};

/**
 * @inheritDoc
 */
monin.parallax.ScrollToElementStrategy.prototype.disposeInternal = function()
{
  goog.base(this, 'disposeInternal');

  this.detach();
  goog.dispose(this.timer_);
};

/**
 * Handles scroll event.
 *
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
 * Handles timer tick event.
 *
 * @param  {goog.events.Event} e
 * @private
 */
monin.parallax.ScrollToElementStrategy.prototype.handleTick_ = function(e)
{
  this.offsetTop_ = goog.style.getPageOffset(this.element_).y;
};

/**
 * Register new scroll strategy
 */
monin.parallax.registry.registerStrategy(
  'scroll-strategy-element',
  function() {
      return new monin.parallax.ScrollToElementStrategy();
  });
