'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CanvasChess = function (_Chess) {
    _inherits(CanvasChess, _Chess);

    function CanvasChess() {
        var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var r = arguments[1];
        var c = arguments[2];

        _classCallCheck(this, CanvasChess);

        var _this = _possibleConstructorReturn(this, (CanvasChess.__proto__ || Object.getPrototypeOf(CanvasChess)).call(this, obj));

        _this.r = r;
        _this.c = c;
        return _this;
    }

    _createClass(CanvasChess, [{
        key: 'draw',
        value: function draw() {
            var ctx = this.owner.ctx;
            ctx.fillStyle = this.owner.fillColor;
            ctx.fillRect(this.x - this.radius, this.y - this.radius, 2 * this.radius, 2 * this.radius);
            if (this.flag === 0) {
                this.clear();
                return;
            }

            ctx.beginPath();
            ctx.save();
            ctx.fillStyle = this.flag === 1 ? 'white' : 'black';
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
            ctx.fill();
            ctx.restore();
            ctx.closePath();
        }
    }, {
        key: 'clear',
        value: function clear() {
            var ctx = this.owner.ctx;
            var x = this.x + .5,
                y = this.y + .5;

            ctx.save();
            ctx.strokeStyle = this.owner.strokeColor;
            ctx.beginPath();
            ctx.moveTo(x - this.radius, y);
            ctx.lineTo(x + this.radius, y);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(x, y - this.radius);
            ctx.lineTo(x, y + this.radius);
            ctx.stroke();
            ctx.restore();
        }
    }]);

    return CanvasChess;
}(Chess);

var GoBang = function () {
    function GoBang() {
        var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, GoBang);

        this.r = 10;
        this.c = 11;
        this.d = 40; //间隔
        this.id = 'canvas';
        this.fillColor = '#964f0a';
        this.strokeColor = 'black';
        this.owner = null;

        Object.assign(this, obj);

        this.getContext();
        if (!this.ctx) {
            console.error("Your broswer doesn't support canvas");
            return;
        }

        this.chessArr = [];

        this.canvasEvent = this.canvasEvent.bind(this);

        this.init();
        this.bindEvent();
        console.log('canvas');
    }

    _createClass(GoBang, [{
        key: 'getContext',
        value: function getContext() {
            this.canvas = document.getElementById(this.id);
            this.ctx = this.canvas.getContext('2d');

            this.canvas.width = this.c * this.d + 1;
            this.canvas.height = this.r * this.d + 1;
        }
    }, {
        key: 'init',
        value: function init() {
            this.initChessBoard();
            this.initChess();
        }
    }, {
        key: 'bindEvent',
        value: function bindEvent() {
            console.log(this.canvas);
            this.canvas.addEventListener('click', this.canvasEvent);
        }
    }, {
        key: 'canvasEvent',
        value: function canvasEvent(e) {
            var flag = this.owner ? this.owner.curChess : 1;
            this.drawChess(e.offsetX, e.offsetY, flag, 0);
        }
    }, {
        key: 'removeEvent',
        value: function removeEvent() {
            this.canvas.removeEventListener('click', this.canvasEvent);
        }
    }, {
        key: 'initChessBoard',
        value: function initChessBoard() {
            var i = 0,
                n = 0,
                w = this.d * this.c + this.d,
                h = this.d * this.r + this.d;

            this.ctx.fillStyle = this.fillColor;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.strokeStyle = this.strokeColor;
            for (; i <= this.r + 1 && n <= this.c + 1; ++i, ++n) {
                this.drawDimen(i, 0, w);
                this.drawLong(n, 0, h);
            }
            while (i <= this.r + 1) {
                this.drawDimen(i, 0, w);
                ++i;
            }
            while (n <= this.c + 1) {
                this.drawLong(n, 0, h);
                ++n;
            }
        }
    }, {
        key: 'drawDimen',
        value: function drawDimen(i, s, e) {
            var y = this.d * i + .5;
            this.ctx.beginPath();
            this.ctx.moveTo(s, y);
            this.ctx.lineTo(e, y);
            this.ctx.stroke();
        }
    }, {
        key: 'drawLong',
        value: function drawLong(n, s, e) {
            var x = this.d * n + .5;
            this.ctx.beginPath();
            this.ctx.moveTo(x, s);
            this.ctx.lineTo(x, e);
            this.ctx.stroke();
        }
    }, {
        key: 'initChess',
        value: function initChess() {
            for (var i = 0; i < this.r; ++i) {
                this.chessArr[i] = [];
                for (var n = 0; n < this.c; ++n) {
                    this.chessArr[i][n] = new CanvasChess({
                        x: this.d * (n + 1),
                        y: this.d * (i + 1),
                        radius: this.d / 2 - 5,
                        flag: 0,
                        owner: this
                    }, i, n);
                }
            }
            console.log(this.chessArr);
        }
    }, {
        key: 'drawChess',
        value: function drawChess(x, y, flag, type) {
            var c = ~~((x - this.d / 2) / this.d),
                r = ~~((y - this.d / 2) / this.d);

            if (c < 0 || r < 0 || c >= this.c || r >= this.r || type === 0 && this.chessArr[r][c].flag !== 0) {
                return null;
            }

            this.chessArr[r][c].flag = flag;
            this.chessArr[r][c].draw();

            if (type === 0) {
                this.owner && this.owner.step && this.owner.step(this.chessArr[r][c]);
            }
        }
    }, {
        key: 'clearChess',
        value: function clearChess(x, y) {
            this.drawChess(x, y, 0, 1);
        }
    }, {
        key: 'cancelChess',
        value: function cancelChess(x, y, flag) {
            this.drawChess(x, y, flag, 2);
        }
    }, {
        key: 'drawLine',
        value: function drawLine(res) {
            var ctx = this.ctx,
                chessArr = this.chessArr;

            ctx.beginPath();
            ctx.save();
            ctx.strokeStyle = 'red';
            ctx.lineWidth = 5;
            ctx.moveTo(chessArr[res.sr][res.sc].x, chessArr[res.sr][res.sc].y);
            ctx.lineTo(chessArr[res.er][res.ec].x, chessArr[res.er][res.ec].y);
            ctx.stroke();
            ctx.restore();
        }
    }]);

    return GoBang;
}();