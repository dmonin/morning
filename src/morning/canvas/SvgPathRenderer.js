goog.provide('morning.canvas.SvgPathRenderer');

goog.require('goog.math.Coordinate');
goog.require('morning.canvas.BoundingBox');
goog.require('morning.canvas.PathParser');

/**
 * @constructor
 */
morning.canvas.SvgPathRenderer = function()
{

};

morning.canvas.SvgPathRenderer.prototype.renderPath = function(ctx, path)
{
    var pathParser = new morning.canvas.PathParser(path);
    pathParser.reset();

    var boundingBox = new morning.canvas.BoundingBox();
    if (ctx != null)
    {
        ctx.beginPath();
    }

    var newP, curr, p, p1, c, cntrl, cp;

    while (!pathParser.isEnd())
    {
        pathParser.nextCommand();

        switch (pathParser.command)
        {
            case 'M':
            case 'm':
                p = pathParser.getAsCurrentPoint();
                pathParser.addMarker(p);
                boundingBox.addPoint(p.x, p.y);
                if (ctx != null) ctx.moveTo(p.x, p.y);
                pathParser.start = pathParser.current;
                while (!pathParser.isCommandOrEnd())
                {
                    p = pathParser.getAsCurrentPoint();
                    pathParser.addMarker(p, pathParser.start);
                    boundingBox.addPoint(p.x, p.y);
                    if (ctx != null)
                    {
                        ctx.lineTo(p.x, p.y);
                    }
                }
                break;
            case 'L':
            case 'l':
                while (!pathParser.isCommandOrEnd())
                {
                    c = pathParser.current;
                    p = pathParser.getAsCurrentPoint();
                    pathParser.addMarker(p, c);
                    boundingBox.addPoint(p.x, p.y);

                    if (ctx != null)
                    {
                        ctx.lineTo(p.x, p.y);
                    }
                }
                break;
            case 'H':
            case 'h':
                while (!pathParser.isCommandOrEnd()) {
                    newP = new goog.math.Coordinate((pathParser.isRelativeCommand() ? pathParser.current.x : 0) + pathParser.getScalar(), pathParser.current.y);
                    pathParser.addMarker(newP, pathParser.current);
                    pathParser.current = newP;
                    boundingBox.addPoint(pathParser.current.x, pathParser.current.y);
                    if (ctx != null) ctx.lineTo(pathParser.current.x, pathParser.current.y);
                }
                break;
            case 'V':
            case 'v':
                while (!pathParser.isCommandOrEnd()) {
                    newP = new goog.math.Coordinate(pathParser.current.x, (pathParser.isRelativeCommand() ? pathParser.current.y : 0) + pathParser.getScalar());
                    pathParser.addMarker(newP, pathParser.current);
                    pathParser.current = newP;
                    boundingBox.addPoint(pathParser.current.x, pathParser.current.y);
                    if (ctx != null) ctx.lineTo(pathParser.current.x, pathParser.current.y);
                }
                break;
            case 'C':
            case 'c':
                while (!pathParser.isCommandOrEnd()) {
                    curr = pathParser.current;
                    p1 = pathParser.getPoint();
                    cntrl = pathParser.getAsControlPoint();
                    cp = pathParser.getAsCurrentPoint();
                    pathParser.addMarker(cp, cntrl, p1);
                    boundingBox.addBezierCurve(curr.x, curr.y, p1.x, p1.y, cntrl.x, cntrl.y, cp.x, cp.y);
                    if (ctx != null) ctx.bezierCurveTo(p1.x, p1.y, cntrl.x, cntrl.y, cp.x, cp.y);
                }
                break;
            case 'S':
            case 's':
                while (!pathParser.isCommandOrEnd()) {
                    curr = pathParser.current;
                    p1 = pathParser.getReflectedControlPoint();
                    cntrl = pathParser.getAsControlPoint();
                    cp = pathParser.getAsCurrentPoint();
                    pathParser.addMarker(cp, cntrl, p1);
                    boundingBox.addBezierCurve(curr.x, curr.y, p1.x, p1.y, cntrl.x, cntrl.y, cp.x, cp.y);
                    if (ctx != null) ctx.bezierCurveTo(p1.x, p1.y, cntrl.x, cntrl.y, cp.x, cp.y);
                }
                break;
            case 'Q':
            case 'q':
                while (!pathParser.isCommandOrEnd()) {
                    curr = pathParser.current;
                    cntrl = pathParser.getAsControlPoint();
                    cp = pathParser.getAsCurrentPoint();
                    pathParser.addMarker(cp, cntrl, cntrl);
                    boundingBox.addQuadraticCurve(curr.x, curr.y, cntrl.x, cntrl.y, cp.x, cp.y);
                    if (ctx != null) ctx.quadraticCurveTo(cntrl.x, cntrl.y, cp.x, cp.y);
                }
                break;
            case 'T':
            case 't':
                while (!pathParser.isCommandOrEnd()) {
                    curr = pathParser.current;
                    cntrl = pathParser.getReflectedControlPoint();
                    pathParser.control = cntrl;
                    cp = pathParser.getAsCurrentPoint();
                    pathParser.addMarker(cp, cntrl, cntrl);
                    boundingBox.addQuadraticCurve(curr.x, curr.y, cntrl.x, cntrl.y, cp.x, cp.y);
                    if (ctx != null) ctx.quadraticCurveTo(cntrl.x, cntrl.y, cp.x, cp.y);
                }
                break;
            case 'A':
            case 'a':
                while (!pathParser.isCommandOrEnd()) {
                    curr = pathParser.current;
                    var rx = pathParser.getScalar();
                    var ry = pathParser.getScalar();
                    var xAxisRotation = pathParser.getScalar() * (Math.PI / 180.0);
                    var largeArcFlag = pathParser.getScalar();
                    var sweepFlag = pathParser.getScalar();
                    cp = pathParser.getAsCurrentPoint();

                    // Conversion from endpoint to center parameterization
                    // http://www.w3.org/TR/SVG11/implnote.html#ArcImplementationNotes
                    // x1', y1'
                    var currp = new goog.math.Coordinate(
                        Math.cos(xAxisRotation) * (curr.x - cp.x) / 2.0 + Math.sin(xAxisRotation) * (curr.y - cp.y) / 2.0,
                        -Math.sin(xAxisRotation) * (curr.x - cp.x) / 2.0 + Math.cos(xAxisRotation) * (curr.y - cp.y) / 2.0
                        );
                    // adjust radii
                    var l = Math.pow(currp.x, 2) / Math.pow(rx, 2) + Math.pow(currp.y, 2) / Math.pow(ry, 2);
                    if (l > 1) {
                        rx *= Math.sqrt(l);
                        ry *= Math.sqrt(l);
                    }
                    // cx', cy'
                    var s = (largeArcFlag == sweepFlag ? -1 : 1) * Math.sqrt(
                        ((Math.pow(rx, 2) * Math.pow(ry, 2)) - (Math.pow(rx, 2) * Math.pow(currp.y, 2)) - (Math.pow(ry, 2) * Math.pow(currp.x, 2))) /
                        (Math.pow(rx, 2) * Math.pow(currp.y, 2) + Math.pow(ry, 2) * Math.pow(currp.x, 2))
                        );
                    if (isNaN(s)) s = 0;
                    var cpp = new goog.math.Coordinate(s * rx * currp.y / ry, s * -ry * currp.x / rx);
                    // cx, cy
                    var centp = new goog.math.Coordinate(
                        (curr.x + cp.x) / 2.0 + Math.cos(xAxisRotation) * cpp.x - Math.sin(xAxisRotation) * cpp.y,
                        (curr.y + cp.y) / 2.0 + Math.sin(xAxisRotation) * cpp.x + Math.cos(xAxisRotation) * cpp.y
                        );
                    // vector magnitude
                    var m = function(v) {
                        return Math.sqrt(Math.pow(v[0], 2) + Math.pow(v[1], 2));
                    };
                    // ratio between two vectors
                    var r = function(u, v) {
                        return (u[0] * v[0] + u[1] * v[1]) / (m(u) * m(v));
                    };
                    // angle between two vectors
                    var a = function(u, v) {
                        return (u[0] * v[1] < u[1] * v[0] ? -1 : 1) * Math.acos(r(u, v));
                    };
                    // initial angle
                    var a1 = a([1, 0], [(currp.x - cpp.x) / rx, (currp.y - cpp.y) / ry]);
                    // angle delta
                    var u = [(currp.x - cpp.x) / rx, (currp.y - cpp.y) / ry];
                    var v = [(-currp.x - cpp.x) / rx, (-currp.y - cpp.y) / ry];
                    var ad = a(u, v);
                    if (r(u, v) <= -1) ad = Math.PI;
                    if (r(u, v) >= 1) ad = 0;

                    if (sweepFlag == 0 && ad > 0) ad = ad - 2 * Math.PI;
                    if (sweepFlag == 1 && ad < 0) ad = ad + 2 * Math.PI;

                    // for markers
                    var halfWay = new goog.math.Coordinate(
                        centp.x + rx * Math.cos((a1 + (a1 + ad)) / 2),
                        centp.y + ry * Math.sin((a1 + (a1 + ad)) / 2)
                        );
                    pathParser.addMarkerAngle(halfWay, (a1 + (a1 + ad)) / 2 + (sweepFlag == 0 ? -1 : 1) * Math.PI / 2);
                    pathParser.addMarkerAngle(cp, (a1 + ad) + (sweepFlag == 0 ? -1 : 1) * Math.PI / 2);

                    boundingBox.addPoint(cp.x, cp.y); // TODO: this is too naive, make it better
                    if (ctx != null) {
                        r = rx > ry ? rx : ry;
                        var sx = rx > ry ? 1 : rx / ry;
                        var sy = rx > ry ? ry / rx : 1;

                        ctx.translate(centp.x, centp.y);
                        ctx.rotate(xAxisRotation);
                        ctx.scale(sx, sy);
                        ctx.arc(0, 0, r, a1, a1 + ad, 1 - sweepFlag);
                        ctx.scale(1 / sx, 1 / sy);
                        ctx.rotate(-xAxisRotation);
                        ctx.translate(-centp.x, -centp.y);
                    }
                }
                break;
            case 'Z':
            case 'z':
                if (ctx != null) ctx.closePath();
                pathParser.current = pathParser.start;
        }

    }
};
