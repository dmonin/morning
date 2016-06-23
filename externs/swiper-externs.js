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
Swiper.prototype.slideTo = function(index, speed, runCallbacks) {};

/**
 *
 */
Swiper.prototype.onResize = function() {};

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
Swiper.prototype.activeIndex = 0;

/**
 * @type {goog.array.ArrayLike<Element>}
 */
Swiper.prototype.slides = [];