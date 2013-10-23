goog.provide('monin.forms.TextboxPlaceholderHandler');
goog.require('goog.events.EventHandler');

/**
 * @constructor
 */
monin.forms.TextboxPlaceholderHandler = function()
{
    /**
     * @type {goog.events.EventHandler}
     * @private
     */
    this.handler_ = new goog.events.EventHandler(this);

    if (typeof Modernizr == 'undefined' || typeof Modernizr.placeholder == 'undefined')
    {
        throw new Error('Modernizr.placeholder test couldnt be found.');
    }
};

goog.addSingletonGetter(monin.forms.TextboxPlaceholderHandler);

/**
 * @param {Element} input
 */
monin.forms.TextboxPlaceholderHandler.prototype.attach = function(input)
{
    if (Modernizr.placeholder)
    {
        return;
    }

    input.defaultValue = input.getAttribute('placeholder');
    input.value = input.defaultValue;

    this.handler_.listen(input, goog.events.EventType.FOCUS,
        this.handleFocus_);

    this.handler_.listen(input, goog.events.EventType.BLUR,
        this.handleBlur_);
};

monin.forms.TextboxPlaceholderHandler.prototype.detach = function(input)
{
    if (Modernizr.placeholder)
    {
        return;
    }

    this.handler_.unlisten(input, goog.events.EventType.FOCUS,
        this.handleFocus_);

    this.handler_.unlisten(input, goog.events.EventType.BLUR,
        this.handleBlur_);
};

/**
 * @param {goog.events.BrowserEvent} e
 * @private
 */
monin.forms.TextboxPlaceholderHandler.prototype.handleFocus_ = function(e)
{
    if (Modernizr.placeholder)
    {
        return;
    }

    if (e.target.value == e.target.getAttribute('placeholder'))
    {
        e.target.value = '';
    }
};


/**
 * @param {goog.events.BrowserEvent} e
 * @private
 */
monin.forms.TextboxPlaceholderHandler.prototype.handleBlur_ = function(e)
{
    if (Modernizr.placeholder)
    {
        return;
    }

    if (e.target.value == '')
    {
        e.target.value = e.target.getAttribute('placeholder');
    }
};
