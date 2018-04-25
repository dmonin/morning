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
 * @fileoverview Narrated Video Player
 */
goog.provide('morning.ui.NarratedVideo');
goog.require('goog.async.Throttle');
goog.require('goog.net.XhrIo');
goog.require('goog.soy');
goog.require('goog.ui.Component');
goog.require('morning.social.YouTubeService');
goog.require('morning.templates.NarratedVideo');

/**
 * @constructor
 * @param {morning.social.YouTubeService} videoService
 * @extends {goog.ui.Component}
 */
morning.ui.NarratedVideo = function(videoService)
{
  goog.base(this);

  /**
   * @type {morning.social.YouTubeService}
   * @private
   */
  this.ytService_ = videoService;

  /**
   * @type {Array<Object>}
   * @private
   */
  this.text_ = [];

  /**
   * @type {Object}
   * @private
   */
  this.renderedItem_ = null;

  /**
   * @type {YT.Player}
   * @private
   */
  this.ytPlayer_ = null;

  /**
   * @type {number}
   * @private
   */
  this.videoTime_ = 0;

  /**
   * @type {number}
   * @private
   */
  this.videoDuration_ = 0;

  /**
   * @type {boolean}
   * @private
   */
  this.isFinished_ = false;

  /**
   * @type {goog.Timer}
   * @private
   */
  this.timer_ = new goog.Timer(100);

  /**
   * @type {Element}
   * @private
   */
  this.narrationEl_ = null;

  /**
   * @type {number}
   * @private
   */
  this.aspectRatio_ = 16.0 / 9.0;

  /**
   * @type {goog.async.Throttle}
   * @private
   */
  this.resizeThrottle_ = new goog.async.Throttle(this.resize, 70, this);
};
goog.inherits(morning.ui.NarratedVideo, goog.ui.Component);

/** @inheritDoc */
morning.ui.NarratedVideo.prototype.createDom = function()
{
  var el = /** @type {Element} */ (goog.soy.renderAsFragment(
    morning.templates.NarratedVideo.main)
  );

  this.decorateInternal(el);
};

/** @inheritDoc */
morning.ui.NarratedVideo.prototype.enterDocument = function()
{
  goog.base(this, 'enterDocument');

  this.narrationEl_ = this.getElement().querySelector('.narration-text');

  this.getHandler()
    .listen(this.timer_, goog.Timer.TICK, this.handleTick_)
    .listen(window, goog.events.EventType.RESIZE, this.handleResize_);
};

/**
 * @param  {goog.events.Event} e
 * @private
 */
morning.ui.NarratedVideo.prototype.handleResize_ = function(e)
{
  this.resizeThrottle_.fire();
};

/**
 */
morning.ui.NarratedVideo.prototype.resize = function()
{
  var el = this.getElementByClass('video-wrap');
  var ytContainer = el.querySelector('.yt-player-container');

  var height = el.offsetWidth / this.aspectRatio_;
  ytContainer.style.height = height + 'px';

  if (ytContainer.offsetHeight > 0)
  {
    var width = ytContainer.offsetHeight * this.aspectRatio_;
    ytContainer.style.width = width + 'px';
  }
};

/**
 * @param {number} ratio
 */
morning.ui.NarratedVideo.prototype.setAspectRatio = function(ratio)
{
  this.aspectRatio_ = ratio;
};

/**
 * @param {Array<Object>} text
 */
morning.ui.NarratedVideo.prototype.setText = function(text)
{
  this.text_ = text;
};

/**
 * @param {string} text
 */
morning.ui.NarratedVideo.prototype.updateText = function(text)
{
  var lines = text.split('\n');
  if (lines.length == 0)
  {
    return;
  }

  this.text_ = [];
  for (var i = 0; i < lines.length; i++)
  {
    var arr = lines[i].split(/ (.*)/);
    var timestamp = this.parseToSeconds_(arr[0]);
    if (timestamp >= 0)
    {
      var itemText = arr[1] || '';
      this.addTextItem_(timestamp, itemText, arr[0]);
      this.dispatchEvent(morning.ui.NarratedVideo.EventType.CHANGE_TEXT);
    }
  }
};

/**
 * @param {string} timestamp
 * @return {number} timestamp in seconds
 * @private
 */
morning.ui.NarratedVideo.prototype.parseToSeconds_ = function(timestamp)
{
  var a = timestamp.split(':');
  if (a.length == 2)
  {
    var minutes = this.parseToNumber_(a[0]);
    var seconds = this.parseToNumber_(a[1]);
    if (minutes > -1 && seconds > -1)
    {
      return minutes * 60 + seconds;
    }
  }

  return -1;
};

/**
 * @param {string} s
 * @return {number}
 * @private
 */
morning.ui.NarratedVideo.prototype.parseToNumber_ = function(s)
{
  if (s.length != 2)
  {
    return -1;
  }

  if (isNaN(parseInt(s[0], 10)) || isNaN(parseInt(s[1], 10)))
  {
    return -1;
  }

  return parseInt(s, 10);
};

/**
 * @param {number} timestamp
 * @param {string} text
 * @param {string} timestampFormatted
 * @private
 */
morning.ui.NarratedVideo.prototype.addTextItem_ = function(
  timestamp, text, timestampFormatted)
{
  var newObj = {
    timestamp: timestamp,
    text: text,
    timestampFormatted: timestampFormatted
  };

  for (var i = 0; i < this.text_.length; i++)
  {
    if (timestamp == this.text_[i].timestamp)
    {
      this.text_[i].text = text;
      return;
    }

    if (timestamp < this.text_[i].timestamp)
    {
      this.text_.splice(i, 0, newObj);
      return;
    }
  }

  this.text_.push(newObj);
};

/**
 * @param {string} url
 */
morning.ui.NarratedVideo.prototype.setVideoUrl = function(url)
{
  var id = this.ytService_.getVideoIdFromUrl(url);

  this.ytService_.getVideoDuration(id, function(duration) {
    this.videoDuration_ = duration;
  });

  if (this.ytPlayer_)
  {
    this.ytPlayer_.loadVideoById(id);
  }
  else
  {
    this.initVideoPlayer_(id);
  }
};

/**
 * @param  {string} videoId
 * @private
 */
morning.ui.NarratedVideo.prototype.initVideoPlayer_ = function(videoId)
{
  if (window['onYouTubeIframeAPIReady'])
  {
    this.ytPlayer_ = this.createYoutubePlayer_(videoId);
    return;
  }

  // Load youtube api
  var tag = document.createElement('script');
  tag.src = 'https://www.youtube.com/iframe_api';
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  window['onYouTubeIframeAPIReady'] = function() {
    this.ytPlayer_ = this.createYoutubePlayer_(videoId);
  }.bind(this);
};

/**
 * @param  {string} videoId
 * @return {YT.Player}
 * @private
 */
morning.ui.NarratedVideo.prototype.createYoutubePlayer_ = function(videoId)
{
  return new YT.Player('youtube-player', {
    'videoId': videoId,
    'playerVars': {
      'autoplay': 1,
      'modestbranding': 1,
      'controls': 1,
      'showinfo': 0,
      'rel' : 0
    },
    'events': {
      'onReady': function() {
        this.timer_.start();
        this.resize();
      }.bind(this)
    }
  });
};

/**
 * @param {goog.events.Event} e
 * @private
 */
morning.ui.NarratedVideo.prototype.handleTick_ = function(e)
{
  var oldTime = this.videoTime_;
  if (this.ytPlayer_ && this.ytPlayer_.getCurrentTime)
  {
    this.videoTime_ = this.ytPlayer_.getCurrentTime();
  }

  if (this.videoTime_ !== oldTime)
  {
    this.onProgress_();
  }
};

/**
 * @private
 */
morning.ui.NarratedVideo.prototype.onProgress_ = function()
{
  this.renderedItem_ = null;
  for (var i = 0; i < this.text_.length; i++)
  {
    if (this.videoTime_ >= this.text_[i].timestamp)
    {
      this.renderedItem_ = this.text_[i];
    }
    else
    {
      break;
    }
  }

  var newText = this.renderedItem_ ? this.renderedItem_.text : '';
  this.dispatchEvent(morning.ui.NarratedVideo.EventType.RENDER_TEXT);

  if (this.narrationEl_.innerHTML != newText)
  {
    this.narrationEl_.innerHTML = newText;
  }

  this.isFinished_ = this.videoTime_ > this.videoDuration_ * 0.8;
};

/**
 * @return {Object}
 */
morning.ui.NarratedVideo.prototype.getCurrentItem = function()
{
  return this.renderedItem_;
};

/**
 * @return {boolean}
 */
morning.ui.NarratedVideo.prototype.isFinished = function()
{
  return this.isFinished_;
};


/**
 * @enum {string}
 */
morning.ui.NarratedVideo.EventType = {
  CHANGE_TEXT: 'change_text',
  RENDER_TEXT: 'render_text'
};
