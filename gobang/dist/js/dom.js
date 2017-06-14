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
        return _this;
    }

    return DomChess;
}(Chess);

var GoBang = function () {
    function GoBang() {
        var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, GoBang);

        this.r = 10;
        this.c = 11;
        this.id = 'panel';
        this.owner = null;

        Object.assign(this, obj);

        this.d = 40; //间隔
        this.chessArr = [];
        this.parent = document.getElementById(this.id);
        if (!parent) {
            console.error('There is no container');
            return;
        }

        this.parentEvent = this.parentEvent.bind(this);

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
            var str = '<table><tbody>',
                strdiv = '',
                rd = this.d / 2;
            for (var i = 0; i < this.r + 1; ++i) {
                str += '<tr>';
                for (var n = 0; n < this.c + 1; ++n) {
                    str += '<td></td>';
                    if (n < this.c && i < this.r) {
                        str += '<div style=\'top: ' + (this.d + i * this.d - 15) + 'px;left: ' + (this.d + n * this.d - 15) + 'px;\'></div>';
                    }
                }
                str += '</tr>';
            }
            str += '</tbody></table>' + strdiv;

            this.parent.innerHTML = str;
        }
    }, {
        key: 'initChessArr',
        value: function initChessArr() {
            for (var i = 0; i < this.r; ++i) {
                this.chessArr[i] = [];
                for (var n = 0; n < this.c; ++n) {
                    this.chessArr[i][n] = new DomChess({
                        x: this.d * (n + 1),
                        y: this.d * (i + 1),
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
            if (e.target !== this.parent && e.target.tagName.toLowerCase() === 'div') {
                var flag = this.owner ? this.owner.curChess : 1;
                this.drawChess(flag, e.target);
            }
        }
    }, {
        key: 'removeEvent',
        value: function removeEvent() {
            this.parent.removeEventListener('click', this.parentEvent);
        }
    }, {
        key: 'drawChess',
        value: function drawChess(flag, tar, tx, ty) {
            var y = ty || parseInt(tar.style.top),
                x = tx || parseInt(tar.style.left);
            var c = ~~((x - this.d / 2) / this.d),
                r = ~~((y - this.d / 2) / this.d);

            if (c < 0 || r < 0 || c >= this.c || r >= this.r || this.chessArr[r][c].flag !== 0) {
                return null;
            }
            tar.style.backgroundColor = flag === 1 ? 'white' : 'black';
            this.chessArr[r][c].flag = flag, this.chessArr[r][c].ele = tar;

            this.owner && this.owner.step && this.owner.step(this.chessArr[r][c]);
        }
    }, {
        key: 'clearChess',
        value: function clearChess(x, y) {
            var c = ~~((x - this.d / 2) / this.d),
                r = ~~((y - this.d / 2) / this.d);

            this.chessArr[r][c].ele.style.backgroundColor = 'transparent';
            this.chessArr[r][c].flag = 0;
        }
    }, {
        key: 'cancelChess',
        value: function cancelChess(x, y, flag) {
            var c = ~~((x - this.d / 2) / this.d),
                r = ~~((y - this.d / 2) / this.d);

            this.chessArr[r][c].ele.style.backgroundColor = flag === 1 ? 'white' : 'black';
            this.chessArr[r][c].flag = flag;
        }
    }, {
        key: 'drawLine',
        value: function drawLine(checkResult) {
            console.log(checkResult);
        }
    }]);

    return GoBang;
}();