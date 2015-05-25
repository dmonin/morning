/**
 * @fileoverview Externs for the Swiper
 * @externs
 */

/**
 * @param {Element} element
 * @param {Object} config
 * @constructor
 */
var Swiper = function(element, config) {};

/**
 *
 */
Swiper.prototype.destroy = function() {};

/**
 *
 */
Swiper.prototype.swipeNext = function() {};

/**
 *
 */
Swiper.prototype.swipePrev = function() {};

/**
 *
 */
Swiper.prototype.swipeTo = function(index, speed, runCallbacks) {};

/**
 *
 */
Swiper.prototype.reInit = function() {};


/**
 * @type {number}
 */
Swiper.prototype.clickedSlideIndex = 0;

/**
 * @type {Element}
 */
Swiper.prototype.clickedSlide = null;

/**
 * @type {Element}
 */
Swiper.prototype.width = null;

/**
 * @return {Element}
 */
Swiper.prototype.activeSlide = function() {

};
/**
 * @type {number}
 */
Swiper.prototype.activeLoopIndex = 0;
