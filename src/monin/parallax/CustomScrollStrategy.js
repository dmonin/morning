goog.provide('monin.parallax.CustomScrollStrategy');

goog.require('goog.events.MouseWheelHandler');
goog.require('goog.events.EventTarget');
goog.require('monin.parallax.registry');
goog.require('monin.parallax.AbstractScrollStrategy');

/**
 * @constructor
 * @extends {monin.parallax.AbstractScrollStrategy}
 */
monin.parallax.CustomScrollStrategy = function()
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

goog.inherits(monin.parallax.CustomScrollStrategy,
  goog.events.EventTarget);

monin.parallax.CustomScrollStrategy.prototype.attach = function(element)
{
  var mouseWheelTarget = this.mouseWheelTarget_ || el;
  this.mouseWheelHandler_ = new goog.events.MouseWheelHandler(mouseWheelTarget);

  this.getHandler().listen(this.mouseWheelHandler_,
            goog.events.MouseWheelHandler.EventType.MOUSEWHEEL,
            this.handleMouseWheel_);
};

monin.parallax.CustomScrollStrategy.prototype.detach = function(element)
{
  this.handler_.removeAll();
  this.mouseWheelHandler_.dispose();
};



/**
 * @param {goog.events.Event} e
 * @private
 */
monin.parallax.CustomScrollStrategy.prototype.handleMouseWheel_ = function(e)
{
    var delta = this.smoothScrolling ? 300 : 100;
    var offset = e.deltaY > 0 ? delta : -delta;

    this.setTargetPosition(this.scrollPos_ + offset);
};


/**
 * @param  {Element} el
 */
monin.parallax.CustomScrollStrategy.prototype.setMouseWheelTarget = function(el)
{
    this.mouseWheelTarget_ = el;
};

/**
 * Register new scroll strategy
 */
monin.parallax.registry.registerStrategy(
    'scroll-strategy-element',
    function() {
        return new monin.parallax.ScrollToElementStrategy();
    });