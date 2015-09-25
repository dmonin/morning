/**
 * @fileoverview Debugs current scroll position of containers.
 * @example
 * if (goog.DEBUG) {
 *    var debugger = new morning.parallax.ui.ScrollDebugger(prlxContainer);
 *    debugger.render(prlxContainer.getElement());
 * }
 *
 */
goog.provide('morning.parallax.ui.ScrollDebugger');

goog.require('goog.ui.Component');
goog.require('goog.style');

/**
 * @constructor
 * @param {morning.parallax.ui.ParallaxContainer} container
 * @extends {goog.ui.Component}
 */
morning.parallax.ui.ScrollDebugger = function(container)
{
  goog.base(this);

  /**
   * Parallax container
   *
   * @type {morning.parallax.ui.ParallaxContainer}
   * @private
   */
  this.container_ = container;
};
goog.inherits(morning.parallax.ui.ScrollDebugger,
  goog.ui.Component);

/** @inheritDoc */
morning.parallax.ui.ScrollDebugger.prototype.createDom = function()
{
  var domHelper = this.getDomHelper();
  var el = domHelper.createDom('div', 'scroll-debugger');
  this.decorateInternal(el);
};

/** @inheritDoc */
morning.parallax.ui.ScrollDebugger.prototype.decorateInternal = function(el)
{
  goog.base(this, 'decorateInternal', el);
  goog.style.setStyle(el, {
    'color': '#fff',
    'padding': '5px 10px',
    'position': 'absolute',
    'background': 'rgba(0,0,0, 0.75)',
    'zIndex': 1000
  });
  el.style.position = 'absolute';
};

/** @inheritDoc */
morning.parallax.ui.ScrollDebugger.prototype.enterDocument = function()
{
  goog.base(this, 'enterDocument');

  this.positionate_();

  this.getHandler().
    listen(this.container_, goog.events.EventType.SCROLL, this.handleScroll_).
    listen(window, goog.events.EventType.RESIZE, this.handleResize_);
};

/**
 * Handles resize event.
 *
 * @param  {goog.events.BrowserEvent} e
 * @private
 */
morning.parallax.ui.ScrollDebugger.prototype.handleResize_ = function(e)
{
  this.positionate_();
};

/**
 * Handles scroll event.
 *
 * @param  {Object} e
 * @private
 */
morning.parallax.ui.ScrollDebugger.prototype.handleScroll_ = function(e)
{
  this.getElement().innerHTML = e.position;
};

/**
 * @private
 */
morning.parallax.ui.ScrollDebugger.prototype.positionate_ = function()
{
  var el = /** @type {Element} */ (this.getElement().parentNode) || this.getElement();
  var pos = goog.style.getPageOffset(el);
  goog.style.setPageOffset(this.getElement(), pos);
};
