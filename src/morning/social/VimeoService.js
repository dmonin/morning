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
 * @fileoverview Vimeo API Service
 */

goog.provide('morning.social.VimeoService');

goog.require('goog.net.Jsonp');

/**
 * Vimeo API Service
 *
 * @constructor
 */
morning.social.VimeoService = function()
{
    var oembedUrl = morning.social.VimeoService.OEMBED_API_URL;

    /**
     * @type {goog.net.Jsonp}
     * @private
     */
    this.oembedJsonp_ = new goog.net.Jsonp(oembedUrl);
};

goog.addSingletonGetter(morning.social.VimeoService);

/**
 * Returns a video ID by specified Vimeo link, if video id couldn't be regonized
 * or link is invalid, returns null.
 *
 * @param {string} videoUrl Link to Vimeo Video
 * @return {string}
 */
morning.social.VimeoService.prototype.getVideoIdFromUrl = function(videoUrl)
{
    var re = /https?:\/\/(www\.)?vimeo.com\/([0-9]+)$/i;
    var matches = videoUrl.match(re);

    if (matches)
    {
        return matches[2];
    }

    return '';
};

/**
 * Returns link to embed player
 *
 * @param  {string} videoId Vimeo Video ID
 * @param {Object=} opt_data Player configuration parameters
 * @return {string}
 */
morning.social.VimeoService.prototype.getEmbedUrl = function(videoId, opt_data)
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
 * Loads Video information and calls callback with Vimeo Video data
 *
 * @param {string} videoId Vimeo Video ID
 * @param {Function} callback Callback function
 * @param {Object=} opt_handler Optional callback context
 */
morning.social.VimeoService.prototype.getVideoData = function(videoId, callback,
    opt_handler)
{
    if (opt_handler)
    {
        callback = goog.bind(callback, opt_handler);
    }

    var url = morning.social.VimeoService.VIDEO_API_URL.replace('{video_id}', String(videoId));

    var jsonp = new goog.net.Jsonp(url);
    jsonp.send(null, function(data) {
        var videoData = data[0];
        callback(videoData);
    });
};

/**
 * @const
 */
morning.social.VimeoService.VIDEO_API_URL = 'http://vimeo.com/api/v2/video/{video_id}.json';

/**
 * @const
 */
morning.social.VimeoService.OEMBED_API_URL = 'http://vimeo.com/api/oembed.json';
