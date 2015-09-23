goog.provide('morning.app.ModularApp');

goog.require('goog.dom.classlist');
goog.require('goog.module.ModuleLoader');
goog.require('goog.module.ModuleManager');
goog.require('goog.events.EventTarget');

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
   * @type {morning.controllers.BaseController}
   */
  this.controller = null;

  /**
   * @type {Object}
   * @private
   */
  this.state_ = null;

  /**
   * @type {Object}
   * @private
   */
  this.config_ = null;

  /**
   * @type {boolean}
   * @private
   */
  this.initialized_ = false;

  /**
   * @type {goog.module.ModuleManager}
   * @private
   */
  this.moduleManager_ = morning.MODULAR ?
    goog.module.ModuleManager.getInstance() : null;
};
goog.inherits(morning.app.ModularApp, goog.events.EventTarget);
goog.addSingletonGetter(morning.app.ModularApp);

/**
 * Initializes app
 *
 * @param {Object} config
 */
morning.app.ModularApp.prototype.initialize = function(config)
{
  this.config_ = config;

  if (morning.MODULAR)
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
  }
};

/**
 * Initializes controller
 *
 * @private
 */
morning.app.ModularApp.prototype.initController_ = function()
{
  goog.dom.classlist.remove(document.body, 'loading');

  var Type = goog.getObjectByName('app.module.' + this.state_.controllerName);

  if (goog.DEBUG)
  {
    console.info('Initializing controller %o', this.state_.controllerName);
  }

  if (Type)
  {
    this.controller = new Type();
    this.controller.initialize(this.config_);
    this.controller.setParentEventTarget(this);
    this.controller.setState(this.state_, !this.initialized_);
    this.initialized_ = true;
  }
};

/**
* @private
*/
morning.app.ModularApp.prototype.loadAndInitController_ = function()
{
  if (morning.MODULAR)
  {
    var moduleInfo = this.moduleManager_.getModuleInfo(this.state_.controllerName);

    if (goog.DEBUG)
    {
      console.info('Loading controller %s %o', this.state_.controllerName, moduleInfo);
    }

    if (moduleInfo)
    {
      this.moduleManager_.execOnLoad(this.state_.controllerName,
        this.initController_, this);
    }
    else
    {
      this.initController_();
    }
  }
  else
  {
    this.initController_();
  }
};

/**
 * Sets current state of the app:
 * - Loads new controller / module if necessary
 * - Updates controller's state if it's the same
 *
* @param {Object} state
*/
morning.app.ModularApp.prototype.setState = function(state)
{
  if (goog.DEBUG)
  {
    console.info('Route match results: %o, current state: %o', state,
      this.state_);
  }

  if (!state)
  {
    return;
  }

  if (!this.state_ || this.state_.controllerName != state.controllerName)
  {
    if (this.controller)
    {
      goog.dispose(this.controller);

      if (goog.DEBUG)
      {
        console.info('Disposed controller %o', this.controller);
      }
    }

    this.state_ = state;

    if (morning.MODULAR)
    {
      goog.dom.classlist.add(document.body, 'loading');

      this.moduleManager_.execOnLoad(this.state_.controllerName,
        this.initController_, this);
    }
    else
    {
      this.initController_();
    }
  }
  else if (this.controller)
  {
    this.controller.setState(state, false);
  }
};

/**
 * @typedef {{
 *          controllerName: string,
 *          data: Object,
 *          token: string}}
 */
morning.app.ModularApp.State;