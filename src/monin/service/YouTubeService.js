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
 * @fileoverview Vimeo API
 */

goog.provide('monin.service.YouTubeService');

goog.require('goog.net.Jsonp');

/**
 * @constructor
 */
monin.service.YouTubeService = function()
{
    var oembedUrl = monin.service.YouTubeService.OEMBED_API_URL;

    /**
     * @type {goog.net.Jsonp}
     * @private
     */
    this.oembedJsonp_ = new goog.net.Jsonp(oembedUrl);
};

goog.addSingletonGetter(monin.service.YouTubeService);

/**
 * @param {string} videoId
 * @param {Object=} opt_data
 * @return {string}
 */
monin.service.YouTubeService.prototype.getEmbedUrl = function(videoId, opt_data)
{
    var url = 'http://www.youtube.com/embed/' + videoId;
    if (opt_data)
    {
        for (var i in opt_data)
        {
            url = goog.uri.utils.appendParam(url, i, opt_data[i]);
        }
    }

    return url;
};

/**
 * @param {number} videoId
 * @param {Function} callback
 * @param {Object=} opt_handler
 */
monin.service.YouTubeService.prototype.getVideoData = function(videoId, callback,
    opt_handler)
{
    if (opt_handler)
    {
        callback = goog.bind(callback, opt_handler);
    }

    callback({
        'thumbnail': 'http://img.youtube.com/vi/' + videoId + '/0.jpg'
    });
};


/**
 * @param {string} videoUrl
 */
monin.service.YouTubeService.prototype.getVideoIdFromUrl = function(videoUrl)
{
    var re = /https?:\/\/(www\.)?youtube.com.*v=([0-9a-z_-]+)$/i;
    var matches = videoUrl.match(re);

    if (matches)
    {
        return matches[2];
    }

    return null;
};