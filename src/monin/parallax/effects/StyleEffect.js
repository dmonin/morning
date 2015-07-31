goog.provide('monin.parallax.effects.StyleEffect');

goog.require('monin.parallax.effects.AbstractPropertyEffect');
goog.require('goog.structs.Map');
goog.require('goog.style.transform');

/**
 * @constructor
 * @extends {monin.parallax.effects.AbstractPropertyEffect }
 */
monin.parallax.effects.StyleEffect = function()
{
  /**
   * @type {string}
   */
  this.unit = '';

  /**
   * @type {string}
   */
  this.property = 'top';

  /**
   * @type {string}
   */
  this.selector = '';

};

goog.inherits(monin.parallax.effects.StyleEffect, monin.parallax.effects.AbstractPropertyEffect);

/**
 * @type {goog.structs.Map}
 * @private
 */
monin.parallax.effects.StyleEffect.states_ = new goog.structs.Map();

/** @inheritDoc */
monin.parallax.effects.StyleEffect.prototype.setConfig = function(config)
{
  goog.base(this, 'setConfig', config);

  this.selector = config['selector'];
  this.property = config['property'];
  this.unit = config['unit'] || '';
};

/**
 * @param {monin.parallax.ui.Element} element
 * @param {number|Array<number>} value
 */
monin.parallax.effects.StyleEffect.prototype.setProperty = function(element, value)
{
  var node = element.getElement();
  var property = this.property;

  var state = null;
  if (node.id)
  {
    state = monin.parallax.effects.StyleEffect.states_.get(node.id) || {};
  }

  if (state && state[this.property] == value)
  {
    return;
  }

  if (this.selector)
  {
    node = node.querySelector(this.selector);
  }

  switch (property)
  {
    case 'blur':
      // too slow on ipad
      if (!goog.userAgent.IPAD)
      {
        monin.style.setFilter(node, 'blur(' + Math.round(value) + 'px)');
      }
      break;

    case 'rotate':
      monin.style.setTransform(node, 'rotate(' + Math.round(value) + 'deg)');
      break;

    case 'scale':
      monin.style.setTransform(node, 'scale(' + value + ')');
      break;

    case 'translate':
      monin.style.translate(node, value[0], value[1], this.unit);
      break;

    default:
      node.style[this.property] = value + this.unit;
      break;
  }

  if (state)
  {
    state[property] = value;
    monin.parallax.effects.StyleEffect.states_.set(node.id, state);
  }
};
