goog.provide('morning.fx.easing');


/**
 * Configurable elastic ease.
 * @param {number} amplitude
 * @param {number} period
 * @return {Function}
 */
morning.fx.easing.getElasticIn = function(amplitude,period) {
    var pi2 = Math.PI * 2;
    return function(t) {
        if (t === 0 || t == 1) return t;
        var s = period / pi2 * Math.asin(1 / amplitude);
        return -(amplitude * Math.pow(2, 10 * (t -= 1)) * Math.sin((t - s) * pi2 / period));
    };
};

morning.fx.easing.elasticIn = morning.fx.easing.getElasticIn(1, 0.3);


/**
 * Configurable elastic ease.
 * @param {number} amplitude
 * @param {number} period
 * @return {Function}
 */
morning.fx.easing.getElasticOut = function(amplitude,period) {
    var pi2 = Math.PI * 2;
    return function(t) {
        if (t === 0 || t == 1) return t;
        var s = period / pi2 * Math.asin(1 / amplitude);
        return (amplitude * Math.pow(2, -10 * t) * Math.sin((t - s) * pi2 / period) + 1);
    };
};

morning.fx.easing.elasticOut = morning.fx.easing.getElasticOut(1, 0.3);

morning.fx.easing.getPowInOut = function(pow) {
    return function(t) {
        if ((t *= 2) < 1) return 0.5 * Math.pow(t, pow);
        return 1 - 0.5 * Math.abs(Math.pow(2 - t, pow));
    };
};

/**
 *
 */
morning.fx.easing.getBezier = function(points)
{
    return function(t) {
        var n = points.length;
        var tmp = [];

        for (var i = 0; i < n; ++i) {
            tmp[i] = points[i]; // save input
        }

        for (var j = 1; j < n; ++j) {
            for (i = 0; i < n - j; ++i) {
                tmp[i] = (1 - t) * tmp[i] + t * tmp[parseInt(i + 1, 10)];
            }
        }

        return tmp[0];
    };
};
