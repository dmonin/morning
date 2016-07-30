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
goog.require('goog.async.Delay');

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

  /**
   * If click target is checkbox, defines, whether that value of checkbox
   * should be reversed for toggled (default: false, checked = expand,
   * unchecked = collapse).
   * @type {boolean}
   * @private
   */
  this.reverseCheckbox_ = false;

  /**
   * @type {goog.async.Delay}
   * @private
   */
  this.initializeDelay_ = new goog.async.Delay(this.initialize_,
    100, this);
  this.registerDisposable(this.initializeDelay_);
};
goog.inherits(morning.ui.ExpandableContent, goog.ui.Component);

/** @inheritDoc */
morning.ui.ExpandableContent.prototype.decorateInternal = function(el)
{
  goog.base(this, 'decorateInternal', el);

  this.isExpanded_ = goog.dom.classlist.contains(el, 'expanded');
  this.reverseCheckbox_ = goog.dom.dataset.get(el, 'reverseCheckbox') == 'true';

  var minHeight = Number(goog.dom.dataset.get(el, 'minHeight')) || 0;
  if (minHeight)
  {
    this.minHeight_ = Number(minHeight);
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


  this.initialize_();
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
  if (e.target.tagName.toLowerCase() == 'input' && e.target.type == 'checkbox')
  {
    var isExpanded = this.reverseCheckbox_ ? !e.target.checked :
      e.target.checked;
    this.setExpanded(e.target.checked);
  }
  else
  {
    this.setExpanded(!this.isExpanded_);
  }

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
 * Initializes expandable content.
 * @private
 */
morning.ui.ExpandableContent.prototype.initialize_ = function()
{
  var curHeight = this.getElementByClass('expandable-bd-wrap').offsetHeight;
  if (curHeight == 0)
  {
    this.initializeDelay_.start();
    return;
  }
  var minHeight = this.minHeight_;

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

/**
 * Sets whether menu is expanded.
 *
 * @param {boolean} isExpanded
 */
morning.ui.ExpandableContent.prototype.setExpanded = function(isExpanded)
{
  this.updateHeight_();

  this.isExpanded_ = isExpanded;

  goog.dom.classlist.enable(this.getElement(), 'expanded', isExpanded);
  this.updateHeight_();

  if (this.isExpanded_)
  {
    this.dispatchEvent(goog.ui.Component.EventType.SHOW);
    goog.Timer.callOnce(function() {
      this.updateHeight_('auto');
    }, 1000, this);
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
 * @param {string=} opt_height
 * @private
 */
morning.ui.ExpandableContent.prototype.updateHeight_ = function(opt_height)
{
  var container = this.getElementByClass('expandable-bd');
  var height;
  if (opt_height)
  {
    height = opt_height;
  }
  else
  {
    height = this.isExpanded_ ? this.getHeight_() : this.minHeight_;
    height += 'px';
  }
  container.style.height = height;
};

/**
 * Register this control so it can be created from markup.
 */
goog.ui.registry.setDecoratorByClassName(
  'expandable',
  function() {
    return new morning.ui.ExpandableContent();
  });
