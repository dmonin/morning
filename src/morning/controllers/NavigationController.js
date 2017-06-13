goog.provide('morning.controllers.NavigationController');

goog.require('goog.dom');
goog.require('goog.history.Html5History');
goog.require('goog.uri.utils');
goog.require('morning.controllers.BaseController');
goog.require('morning.routing.Router');

/**
 * @constructor
 * @extends {morning.controllers.BaseController}
 */
morning.controllers.NavigationController = function()
{
  goog.base(this);

  /**
   * @type {goog.history.Html5History|goog.History}
   * @protected
   */
  this.history = null;

  /**
   * @type {string}
   * @private
   */
  this.token_ = '';
};
goog.inherits(morning.controllers.NavigationController,
  morning.controllers.BaseController);

goog.addSingletonGetter(morning.controllers.NavigationController);

/**
 * @param {goog.events.BrowserEvent} e
 * @private
 */
morning.controllers.NavigationController.prototype.handleClick_ = function(e)
{
  if (!e.isMouseActionButton())
  {
    return;
  }

  // getting link element from event
  var link = e.target.href ?
    e.target :
    goog.dom.getAncestor(e.target, function(el) {
      if (el.href)
      {
          return true;
      }
      return false;
  });

  if (!link || !link.href || link.tagName.toLowerCase() != 'a')
  {
    return;
  }

  if (link.rel == 'noaction')
  {
    return;
  }

  var currentDomain = goog.uri.utils.getDomain(document.location.href);
  var domain = goog.uri.utils.getDomain(link.href);

  if (domain != currentDomain)
  {
      return;
  }

  e.preventDefault();

  // Static urls, requering redirect
  if (link.rel == 'redirect')
  {
    if (link.target)
    {
      window.open(link.href, link.target);
    }
    else
    {
      document.location = link.href;
    }
    return;
  }

  var path = goog.uri.utils.getPath(link.href);

  var token = path.substr(1);
  this.navigate(token, false);
};

/**
 * @inheritDoc
 */
morning.controllers.NavigationController.prototype.initialize = function(config)
{
  this.history = new goog.history.Html5History();
  this.history.setUseFragment(false);

  var urlToken = goog.uri.utils.getPath(goog.dom.getDocument().location.href);
  this.token_ = this.history.getToken() || urlToken.substr(1);
  this.history.setToken(this.token_);
  this.history.setEnabled(true);
  this.history.setParentEventTarget(this);

  this.getHandler().
    listen(document.documentElement, goog.events.EventType.CLICK,
      this.handleClick_).
    listen(this.history, goog.history.EventType.NAVIGATE,
      this.handleNavigate_);

  if (goog.DEBUG)
  {
    console.info('Initialized NavigationController with token %s', this.token_);
  }
};

/**
 * @return {string}
 */
morning.controllers.NavigationController.prototype.getToken = function()
{
  return this.history.getToken();
};

/**
 * Handles navigate event.
 *
 * @param  {goog.events.Event} e
 * @private
 */
morning.controllers.NavigationController.prototype.handleNavigate_ = function(e)
{
  if (this.token_ == e.token)
  {
    e.stopPropagation();
  }

  this.token_ = e.token;
};

/**
 * Navigates to specified url
 *
 * @param {string} path
 * @param {boolean=} opt_replace
 */
morning.controllers.NavigationController.prototype.navigate = function(path,
  opt_replace)
{
  if (opt_replace)
  {
    this.history.replaceToken(path);
  }
  else
  {
    this.history.setToken(path);
  }
};
