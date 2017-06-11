'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Maze = function () {
    function Maze(r, c, id) {
        _classCallCheck(this, Maze);

        this.r = r;
        this.c = c;
        this.accessed = [];
        this.notAccessed = [];
        this.arr = [];

        this.init(id);
    }

    _createClass(Maze, [{
        key: 'init',
        value: function init(id) {
            if (this.r === 0 || this.c === 0) {
                return;
            }
            this.initArray();
            this.initCanvas(id);
            this.generate();
            this.render();
        }
    }, {
        key: 'initArray',
        value: function initArray() {
            for (var i = 0; i < 2 * this.r + 1; ++i) {
                this.arr[i] = [];
                for (var n = 0; n < 2 * this.c + 1; ++n) {
                    if ((n ^ n - 1) === 1 && (i ^ i - 1) === 1) {
                        this.arr[i][n] = 0;
                        this.notAccessed.push(0);
                    } else {
                        this.arr[i][n] = 1;
                    }
                }
            }
            this.arr[1][0] = 0;
            this.arr[2 * this.r - 1][2 * this.c] = 0;
        }
    }, {
        key: 'generate',
        value: function generate() {
            var count = this.r * this.c;
            var cur = MathUtil.randomInt(0, count);
            var offs = [-this.c, this.c, -1, 1],
                offr = [-1, 1, 0, 0],
                offc = [0, 0, -1, 1];
            this.accessed.push(cur);
            this.notAccessed[cur] = 1;

            while (this.accessed.length < count) {
                var tr = Math.floor(cur / this.c),
                    tc = cur % this.c;
                var num = 0,
                    off = -1;

                while (++num < 5) {
                    var around = MathUtil.randomInt(0, 4),
                        nr = tr + offr[around],
                        nc = tc + offc[around];
                    if (nr >= 0 && nc >= 0 && nr < this.r && nc < this.c && this.notAccessed[cur + offs[around]] === 0) {
                        off = around;
                        break;
                    }
                }

                if (off < 0) {
                    cur = this.accessed[MathUtil.randomInt(0, this.accessed.length)];
                } else {
                    tr = 2 * tr + 1;
                    tc = 2 * tc + 1;
                    this.arr[tr + offr[off]][tc + offc[off]] = 0;
                    cur = cur + offs[off];
                    this.notAccessed[cur] = 1;
                    this.accessed.push(cur);
                }
            }
        }
    }, {
        key: 'initCanvas',
        value: function initCanvas(id) {
            if (typeof id === 'string') {
                this.canvas = document.getElementById(id);
                this.ctx = this.canvas.getContext('2d');
            } else {
                this.createCanvas();
            }
        }
    }, {
        key: 'createCanvas',
        value: function createCanvas() {
            this.canvas = document.createElement('canvas');
            this.ctx = this.canvas.getContext('2d');

            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
            document.body.appendChild(this.canvas);
        }
    }, {
        key: 'render',
        value: function render() {
            var _this = this;

            this.arr.forEach(function (value, i) {
                value.forEach(function (item, n) {
                    _this.ctx.save();
                    _this.ctx.beginPath();
                    _this.ctx.fillStyle = item === 1 ? 'black' : 'white';
                    _this.ctx.rect(n * 10, i * 10, 10, 10);
                    _this.ctx.fill();
                    _this.ctx.closePath();
                    _this.ctx.restore();
                });
            });
        }
    }]);

    return Maze;
}();