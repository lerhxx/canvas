'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

window.onload = function () {
    var canvas = document.getElementById('canvas'),
        ctx = canvas.getContext('2d');
    canvas.width = 500;
    canvas.height = 500;

    var gradient = ctx.createLinearGradient(20, 0, 50, 50);
    gradient.addColorStop(0, 'green');
    gradient.addColorStop(.2, 'blue');
    gradient.addColorStop(1, 'red');

    var x = 0,
        y = 0,
        xWidth = canvas.width,
        yWidth = canvas.height,
        xy = 15,
        i,
        n;

    ctx.strokeStyle = '#f36';

    var canvasPro = window.CanvasRenderingContext2D && CanvasRenderingContext2D.prototype;

    /*
     * @method setLineDotted: 绘制圆点线
     * @params {Number} radius 半径
     * @params {Number} x 起始点圆心横坐标
     * @params {Number} y 起始点圆心纵坐标
     * @params {Number} wx 水平长度
     * @params {Number} hy 纵向长度
     * @params {Number} dx 圆心横坐标距离
     * @params {Number} dy 圆心横坐标距离
     * @params {Number} startArc 开始角度
     * @params {Number} endArc 结束角度
     * @params {Number} direct 绘制方向，true为逆时针，false为顺时针
     * @params {String} style storke或fill
     * @params {String} color 颜色
     */
    canvasPro.setLineDotted = function () {
        var opt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        var origin = {
            radius: 5,
            x: 5.5,
            y: 5.5,
            wx: 500,
            hy: 500,
            dx: 20,
            dy: 0,
            startArc: 0,
            endArc: Math.PI * 2,
            direct: true,
            style: 'stroke',
            color: '#f36'
        };
        Object.assign(origin, opt);

        this[origin.style + 'Style'] = origin.color;
        for (var _i = origin.x, _n = origin.y; _i <= origin.wx && _n <= origin.hy; _i += origin.dx, _n += origin.dy) {
            this.beginPath();
            this.moveTo(_i + origin.radius * Math.cos(origin.startArc), _n + origin.radius * Math.sin(origin.startArc));
            this.arc(_i, _n, origin.radius, origin.startArc, origin.endArc, origin.direct);
            this[origin.style]();
            this.closePath();
        }
    };
    // ctx.setLineDotted({dx: 0, dy: 20, style:'fill'});

    /*
     * @method drawStar: 绘制五角星
     * @params {CanvasRenderingContext2D} ctx canvas环境
     * @params {Number} x 中心点横坐标
     * @params {Number} y 中心点纵坐标
     * @params {Number} R 外圆半径
     * @params {Number} r 内圆半径
     */
    function drawStar(ctx) {
        var opt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        if (!ctx) {
            console.warn('there is no ctx');
            return;
        }
        var origin = {
            R: 100,
            r: 50,
            x: 100,
            y: 150,
            rotation: 0,
            color: '#f36',
            style: 'fill'
        };
        Object.assign(origin, opt);

        ctx[origin.style + 'Style'] = origin.color;

        ctx.beginPath();
        for (var _i2 = 0; _i2 < 5; ++_i2) {
            ctx.lineTo(Math.cos((18 + 72 * _i2 + origin.rotation) / 180 * Math.PI) * origin.R + origin.x, -Math.sin((18 + 72 * _i2 + origin.rotation) / 180 * Math.PI) * origin.R + origin.y);
            ctx.lineTo(Math.cos((54 + 72 * _i2 + origin.rotation) / 180 * Math.PI) * origin.r + origin.x, -Math.sin((54 + 72 * _i2 + origin.rotation) / 180 * Math.PI) * origin.r + origin.y);
        }
        ctx.closePath();
        ctx[origin.style]();
    }

    function drawFlag(ctx) {
        ctx.fillStyle = 'red';
        ctx.fillRect(0, 0, 450, 300);

        drawStar(ctx, {
            x: 65,
            y: 70,
            R: 40,
            r: 15,
            color: 'yellow'
        }), drawStar(ctx, {
            x: 140,
            y: 30,
            R: 16,
            r: 6,
            rotation: -18,
            color: 'yellow'
        }), drawStar(ctx, {
            x: 170,
            y: 60,
            R: 16,
            r: 6,
            rotation: 10,
            color: 'yellow'
        }), drawStar(ctx, {
            x: 166,
            y: 105,
            R: 16,
            r: 6,
            rotation: 0,
            color: 'yellow'
        }), drawStar(ctx, {
            x: 135,
            y: 140,
            R: 16,
            r: 6,
            rotation: -25,
            color: 'yellow'
        });
    }
    // drawFlag(ctx)

    function drawSector(ctx, opt) {
        var origin = {
            x: 100,
            y: 100,
            r: 50,
            sDeg: 0,
            eDeg: 72 / 180 * Math.PI
        };
        Object.assign(origin, opt);

        ctx.translate(origin.x, origin.y);
        ctx.beginPath();

        ctx.arc(0, 0, origin.r, origin.sDeg, origin.eDeg);
        ctx.save();
        ctx.stroke();

        // ctx.rotate(origin.eDeg);
        ctx.lineTo(0, 0);
        // ctx.restore()
        // ctx.rotate(origin.sDeg)
        ctx.lineTo(origin.r, 0);
        ctx.closePath();
        ctx.restore;
        ctx.fill();
    }
    var rect = {};
    function dragRect() {
        canvas.addEventListener('mousedown', mouseDown, false);
        canvas.addEventListener('mousemove', mouseMove, false);
        canvas.addEventListener('mouseup', mouseUp, false);
    }

    function mouseDown(e) {
        rect.startX = e.pageX - this.offsetLeft;
        rect.startY = e.pageY - this.offsetTop;
        rect.drag = true;
        // console.log(rect.startX)
        // console.log(e.pageX)
    }

    function mouseMove(e) {
        if (rect.drag) {
            rect.w = e.pageX - this.offsetLeft - rect.startX;
            rect.h = e.pageY - this.offsetTop - rect.startY;
            // console.log(rect.w)
            ctx.clearRect(0, 0, this.width, this.height);
            drawRect('stroke');
            // console.log('mousemove')
        }
    }

    function mouseUp() {
        rect.drag = false;
        // console.log('mouseup')
    }

    function drawRect(style) {
        ctx[style + 'Rect'](rect.startX, rect.startY, rect.w, rect.h);
        console.log(rect.startX);
    }
    // dragRect()

    function drawCurve() {
        ctx.strokeStyle = '#f36';
        ctx.fillStyle = 'red';
        ctx.lineWidth = 1;

        ctx.fillRect(100 - 4, 50 - 4, 8, 8);
        ctx.fillRect(300 - 4, 200 - 4, 8, 8);
        ctx.fillRect(100 - 4, 200 - 4, 8, 8);

        ctx.beginPath();
        ctx.strokeStyle = 'pink';
        ctx.moveTo(100, 50);
        ctx.lineTo(100, 200);
        ctx.lineTo(300, 200);
        ctx.stroke();

        ctx.beginPath();
        ctx.strokeStyle = 'blue';
        ctx.moveTo(100, 50);
        ctx.quadraticCurveTo(100, 200, 300, 200);
        ctx.stroke();
    }
    // drawCurve()
    function drawLang() {
        var lineWidth = 2,
            oW = canvas.width,
            oH = canvas.height,
            r = oW / 2,
            cR = r - 8 * lineWidth,
            oRange = document.getElementsByName('range')[0];
        var M = Math;
        Sin = M.sin;
        Cos = M.cos;
        Sqrt = M.sqrt;
        Pow = M.pow;
        PI = M.PI;
        Round = M.round;

        ctx.beginPath();
        ctx.lineWidth = lineWidth;
        var axisLength = 2 * r - 16 * lineWidth,
            unit = axisLength / 8,
            range = .2,
            nowrange = range,
            xoffset = 8 * lineWidth,
            data = ~~oRange.value / 100,
            sp = 0,
            nowdata = 0,
            waveupsp = 0.002,
            arcStack = [],
            bR = r - 8 * lineWidth,
            soffset = -(PI / 2),
            circleLock = true;

        for (var _i3 = soffset; _i3 < soffset + 2 * PI; _i3 += 1 / (8 * PI)) {
            arcStack.push([r + bR * Cos(_i3), r + bR * Sin(_i3)]);
        }

        var cStartPoint = arcStack.shift();

        ctx.strokeStyle = '#1c86d1';
        ctx.moveTo(cStartPoint[0], cStartPoint[1]);

        render();

        function render() {
            ctx.clearRect(0, 0, oW, oH);
            if (circleLock) {
                if (arcStack.length) {
                    var temp = arcStack.shift();
                    ctx.lineTo(temp[0], temp[1]);
                    ctx.stroke();
                } else {
                    circleLock = false;
                    ctx.lineTo(cStartPoint[0], cStartPoint[1]);
                    ctx.stroke();
                    arcStack = null;

                    ctx.globalCompositeOperation = 'destination-over';

                    ctx.beginPath();
                    ctx.lineWidth = lineWidth;
                    ctx.arc(r, r, bR, 0, 2 * PI, 1);

                    ctx.beginPath();
                    ctx.save();
                    ctx.arc(r, r, r - 16 * lineWidth, 0, 2 * PI, 1);
                    ctx.restore();
                    ctx.clip();
                    //  ctx.fillRect(0, 0, oW, oH)

                    ctx.fillStyle = '#1c86d1';

                    oRange.addEventListener('change', function () {
                        data = ~~oRange.value / 100;
                        console.log('data = ' + data);
                    }, 0);
                }
            } else {
                var t = range * .01;
                if (data >= 0.85) {
                    if (nowrange > range / 4) {
                        nowrange -= t;
                    }
                } else if (data <= .1) {
                    if (nowrange < range * 1.5) {
                        nowrange += t;
                    }
                } else {
                    if (nowrange <= range) {
                        nowrange += t;
                    }
                    if (nowrange >= range) {
                        nowrange -= t;
                    }
                }
                if (data - nowdata > 0) {
                    nowdata += waveupsp;
                }
                if (data - nowdata < 0) {
                    nowdata -= waveupsp;
                }
                sp += .07;
                drawSine();
                drawText();
            }

            requestAnimationFrame(render);
        }

        function drawSine() {
            ctx.beginPath();
            ctx.save();
            var Stack = [];
            for (var _i4 = xoffset; _i4 <= xoffset + axisLength; _i4 += 20 / axisLength) {
                var _x3 = sp + (xoffset + _i4) / unit,
                    _y = Sin(_x3) * nowrange,
                    dx = _i4,
                    dy = 2 * cR * (1 - nowdata) + (r - cR) - unit * _y;

                ctx.lineTo(dx, dy);
                Stack.push([dx, dy]);
            }
            var startP = Stack[0];
            var endP = Stack[Stack.length - 1];

            ctx.lineTo(xoffset + axisLength, oW);
            ctx.lineTo(xoffset, oW);
            ctx.lineTo(startP[0], startP[1]);
            ctx.fillStyle = '#1c86d1';
            // ctx.fillStyle = 'pink'
            ctx.fill();
            ctx.restore();
        }
        function drawText() {
            ctx.globalCompositeOperation = 'source-over';
            var size = .4 * cR;
            ctx.font = 'bold ' + size + 'px Microsoft Yahei';

            var txt = (nowdata.toFixed(2) * 100).toFixed(0) + '%';

            var fonty = r + size / 2,
                fontx = r - size * .8;
            ctx.fillStyle = 'rgba(6, 85, 128, .8)';
            ctx.fillText(txt, fontx, fonty);
        }
    }
    drawLang();

    var Loading = function () {
        function Loading(id) {
            _classCallCheck(this, Loading);

            this.init(id);

            this.x = this.canvas.width / 2;
            this.y = this.canvas.height / 2;
            this.r = Math.min(this.x, this.y) - 10;
            this.speed = .1;
            this.rad = Math.PI * 2 / 100;
            this.initialPoint = -Math.PI / 2;

            this.baseRound = this.baseRound.bind(this);
            this.progressBar = this.progressBar.bind(this);
            this.progressText = this.progressText.bind(this);
            this.start = this.start.bind(this);

            this.start();
        }

        _createClass(Loading, [{
            key: 'init',
            value: function init(id) {
                if (!id) {
                    console.warn('there is no id');
                    return null;
                }
                this.canvas = document.getElementById(id);
                this.ctx = this.canvas.getContext('2d');
            }
        }, {
            key: 'baseRound',
            value: function baseRound() {
                this.ctx.save();
                this.ctx.beginPath();
                this.ctx.strokeStyle = '#49f';
                this.ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
                this.ctx.closePath();
                this.ctx.stroke();
                this.ctx.restore();
            }
        }, {
            key: 'progressBar',
            value: function progressBar(n) {
                this.ctx.save();
                this.ctx.beginPath();
                this.ctx.strokeStyle = '#49f';
                this.ctx.lineWidth = 5;
                this.ctx.arc(this.x, this.y, this.r, this.initialPoint, n * this.rad + this.initialPoint, false);
                this.ctx.stroke();
                this.ctx.restore();
            }
        }, {
            key: 'progressText',
            value: function progressText(n) {
                this.ctx.save();
                this.ctx.strokeStyle = '#49f';
                this.ctx.font = '20px Arial';
                this.ctx.strokeText(n.toFixed(0) + '%', this.x - 15, this.y + 8);
                this.ctx.stroke();
                this.ctx.restore();
            }
        }, {
            key: 'start',
            value: function start() {
                requestAnimationFrame(this.start);
                // this.fillStyle = 'black';
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                this.baseRound();
                this.progressText(this.speed);
                this.progressBar(this.speed);
                if (this.speed <= 100) {
                    this.speed += .1;
                } else {
                    this.speed = 0;
                }
            }
        }]);

        return Loading;
    }();

    new Loading('canvas1');

    var FallText = function () {
        function FallText(id) {
            _classCallCheck(this, FallText);

            this.init(id);
            var words = "0123456789qwertyuiopasdfghjklzxcvbnm,./;'\[]QWERTYUIOP{}ASDFGHJHJKL:ZXCVBBNM<>?";
            this.wordColor = '#3f3';
            this.clearColor = 'rgba(0, 0, 0, .1)';
            this.wordArr = words.split('');
            this.fontSize = 16;
            this.column = this.canvas.width / this.fontSize;
            this.drops = [];
            this.n = 0;

            this.initDrops = this.initDrops.bind(this);
            this.draw = this.draw.bind(this);
            this.start = this.start.bind(this);
            this.initDrops();
            this.start();
        }

        _createClass(FallText, [{
            key: 'init',
            value: function init(id) {
                if (!id) {
                    console.warn('there is no id');
                    return null;
                }
                this.canvas = document.getElementById(id);
                this.ctx = this.canvas.getContext('2d');
            }
        }, {
            key: 'initDrops',
            value: function initDrops() {
                for (var _i5 = 0; _i5 < this.column; ++_i5) {
                    this.drops[_i5] = 1;
                }
            }
        }, {
            key: 'draw',
            value: function draw() {
                this.ctx.save();
                this.ctx.fillStyle = this.wordColor;
                for (var _i6 = 0; _i6 < this.column; ++_i6) {
                    var text = this.wordArr[Math.floor(Math.random() * this.wordArr.length)];
                    this.ctx.fillText(text, _i6 * this.fontSize, this.drops[_i6] * this.fontSize);
                    if (this.drops[_i6] * this.fontSize > this.canvas.height && Math.random() > .98) {
                        this.drops[_i6] = 0;
                    }
                    ++this.drops[_i6];
                }
                this.ctx.restore();
            }
        }, {
            key: 'start',
            value: function start() {
                requestAnimationFrame(this.start);
                this.ctx.fillStyle = this.clearColor;
                this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
                this.draw();
            }
        }]);

        return FallText;
    }();

    new FallText('canvas2');

    var Arrow = function () {
        function Arrow(id) {
            _classCallCheck(this, Arrow);

            if (!this.init(id)) {
                return;
            }

            this.x = this.canvas.width / 2;
            this.y = this.canvas.height / 2;
            this.rotation = 0;
            this.color = '#ff0';
            this.speed = .2;

            this.bindEvent();

            this.draw = this.draw.bind(this);
            this.start = this.start.bind(this);
        }

        _createClass(Arrow, [{
            key: 'init',
            value: function init(id) {
                if (!id) {
                    console.warn('there is no id');
                    return null;
                }
                this.canvas = document.getElementById(id);
                this.ctx = this.canvas.getContext('2d');
                return true;
            }
        }, {
            key: 'bindEvent',
            value: function bindEvent() {
                var _this = this;

                this.canvas.addEventListener('mousemove', function (e) {
                    _this.mouseX = e.offsetX;
                    _this.mouseY = e.offsetY;
                    _this.start();
                });
            }
        }, {
            key: 'draw',
            value: function draw() {
                this.ctx.save();
                this.ctx.translate(this.x, this.y);
                this.ctx.rotate(this.rotation);
                this.ctx.lineWidth = 5;
                this.ctx.fillStyle = this.color;
                this.ctx.beginPath();
                this.ctx.moveTo(-50, -25);
                this.ctx.lineTo(0, -25);
                this.ctx.lineTo(0, -50);
                this.ctx.lineTo(50, 0);
                this.ctx.lineTo(0, 50);
                this.ctx.lineTo(0, 25);
                this.ctx.lineTo(-50, 25);
                this.ctx.closePath();
                this.ctx.stroke();
                this.ctx.fill();
                this.ctx.restore();
            }
        }, {
            key: 'start',
            value: function start() {
                requestAnimationFrame(this.start);
                var dx = this.mouseX - this.x + 50,
                    dy = this.mouseY - this.y + 50,
                    rotation = Math.atan2(dy, dx);
                var vx = Math.cos(rotation) * this.speed,
                    vy = Math.sin(rotation) * this.speed;
                this.x += vx;
                this.y += vy;
                this.rotation = rotation;
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                this.draw();
            }
        }]);

        return Arrow;
    }();

    new Arrow('canvas3');

    var Ball = function () {
        function Ball(id) {
            var radius = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 5;
            var color = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '#f36';
            var speedX = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : .1;
            var speedY = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : .1;

            _classCallCheck(this, Ball);

            if (!this.init(id)) {
                return;
            }

            // this.x = this.canvas.width / 2;
            this.y = this.canvas.height / 2;
            this.x = radius;
            // this.y = 0;
            this.radius = radius;
            this.color = color;
            this.speedX = speedX;
            this.speedY = speedY;
            this.scaleX = 1;
            this.scaleY = 1;
            this.rad = 0;

            this.draw = this.draw.bind(this);
            this.start = this.start.bind(this);

            this.start();
        }

        _createClass(Ball, [{
            key: 'init',
            value: function init(id) {
                if (!id) {
                    console.warn('there is no id');
                    return null;
                }
                this.canvas = document.getElementById(id);
                this.ctx = this.canvas.getContext('2d');
                return true;
            }
        }, {
            key: 'draw',
            value: function draw() {
                this.ctx.save();
                this.ctx.beginPath();
                this.ctx.scale(this.scaleX, this.scaleY);
                this.ctx.fillStyle = this.color;
                this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
                this.ctx.fill();
                this.ctx.restore();
            }
        }, {
            key: 'start',
            value: function start() {
                requestAnimationFrame(this.start);
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                this.x += this.speedX * 10;
                this.y += Math.cos(this.rad) * 10;
                if (this.x > this.canvas.width - this.radius || this.x < this.radius) {
                    this.speedX = -this.speedX;
                }
                // this.scaleX = this.scaleY = 1 + Math.sin(this.rad) * .5;
                this.rad += this.speedY;
                this.draw();
            }
        }]);

        return Ball;
    }();

    new Ball('canvas4');

    var Ship = function () {
        function Ship(id) {
            _classCallCheck(this, Ship);

            if (!this.init(id)) {
                return;
            }

            this.x = this.canvas.width / 2;
            this.y = this.canvas.height / 2;
            this.color = '#000';
            this.rotation = 0;
            this.vx = 0;
            this.vy = 0;
            this.vr = 0;
            this.ax = 0;
            this.ay = 0;
            this.thrust = 0;
            this.showFlame = false;

            this.bindEvent();

            this.draw = this.draw.bind(this);
            this.start = this.start.bind(this);

            this.start();
        }

        _createClass(Ship, [{
            key: 'init',
            value: function init(id) {
                if (!id) {
                    console.warn('there is no id');
                    return null;
                }
                this.canvas = document.getElementById(id);
                this.ctx = this.canvas.getContext('2d');
                return true;
            }
        }, {
            key: 'draw',
            value: function draw() {
                this.ctx.save();
                this.ctx.beginPath();
                this.ctx.strokeStyle = this.color;
                this.ctx.translate(this.x, this.y);
                this.ctx.rotate(this.rotation);
                this.ctx.moveTo(10, 0);
                this.ctx.lineTo(-10, 10);
                this.ctx.lineTo(-5, 0);
                this.ctx.lineTo(-10, -10);
                this.ctx.closePath();
                this.ctx.stroke();
                if (this.showFlame) {
                    this.ctx.save();
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = "#f69";
                    this.ctx.moveTo(-7.5, -5);
                    this.ctx.lineTo(-15, 0);
                    this.ctx.lineTo(-7.5, 5);
                    this.ctx.stroke();
                    this.ctx.restore();
                }
                this.ctx.restore();
            }
        }, {
            key: 'bindEvent',
            value: function bindEvent() {
                var _this2 = this;

                window.addEventListener('keydown', function (e) {
                    switch (e.keyCode) {
                        case 37:
                            _this2.vr = -3;
                            _this2.vx = 0;
                            _this2.vy = 0;
                            break;
                        case 39:
                            _this2.vr = 3;
                            _this2.vx = 0;
                            _this2.vy = 0;
                            break;
                        case 38:
                            _this2.showFlame = true;
                            _this2.vx = 0;
                            _this2.vy = 0;
                            _this2.thrust += .05;
                            break;
                        case 40:
                            _this2.ax = 0;
                            _this2.ay = 0;
                            _this2.vx = 0;
                            _this2.vy = 0;
                            break;
                    }
                });
                window.addEventListener('keyup', function () {
                    _this2.vr = 0;
                    _this2.showFlame = false;
                });
            }
        }, {
            key: 'start',
            value: function start() {
                requestAnimationFrame(this.start);
                if (this.x - 20 > this.canvas.width) {
                    this.x = -20;
                }
                if (this.x + 20 < 0) {
                    this.x = this.canvas.width - 10;
                }
                if (this.y - 20 > this.canvas.height) {
                    this.y = -20;
                }
                if (this.y + 20 < 0) {
                    this.y = this.canvas.height - 10;
                }

                this.rotation += this.vr * Math.PI / 180;
                this.ax = Math.cos(this.rotation) * this.thrust;
                this.ay = Math.sin(this.rotation) * this.thrust;

                this.vx += this.ax;
                this.vy += this.ay;

                this.x += this.vx;
                this.y += this.vy;

                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

                this.draw();
            }
        }]);

        return Ship;
    }();

    new Ship('canvas5');

    var Ball2 = function () {
        function Ball2(id) {
            _classCallCheck(this, Ball2);

            if (!this.init(id)) {
                return;
            }
            this.x = 10;
            this.y = 10;
            this.size = 10;
            this.rotation = 0;
            this.f = .05;
            this.vx = Math.random() * 10 - 5;
            this.vy = Math.random() * 10 - 5;
            this.speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy).toFixed(0);

            this.draw = this.draw.bind(this);
            this.start = this.start.bind(this);

            this.start();
            // this.draw()
        }

        _createClass(Ball2, [{
            key: 'init',
            value: function init(id) {
                if (!id) {
                    console.warn('there is no id');
                    return null;
                }

                this.canvas = document.getElementById(id);
                this.ctx = this.canvas.getContext('2d');
                return true;
            }
        }, {
            key: 'draw',
            value: function draw() {
                this.ctx.save();
                this.ctx.beginPath();
                // this.ctx.translate(this.x, this.y);
                this.ctx.rotate(this.rotation);
                this.ctx.fillStyle = '#f36';
                this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
                this.ctx.fill();
                this.ctx.closePath();
                this.ctx.restore();
            }
        }, {
            key: 'start',
            value: function start() {
                requestAnimationFrame(this.start);
                var angle = Math.atan(this.vx, this.vy);
                // this.speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy).toFixed(0);
                // this.speed = 1;

                if (this.speed - this.f > 0) {
                    this.speed -= this.f;
                } else {
                    this.speed = 0;
                }

                if (this.x - this.size > this.canvas.width) {
                    this.x = 0 + this.size;
                    // this.vx = -this.vx;
                }
                if (this.x + this.size < 0) {
                    this.x = this.canvas.width - this.size;
                    // this.vx = -this.vx;
                }
                if (this.y - this.size > this.canvas.height) {
                    this.y = 0 + this.size;
                    // this.vy = -this.vy;
                }
                if (this.y + this.size < 0) {
                    this.y = this.canvas.height - this.size;
                    // this.vy = -this.vy;
                }

                angle = (this.rotation + 8) * Math.PI / 180;

                this.vx = Math.cos(angle) * this.speed;
                this.vy = Math.sin(angle) * this.speed;

                this.x += this.vx;
                this.y += this.vy;

                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                this.draw();
            }
        }]);

        return Ball2;
    }();
    // new Ball2('canvas6');

    var dragBall = function () {
        function dragBall(id) {
            _classCallCheck(this, dragBall);

            if (!this.init(id)) {
                return;
            }

            this.x = this.canvas.width / 2;
            this.y = this.canvas.height / 2;
            this.vx = 0;
            this.vy = 0;
            this.ax = 0;
            this.ay = 0;
            this.size = 20;
            this.isDrag = false;
            this.speed = 2;
            this.bound = -0.8;
            this.gravity = .5;

            this.draw = this.draw.bind(this);
            this.start = this.start.bind(this);
            this.mouseDown = this.mouseDown.bind(this);
            this.mouseMove = this.mouseMove.bind(this);
            this.mouseUp = this.mouseUp.bind(this);
            this.getBound = this.getBound.bind(this);

            this.bindEvent();

            this.start();
        }

        _createClass(dragBall, [{
            key: 'init',
            value: function init(id) {
                if (!id) {
                    console.warn('there is no id');
                    return null;
                }

                this.canvas = document.getElementById(id);
                this.ctx = this.canvas.getContext('2d');
                return true;
            }
        }, {
            key: 'bindEvent',
            value: function bindEvent() {
                this.canvas.addEventListener('mousedown', this.mouseDown, false);
            }
        }, {
            key: 'mouseDown',
            value: function mouseDown(e) {
                console.log('down');
                if (Math.abs(e.offsetX - this.x) < this.size && Math.abs(e.offsetY - this.y)) {
                    this.isDrag = true;
                    this.w = e.offsetX - this.x;
                    this.h = e.offsetY - this.y;
                    this.startX = this.x;
                    this.startY = this.y;
                    this.startTime = new Date();
                    this.canvas.addEventListener('mousemove', this.mouseMove, false);
                    this.canvas.addEventListener('mouseup', this.mouseUp, false);
                }
            }
        }, {
            key: 'mouseMove',
            value: function mouseMove(e) {
                console.log('move');
                this.x = e.offsetX - this.w;
                this.y = e.offsetY - this.h;
            }
        }, {
            key: 'mouseUp',
            value: function mouseUp(e) {
                console.log('up');
                this.isDrag = false;
                this.durX = this.x - this.startX;
                this.durY = this.y - this.startY;
                this.durT = new Date() - this.startTime;
                this.vx = this.durX / this.durT;
                this.vy = this.durY / this.durT;
                this.canvas.removeEventListener('mousemove', this.mouseMove, false);
                this.canvas.removeEventListener('mouseup', this.mouseUp, false);
            }
        }, {
            key: 'draw',
            value: function draw() {
                this.ctx.save();
                this.ctx.beginPath();
                // this.ctx.translate(this.x, this.y);
                this.ctx.fillStyle = '#f36';
                this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
                this.ctx.fill();
                this.ctx.restore();
            }
        }, {
            key: 'getBound',
            value: function getBound() {
                this.vy += this.gravity;
                // console.log(this.vy)
                if (this.x - this.size < 0) {
                    this.vx *= this.bound;
                    this.x = this.size;
                }
                if (this.x + this.size > this.canvas.width) {
                    this.vx *= this.bound;
                    this.x = this.canvas.width - this.size;
                }
                if (this.y - this.size < 0) {
                    this.vy *= this.bound;
                    this.y = this.size;
                }
                if (this.y + this.size > this.canvas.height) {
                    this.vy *= this.bound;
                    this.y = this.canvas.height - this.size;
                }
                // this.vx = this.vx.toFixed(0);
                // this.vy = parseInt(this.vy)
            }
        }, {
            key: 'start',
            value: function start() {
                requestAnimationFrame(this.start);

                if (this.isDrag) {
                    this.vx = 0;
                    this.vy = 0;
                } else {
                    // console.log(this.vy)
                    // console.log(this.y)
                    // console.log(this.vx)

                    this.getBound();

                    this.x += this.vx;
                    this.y += this.vy;
                }

                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                this.draw();
            }
        }]);

        return dragBall;
    }();

    new dragBall('canvas7');

    var Vertex = function () {
        function Vertex(x, y, baseY) {
            _classCallCheck(this, Vertex);

            this.x = x;
            this.y = y;
            this.baseY = baseY;
            this.targetY = 0;
            this.vy = 0;
            this.deceleration = .95;
            this.friction = 0.15;

            this.updateY = this.updateY.bind(this);
        }

        _createClass(Vertex, [{
            key: 'updateY',
            value: function updateY(diffVal) {
                this.targetY = diffVal + this.baseY;
                this.vy += this.targetY - this.y;
                this.vy *= this.deceleration;
                this.y += this.vy * this.friction;
            }
        }]);

        return Vertex;
    }();

    var Wave = function () {
        function Wave(id) {
            _classCallCheck(this, Wave);

            if (!this.init(id)) {
                return;
            }

            this.x = this.canvas.width / 2;
            this.y = this.canvas.height / 2;
            this.w = this.canvas.width;
            this.h = this.canvas.height;
            this.baseY = this.canvas.height;
            this.lineNum = 250;
            this.vertexs = [];
            this.diffPt = [];
            this.vPos = this.lineNum / 2;
            this.dd = 15;
            this.autoDiff = 100;

            this.draw = this.draw.bind(this);
            this.update = this.update.bind(this);
            this.mouseDown = this.mouseDown.bind(this);
            this.start = this.start.bind(this);

            this.initVertexs();
            this.bindEvent();
            this.start();
        }

        _createClass(Wave, [{
            key: 'init',
            value: function init(id) {
                if (!id) {
                    console.warn('there is no id');
                    return null;
                }

                this.canvas = document.getElementById(id);
                this.ctx = this.canvas.getContext('2d');
                this.canvas.width = window.innerWidth;

                return true;
            }
        }, {
            key: 'initVertexs',
            value: function initVertexs() {
                var dur = this.w / (this.lineNum - 1);
                console.log(dur);
                for (var _i7 = 0; _i7 < this.lineNum; ++_i7) {
                    this.vertexs[_i7] = new Vertex(dur * _i7, this.h / 2, this.h / 2);
                    this.diffPt[_i7] = 0;
                }
            }
        }, {
            key: 'bindEvent',
            value: function bindEvent() {
                this.canvas.addEventListener('mousedown', this.mouseDown, false);
            }
        }, {
            key: 'mouseDown',
            value: function mouseDown(e) {
                if (e.offsetY < this.h / 2 + 30 || e.offsetY > this.h / 2 - 30) {
                    this.vPos = Math.floor(this.lineNum * e.offsetX / this.w);
                    this.autoDiff = 100;
                }
            }
        }, {
            key: 'draw',
            value: function draw() {
                this.ctx.save();
                this.ctx.beginPath();
                this.ctx.fillStyle = '#6ca0f6';
                this.ctx.moveTo(0, this.h);
                this.ctx.lineTo(this.vertexs[0].x, this.vertexs[0].y);
                for (var _i8 = 0; _i8 < this.lineNum; ++_i8) {
                    this.ctx.lineTo(this.vertexs[_i8].x, this.vertexs[_i8].y);
                }
                this.ctx.lineTo(this.w, this.h);
                this.ctx.lineTo(0, this.h);
                this.ctx.fill();
                this.ctx.restore();

                this.ctx.save();
                this.ctx.beginPath();
                this.ctx.fillStyle = '#367aec';
                this.ctx.moveTo(0, this.h);
                this.ctx.lineTo(this.vertexs[0].x, this.vertexs[0].y);
                for (var _i9 = 0; _i9 < this.lineNum; ++_i9) {
                    this.ctx.lineTo(this.vertexs[_i9].x, this.vertexs[_i9].y + 5);
                }
                this.ctx.lineTo(this.w, this.h);
                this.ctx.lineTo(0, this.h);
                this.ctx.fill();
                this.ctx.restore();
            }
        }, {
            key: 'update',
            value: function update() {
                this.diffPt[this.vPos] = this.autoDiff;
                var len = this.vertexs.length;

                for (var _i10 = this.vPos - 1; _i10 > 0; --_i10) {
                    var d = this.vPos - _i10;
                    if (d > this.dd) {
                        d = this.dd;
                    }
                    this.diffPt[_i10] -= (this.diffPt[_i10] - this.diffPt[_i10 + 1]) * (1 - .01 * d);
                }
                for (var _i11 = this.vPos + 1; _i11 < len; ++_i11) {
                    var _d = _i11 - this.vPos;
                    if (_d > this.dd) {
                        _d = this.dd;
                    }
                    this.diffPt[_i11] -= (this.diffPt[_i11] - this.diffPt[_i11 - 1]) * (1 - .01 * _d);
                }

                for (var _i12 = 0; _i12 < len; ++_i12) {
                    this.vertexs[_i12].updateY(this.diffPt[_i12]);
                }

                this.autoDiff -= this.autoDiff * .9;
            }
        }, {
            key: 'start',
            value: function start() {
                requestAnimationFrame(this.start);
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                this.update();
                this.draw();
            }
        }]);

        return Wave;
    }();

    new Wave('canvas8');

    var Balls = function () {
        function Balls(ctx, canvas) {
            var x = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
            var y = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
            var r = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 10;
            var handle = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : false;
            var color = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : '#f36';

            _classCallCheck(this, Balls);

            if (!ctx) {
                console.error('there is no ctx');
                return;
            }
            this.x = x;
            this.y = y;
            this.r = r;
            this.ctx = ctx;
            this.color = color;
            this.handle = handle;

            this.draw = this.draw.bind(this);
        }

        _createClass(Balls, [{
            key: 'draw',
            value: function draw() {
                this.ctx.save();
                this.ctx.beginPath();
                this.ctx.fillStyle = this.color;
                this.ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
                this.ctx.fill();
                this.ctx.closePath();
                this.ctx.restore();
            }
        }]);

        return Balls;
    }();

    var Easing = function () {
        function Easing(id) {
            _classCallCheck(this, Easing);

            if (!this.init(id)) {
                return;
            }

            this.x = this.canvas.width / 2;
            this.y = this.canvas.height / 2;
            this.r = 20;
            this.vx = 0;
            this.vy = 0;
            this.ax = 0;
            this.ay = 0;
            this.color = '#f36';
            this.lineColor = 'blake';
            this.dx = 0;
            this.dy = 0;

            this.s1X;
            this.targetX = 0;
            this.targetY = 0;
            this.easing = .9;
            this.spring = .03;
            this.springLength = 100;

            this.draw = this.draw.bind(this);
            this.drawLine = this.drawLine.bind(this);
            this.changeStatus = this.changeStatus.bind(this);
            this.containPoint = this.containPoint.bind(this);
            this.mouseDown = this.mouseDown.bind(this);
            this.mouseMove = this.mouseMove.bind(this);
            this.mouseUp = this.mouseUp.bind(this);
            this.start = this.start.bind(this);

            this.bindEvent();
            this.start();
        }

        _createClass(Easing, [{
            key: 'init',
            value: function init(id) {
                if (!id) {
                    console.warn('there is no id');
                    return null;
                }

                this.canvas = document.getElementById(id);
                this.ctx = this.canvas.getContext('2d');
                this.canvas.width = window.innerWidth;

                this.w = this.canvas.width;
                this.h = this.canvas.height;
                this.sBall = [];

                for (var _i13 = 0; _i13 < 3; ++_i13) {
                    this.sBall.push(new Balls(this.ctx, this.canvas, Math.random() * 450 + 20, Math.random() * 450 + 20, Math.random() * 10 + 5));
                }

                return true;
            }
        }, {
            key: 'draw',
            value: function draw() {
                this.ctx.save();
                this.ctx.beginPath();
                this.ctx.fillStyle = this.color;
                this.ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
                this.ctx.fill();
                this.ctx.restore();
            }
        }, {
            key: 'drawLine',
            value: function drawLine(ball) {
                this.ctx.save();
                this.ctx.beginPath();
                this.ctx.strokeStyle = this.lineColor;
                this.ctx.moveTo(this.x, this.y);
                this.ctx.lineTo(ball.x, ball.y);
                this.ctx.stroke();
                this.ctx.restore();
            }
        }, {
            key: 'containPoint',
            value: function containPoint(ball, x, y) {
                if (Math.abs(x - ball.x) < ball.r && Math.abs(y - ball.y) < ball.r) {
                    return true;
                }
                return false;
            }
        }, {
            key: 'bindEvent',
            value: function bindEvent() {
                console.log(this.sBall);
                this.canvas.addEventListener('mousedown', this.mouseDown, false);
            }
        }, {
            key: 'mouseDown',
            value: function mouseDown(e) {
                console.log(e.offsetX);
                for (var _i14 = 0; _i14 < this.sBall.length; ++_i14) {
                    // console.log(this.containPoint(this.sBall[i]))
                    if (this.containPoint(this.sBall[_i14], e.offsetX, e.offsetY)) {
                        this.sBall[_i14].handle = true;
                        this.handleBall = this.sBall[_i14];
                        this.dx = this.handleBall.x - e.offsetX;
                        this.dy = this.handleBall.y - e.offsetY;
                        this.canvas.addEventListener('mousemove', this.mouseMove, false);
                        this.canvas.addEventListener('mouseup', this.mouseUp, false);
                        break;
                    }
                }
            }
        }, {
            key: 'mouseMove',
            value: function mouseMove(e) {
                if (this.handleBall.handle) {
                    this.handleBall.x = e.offsetX + this.dx;
                    this.handleBall.y = e.offsetY + this.dy;
                }
            }
        }, {
            key: 'mouseUp',
            value: function mouseUp() {
                this.handleBall.handle = false;
                this.canvas.addEventListener('mousemove', this.mouseMove);
                this.canvas.addEventListener('mouseup', this.mouseUp);
            }
        }, {
            key: 'changeStatus',
            value: function changeStatus() {
                var dx = 0,
                    dy = 0,
                    angle = 0;
                if (this.handleBall) {
                    dx = this.handleBall.x - this.x, dy = this.handleBall.y - this.y;
                    angle = Math.atan2(dy, dx);
                    this.targetX = this.handleBall.x + Math.cos(angle) * this.springLength;
                    this.targetY = this.handleBall.y + Math.sin(angle) * this.springLength;
                    this.vx += (this.targetX - this.x) * this.spring;
                    this.vy += (this.targetY - this.y) * this.spring;
                } else {
                    dx = 0;
                    dy = 0;
                    this.vx = dx;
                    this.vy = dy;
                }

                this.x += this.vx * this.easing;
                this.y += this.vy * this.easing;
            }
        }, {
            key: 'start',
            value: function start() {
                requestAnimationFrame(this.start);
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                this.changeStatus();
                for (var _i15 = 0; _i15 < this.sBall.length; ++_i15) {
                    this.drawLine(this.sBall[_i15]);
                    this.sBall[_i15].draw();
                }
                this.draw();
            }
        }]);

        return Easing;
    }();

    new Easing('canvas9');

    var Magnifier = function () {
        function Magnifier(id) {
            _classCallCheck(this, Magnifier);

            if (!this.init(id)) {
                return;
            }

            this.img = document.getElementById('img');
            this.r = 50;

            this.bindEvent = this.bindEvent.bind(this);
            this.draw = this.draw.bind(this);

            this.bindEvent();
        }

        _createClass(Magnifier, [{
            key: 'init',
            value: function init(id) {
                if (!id) {
                    console.warn('there is no id');
                    return null;
                }

                this.canvas = document.getElementById(id);
                this.ctx = this.canvas.getContext('2d');
                // this.canvas.width = window.innerWidth;

                this.w = this.canvas.width;
                this.h = this.canvas.height;

                return true;
            }
        }, {
            key: 'bindEvent',
            value: function bindEvent() {
                var _this3 = this;

                this.img.addEventListener('click', function (e) {
                    _this3.mX = e.offsetX;
                    _this3.mY = e.offsetY;
                    _this3.draw();
                });
            }
        }, {
            key: 'draw',
            value: function draw() {
                console.log(this.mX);
                console.log(this.mY);
                // this.ctx.save();
                this.ctx.arc(250, 250, 100, 0, Math.PI * 2, false);
                this.ctx.clip();
                this.ctx.drawImage(this.img, this.mX - this.r, this.mY - this.r, this.r * 2, this.r * 2, this.w / 2 - this.r * 2, this.h / 2 - this.r * 2, this.r * 4, this.r * 4);
                // this.ctx.drawImage(this.img, 0, 0)
                // this.ctx.restore();
            }
        }]);

        return Magnifier;
    }();

    new Magnifier('canvas10');
};