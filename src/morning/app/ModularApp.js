goog.provide('morning.app.ModularApp');

goog.require('goog.module.ModuleLoader');
goog.require('goog.module.ModuleManager');
goog.require('goog.events.EventTarget');
goog.require('goog.history.EventType');
goog.require('goog.structs.Map');
goog.require('morning.app.ViewFactory');
goog.require('goog.dom');
goog.require('morning.app.View');
goog.require('morning.routing.Router');
goog.require('morning.routing.Route');

/**
 * @define {boolean}
 */
goog.define('morning.MODULAR', false);

/**
* Manages the data and interface for a single note.
* @constructor
* @extends {goog.events.EventTarget}
*/
morning.app.ModularApp = function()
{
  goog.base(this);

  /**
   * Event handler for processing of local events.
   *
   * @type {goog.events.EventHandler}
   * @private
   */
  this.handler_ = new goog.events.EventHandler(this);

  /**
   * List of all loaded controllers.
   * @type {goog.structs.Map}
   * @private
   */
  this.controllers_ = new goog.structs.Map();

  /**
   * Current view.
   *
   * @type {morning.app.View}
   * @private
   */
  this.view_ = null;


  /**
   * Element used with initial view initialization.
   *
   * @type {Element}
   * @private
   */
  this.initialViewElement_ = null;

  /**
   * View Factory
   *
   * @type {morning.app.ViewFactory}
   */
  this.viewFactory = morning.app.ViewFactory.getInstance();

  /**
   * @type {morning.routing.Router}
   * @private
   */
  this.router_ = new morning.routing.Router();

  /**
   * @type {Object}
   * @private
   */
  this.state_ = null;

  /**
   * @type {goog.module.ModuleManager}
   * @private
   */
  this.moduleManager_ = morning.MODULAR ?
    goog.module.ModuleManager.getInstance() : null;

  /**
   * An element where the view containers will be rendered.
   *
   * @type {Element}
   */
  this.viewContainer = document.body.querySelector('#view-container');
};
goog.inherits(morning.app.ModularApp, goog.events.EventTarget);
goog.addSingletonGetter(morning.app.ModularApp);

/**
 * @param {string} name
 * @param {morning.controllers.BaseController} controller
 * @param {Object=} opt_config Initialization config
 * @return {morning.app.ModularApp}
 */
morning.app.ModularApp.prototype.addController = function(name, controller,
  opt_config)
{
  if (opt_config)
  {
    controller.initialize(opt_config);
  }

  controller.setParentEventTarget(this);

  this.controllers_.set(name, controller);
  return this;
};

/**
 * Adds a route to the application. After navigation controller changed token,
 * the router match against all available routes and find appropriate view.
 *
 * @param {morning.routing.Route} route
 * @return {morning.app.ModularApp}
 */
morning.app.ModularApp.prototype.addRoute = function(route)
{
  this.router_.addRoute(route);
  return this;
};

/**
 * Returns controller by specified key.
 *
 * @param {string} key
 * @return {morning.controllers.BaseController}
 */
morning.app.ModularApp.prototype.getController = function(key)
{
  return this.controllers_.get(key);
};

/**
 * Returns current app state.
 *
 * @return {Object}
 */
morning.app.ModularApp.prototype.getState = function()
{
  return this.state_;
};

/**
 * Returns currently active view.
 *
 * @return {morning.app.View}
 */
morning.app.ModularApp.prototype.getView = function()
{
  return this.view_;
};

/**
 * Handles navigate event.
 *
 * @param  {morning.routing.RouteMatchEvent} e
 * @private
 */
morning.app.ModularApp.prototype.handleNavigate_ = function(e)
{
  if (goog.DEBUG)
  {
    console.info('App: Navigating to %s', e.token);
  }

  this.navigate(e.token);
};

/**
 * Handles matching of route
 * @param  {morning.routing.RouteMatchEvent} e
 * @private
 */
morning.app.ModularApp.prototype.handleRouteMatch_ = function(e)
{
  this.setState({
    token: e.token,
    data: e.data,
    route: e.target
  });
};

/**
 * Initializes module manager
 *
 * @private
 */
morning.app.ModularApp.prototype.initializeModuleManager_ = function()
{
  var moduleManager = goog.module.ModuleManager.getInstance();
  var moduleLoader = new goog.module.ModuleLoader();
  moduleManager.setLoader(moduleLoader);
  moduleManager.setAllModuleInfo(goog.global['PLOVR_MODULE_INFO']);
  moduleManager.setModuleUris(goog.global['PLOVR_MODULE_URIS']);
  moduleManager.setLoaded('app');
};

/**
 * @param {string} urlToken
 */
morning.app.ModularApp.prototype.navigate = function(urlToken)
{
  this.router_.match(urlToken);
};

/**
 * @protected
 */
morning.app.ModularApp.prototype.removeView = function()
{
  if (this.view_)
  {
    goog.dom.removeNode(this.view_.getElement());
    goog.dispose(this.view_);
    this.view_ = null;

    if (goog.DEBUG)
    {
      console.info('Disposed view %o', this.view_);
    }
  }
};

/**
 * Initializes app
 *
 * @param {(Element|morning.app.View)=} opt_view Start view of the app. If no view
 * provided, the app will try to find the view from navigation controller.
 */
morning.app.ModularApp.prototype.start = function(opt_view)
{
  if (morning.MODULAR)
  {
    this.initializeModuleManager_();
  }

  this.handler_.

    listen(this, goog.history.EventType.NAVIGATE, this.handleNavigate_).

    listen(this.router_, morning.routing.Route.EventType.ROUTE_MATCH,
      this.handleRouteMatch_);

  var navController = this.controllers_.get('navigation');
  if (opt_view && opt_view instanceof morning.app.View)
  {
    this.setView(opt_view);
  }
  else if (navController)
  {
    if (opt_view)
    {
      this.initialViewElement_ = opt_view;
    }

    this.navigate(navController.getToken());
  }
};

/**
 * Sets view from previously saved state.
 *
 * @private
 */
morning.app.ModularApp.prototype.setViewFromState_ = function()
{
  var view = this.viewFactory.getView(this.state_.route.name);
  this.setView(view);

  if (!view && goog.DEBUG)
  {
    console.warn('ModularApp: View not found ' + this.state_.route.name + '.');
  }

  this.view_.setState(this.state_);
  this.dispatchEvent(morning.app.ModularApp.EventType.STATE_CHANGE);
};

/**
 * @param {morning.app.View} view
 */
morning.app.ModularApp.prototype.setView = function(view)
{
  this.removeView();

  if (goog.DEBUG)
  {
    console.info('ModularApp: Changing view to %o.', view);
  }

  this.view_ = view;
  if (!view.isInDocument())
  {
    if (this.initialViewElement_)
    {
      this.view_.decorate(this.initialViewElement_);
      this.initialViewElement_ = null;
    }
    else
    {
      this.view_.render(this.viewContainer);
    }
  }

  this.view_.setParentEventTarget(this);
  this.dispatchEvent(morning.app.ModularApp.EventType.VIEW_CHANGE);
};

/**
 * Sets new state of the app.
 *
* @param {Object} state
*/
morning.app.ModularApp.prototype.setState = function(state)
{
  if (this.view_ && this.state_.route.name == state.route.name)
  {
    this.view_.setState(state);
    this.state_ = state;
    this.dispatchEvent(morning.app.ModularApp.EventType.STATE_CHANGE);
    return;
  }

  this.removeView();

  if (goog.DEBUG)
  {
    console.info('ModularApp: Setting state %o', state);
  }

  this.state_ = state;

  if (this.state_.route.module && morning.MODULAR)
  {
    this.moduleManager_.execOnLoad(this.state_.route.module,
      this.setViewFromState_, this);
  }
  else
  {
    this.setViewFromState_();
  }
};

/**
 * @typedef {{
 *          data: Object,
 *          route: morning.routing.Route,
 *          token: string}}
 */
morning.app.ModularApp.State;

/** @enum {string} */
morning.app.ModularApp.EventType = {
  STATE_CHANGE: 'state_change',
  VIEW_CHANGE: 'view_change'
};