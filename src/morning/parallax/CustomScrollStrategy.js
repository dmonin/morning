goog.provide('morning.parallax.CustomScrollStrategy');

goog.require('goog.events.MouseWheelHandler');
goog.require('goog.events.EventTarget');
goog.require('morning.parallax.registry');
goog.require('morning.parallax.AbstractScrollStrategy');

/**
 * @constructor
 * @extends {morning.parallax.AbstractScrollStrategy}
 */
morning.parallax.CustomScrollStrategy = function()
{
  goog.base(this);

  /**
   * @type {goog.events.EventHandler}
   * @private
   */
  this.handler_ = new goog.events.EventHandler(this);

  /**
   * @type {goog.events.MouseWheelHandler}
   * @private
   */
  this.mouseWheelHandler_ = null;

  /**
   * @type {Element}
   * @private
   */
  this.mouseWheelTarget_ = null;
};

goog.inherits(morning.parallax.CustomScrollStrategy,
  goog.events.EventTarget);

morning.parallax.CustomScrollStrategy.prototype.attach = function(element)
{
  var mouseWheelTarget = this.mouseWheelTarget_ || el;
  this.mouseWheelHandler_ = new goog.events.MouseWheelHandler(mouseWheelTarget);

  this.getHandler().listen(this.mouseWheelHandler_,
            goog.events.MouseWheelHandler.EventType.MOUSEWHEEL,
            this.handleMouseWheel_);
};

morning.parallax.CustomScrollStrategy.prototype.detach = function(element)
{
  this.handler_.removeAll();
  this.mouseWheelHandler_.dispose();
};



/**
 * @param {goog.events.Event} e
 * @private
 */
morning.parallax.CustomScrollStrategy.prototype.handleMouseWheel_ = function(e)
{
    var delta = this.smoothScrolling ? 300 : 100;
    var offset = e.deltaY > 0 ? delta : -delta;

    this.setTargetPosition(this.scrollPos_ + offset);
};


/**
 * @param  {Element} el
 */
morning.parallax.CustomScrollStrategy.prototype.setMouseWheelTarget = function(el)
{
    this.mouseWheelTarget_ = el;
};

/**
 * Register new scroll strategy
 */
morning.parallax.registry.registerStrategy(
    'scroll-strategy-element',
    function() {
        return new morning.parallax.ScrollToElementStrategy();
    });