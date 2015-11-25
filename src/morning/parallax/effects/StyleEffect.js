goog.provide('morning.parallax.effects.StyleEffect');

goog.require('morning.parallax.effects.AbstractPropertyEffect');
goog.require('goog.structs.Map');
goog.require('goog.style.transform');

/**
 * @constructor
 * @extends {morning.parallax.effects.AbstractPropertyEffect }
 */
morning.parallax.effects.StyleEffect = function()
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
goog.inherits(morning.parallax.effects.StyleEffect,
  morning.parallax.effects.AbstractPropertyEffect);

/**
 * @type {goog.structs.Map}
 * @private
 */
morning.parallax.effects.StyleEffect.states_ = new goog.structs.Map();

/** @inheritDoc */
morning.parallax.effects.StyleEffect.prototype.setConfig = function(config)
{
  goog.base(this, 'setConfig', config);

  this.selector = config['selector'];
  this.property = config['property'];
  this.unit = config['unit'] || '';
};

/**
 * @param {morning.parallax.ui.Element} element
 * @param {number|Array<number>} value
 */
morning.parallax.effects.StyleEffect.prototype.setProperty = function(element, value)
{
  var node = element.getElement();
  var property = this.property;

  var state = null;
  if (node.id)
  {
    state = morning.parallax.effects.StyleEffect.states_.get(node.id) || {};
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
        morning.style.setFilter(node, 'blur(' + Math.round(value) + 'px)');
      }
      break;

    case 'rotate':
      morning.style.setTransform(node, 'rotate(' + Math.round(value) + 'deg)');
      break;

    case 'scale':
      morning.style.setTransform(node, 'scale(' + value + ')');
      break;

    case 'scaleX':
      morning.style.setTransform(node, 'scaleX(' + value + ')');
      break;

    case 'scaleY':
      morning.style.setTransform(node, 'scaleY(' + value + ')');
      break;

    case 'translate':
      morning.style.translate(node, value[0], value[1], this.unit);
      break;

    default:
      if (value instanceof Array)
      {
        var str = '';
        for (var i = 0; i < value.length; i++)
        {
          str += value[i] + this.unit + ' ';
        }
        node.style[this.property] = str;
      }
      else
      {
        node.style[this.property] = value + this.unit;
      }

      break;
  }

  if (state)
  {
    state[property] = value;
    morning.parallax.effects.StyleEffect.states_.set(node.id, state);
  }
};
