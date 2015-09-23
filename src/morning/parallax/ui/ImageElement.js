goog.provide('morning.parallax.ui.ImageElement');

goog.require('goog.net.ImageLoader');
goog.require('goog.style');
goog.require('goog.ui.registry');
goog.require('goog.uri.utils');
goog.require('morning.parallax.ui.Element');

/**
 * @constructor
 * @extends {morning.parallax.ui.Element}
 */
morning.parallax.ui.ImageElement = function()
{
  goog.base(this);

};
goog.inherits(morning.parallax.ui.ImageElement,
  morning.parallax.ui.Element);


/**
 * @param {Element} el
 */
morning.parallax.ui.ImageElement.prototype.decorateInternal = function(el)
{
  goog.base(this, 'decorateInternal', el);

  var image = goog.style.getComputedStyle(this.getElement(), 'backgroundImage');

  if (!image)
  {
    // Computed Style couldn't be retrieved (IE8)
    this.dispatchEvent(morning.parallax.ui.Element.EventType.LOAD);
    return;
  }
  var src = image.match(/url\((.*?)\)/)[1];
  var loader = new goog.net.ImageLoader();
  var path = goog.uri.utils.getPath(src).replace(/"/g, '');

  loader.addImage(this.makeId('img'), path);
  this.getHandler().listen(loader, goog.net.EventType.COMPLETE,
    this.handleLoadComplete_);
  loader.start();
};

/**
 * @param {goog.events.Event} e
 * @private
 */
morning.parallax.ui.ImageElement.prototype.handleLoadComplete_ = function(e)
{
  this.dispatchEvent(morning.parallax.ui.Element.EventType.LOAD);
};

/** @inheritDoc */
morning.parallax.ui.ImageElement.prototype.isLoadable = function()
{
  return true;
};


/**
 * Register this control so it can be created from markup.
 */
goog.ui.registry.setDecoratorByClassName(
  'prlx-image-element',
  function() {
    return new morning.parallax.ui.ImageElement();
  }
);
