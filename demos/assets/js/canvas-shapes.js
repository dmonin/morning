// You need to convert SVG to JSON, for example: https://gist.github.com/robflaherty/1616367
var sunShape = "M71.997,51.999h-3.998c-1.105,0-2-0.895-2-1.999s0.895-2,2-2h3.998  c1.105,0,2,0.896,2,2S73.103,51.999,71.997,51.999z M64.142,38.688c-0.781,0.781-2.049,0.781-2.828,0  c-0.781-0.781-0.781-2.047,0-2.828l2.828-2.828c0.779-0.781,2.047-0.781,2.828,0c0.779,0.781,0.779,2.047,0,2.828L64.142,38.688z   M50.001,61.998c-6.627,0-12-5.372-12-11.998c0-6.627,5.372-11.999,12-11.999c6.627,0,11.998,5.372,11.998,11.999  C61.999,56.626,56.628,61.998,50.001,61.998z M50.001,42.001c-4.418,0-8,3.581-8,7.999c0,4.417,3.583,7.999,8,7.999  s7.998-3.582,7.998-7.999C57.999,45.582,54.419,42.001,50.001,42.001z M50.001,34.002c-1.105,0-2-0.896-2-2v-3.999  c0-1.104,0.895-2,2-2c1.104,0,2,0.896,2,2v3.999C52.001,33.106,51.104,34.002,50.001,34.002z M35.86,38.688l-2.828-2.828  c-0.781-0.781-0.781-2.047,0-2.828s2.047-0.781,2.828,0l2.828,2.828c0.781,0.781,0.781,2.047,0,2.828S36.641,39.469,35.86,38.688z   M34.002,50c0,1.104-0.896,1.999-2,1.999h-4c-1.104,0-1.999-0.895-1.999-1.999s0.896-2,1.999-2h4C33.107,48,34.002,48.896,34.002,50  z M35.86,61.312c0.781-0.78,2.047-0.78,2.828,0c0.781,0.781,0.781,2.048,0,2.828l-2.828,2.828c-0.781,0.781-2.047,0.781-2.828,0  c-0.781-0.78-0.781-2.047,0-2.828L35.86,61.312z M50.001,65.998c1.104,0,2,0.895,2,1.999v4c0,1.104-0.896,2-2,2  c-1.105,0-2-0.896-2-2v-4C48.001,66.893,48.896,65.998,50.001,65.998z M64.142,61.312l2.828,2.828c0.779,0.781,0.779,2.048,0,2.828  c-0.781,0.781-2.049,0.781-2.828,0l-2.828-2.828c-0.781-0.78-0.781-2.047,0-2.828C62.093,60.531,63.36,60.531,64.142,61.312z";

// Background
var size = new goog.math.Size(1700, 1275);
var bgImage = new morning.models.Image("assets/img/bg.jpg", size);
var coverBackground = new morning.ui.CoverBackground(bgImage);
coverBackground.render(document.body);
coverBackground.setVisible(true);

// Canvas
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
updateSize();
move();

// Pattern
var patternImg = new Image();
patternImg.src = "assets/img/pattern/blue.jpg";

var pattern;
patternImg.onload = function() {
    pattern = ctx.createPattern(patternImg, 'repeat');
    draw();
};

var canvasTop = 0;
var pathRenderer = new morning.canvas.SvgPathRenderer();

// Mouse wheel handler
var mousewheelHandler = new goog.events.MouseWheelHandler(document.body);
mousewheelHandler.listen(goog.events.MouseWheelHandler.EventType.MOUSEWHEEL, function(e) {
    canvasTop += e.deltaY > 0 ? -100 : 100;
    canvasTop = Math.min(0, canvasTop);
});

// Touch handlers
var lastY = -1;
document.ontouchmove = function(e)
{
    e.preventDefault();
    e = e || window.event;
    var y = e.touches[0].pageY;
    if (lastY != -1)
    {
        var dy = y - lastY;
        canvasTop += dy * 3;
        canvasTop = Math.min(0, canvasTop);
    }
    lastY = y;

};
document.ontouchstart = function()
{
    lastY = e.touches[0].pageY;
};
document.ontouchend = function(e)
{
    lastY = -1;
};

window.onresize = function() {
    updateSize();
    draw();
};

document.getElementById('pattern-selector').onclick = function(e) {
    e = e || window.event;
    if (e.target.src)
    {
        patternImg.src = e.target.src;
    }
};

var text = "S C R O L L";
document.getElementById('text-input').onkeyup = function(e)
{
    e = e || window.event;
    text = e.target.value;
    draw();
};

function draw()
{
    var viewportSize = goog.dom.getViewportSize();
    ctx.save();
    ctx.fillStyle = pattern;
    ctx.fillRect(0, 0, viewportSize.width, viewportSize.height);
    ctx.globalCompositeOperation = 'destination-out';


    ctx.font = '100px "Futura W01 Medium"';
    var width = ctx.measureText(text).width;
    var x = (viewportSize.width - width) / 2;
    var y = viewportSize.height - 100;
    ctx.fillText(text.toUpperCase(), x, y);

    ctx.translate(viewportSize.width / 2 - 400, viewportSize.height / 2 - 500);

    ctx.scale(8, 8);
    pathRenderer.renderPath(ctx, sunShape);
    ctx.fill();

    ctx.restore();
};

function move()
{
    var top = parseInt(canvas.style.top) || 0;
    top += (canvasTop - top) / 20;
    canvas.style.top = top + 'px';

    requestAnimFrame(move);
};

function updateSize()
{
    var viewportSize = goog.dom.getViewportSize();

    // Updating background
    coverBackground.setSize(viewportSize);

    // Updating canvas
    canvas.style.width = viewportSize.width + 'px';
    canvas.style.height = viewportSize.height + 'px';

    canvas.width = viewportSize.width;
    canvas.height = viewportSize.height;
};