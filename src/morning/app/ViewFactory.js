goog.provide('morning.app.ViewFactory');
goog.require('goog.structs.Map');

/**
 * @constructor
 */
morning.app.ViewFactory = function()
{
  /**
   * View factory mapping.
   *
   * @type {goog.structs.Map}
   * @private
   */
  this.factory_ = new goog.structs.Map();
};
goog.addSingletonGetter(morning.app.ViewFactory);

/**
 * @param  {string} name Name of the view
 * @return {morning.app.View}
 */
morning.app.ViewFactory.prototype.getView = function(name)
{
  var factory = this.factory_.get(name);

  return factory ? factory() : null;
};

/**
 * @param  {string} name
 * @param  {Function} func
 */
morning.app.ViewFactory.prototype.register = function(name, func)
{
  this.factory_.set(name, func);
  return this;
};
