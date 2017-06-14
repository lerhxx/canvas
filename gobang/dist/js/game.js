'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Game = function () {
    function Game() {
        _classCallCheck(this, Game);

        this.toolbar = new ToolBar({
            parent: document.getElementById('container'),
            owner: this
        });
        this.curChess = 1;
        this.toolbar.changeCur(this.curChess === 1 ? 'white' : 'black');

        this.goBang = new GoBang({
            owner: this
        });

        this.steps = [];
        this.regrets = [];
        this.direction = ['checklr', 'checktb', 'checklt', 'checkrt'];

        this.regret = this.regret.bind(this);
        this.cancelRreget = this.cancelRreget.bind(this);
    }

    _createClass(Game, [{
        key: 'step',
        value: function step(chess) {
            if (chess) {
                this.checkGmae(chess);
            }
            if (this.regrets.length !== 0) {
                this.regrets.length = 0;
            }
        }
    }, {
        key: 'checkGmae',
        value: function checkGmae(chess) {
            var chessArr = this.goBang.chessArr,
                count = 0,
                r = chess.r,
                c = chess.c,
                flag = chess.flag;

            for (var i = 0, len = this.direction.length; i < len; ++i) {
                var checkResult = this[this.direction[i]](r, c, flag);
                if (checkResult.result) {
                    checkResult.flag = chess.flag;
                    this.end(checkResult);
                    return;
                }
            }
            this.changeCurChess();
            this.steps.push(chess);
        }
    }, {
        key: 'checklr',
        value: function checklr(r, c, flag) {
            var chessArr = this.goBang.chessArr,
                count = 1,
                sc = c,
                ec = c,
                result = false;

            for (var i = c - 1; i >= 0; --i) {
                if (chessArr[r][i].flag !== flag) {
                    break;
                }
                ++count;
                sc = i;
                if (count >= 5) {
                    result = true;
                    break;
                }
            }
            for (var _i = c + 1; _i < this.goBang.c; ++_i) {
                if (chessArr[r][_i].flag !== flag) {
                    break;
                }
                ++count;
                ec = _i;
                if (count >= 5) {
                    result = true;
                    break;
                }
            }

            return {
                sr: r,
                sc: sc,
                er: r,
                ec: ec,
                result: result
            };
        }
    }, {
        key: 'checktb',
        value: function checktb(r, c, flag) {
            var chessArr = this.goBang.chessArr,
                count = 1,
                sr = r,
                er = r,
                result = false;

            for (var i = r - 1; i >= 0; --i) {
                if (chessArr[i][c].flag !== flag) {
                    break;
                }
                ++count;
                sr = i;
                if (count >= 5) {
                    result = true;
                    break;
                }
            }
            for (var _i2 = r + 1; _i2 < this.goBang.r; ++_i2) {
                if (chessArr[_i2][c].flag !== flag) {
                    break;
                }
                ++count;
                er = _i2;
                if (count >= 5) {
                    result = true;
                    break;
                }
            }

            return {
                sr: sr,
                sc: c,
                er: er,
                ec: c,
                result: result
            };
        }
    }, {
        key: 'checklt',
        value: function checklt(r, c, flag) {
            var chessArr = this.goBang.chessArr,
                count = 1,
                sr = r,
                sc = c,
                er = r,
                ec = c,
                result = false;

            for (var i = r - 1, n = c - 1; i >= 0 && n >= 0; --i, --n) {
                if (chessArr[i][n].flag !== flag) {
                    break;
                }
                ++count;
                sr = i;
                sc = n;
                if (count >= 5) {
                    result = true;
                    break;
                }
            }
            for (var _i3 = r + 1, _n = c + 1; _i3 < this.goBang.r && _n < this.goBang.c; ++_i3, ++_n) {
                if (chessArr[_i3][_n].flag !== flag) {
                    break;
                }
                ++count;
                er = _i3;
                ec = _n;
                if (count >= 5) {
                    result = true;
                    break;
                }
            }

            return {
                sr: sr,
                sc: sc,
                er: er,
                ec: ec,
                result: result
            };
        }
    }, {
        key: 'checkrt',
        value: function checkrt(r, c, flag) {
            var chessArr = this.goBang.chessArr,
                count = 1,
                sr = r,
                sc = c,
                er = r,
                ec = c,
                result = false;

            for (var i = r - 1, n = c + 1; i >= 0 && n < this.goBang.c; --i, ++n) {
                if (chessArr[i][n].flag !== flag) {
                    break;
                }
                ++count;
                sr = i;
                sc = n;
                if (count >= 5) {
                    result = true;
                    break;
                }
            }
            for (var _i4 = r + 1, _n2 = c - 1; _i4 < this.goBang.r && _n2 >= 0; ++_i4, --_n2) {
                if (chessArr[_i4][_n2].flag !== flag) {
                    break;
                }
                ++count;
                er = _i4;
                ec = _n2;
                if (count >= 5) {
                    result = true;
                    break;
                }
            }

            return {
                sr: sr,
                sc: sc,
                er: er,
                ec: ec,
                result: result
            };
        }
    }, {
        key: 'regret',
        value: function regret() {
            if (this.steps.length === 0) {
                alert('棋盘上没有可以反悔的棋子了');
                return;
            }
            var chess = this.steps.pop();
            this.regrets.push({
                chess: chess,
                oriFlag: chess.flag
            });

            this.goBang.clearChess(chess.x, chess.y);
            this.changeCurChess();
        }
    }, {
        key: 'cancelRreget',
        value: function cancelRreget() {
            if (this.regrets.length === 0) {
                alert('没有反悔的棋子哦');
                return;
            }
            var chess = this.regrets.pop();
            this.steps.push(chess.chess);
            this.goBang.cancelChess(chess.chess.x, chess.chess.y, chess.oriFlag);
            this.changeCurChess();
        }
    }, {
        key: 'changeCurChess',
        value: function changeCurChess() {
            this.curChess = this.curChess === 1 ? 2 : 1;
            this.toolbar.changeCur(this.curChess === 1 ? 'white' : 'black');
        }
    }, {
        key: 'drawLine',
        value: function drawLine(res) {
            this.goBang.drawLine(res);
        }
    }, {
        key: 'end',
        value: function end(checkResult) {
            this.goBang.removeEvent();
            this.drawLine(checkResult);
            var color = checkResult.flag === 1 ? '白' : '黑';
            setTimeout(function () {
                alert(color + '\u68CB\u624B\u80DC');
            }, 500);
        }
    }]);

    return Game;
}();