goog.provide('monin.ui.Keyboard');

goog.require('goog.ui.Component');
goog.require('goog.dom.classlist');
goog.require('goog.dom.dataset');
goog.require('goog.structs.Map');
goog.require('goog.structs.Map');

/**
 * @constructor
 * @extends {goog.ui.Component}
 */
monin.ui.Keyboard = function()
{
    goog.base(this);

    /**
     * @type {goog.structs.Map}
     * @private
     */
    this.keys_ = new goog.structs.Map();

    /**
     * @type {goog.async.Delay}
     * @private
     */
    this.hideDelay_ = null;
};

goog.inherits(monin.ui.Keyboard, goog.ui.Component);

/** @inheritDoc */
monin.ui.Keyboard.prototype.decorateInternal = function(el)
{
    goog.base(this, 'decorateInternal', el);

    goog.array.forEach(this.getElementsByClass('key'), function(key) {
        var keyCode = Number(goog.dom.dataset.get(key, 'keycode'));
        this.keys_.set(keyCode, key);
    }, this);
};

/** @inheritDoc */
monin.ui.Keyboard.prototype.enterDocument = function()
{
    goog.base(this, 'enterDocument');

    this.getHandler().listen(document, [goog.events.EventType.KEYDOWN,goog.events.EventType.KEYUP],
        this.handleKey_);
};

/**
 * @param  {goog.events.BrowserEvent} e
 * @private
 */
monin.ui.Keyboard.prototype.handleKey_ = function(e)
{
    var key = /** @type {Element} */ (this.keys_.get(e.keyCode));
    if (key)
    {
        goog.dom.classlist.enable(key, 'active', e.type == goog.events.EventType.KEYDOWN);
        if (this.hideDelay_)
        {
            this.hideDelay_.start();
            this.hideDelay_ = null;
        }
    }
};

/**
 * @param  {number} delay
 */
monin.ui.Keyboard.prototype.hideAfterUse = function(delay)
{
    this.hideDelay_ = new goog.async.Delay(this.setVisible, delay, this);
};

/**
 * @param  {boolean} isVisible
 */
monin.ui.Keyboard.prototype.setVisible = function(isVisible)
{
    goog.dom.classlist.enable(this.getElement(), 'visible', isVisible);

    if (isVisible)
    {
        this.dispatchEvent(goog.ui.Component.EventType.SHOW);
    }
    else
    {
        this.dispatchEvent(goog.ui.Component.EventType.HIDE);
    }
};