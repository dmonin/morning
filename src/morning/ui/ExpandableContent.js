/**
 * @fileoverview Allows to expand / collapse contents.
 *
 * <div class="expandable cmp">
 *  <div class="expandable-bd">
 *    <div class="expandable-bd-wrap">
 *      <p class="name-it-yourself-body">lots of text</p>
 *     </div>
 *   </div>
 *   <span class="expander" data-texts="more|less">more</span>
 * </div>
 */
goog.provide('morning.ui.ExpandableContent');
goog.require('goog.dom.classlist');
goog.require('goog.ui.Component');

/**
 * @constructor
 * @extends {goog.ui.Component}
 */
morning.ui.ExpandableContent = function()
{
  goog.base(this);

  /**
   * Defines whether component is expanded.
   *
   * @type {boolean}
   * @private
   */
  this.isExpanded_ = false;

  /**
   * @type {number}
   * @private
   */
  this.minHeight_ = 0;
};
goog.inherits(morning.ui.ExpandableContent, goog.ui.Component);

/** @inheritDoc */
morning.ui.ExpandableContent.prototype.decorateInternal = function(el)
{
  goog.base(this, 'decorateInternal', el);

  this.isExpanded_ = goog.dom.classlist.contains(el, 'expanded');

  var minHeight = goog.dom.dataset.get(el, 'minHeight');
  var curHeight = this.getElementByClass('expandable-bd-wrap').offsetHeight;

  if (minHeight)
  {
    this.minHeight_ = Number(minHeight);
  }


  if (minHeight < curHeight)
  {
    this.updateHeight_();
  }
  else
  {
    this.minHeight_ = Number(curHeight);
    goog.dom.removeNode(this.getElementByClass('expander'));
  }
};

/** @inheritDoc */
morning.ui.ExpandableContent.prototype.enterDocument = function()
{
  goog.base(this, 'enterDocument');

  if (this.getElementByClass('expander'))
  {
    this.getHandler().
      listen(this.getElementByClass('expander'),
        goog.events.EventType.CLICK, this.handleExpanderClick_).
      listen(window,
        goog.events.EventType.RESIZE, this.handleResize_);
  }
};

/**
 * Returns height of content wrapper element.
 * @private
 */
morning.ui.ExpandableContent.prototype.getHeight_ = function()
{
  return this.getElementByClass('expandable-bd-wrap').offsetHeight;
};

/**
 * Handles click on one of the expanders.
 *
 * @param  {goog.events.BrowserEvent} e
 * @private
 */
morning.ui.ExpandableContent.prototype.handleExpanderClick_ = function(e)
{
  this.setExpanded(!this.isExpanded_);
};

/**
 * Handles resize event.
 *
 * @param  {goog.events.Event} e
 * @private
 */
morning.ui.ExpandableContent.prototype.handleResize_ = function(e)
{
  this.updateHeight_();
};

/**
 * Sets whether menu is expanded.
 *
 * @param {boolean} isExpanded
 */
morning.ui.ExpandableContent.prototype.setExpanded = function(isExpanded)
{
  this.isExpanded_ = isExpanded;

  goog.dom.classlist.enable(this.getElement(), 'expanded', isExpanded);
  this.updateHeight_();

  if (this.isExpanded_)
  {
    this.dispatchEvent(goog.ui.Component.EventType.SHOW);
  }
  else
  {
    this.dispatchEvent(goog.ui.Component.EventType.HIDE);
  }

  var expander = this.getElementByClass('expander');
  var texts = goog.dom.dataset.get(expander, 'texts');
  if (texts)
  {
    var index = isExpanded ? 1 : 0;
    expander.innerHTML = texts.split('|')[index];
  }
};

/**
 * Updates height of the wrap element according expanded state.
 *
 * @private
 */
morning.ui.ExpandableContent.prototype.updateHeight_ = function()
{
  var container = this.getElementByClass('expandable-bd');
  var height = this.isExpanded_ ? this.getHeight_() : this.minHeight_;
  container.style.height = height + 'px';
  // container.style.visibility = height > this.minHeight_ ? 'visible' :
  //   'hidden';
};

/**
 * Register this control so it can be created from markup.
 */
goog.ui.registry.setDecoratorByClassName(
  'expandable',
  function() {
    return new morning.ui.ExpandableContent();
  });
