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

/**
 * @fileoverview NodeJS WebSocket adapter. See http://socket.io.
 */

goog.provide('morning.net.SocketHandler');

goog.require('goog.Disposable');

/**
 * @param {Object} handler
 * @constructor
 * @extends {goog.Disposable}
 */
morning.net.SocketHandler = function(handler)
{
    /**
     * Listener scope object
     *
     * @type {Object}
     * @private
     */
    this.handler_ = handler;

    /**
     * List of listeners
     *
     * @type {Array}
     * @private
     */
    this.listeners_ = [];
};
goog.inherits(morning.net.SocketHandler, goog.Disposable);

/** @inheritDoc */
morning.net.SocketHandler.prototype.disposeInternal = function()
{
    this.removeAll();
};

/**
 * Adds listener to specified event type
 *
 * @param {morning.net.Socket} socket
 * @param {string} evtType
 * @param {Function} callback
 */
morning.net.SocketHandler.prototype.listen = function(socket, evtType, callback)
{
    callback = goog.bind(callback, this.handler_);
    socket.on(evtType, callback);

    this.listeners_.push([socket, evtType, callback]);
};

/**
 * Removes all event listeners
 */
morning.net.SocketHandler.prototype.removeAll = function()
{
    goog.array.forEach(this.listeners_, function(data) {
        data[0].off(data[1], data[2]);
    });
    this.listeners_ = [];
};