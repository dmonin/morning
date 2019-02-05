goog.provide('morning.app.View');
goog.require('goog.ui.Component');

/**
 * @constructor
 * @param {string} name
 * @extends {goog.ui.Component}
 */
morning.app.View = function(name)
{
  goog.base(this);

  /**
   * Name of the current view.
   *
   * @type {string}
   */
  this.name = name;

  /**
   * View state
   *
   * @type {Object}
   * @protected
   */
  this.state = null;

  /**
   * Dynamically initialized components in the view
   *
   * @type {morning.controllers.ComponentController}
   * @protected
   */
  this.componentController = new morning.controllers.ComponentController();
  this.componentController.setParentEventTarget(this);
  this.registerDisposable(this.componentController);
};
goog.inherits(morning.app.View, goog.ui.Component);

/** @inheritDoc */
morning.app.View.prototype.createDom = function()
{
  var el = this.getDomHelper().createDom('div', 'view');
  this.decorateInternal(el);
};

/** @inheritDoc */
morning.app.View.prototype.decorateInternal = function(el)
{
  goog.base(this, 'decorateInternal', el);

  this.componentController.initialize({
    element: this.getElement(),
    selector: '.cmp'
  });
};

/** @inheritDoc */
morning.app.View.prototype.enterDocument = function()
{
  morning.app.View.superClass_.enterDocument.call(this);

  this.componentController.getAll().forEach(function(child) {
    if (!child.isInDocument())
    {
      child.enterDocument();
    }
  }, this);
};

/** @inheritDoc */
morning.app.View.prototype.exitDocument = function()
{
  goog.base(this, 'exitDocument');

  this.componentController.getAll().forEach(function(child) {
    if (child.isInDocument())
    {
      child.exitDocument();
    }
  }, this);
};

/**
 * Returns sub component by specified name, which was initialized automatically
 * (through .cmp selector)
 *
 * @param {string} name
 * @return {goog.ui.Component}
 */
morning.app.View.prototype.getComponent = function(name)
{
  return this.componentController.getComponentByName(name);
};

/**
 * Sets whether component is active.
 *
 * @param {boolean} isActive
 */
morning.app.View.prototype.setActive = function(isActive)
{
  this.forEachChild(function(child) {
    if (child.setActive && typeof child.setActive == 'function')
    {
      child.setActive(isActive);
    }
  }, this);

  this.isActive = isActive;
};

/**
 * Sets the state of the view.
 *
 * @param {Object} state
 */
morning.app.View.prototype.setState = function(state)
{
  this.state = state;
};
