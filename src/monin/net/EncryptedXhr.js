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
 * @fileoverview AES Encrypted XHR.
 * AES Encryption works slow for large data requests. Use encryption only when necessary.
 */
goog.provide('monin.net.EncryptedXhr');

goog.require('goog.json');
goog.require('goog.net.XhrIo');
goog.require('monin.crypt.Aes');

/**
 * Encrypted XHR
 *
 * @constructor
 * @param {string=} opt_password optional encryption password. Requests woun't be encrypted if no password provided.
 * @extends {goog.net.XhrIo}
 */
monin.net.EncryptedXhr = function(opt_password)
{
    goog.base(this);

    /**
     * @type {string}
     * @private
     */
    this.password_ = opt_password;
};
goog.inherits(monin.net.EncryptedXhr, goog.net.XhrIo);

/**
 * @type {monin.crypt.Aes}
 * @private
 */
monin.net.EncryptedXhr.aes_ = null;

/**
 * @param {string} data
 * @private
 */
monin.net.EncryptedXhr.encrypt_ = function(data)
{
    if (!monin.net.EncryptedXhr.aes_)
    {
        monin.net.EncryptedXhr.aes_ = new monin.crypt.Aes();
    }

    return monin.net.EncryptedXhr.aes_.encrypt(data, this.password_);
};

/**
 * Static send that creates a short lived instance of XhrIo to send the
 * request.
 * @see goog.net.XhrIo.cleanupAllPendingStaticSends
 * @param {string|goog.Uri} url Uri to make request to.
 * @param {Function=} opt_callback Callback function for when request is
 *     complete.
 * @param {string=} opt_method Send method, default: GET.
 * @param {Object=} opt_content Post data.
 * @param {Object|goog.structs.Map=} opt_headers Map of headers to add to the
 *     request.
 * @param {number=} opt_timeoutInterval Number of milliseconds after which an
 *     incomplete request will be aborted; 0 means no timeout is set.
 */
monin.net.EncryptedXhr.send = function(url, opt_callback, opt_method, opt_content,
                               opt_headers, opt_timeoutInterval)
{
    var jsonContent = '';
    if (goog.isObject(opt_content))
    {
        jsonContent = goog.json.serialize(opt_content);
    }

    goog.net.XhrIo.send(url, opt_callback, opt_method, jsonContent, opt_headers, opt_timeoutInterval);
};

/**
 * @param {goog.Uri|string} url
 * @param {string=} opt_method
 * @param {FormData|string|Object=} opt_content
 * @param {Object|goog.structs.Map=} opt_headers Map of headers to add to the
 *     request.
 * @override
 */
monin.net.EncryptedXhr.prototype.send = function(url, opt_method, opt_content,
                                         opt_headers)
{
    var jsonContent = '';
    if (goog.isObject(opt_content))
    {
        jsonContent = goog.json.serialize(opt_content);
    }

    if (this.encryptData_ && opt_content)
    {
        jsonContent = monin.net.EncryptedXhr.encrypt_(jsonContent);
    }

    goog.base(this, 'send', url, opt_method, jsonContent, opt_headers);
};
