goog.provide('monin.controllers.ComponentController');
goog.require('monin.controllers.BaseController');
goog.require('goog.ui.decorate');
goog.require('goog.structs.Map');
goog.require('goog.dom.dataset');

/**
 * @constructor
 * @extends {monin.controllers.BaseController}
 */
monin.controllers.ComponentController = function()
{
  goog.base(this);

  /**
   * @type {goog.structs.Map}
   * @private
   */
  this.components_ = new goog.structs.Map();
};

goog.inherits(monin.controllers.ComponentController,
  monin.controllers.BaseController);

goog.addSingletonGetter(monin.controllers.ComponentController);

/**
 * @param  {Element} element
 * @param  {string=} opt_selector
 */
monin.controllers.ComponentController.prototype.destroy = function(element, opt_selector)
{
  var selector = opt_selector || '.cmp';
  var elements = element.querySelectorAll(selector);

  for (var i = 0; i < elements.length; i++)
  {
    var name = goog.dom.dataset.get(elements[i], 'name');
    var cmp = this.components_.get(name);
    if (name && cmp)
    {
      if (goog.DEBUG)
      {
        console.log('Destroyed component %o', cmp);
      }

      cmp.dispose();
      this.components_.remove(name);
    }
  }
};

/** @inheritDoc */
monin.controllers.ComponentController.prototype.disposeInternal = function()
{
  goog.base(this, 'disposeInternal');

  if (goog.DEBUG)
  {
    console.log('Disposing components: %o', this.components_.getValues());
  }

  goog.disposeAll(this.components_.getValues());
};

/**
 * @param {string} name
 * @return {goog.ui.Component}
 */
monin.controllers.ComponentController.prototype.getComponentByName =
  function(name)
{
  return this.components_.get(name);
};


/**
 * @param {Object} element
 * @param {string=} opt_selector
 */
monin.controllers.ComponentController.prototype.initialize = function(element, opt_selector)
{
  element = /** @type {Element} */ (element);
  var selector = opt_selector || '.cmp';
  var elements = element.querySelectorAll(selector);

  for (var i = 0; i < elements.length; i++)
  {
    var cmp = goog.ui.decorate(elements[i]);
    var name = goog.dom.dataset.get(elements[i], 'name');

    this.components_.set(name, cmp);
    cmp.setParentEventTarget(this);

    if (!cmp)
    {
      console.warn('Couldn\'t initialize component %o', elements[i]);
    }
    else if (goog.DEBUG)
    {
      console.log('Initialized component %s: %o %o', name, cmp, elements[i]);
    }
  }
};