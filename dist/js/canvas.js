'use strict';

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
    // for(i = 0.5; i < xWidth; i += xy) {
    //     ctx.moveTo(i, 0);
    //     ctx.lineTo(i, yWidth);
    //     ctx.stroke();
    // }
    // for(n = 0.5; n < yWidth; n += xy) {
    //     ctx.moveTo(0, n);
    //     ctx.lineTo(xWidth, n);
    //     ctx.stroke();
    // }

    // ctx.lineWidth = 10;
    // ctx.moveTo(10, 10);
    // ctx.lineTo(100, 10);
    // ctx.lineTo(100, 100);
    // ctx.stroke();
    // ctx.moveTo(150, 100)
    // ctx.lineTo(150, 50);
    // ctx.stroke()

    // ctx.lineCap = 'round';
    // ctx.lineJoin = 'round';
    // ctx.fillStyle = '#f36';
    // ctx.lineWidth = 10;
    // ctx.beginPath();
    // ctx.moveTo(100.5, 10.5);
    // ctx.lineTo(300.5, 10.5);
    // ctx.lineTo(300.5, 210.5);
    // ctx.lineTo(100.5, 210.5);
    // ctx.lineTo(100.5, 10.5);
    // ctx.stroke();


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
    // drawSector(ctx);

    // ctx.shadowBlur = 5;
    // ctx.shadowColor = 'rgba(204, 204, 204, 0.5)';
    // ctx.shadowOffsetX = 5;
    // ctx.shadowOffsetY = 5;
    // ctx.fillStyle = '#FA6900';
    // ctx.save();
    // ctx.fillRect(10, 10, 20, 50)

    // ctx.shadowStyle = 'rgba(204, 204, 204, 0.5)';
    // ctx.fillStyle = '#f36';
    // ctx.save();
    // ctx.fillRect(50, 10, 20, 50)

    // ctx.shadowStyle = 'rgba(204, 204, 204, 0.5)';
    // ctx.fillStyle = '#A7DBD7';
    // ctx.save();
    // ctx.fillRect(100, 10, 20, 50)

    // ctx.restore();
    // ctx.beginPath();
    // ctx.arc(150, 30, 20, 0, Math.PI * 2, true);
    // ctx.closePath();
    // ctx.fill()
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
};