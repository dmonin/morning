/**
 * @fileoverview Appears elements while scrolling.
 */
goog.provide('morning.ui.AppearEffect');

goog.require('goog.async.Delay');
goog.require('goog.async.Throttle');
goog.require('goog.dom.dataset');
goog.require('goog.ui.Component');

/**
 * Appear effect
 *
 * @constructor
 * @extends {goog.ui.Component}
 */
morning.ui.AppearEffect = function()
{
  goog.base(this);

  /**
   * Scroll offset after which elements is appears
   * (Element Position + Scroll Offset = Visible).
   *
   * @type {number}
   * @private
   */
  this.offset_ = 100;

  /**
   * Defines whether element is appeared.
   *
   * @type {boolean}
   * @private
   */
  this.isVisible_ = false;

  /**
   * Position and size of the element in the document
   * @type {goog.math.Rect}
   * @protected
   */
  this.bounds = null;

  /**
   * Size of the screen.
   *
   * @type {goog.math.Size}
   * @protected
   */
  this.viewportSize = goog.dom.getViewportSize();

  /**
   * Defines whether element should appear once.
   *
   * @type {boolean}
   * @private
   */
  this.isOnce_ = false;

  /**
   * @type {boolean}
   * @private
   */
  this.isOnceAppeared_ = false;

  /**
   * @type {goog.async.Delay}
   * @protected
   */
  this.updatePositionDelay = new goog.async.Delay(this.updatePosition,
    300, this);
  this.registerDisposable(this.updatePositionDelay);

  /**
   * Update css class with a certain delay.
   *
   * @type {goog.async.Delay}
   * @private
   */
  this.updateClsDelay_ = null;
  this.registerDisposable(this.updateClsDelay_);
};
goog.inherits(morning.ui.AppearEffect, goog.ui.Component);

/**
 * @inheritDoc
 */
morning.ui.AppearEffect.prototype.decorateInternal = function(el)
{
  goog.base(this, 'decorateInternal', el);

  var offset = goog.dom.dataset.get(el, 'offset');
  if (offset)
  {
    this.offset_ = parseInt(offset, 10);
  }

  var delay = goog.dom.dataset.get(el, 'delay');
  if (delay)
  {
    goog.dispose(this.updateClsDelay_);
    this.updateClsDelay_ = new goog.async.Delay(this.updateVisibility,
      Number(delay), this);
    this.registerDisposable(this.updateClsDelay_);
  }

  this.isOnce_ = goog.dom.classlist.contains(el, 'once');
};

/** @inheritDoc */
morning.ui.AppearEffect.prototype.enterDocument = function()
{
  goog.base(this, 'enterDocument');

  this.getHandler().
    listen(window, goog.events.EventType.SCROLL, this.handleScroll).
    listen(window, goog.events.EventType.RESIZE, this.handleResize_);

  this.updatePosition();
  this.updatePositionDelay.start();
  goog.Timer.callOnce(this.updatePosition, 2000, this);

  this.handleScroll(null);
};

/**
 * Handles browser scroll events.
 *
 * @param  {goog.events.Event} e
 * @protected
 */
morning.ui.AppearEffect.prototype.handleScroll = function(e)
{
  if (this.isOnceAppeared_ && this.isOnce_)
  {
    return;
  }

  var docScroll = goog.dom.getDocumentScroll();
  var viewportSize = this.viewportSize;
  var isVisible = this.bounds.top < docScroll.y + viewportSize.height - this.offset_;

  if (isVisible != this.isVisible_)
  {
    this.isVisible_ = isVisible;
    if (this.updateClsDelay_)
    {
      this.updateClsDelay_.start();
    }
    else
    {
      this.updateVisibility();
    }

  }
};

/**
 * @param {goog.events.Event} e
 * @private
 */
morning.ui.AppearEffect.prototype.handleResize_ = function(e)
{
  this.updatePositionDelay.start();
};

/**
 * Returns true if element is visible currently.
 *
 * @return {boolean}
 */
morning.ui.AppearEffect.prototype.isVisible = function()
{
  return this.isVisible_;
};

/**
 * @private
 */
morning.ui.AppearEffect.prototype.updatePosition = function()
{
  this.bounds = goog.style.getBounds(this.getElement());
  this.viewportSize = goog.dom.getViewportSize();
};

/**
 * Updates class depending on visibility of the element.
 */
morning.ui.AppearEffect.prototype.updateVisibility = function()
{
  goog.dom.classlist.enable(this.getElement(), 'appear', this.isVisible_);

  if (this.isVisible_ && this.isOnce_)
  {
    this.isOnceAppeared_ = true;

  }
};


/**
 * Register this control so it can be created from markup.
 */
goog.ui.registry.setDecoratorByClassName(
  'appear-effect',
  function() {
    return new morning.ui.AppearEffect();
  }
);
