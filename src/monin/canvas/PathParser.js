goog.provide('monin.canvas.PathParser');
goog.require('goog.string');

/**
 * @constructor
 */
monin.canvas.PathParser = function(d)
{
    d = d.replace(/,/gm, ' '); // get rid of all commas
    d = d.replace(/([MmZzLlHhVvCcSsQqTtAa])([MmZzLlHhVvCcSsQqTtAa])/gm, '$1 $2'); // separate commands from commands
    d = d.replace(/([MmZzLlHhVvCcSsQqTtAa])([MmZzLlHhVvCcSsQqTtAa])/gm, '$1 $2'); // separate commands from commands
    d = d.replace(/([MmZzLlHhVvCcSsQqTtAa])([^\s])/gm, '$1 $2'); // separate commands from points
    d = d.replace(/([^\s])([MmZzLlHhVvCcSsQqTtAa])/gm, '$1 $2'); // separate commands from points
    d = d.replace(/([0-9])([+\-])/gm, '$1 $2'); // separate digits when no comma
    d = d.replace(/(\.[0-9]*)(\.)/gm, '$1 $2'); // separate digits when no comma
    d = d.replace(/([Aa](\s+[0-9]+){3})\s+([01])\s*([01])/gm, '$1 $3 $4 '); // shorthand elliptical arc path syntax
    d = d.replace(/[\s\r\t\n]+/gm, ' '); // compress multiple spaces
    d = goog.string.trim(d);


    this.tokens = d.split(' ');

    /**
     * @type {string}
     */
    this.command = '';

    /**
     * @type {string}
     * @private
     */
    this.previousCommand = '';

    /**
     * @type {goog.math.Coordinate}
     */
    this.control = null;

    /**
     * @type {goog.math.Coordinate}
     */
    this.start = null;

    /**
     * @type {goog.math.Coordinate}
     */
    this.current = null;

    /**
     * @type {number}
     * @private
     */
    this.i = 0;

    /**
     * @type {Array.<goog.math.Coordinate>}
     * @private
     */
    this.points = null;

    /**
     * @type {Array.<number>}
     * @private
     */
    this.angles = null;
};

monin.canvas.PathParser.prototype.reset = function()
{
    this.i = -1;
    this.command = '';
    this.previousCommand = '';
    this.start = new goog.math.Coordinate(0, 0);
    this.control = new goog.math.Coordinate(0, 0);
    this.current = new goog.math.Coordinate(0, 0);
    this.points = [];
    this.angles = [];
};

monin.canvas.PathParser.prototype.isEnd = function()
{
    return this.i >= this.tokens.length - 1;
};

monin.canvas.PathParser.prototype.isCommandOrEnd = function()
{
    if (this.isEnd()) return true;
    return this.tokens[this.i + 1].match(/^[A-Za-z]$/) != null;
};

monin.canvas.PathParser.prototype.isRelativeCommand = function()
{
    switch (this.command)
    {
        case 'm':
        case 'l':
        case 'h':
        case 'v':
        case 'c':
        case 's':
        case 'q':
        case 't':
        case 'a':
        case 'z':
            return true;
            break;
    }
    return false;
};

monin.canvas.PathParser.prototype.getToken = function()
{
    this.i++;
    return this.tokens[this.i];
};

monin.canvas.PathParser.prototype.getScalar = function()
{
    return parseFloat(this.getToken());
};

monin.canvas.PathParser.prototype.nextCommand = function() {
    this.previousCommand = this.command;
    this.command = this.getToken();
};

monin.canvas.PathParser.prototype.getPoint = function()
{
    var p = new goog.math.Coordinate(this.getScalar(), this.getScalar());
    return this.makeAbsolute(p);
};

monin.canvas.PathParser.prototype.getAsControlPoint = function()
{
    var p = this.getPoint();
    this.control = p;
    return p;
};

monin.canvas.PathParser.prototype.getAsCurrentPoint = function()
{
    var p = this.getPoint();
    this.current = p;
    return p;
};

monin.canvas.PathParser.prototype.getReflectedControlPoint = function()
{
    if (this.previousCommand.toLowerCase() != 'c' && this.previousCommand.toLowerCase() != 's') {
        return this.current;
    }

    // reflect point
    var p = new goog.math.Coordinate(2 * this.current.x - this.control.x, 2 * this.current.y - this.control.y);
    return p;
};

monin.canvas.PathParser.prototype.makeAbsolute = function(p)
{
    if (this.isRelativeCommand())
    {
        p.x += this.current.x;
        p.y += this.current.y;
    }
    return p;
};

/**
 * @param {goog.math.Coordinate} from
 * @param {goog.math.Coordinate} to
 * @return {number}
 * @private
 */
monin.canvas.PathParser.prototype.angleTo = function(from, to)
{
    return Math.atan2(to.y - from.y, to.x - from.x);
};

/**
 * @param {goog.math.Coordinate} p
 * @param {goog.math.Coordinate=} opt_from
 * @param {goog.math.Coordinate=} opt_priorTo
 */
monin.canvas.PathParser.prototype.addMarker = function(p, opt_from, opt_priorTo)
{
    // if the last angle isn't filled in because we didn't have this point yet ...
    if (opt_priorTo != null && this.angles.length > 0 && this.angles[this.angles.length - 1] == null)
    {
        this.angles[this.angles.length - 1] = this.angleTo(this.points[this.points.length - 1], opt_priorTo);
    }
    this.addMarkerAngle(p, opt_from == null ? undefined : this.angleTo(opt_from, p));
};

/**
 * @param {goog.math.Coordinate} p
 * @param {number=} a
 */
monin.canvas.PathParser.prototype.addMarkerAngle = function(p, a)
{
    this.points.push(p);
    this.angles.push(a);
};

/**
 * @return {Array.<goog.math.Coordinate>}
 */
monin.canvas.PathParser.prototype.getMarkerPoints = function()
{
    return this.points;
};

monin.canvas.PathParser.prototype.getMarkerAngles = function()
{
    for (var i = 0; i < this.angles.length; i++)
    {
        if (this.angles[i] == null)
        {
            for (var j = i + 1; j < this.angles.length; j++)
            {
                if (this.angles[j] != null)
                {
                    this.angles[i] = this.angles[j];
                    break;
                }
            }
        }
    }
    return this.angles;
};
