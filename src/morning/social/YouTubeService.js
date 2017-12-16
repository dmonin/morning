// Copyright 2012 Dmitry Monin. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
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
 * @param {string=} opt_apiKey
 */
morning.social.YouTubeService = function(opt_apiKey)
{
  /**
   * @type {string}
   * @private
   */
  this.apiKey_ = opt_apiKey || '';
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
  var url = '//www.youtube.com/embed/' + videoId;
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
    'thumbnail': '//img.youtube.com/vi/' + videoId + '/0.jpg'
  });
};

/**
 * Fetches Video Duration (in seconds) and gives that as a parameter to the
 * callback function.
 *
 * @param {string} videoId
 * @param  {Function} callback
 */
morning.social.YouTubeService.prototype.getVideoDuration = function(videoId,
  callback)
{
  var ytApiUrl = 'https://www.googleapis.com/youtube/v3/videos?id=' + videoId;
  if (!this.apiKey_)
  {
    throw new Error('API Key is not defined.');
  }

  goog.net.XhrIo.send(
    ytApiUrl + '&part=contentDetails&key=' + this.apiKey_,
    function(e) {
      var xhr = e.target;
      var obj = xhr.getResponseJson();
      var duration = obj['items'][0]['contentDetails']['duration'];
      callback(this.parseDuration_(duration));
  }.bind(this));
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

/**
 * Returns Duration in seconds.
 *
 * @param  {string} dur Duration string
 * @return {number}
 * @private
 */
morning.social.YouTubeService.prototype.parseDuration_ = function(dur)
{
  var interval = goog.date.Interval.fromIsoString(dur);
  var inSeconds = interval.seconds +
    (interval.minutes * 60) + (interval.hours * 60 * 60);
  return inSeconds;
};