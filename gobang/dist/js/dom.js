'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DomChess = function (_Chess) {
    _inherits(DomChess, _Chess);

    function DomChess() {
        var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var r = arguments[1];
        var c = arguments[2];

        _classCallCheck(this, DomChess);

        var _this = _possibleConstructorReturn(this, (DomChess.__proto__ || Object.getPrototypeOf(DomChess)).call(this, obj));

        _this.r = r;
        _this.c = c;
        _this.ele = null;
        return _this;
    }

    _createClass(DomChess, [{
        key: 'draw',
        value: function draw(color) {
            this.ele.style.backgroundColor = color;
        }
    }]);

    return DomChess;
}(Chess);

var GoBang = function () {
    function GoBang() {
        var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, GoBang);

        this.id = 'panel';
        this.owner = null;

        Object.assign(this, obj);

        this.r = this.r >= 4 ? this.r : 4;
        this.c = this.c >= 4 ? this.c : 4;

        this.d = this.d > 0 ? this.d : 30; // 棋盘间隔
        this.ra = this.ra > 0 ? this.ra : 20; // 棋子半径
        this.chessArr = [];
        this.parent = document.getElementById(this.id);
        if (!parent) {
            console.error('There is no container');
            return;
        }

        this.parentEvent = this.parentEvent.bind(this);
        this.win = document.getElementById('win');

        this.init();
        this.bindEvent();
        console.log('dom');
    }

    _createClass(GoBang, [{
        key: 'init',
        value: function init() {
            this.initChessBoard();
            this.initChessArr();
        }
    }, {
        key: 'initChessBoard',
        value: function initChessBoard() {
            var str = '<div class="table">',
                strdiv = '<div class="chess-box">',
                rd = this.ra / 2,
                i = void 0;
            for (i = 0; i < this.r; ++i) {
                str += '<div class="tr" style="height: ' + this.d + 'px;">';
                for (var n = 0; n <= this.c; ++n) {
                    if (n < this.c && i < this.r) {
                        str += '<div class="td" style="width:' + this.d + 'px;height:' + this.d + 'px;"></div>';
                    }
                    strdiv += '<div class=\'chess\' style=\'top: ' + (i * this.d + 20 - rd) + 'px;left: ' + (n * this.d + 20 - rd) + 'px;width:' + this.ra + 'px;height:' + this.ra + 'px;\'></div>';
                }
                str += '</div>';
            }
            for (var _n = 0; _n <= this.c; ++_n) {
                strdiv += '<div class=\'chess\' style=\'top: ' + (i * this.d + 20 - rd) + 'px;left: ' + (_n * this.d + 20 - rd) + 'px;width:' + this.ra + 'px;height:' + this.ra + 'px;\'></div>';
            }
            str += '</div>' + strdiv + '</div>';

            this.parent.innerHTML = str;
        }
    }, {
        key: 'initChessArr',
        value: function initChessArr() {
            for (var i = 0; i <= this.r; ++i) {
                this.chessArr[i] = [];
                for (var n = 0; n <= this.c; ++n) {
                    this.chessArr[i][n] = new DomChess({
                        x: this.d * n,
                        y: this.d * i,
                        flag: 0,
                        owner: this
                    }, i, n);
                }
            }
            console.log(this.chessArr);
        }
    }, {
        key: 'bindEvent',
        value: function bindEvent() {
            this.parent.addEventListener('click', this.parentEvent);
        }
    }, {
        key: 'parentEvent',
        value: function parentEvent(e) {
            if (e.target !== this.parent && e.target.classList.contains('chess') && !this.owner.isEnd) {
                var flag = this.owner ? this.owner.curChess : 1;
                this.drawChess(flag, e.target);
            }
        }
    }, {
        key: 'drawChess',
        value: function drawChess(flag, tar, tx, ty) {
            var y = ty || parseInt(tar.style.top),
                x = tx || parseInt(tar.style.left);
            var c = ~~(x / this.d),
                r = ~~(y / this.d);

            if (c < 0 || r < 0 || c > this.c || r > this.r || this.chessArr[r][c].flag !== 0) {
                return null;
            }
            this.chessArr[r][c].flag = flag, this.chessArr[r][c].ele = tar;
            this.chessArr[r][c].draw(flag === 1 ? 'white' : 'black');

            this.owner && this.owner.step && this.owner.step(this.chessArr[r][c]);
        }
    }, {
        key: 'clearChess',
        value: function clearChess(chess) {
            this.chessArr[chess.r][chess.c].ele.style.backgroundColor = 'transparent';
            this.chessArr[chess.r][chess.c].flag = 0;
        }
    }, {
        key: 'cancelChess',
        value: function cancelChess(newChess, flag) {
            var chess = newChess.chess;
            this.chessArr[chess.r][chess.c].ele.style.backgroundColor = flag === 1 ? 'white' : 'black';
            this.chessArr[chess.r][chess.c].flag = flag;
        }
    }, {
        key: 'restart',
        value: function restart() {
            this.chessArr.forEach(function (row) {
                row.forEach(function (col) {
                    col.flag = 0;
                    if (col.ele) {
                        col.draw('transparent');
                        col.ele = null;
                    }
                });
            });
            this.win.classList.add('hide');
            this.bindEvent();
            this.win.className = 'hide';
        }
    }, {
        key: 'drawLine',
        value: function drawLine(checkResult) {
            var win = this.win,
                list = win.classList;
            var sr = checkResult.sr,
                sc = checkResult.sc,
                er = checkResult.er,
                ec = checkResult.ec,
                top = 0,
                left = 0,
                width = Math.abs(sc - ec) * this.d;
            if (sr < er && sc === ec) {
                width = Math.abs(sr - er) * this.d;
                win.classList.add('vertical');
                win.style.width = width + 'px';
            } else if (sr < er && sc < ec) {
                win.classList.add('blackslash');
                win.style.width = width * 1.45 + 'px';
            } else if (sr < er && sc > ec) {
                win.classList.add('slash');
                win.style.width = width * 1.45 + 'px';
            } else if (sr === er && sc < ec) {
                win.style.width = width + 'px';
                top -= 2.5;
            }
            top += sr * this.d + this.ra;
            left += sc * this.d + this.ra;
            win.style.top = top + 'px';
            win.style.left = left + 'px';
            list.remove('hide');
        }
    }]);

    return GoBang;
}();