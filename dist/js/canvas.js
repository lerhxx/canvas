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
     * @method setLineDotted: 绘制五角星
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
    drawSector(ctx);

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
};