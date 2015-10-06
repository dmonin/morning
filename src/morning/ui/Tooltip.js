// Copyright 2012 Dmitry morning. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Tooltip component
 */

goog.provide('morning.ui.Tooltip');
goog.provide('morning.ui.Tooltip.Direction');

goog.require('goog.array');
goog.require('goog.dom.classlist');
goog.require('morning.fx.dom.Slide');
goog.require('goog.fx.easing');
goog.require('goog.math.Coordinate');
goog.require('goog.style');
goog.require('goog.ui.Component');

/**
 * Tooltip
 *
 * @constructor
 * @extends {goog.ui.Component}
 */
morning.ui.Tooltip = function()
{
  goog.base(this);

  /**
   * Tooltip text
   *
   * @type {string}
   * @private
   */
  this.text_ = '';

  /**
   * Tooltip body element
   *
   * @type {Element}
   * @private
   */
  this.bodyEl_ = null;

  /**
   * Tooltip action elements wrapper
   *
   * @type {Element}
   * @private
   */
  this.actionsEl_ = null;

  /**
   * Tooltip direction
   *
   * @type {morning.ui.Tooltip.Direction|number}
   * @private
   */
  this.direction_ = morning.ui.Tooltip.Direction.NONE;

  /**
   * Defines whether tooltip is currently visible
   *
   * @type {boolean}
   * @private
   */
  this.isVisible_ = false;

  /**
   * Defines tooltip show animation
   *
   * @type {morning.fx.dom.Slide}
   * @private
   */
  this.animation_ = null;

  /**
   * Defines whether to show animation on show
   *
   * @type {boolean}
   */
  this.animationEnabled = true;

  /**
   * Defines tooltip owner: component which displayed tooltip
   *
   * @type {goog.ui.Component}
   * @private
   */
  this.owner_ = null;

  /**
   * Element to which tooltip is shown
   *
   * @type {string|Element}
   * @private
   */
  this.positionatedTo_ = null;

  /**
   * Defines whether tooltip should use simple css styles
   *
   * @type {boolean}
   * @private
   */
  this.isSimple_ = false;

  /**
   * Hide delay for tooltip
   *
   * @type {goog.async.Delay}
   * @private
   */
  this.hideDelay_ = new goog.async.Delay(this.hide_, 3000, this);
};
goog.inherits(morning.ui.Tooltip, goog.ui.Component);

goog.addSingletonGetter(morning.ui.Tooltip);

/**
 * Adjusts arrow position
 *
 * @param {goog.math.Coordinate} position
 * @param {goog.math.Size} tooltipSize
 * @param {Element} element
 * @private
 */
morning.ui.Tooltip.prototype.adjustArrowPosition_ = function(position,
  tooltipSize, element)
{
  var directionEnum = morning.ui.Tooltip.Direction,
    size = goog.style.getSize(element),
    elementPosition = goog.style.getPageOffset(element);

  if ((this.direction_ & directionEnum.TOP ||
    this.direction_ & directionEnum.BOTTOM))
  {
    var arrowCls = this.direction_ & directionEnum.TOP ?
                '.tooltip-arrow-t' : '.tooltip-arrow-b',
      arrow = this.getElement().querySelector(arrowCls);

    if (size.width < tooltipSize.width)
    {
      arrow.style.left = elementPosition.x - position.x + size.width / 2 + 'px';
    }
    else
    {
      arrow.style.left = '50%';
    }
  }
};

/**
 * Adjusts position to viewport
 *
 * @param {goog.math.Coordinate} position
 * @param {goog.math.Size} tooltipSize
 * @private
 */
morning.ui.Tooltip.prototype.adjustToViewport_ = function(position, tooltipSize)
{
  var scroll = goog.dom.getDocumentScroll();
  var viewportSize = goog.dom.getViewportSize();

  position.x = Math.max(0, position.x);
  position.x = Math.min(scroll.x + viewportSize.width - tooltipSize.width, position.x);
};

/**
 * Attaches tooltip to element
 *
 * @param {Element} element
 */
morning.ui.Tooltip.prototype.attach = function(element)
{
  this.getHandler().listen(element, goog.events.EventType.MOUSEOVER,
    this.handleAttachedMouseOver_);

  this.getHandler().listen(element, goog.events.EventType.MOUSEOUT,
    this.handleAttachedMouseOut_);
};



/**
 * Detaches tooltip from element
 *
 * @param {Element} element
 */
morning.ui.Tooltip.prototype.detach = function(element)
{
  this.getHandler().unlisten(element, goog.events.EventType.MOUSEOVER,
    this.handleAttachedMouseOver_);

  this.getHandler().unlisten(element, goog.events.EventType.MOUSEOUT,
    this.handleAttachedMouseOut_);
};

/** @inheritDoc */
morning.ui.Tooltip.prototype.createDom = function()
{
  var dom = this.getDomHelper(),
    arrowLeft = dom.createDom('div', 'tooltip-arrow-l'),
    arrowRight = dom.createDom('div', 'tooltip-arrow-r'),
    arrowTop = dom.createDom('div', 'tooltip-arrow-b'),
    arrowBottom = dom.createDom('div', 'tooltip-arrow-t'),
    body = dom.createDom('div', 'tooltip-body'),
    actions = dom.createDom('div', 'tooltip-actions'),
    el = dom.createDom('div', 'tooltip', [
      arrowLeft,
      arrowRight,
      arrowTop,
      arrowBottom,
      body,
      actions
    ]);

  this.decorateInternal(el);
};

/** @inheritDoc */
morning.ui.Tooltip.prototype.decorateInternal = function(el)
{
  goog.base(this, 'decorateInternal', el);


  this.actionsEl_ = el.querySelector('.tooltip-actions');
  this.bodyEl_ = el.querySelector('.tooltip-body');

  if (this.text_)
  {
    this.bodyEl_.innerHTML = this.text_;
  }

  this.setSimple(this.isSimple_);
  this.updateDirectionClass_();
  this.setVisible(this.isVisible_);

  this.animation_ = new morning.fx.dom.Slide(this.getElement(), [0, 0], [0, 0],
    500, goog.fx.easing.easeOut);
};

/**
 * Enables additional class names
 *
 * @param {string} className
 * @param {boolean} isEnabled
 */
morning.ui.Tooltip.prototype.enableExtraClassName = function(className,
    isEnabled)
{
  goog.dom.classlist.enable(this.getElement(), className, isEnabled);
};

/** @inheritDoc */
morning.ui.Tooltip.prototype.enterDocument = function()
{
  goog.base(this, 'enterDocument');

  this.getHandler().listen(this, goog.ui.Component.EventType.ACTION,
    this.handleAction_);

  this.getHandler().listen(window, goog.events.EventType.SCROLL,
    this.handleScroll_);
};

/**
 * Handles tooltip action
 *
 * @param {goog.events.BrowserEvent} e
 * @private
 */
morning.ui.Tooltip.prototype.handleAction_ = function(e)
{
  if (e.target.name == 'close')
  {
    this.setVisible(false);
    this.dispatchEvent(goog.ui.Component.EventType.CLOSE);
  }
};

/**
 * Handles mouse over on attached element and shows tooltip
 *
 * @param {goog.events.BrowserEvent} e
 * @private
 */
morning.ui.Tooltip.prototype.handleAttachedMouseOver_ = function(e)
{
  // Mouseenter
  var currentTarget = /** @type {Node} */ (e.currentTarget);
  var relatedTarget = /** @type {Node} */ (e.relatedTarget);
  if (!e.relatedTarget || goog.dom.contains(currentTarget, relatedTarget))
  {
    return;
  }

  var element = /** @type {Element} */ (e.currentTarget);
  this.positionateToElement(element);
  this.setVisible(true);
};

/**
 * Handles mouse over on attached element and hides tooltip
 *
 * @param {goog.events.BrowserEvent} e
 * @private
 */
morning.ui.Tooltip.prototype.handleAttachedMouseOut_ = function(e)
{
  // Mouseleave
  var currentTarget = /** @type {Node} */ (e.currentTarget);
  var relatedTarget = /** @type {Node} */ (e.relatedTarget);
  if (!e.relatedTarget || goog.dom.contains(currentTarget, relatedTarget))
  {
    return;
  }

  this.setVisible(false);
};

/**
 * Handles browser scrolling and repositionates tooltip
 *
 * @param {goog.events.BrowserEvent} e
 * @private
 */
morning.ui.Tooltip.prototype.handleScroll_ = function(e)
{
  if (this.isVisible() && this.positionatedTo_)
  {
    var position = this.getPositionToElement_(this.positionatedTo_);
    goog.style.setPageOffset(this.getElement(), position);
  }
};

/**
 * Hides tooltip
 *
 * @private
 */
morning.ui.Tooltip.prototype.hide_ = function()
{
  this.setVisible(false);
};

/**
 * Hides tooltip after specified time interval
 *
 * @param {number=} opt_delay
 */
morning.ui.Tooltip.prototype.hideDelayed = function(opt_delay)
{
  this.hideDelay_.start(opt_delay);
};

/**
 * Returns tooltip size
 *
 * @return {goog.math.Size}
 */
morning.ui.Tooltip.prototype.getSize = function()
{
  return goog.style.getSize(this.getElement());
};

/**
 * Returns attached elements
 *
 * @param {string} selector
 * @return {Element|Array.<Element>|NodeList}
 * @private
 */
morning.ui.Tooltip.prototype.getAttachedElements_ = function(selector)
{
  if (typeof selector == 'string')
  {
    var elements = selector ? document.body.querySelectorAll(selector) : null;

    if (!elements || elements.length == 0)
    {
      throw new Error('No matching element for selector ' + selector);
    }

    return elements;
  }
  else
  {
    return [selector];
  }
};

/**
 * Returns offset to attached element
 *
 * @return {goog.math.Coordinate}
 * @private
 */
morning.ui.Tooltip.prototype.getDefaultOffset_ = function()
{
  var directionEnum = morning.ui.Tooltip.Direction,
    offset = new goog.math.Coordinate(0, 0);

  if (this.direction_ & directionEnum.LEFT)
  {
    offset.x = 20;
  }
  else if (this.direction_ & directionEnum.RIGHT)
  {
    offset.x = -20;
  }
  else if (this.direction_ & directionEnum.TOP)
  {
    offset.y = 20;
  }
  else if (this.direction_ & directionEnum.BOTTOM)
  {
    offset.y = -20;
  }

  return offset;
};

/**
 * Returns tooltip position
 *
 * @return {!goog.math.Coordinate}
 */
morning.ui.Tooltip.prototype.getPosition = function()
{
  return goog.style.getPageOffset(this.getElement());
};

/**
 * Returns tooltip position to element according tooltip direction
 *
 * @param {string|Element} selector
 * @return {goog.math.Coordinate}
 * @private
 */
morning.ui.Tooltip.prototype.getPositionToElement_ = function(selector)
{
  if (this.isDisposed())
  {
    return null;
  }

  var tooltipSize = this.getSize(),
    attachedElements = this.getAttachedElements_(selector),
    directionEnum = morning.ui.Tooltip.Direction,
    position = goog.style.getPageOffset(attachedElements[0]),
    size = goog.style.getSize(attachedElements[0]);

  // Positioning between two elements
  if (this.direction_ & directionEnum.LEFT ||
    this.direction_ & directionEnum.RIGHT)
  {
    position.y = position.y + (size.height - tooltipSize.height) / 2;
  }

  if (this.direction_ & directionEnum.TOP ||
    this.direction_ & directionEnum.BOTTOM)
  {
    position.x = position.x + (size.width - tooltipSize.width) / 2;
  }

  // Position
  if (attachedElements.length > 1 && this.direction_ & directionEnum.LEFT &&
      this.direction_ & directionEnum.RIGHT)
  {
    var position2 = goog.style.getPageOffset(attachedElements[1]);
    position.x = Math.round((position2.x + position.x) / 2 - tooltipSize.width / 2);
  }
  else if (this.direction_ & directionEnum.LEFT)
  {
    position.x += size.width + 10;
  }
  else if (this.direction_ & directionEnum.RIGHT)
  {
    position.x -= tooltipSize.width + 10;
  }
  else if (this.direction_ & directionEnum.TOP)
  {
    position.y += size.height + 10;
  }
  else if (this.direction_ & directionEnum.BOTTOM)
  {
    position.y -= tooltipSize.height + 10;
  }
  else if (this.direction_ === 0)
  {
    position.x += (size.width - tooltipSize.width) / 2;
    position.y += (size.height - tooltipSize.height) / 2;
  }

  this.adjustToViewport_(position, tooltipSize);
  this.adjustArrowPosition_(position, tooltipSize, attachedElements[0]);

  return position;
};

/**
 * Returns whether tooltip owner is specified object
 *
 * @param {goog.ui.Component} owner
 * @return {boolean}
 */
morning.ui.Tooltip.prototype.isOwner = function(owner)
{
  return this.owner_ == owner;
};

/**
 * Returns whether tooltip is visible now
 *
 * @return {boolean}
 */
morning.ui.Tooltip.prototype.isVisible = function()
{
  return goog.dom.classlist.contains(this.getElement(), 'visible');
};

/**
 * Positionates tooltip to element
 *
 * @param {string|Element} selector
 * @param {goog.math.Coordinate=} opt_animOffset
 */
morning.ui.Tooltip.prototype.positionateToElement = function(selector,
  opt_animOffset)
{
  this.positionatedTo_ = selector;

  var position = this.getPositionToElement_(selector);

  if (position)
  {
    this.setPosition(position, opt_animOffset);
  }
};

/**
 * Sets tooltip position with or without animation
 *
 * @param {!goog.math.Coordinate} position
 * @param {goog.math.Coordinate=} opt_animOffset
 * @protected
 */
morning.ui.Tooltip.prototype.setPosition = function(position,
  opt_animOffset)
{
  if (!this.animationEnabled)
  {
    goog.style.setPageOffset(this.getElement(), position);
    return;
  }


  if (this.animation_.isPlaying())
  {
    this.animation_.stop();
  }

  if (!this.isVisible() && !opt_animOffset)
  {
    opt_animOffset = this.getDefaultOffset_();
  }

  var start = goog.style.getPosition(this.getElement());
  var diff = goog.math.Coordinate.difference(this.getPosition(), start);
  var end = goog.math.Coordinate.difference(position, diff);

  if (opt_animOffset)
  {
    start = goog.math.Coordinate.sum(end, opt_animOffset);
  }

  goog.style.setPageOffset(this.getElement(), position);

  this.animation_.setStartPoint([start.x, start.y]);
  this.animation_.setEndPoint([end.x, end.y]);
  this.animation_.play();
};

/**
 * Sets tooltip text
 *
 * @param {string} text
 */
morning.ui.Tooltip.prototype.setBody = function(text)
{
  this.text_ = text;

  if (this.bodyEl_)
  {
    this.bodyEl_.innerHTML = text;
  }
};

/**
 * Sets tooltip actions
 *
 * @param {Array.<morning.ui.TooltipAction>} actions
 */
morning.ui.Tooltip.prototype.setActions = function(actions)
{
  this.removeChildren(true);

  goog.array.forEach(actions, function(action) {
    this.addChild(action);
    action.render(this.actionsEl_);
  }, this);
};

/**
 * Sets tooltip direction
 *
 * @param {morning.ui.Tooltip.Direction|number} direction
 */
morning.ui.Tooltip.prototype.setDirection = function(direction)
{
  this.direction_ = direction;

  this.updateDirectionClass_();
};

/**
 * Sets tooltip owner
 *
 * @param {goog.ui.Component} owner
 */
morning.ui.Tooltip.prototype.setOwner = function(owner)
{
  this.owner_ = owner;
};

/**
 * Sets whether tooltip should be displayed in simple mode
 *
 * @param {boolean} isSimple
 */
morning.ui.Tooltip.prototype.setSimple = function(isSimple)
{
  this.isSimple_ = isSimple;

  if (this.getElement() !== null)
  {
    goog.dom.classlist.enable(this.getElement(), 'simple', isSimple);
  }
};

/**
 * Shows / hides tooltip
 *
 * @param {boolean} isVisible
 */
morning.ui.Tooltip.prototype.setVisible = function(isVisible)
{
  this.isVisible_ = isVisible;

  if (!this.getElement())
  {
    return;
  }

  goog.dom.classlist.enable(this.getElement(), 'visible', isVisible);
};

/**
 * Updates tooltip direction css classes
 *
 * @private
 */
morning.ui.Tooltip.prototype.updateDirectionClass_ = function()
{
  var el = this.getElement(), classes = goog.dom.classlist;
  if (!el)
  {
    return;
  }

  classes.removeAll(el,
    ['left', 'bottom', 'top', 'right',
    'align-right', 'align-left']);

  var direction = this.direction_,
    directionEnum = morning.ui.Tooltip.Direction;

  if (direction & directionEnum.TOP)
  {
    classes.add(el, 'top');
  }

  if (direction & directionEnum.RIGHT)
  {
    classes.add(el, 'right');
  }

  if (direction & directionEnum.BOTTOM)
  {
    classes.add(el, 'bottom');
  }

  if (direction & directionEnum.LEFT)
  {
    classes.add(el, 'left');
  }
};

/**
 * Sets tooltip z-index
 *
 * @param {number} zIndex
 *
 */
morning.ui.Tooltip.prototype.setZIndex = function(zIndex)
{
  this.getElement().style.zIndex = zIndex;
};

/**
 * Event enumirations for tooltip
 *
 * @enum {number}
 */
morning.ui.Tooltip.Direction = {
  NONE: 0,
  TOP: 1,
  RIGHT: 2,
  BOTTOM: 4,
  LEFT: 8
};
