/**
 * @fileoverview Hamburger Navigation Button
 */
goog.provide('morning.ui.HamburgerButton');

goog.require('goog.dom.classlist');
goog.require('goog.ui.Component');
goog.require('goog.ui.registry');

/**
 * @constructor
 * @extends {goog.ui.Component}
 */
morning.ui.HamburgerButton = function()
{
  goog.base(this);

  /**
   * Defines whether button is currently expanded.
   *
   * @type {boolean}
   * @private
   */
  this.isExpanded_ = false;
};
goog.inherits(morning.ui.HamburgerButton, goog.ui.Component);

/** @inheritDoc */
morning.ui.HamburgerButton.prototype.enterDocument = function()
{
  goog.base(this, 'enterDocument');

  this.getHandler().

    listen(this.getElement(),
      goog.events.EventType.CLICK, this.handleClick_);
};

/**
 * Handles click event.
 *
 * @param  {goog.events.BrowserEvent} e
 * @private
 */
morning.ui.HamburgerButton.prototype.handleClick_ = function(e)
{
  this.isExpanded_ = !this.isExpanded_;
  goog.dom.classlist.enable(document.body, 'nav-expanded', this.isExpanded_);

  e.stopPropagation();
  if (this.isExpanded_)
  {
    this.getHandler().listenOnce(document.documentElement,
      goog.events.EventType.CLICK, this.handleDocClick_);
    this.dispatchEvent(goog.ui.Component.EventType.OPEN);
  }
  else
  {
    this.dispatchEvent(goog.ui.Component.EventType.CLOSE);
  }
};

/**
 * Handles click on document element and if the click is not inside navigation,
 * than is collapses.
 *
 * @param  {goog.events.BrowserEvent} e
 * @private
 */
morning.ui.HamburgerButton.prototype.handleDocClick_ = function(e)
{
  this.isExpanded_ = false;
  goog.dom.classlist.remove(document.body, 'nav-expanded');

  this.dispatchEvent(goog.ui.Component.EventType.CLOSE);
};

/**
 * Register this control so it can be created from markup.
 */
goog.ui.registry.setDecoratorByClassName(
  'hamburger-button',
  function() {
    return new morning.ui.HamburgerButton();
  }
);
