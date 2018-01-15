/**
 * @fileoverview Scroll detector: checks current scroll position and checks for
 * the end of the page
 */
goog.provide('morning.events.EndOfPageDetector');

goog.require('goog.Timer');
goog.require('goog.events.EventTarget');

/**
 * @constructor
 * @param {Element} element
 * @extends {goog.events.EventTarget}
 */
morning.events.EndOfPageDetector = function(element)
{
  goog.base(this);

  /**
   * Event handler
   *
   * @type {goog.events.EventHandler}
   * @private
   */
  this.eventHandler_ = new goog.events.EventHandler(this);

  /**
   * Offset to the bottom of the container
   *
   * @type {number}
   */
  this.bottomOffset = 1000;

  /**
   * Scrollable element
   *
   * @type {Element}
   * @private
   */
  this.element_ = element;

  /**
   * Total possible scroll height
   *
   * @type {number}
   * @private
   */
  this.scrollHeight_ = 0;

  /**
   * Element height
   *
   * @type {number}
   * @private
   */
  this.elementHeight_ = 0;
};
goog.inherits(morning.events.EndOfPageDetector,
  goog.events.EventTarget);

/**
 * Attaches scrolling events
 */
morning.events.EndOfPageDetector.prototype.attach = function()
{
  this.eventHandler_.listen(this.element_, goog.events.EventType.SCROLL,
    this.handleScroll_);
};

/**
 * Detaches scrolling events
 */
morning.events.EndOfPageDetector.prototype.detach = function()
{
  this.eventHandler_.removeAll();
};

/**
 * Detects whether user scrolled to the end of the page
 *
 * @private
 */
morning.events.EndOfPageDetector.prototype.detectEndOfPage_ = function()
{
  var isEndOfPage = (this.getPosition() + this.elementHeight_ >
     this.scrollHeight_ - this.bottomOffset);

  if (isEndOfPage)
  {
    this.dispatchEvent(morning.events.EndOfPageDetector.EventType.ENDOFPAGE);
  }
};



/**
 * Returns current scroll position
 *
 * @return {number}
 */
morning.events.EndOfPageDetector.prototype.getPosition = function()
{
  return this.element_.scrollTop;
};

/**
 * Handles browser scroll event
 *
 * @param {goog.events.BrowserEvent} e
 * @private
 */
morning.events.EndOfPageDetector.prototype.handleScroll_ = function(e)
{
  this.detectEndOfPage_();
  this.dispatchEvent(goog.events.EventType.SCROLL);
};

/**
 * Refreshes internally scrolling and element heights
 *
 */
morning.events.EndOfPageDetector.prototype.refresh = function()
{
  this.scrollHeight_ = this.element_.scrollHeight;
  this.elementHeight_ = this.element_.offsetHeight;
};

/**
 * List of Events
 *
 * @enum {string}
 */
morning.events.EndOfPageDetector.EventType = {
  SCROLL: 'scroll',
  ENDOFPAGE: 'endofpage'
};
