goog.provide('morning.parallax.effects.AttributeEffect');

goog.require('morning.parallax.effects.AbstractPropertyEffect');
goog.require('goog.structs.Map');
goog.require('goog.style.transform');

/**
 * @constructor
 * @extends {morning.parallax.effects.AbstractPropertyEffect }
 */
morning.parallax.effects.AttributeEffect = function()
{
  /**
   * @type {string}
   */
  this.attribute = '';

  /**
   * @type {string}
   */
  this.selector = '';

  /**
   * @type {Element}
   */
  this.element = null;

};
goog.inherits(morning.parallax.effects.AttributeEffect,
  morning.parallax.effects.AbstractPropertyEffect);

/**
 * @type {goog.structs.Map}
 * @private
 */
morning.parallax.effects.AttributeEffect.states_ = new goog.structs.Map();

/** @inheritDoc */
morning.parallax.effects.AttributeEffect.prototype.setConfig = function(config)
{
  goog.base(this, 'setConfig', config);

  this.selector = config['selector'];
  this.attribute = config['attribute'];
};

/**
 * @param {morning.parallax.ui.Element} element
 * @param {number|Array<number>} value
 */
morning.parallax.effects.AttributeEffect.prototype.setProperty = function(element, value)
{
  var node = element.getElement();
  var property = this.property;

  var state = null;
  if (node.id)
  {
    state = morning.parallax.effects.AttributeEffect.states_.get(node.id) || {};
  }

  if (state && state[this.property] == value)
  {
    return;
  }

  if (this.selector)
  {
    node = node.querySelector(this.selector);
  }

  node.setAttribute(this.attribute, value);

  if (state)
  {
    state[property] = value;
    morning.parallax.effects.AttributeEffect.states_.set(node.id, state);
  }
};
