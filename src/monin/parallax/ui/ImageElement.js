goog.provide('monin.parallax.ui.ImageElement');

goog.require('goog.net.ImageLoader');
goog.require('goog.style');
goog.require('goog.ui.registry');
goog.require('goog.uri.utils');
goog.require('monin.parallax.ui.Element');

/**
 * @constructor
 * @extends {monin.parallax.ui.Element}
 */
monin.parallax.ui.ImageElement = function()
{
  goog.base(this);

};
goog.inherits(monin.parallax.ui.ImageElement,
  monin.parallax.ui.Element);


/**
 * @param {Element} el
 */
monin.parallax.ui.ImageElement.prototype.decorateInternal = function(el)
{
  goog.base(this, 'decorateInternal', el);

  var image = goog.style.getComputedStyle(this.getElement(), 'backgroundImage');

  if (!image)
  {
    // Computed Style couldn't be retrieved (IE8)
    this.dispatchEvent(monin.parallax.ui.Element.EventType.LOAD);
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
monin.parallax.ui.ImageElement.prototype.handleLoadComplete_ = function(e)
{
  this.dispatchEvent(monin.parallax.ui.Element.EventType.LOAD);
};

/** @inheritDoc */
monin.parallax.ui.ImageElement.prototype.isLoadable = function()
{
  return true;
};


/**
 * Register this control so it can be created from markup.
 */
goog.ui.registry.setDecoratorByClassName(
  'prlx-image-element',
  function() {
    return new monin.parallax.ui.ImageElement();
  }
);
