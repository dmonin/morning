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
 * @fileoverview YouTube Service API
 */

goog.provide('morning.social.YouTubeService');

goog.require('goog.net.Jsonp');

/**
 * YouTube Service API
 *
 * @constructor
 */
morning.social.YouTubeService = function()
{

};

goog.addSingletonGetter(morning.social.YouTubeService);

/**
 * Returns link to embed player
 *
 * @param  {string} videoId YouTube Video ID
 * @param {Object=} opt_data Player configuration parameters
 * @return {string}
 */
morning.social.YouTubeService.prototype.getEmbedUrl = function(videoId, opt_data)
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
 * Loads Video information and calls callback with YouTube Video data
 *
 * @param {string} videoId YouTube Video ID
 * @param {Function} callback Callback function
 * @param {Object=} opt_handler Optional callback context
 */
morning.social.YouTubeService.prototype.getVideoData = function(videoId, callback,
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
 * Returns a video ID by specified YouTube link, if video id couldn't be regonized
 * or link is invalid, returns null.
 *
 * @param {string} videoUrl  Link to YouTube Video
 * @return {string}
 */
morning.social.YouTubeService.prototype.getVideoIdFromUrl = function(videoUrl)
{
    var re = /https?:\/\/(www\.|m\.)?youtube.com.*v=([0-9a-z_-]+)/i;
    var matches = videoUrl.match(re);

    if (matches)
    {
        return matches[2];
    }

    return '';
};