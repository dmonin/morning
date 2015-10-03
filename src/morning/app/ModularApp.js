goog.provide('morning.app.ModularApp');

goog.require('goog.module.ModuleLoader');
goog.require('goog.module.ModuleManager');
goog.require('goog.events.EventTarget');
goog.require('goog.history.EventType');
goog.require('goog.structs.Map');
goog.require('morning.app.ViewFactory');
goog.require('goog.dom');
goog.require('morning.routing.Router');

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
   * @type {goog.structs.Map}
   * @private
   */
  this.controllers_ = new goog.structs.Map();

  /**
   * @type {morning.app.View}
   */
  this.view = null;

  /**
   * View Factory
   *
   * @type {morning.app.ViewFactory}
   * @private
   */
  this.viewFactory_ = morning.app.ViewFactory.getInstance();

  /**
   * @type {morning.routing.Router}
   * @private
   */
  this.router_ = new morning.routing.Router();

  /**
   * Currently active route
   *
   * @type {morning.routing.Route}
   * @private
   */
  this.route_ = null;

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
   *
   * @type {string}
   * @private
   */
  this.token_ = '';

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

  this.controllers_.set(name, controller);
  return this;
};

/**
 * @param {morning.routing.Route} route
 * @return {morning.app.ModularApp}
 */
morning.app.ModularApp.prototype.addRoute = function(route)
{
  this.router_.addRoute(route);
  return this;
};

/**
 * Handles navigate event.
 *
 * @param  {goog.events.Event} e
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
 * @param  {goog.events.Event} e
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
  var scripts = document.body.querySelectorAll('script');
  var re = /app\.js\?v=([0-9]+)/;
  var version = 'unknown';
  for (var i = 0; i < scripts.length; i++)
  {
    if (scripts[i].src.match(re))
    {
      version = scripts[i].src.match(re)[1];
      break;
    }
  }

  var moduleUrls = goog.global['PLOVR_MODULE_URIS'];
  for (var key in moduleUrls)
  {
    moduleUrls[key] += '?v=' + version;
  }

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
 * @private
 */
morning.app.ModularApp.prototype.removeView_ = function()
{
  if (this.view)
  {
    goog.dom.removeNode(this.view.getElement());
    goog.dispose(this.view);
    this.view = null;

    if (goog.DEBUG)
    {
      console.info('Disposed view %o', this.view);
    }
  }
};

/**
 * Initializes app
 */
morning.app.ModularApp.prototype.start = function()
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
  if (navController)
  {
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
  this.setView(
    this.viewFactory_.getView(this.state_.route.name));
};

/**
 * @param {morning.app.View} view
 */
morning.app.ModularApp.prototype.setView = function(view)
{
  this.removeView_();

  if (goog.DEBUG)
  {
    console.info('ModularApp: Changing view to %o.', view);
  }

  if (view)
  {
    this.view = view;
    this.view.render(this.viewContainer);
    this.view.setParentEventTarget(this);
  }
};

/**
 * Sets new state of the app.
 *
* @param {Object} state
*/
morning.app.ModularApp.prototype.setState = function(state)
{
  this.removeView_();

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
