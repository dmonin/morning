// Copyright 2012 Dmitry Monin. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
/**
 * @fileoverview Utility to maintain loading notification events of third party libraries.
 */
goog.provide('morning.net.ExternalApi');

goog.require('goog.async.ConditionalDelay');

/**
 * Utility to maintain loading notification events of third party libraries.
 *
 * @constructor
 */
morning.net.ExternalApi = function()
{

};

goog.addSingletonGetter(morning.net.ExternalApi);

/**
 * Adds script to Document
 *
 * @param {Element} parent
 * @param {string} src
 * @return {Element}
 */
morning.net.ExternalApi.prototype.addScript = function(parent, src)
{
    var js = document.createElement('script');
    js.async = true;
    js.src = src;
    parent.appendChild(js);

    return js;
};

/**
 * @param {string} objName object name, i.e. google.maps
 * @param {Function} callback callback method to call after library has been loaded
 * @param {Object} scope callback scope
 */
morning.net.ExternalApi.prototype.onAvailable = function(objName, callback, scope)
{
    var delay = new goog.async.ConditionalDelay(function() {
        return !!goog.getObjectByName(objName);
    });

    delay.onSuccess = function()
    {
        callback.call(scope);
    };

    delay.onFailure = function()
    {
        throw new Error(objName + ' couldn\'t be loaded.');
    };

    delay.start(100, 60000);

};
