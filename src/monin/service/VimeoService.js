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

goog.provide('monin.service.VimeoService');

goog.require('goog.net.Jsonp');

/**
 * @constructor
 */
monin.service.VimeoService = function()
{
    var oembedUrl = monin.service.VimeoService.OEMBED_API_URL;

    /**
     * @type {goog.net.Jsonp}
     * @private
     */
    this.oembedJsonp_ = new goog.net.Jsonp(oembedUrl);
};

goog.addSingletonGetter(monin.service.VimeoService);

/**
 * @param {String} videoUrl
 */
monin.service.VimeoService.prototype.getVideoIdFromUrl = function(videoUrl)
{
    var re = /https?:\/\/(www\.)?vimeo.com\/([0-9]+)$/i;
    var matches = videoUrl.match(re);

    if (matches)
    {
        return matches[2];
    }

    return null;
};

/**
 * @param  {string} videoId
 * @param {Object} opt_data
 * @return {string}
 */
monin.service.VimeoService.prototype.getEmbedUrl = function(videoId, opt_data)
{
    var url = 'http://player.vimeo.com/video/' + videoId + '/';
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
monin.service.VimeoService.prototype.getVideoData = function(videoId, callback,
    opt_handler)
{
    if (opt_handler)
    {
        callback = goog.bind(callback, opt_handler);
    }

    var url = monin.service.VimeoService.VIDEO_API_URL.replace('{video_id}', String(videoId));

    var jsonp = new goog.net.Jsonp(url);
    jsonp.send(null, function(data) {
        var videoData = data[0];
        callback(videoData);
    });
};

/**
 * @const
 */
monin.service.VimeoService.VIDEO_API_URL = 'http://vimeo.com/api/v2/video/{video_id}.json';

/**
 * @const
 */
monin.service.VimeoService.OEMBED_API_URL = 'http://vimeo.com/api/oembed.json';
