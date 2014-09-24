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
 * @fileoverview NodeJS WebSocket adapter. See http://socket.io
 */
goog.provide('monin.net.Socket');

goog.require('goog.events.EventTarget');
goog.require('monin.net.ExternalApi');

/**
 * Socket constructor
 *
 * @constructor
 * @param {string} socketUrl
 * @extends {goog.events.EventTarget}
 */
monin.net.Socket = function(socketUrl)
{
    goog.base(this);

    /**
     * @type {boolean}
     */
    this.connected = false;

    /**
     * @type {string}
     * @private
     */
    this.socketUrl_ = socketUrl;

    if (goog.DEBUG)
    {
        console.info('Socket: initialized');
    }

    var ext = monin.net.ExternalApi.getInstance();
    ext.onAvailable('io', this.initialize_, this);

    /**
     * @type {ioSocket}
     * @private
     */
    this.socket_ = null;
};
goog.inherits(monin.net.Socket, goog.events.EventTarget);

/**
 *
 */
monin.net.Socket.prototype.disconnect = function()
{
    this.socket_.disconnect();
};

/**
 * Sends a message to server
 *
 * @param {string} type
 * @param {*=} opt_data
 * @param {Function=} opt_callback
 * @param {Object=} opt_handler
 */
monin.net.Socket.prototype.emit = function(type, opt_data, opt_callback, opt_handler)
{
    if (!this.connected)
    {
        throw new Error('Socket not yet connected');
    }

    if (opt_callback && opt_handler)
    {
        opt_callback = goog.bind(opt_callback, opt_handler);
    }

    this.socket_.emit(type, opt_data, opt_callback);
};

/**
 * Initializes socket connection
 *
 * @private
 */
monin.net.Socket.prototype.initialize_ = function()
{
    if (goog.DEBUG)
    {
        console.info('Socket: Connecting');
    }

    this.socket_ = io.connect(this.socketUrl_, {
        port: 8080
    });

    this.socket_.on('connect', goog.bind(function() {
        if (goog.DEBUG)
        {
            console.info('Socket: Connected');
        }

        this.connected = true;
        this.dispatchEvent(monin.net.Socket.EventType.CONNECTED);
    }, this));

    this.socket_.on('disconnect', goog.bind(function() {
        if (goog.DEBUG)
        {
            console.info('Socket: Disconnected');
        }

        this.connected = false;
        this.dispatchEvent(monin.net.Socket.EventType.DISCONNECTED);
    }, this));
};

/**
 * Adds event listener
 *
 * @param {string} type event type
 * @param {Function} callback callback method
 * @param {Object=} opt_handler callback scope
 */
monin.net.Socket.prototype.on = function(type, callback, opt_handler)
{
    if (!this.connected)
    {
        throw new Error('Socket not yet connected');
    }

    if (opt_handler)
    {
        callback = goog.bind(callback, opt_handler);
    }

    this.socket_.on(type, callback);
};

/**
 * Removes event listener
 *
 * @param {string} type
 * @param {Function} callback
 */
monin.net.Socket.prototype.off = function(type, callback)
{
    if (!this.connected)
    {
        throw new Error('Socket not yet connected');
    }

    this.socket_.removeListener(type, callback);
};

/**
 *
 */
monin.net.Socket.prototype.reconnect = function()
{
    this.socket_.disconnect();
    this.initialize_();
};

/**
 * @enum {string}
 */
monin.net.Socket.EventType = {
    CONNECTED: 'connected',
    DISCONNECTED: 'disconnected'
};
