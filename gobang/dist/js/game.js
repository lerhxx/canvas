'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Game = function () {
    function Game(aiModeTool) {
        _classCallCheck(this, Game);

        this.toolbar = new ToolBar({
            parent: document.getElementById('container'),
            owner: this,
            aiTool: aiModeTool
        });
        this.isAIMode = false;
        aiModeTool && this.toolbar.changeMode(1);

        this.playerChess = 2;
        this.aiChess = 1;
        this.curChess = this.playerChess;
        this.toolbar.changeCur(this.curChess === 1 ? 'white' : 'black');

        this.goBang = new GoBang({
            owner: this,
            r: 15,
            c: 15,
            d: 30
        });

        if (!this.goBang) {
            return;
        }

        this.steps = [];
        this.regrets = [];
        this.direction = ['checklr', 'checktb', 'checklt', 'checkrt'];
        this.weightDirection = ['checkWeightlr', 'checkWeighttb', 'checkWeightlt', 'checkWeightrt'];
        this.isEnd = false;
        this.isAI = false;

        this.regret = this.regret.bind(this);
        this.cancelRreget = this.cancelRreget.bind(this);
        this.aiPlay = this.aiPlay.bind(this);
    }

    /*
     * mode 1: aiMode 2: selfMode
     */


    _createClass(Game, [{
        key: 'changeMode',
        value: function changeMode(mode) {
            this.isAIMode = mode === 1 ? true : false;
        }
    }, {
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
                flag = chess.flag,
                sum = chessArr.length * chessArr[0].length;

            this.steps.push(chess);

            if (this.steps.length >= sum) {
                this.tied();
                return;
            }

            for (var i = 0, len = this.direction.length; i < len; ++i) {
                var checkResult = this[this.direction[i]](r, c, flag);
                if (checkResult.result) {
                    checkResult.flag = chess.flag;
                    this.end(checkResult);
                    return;
                }
            }
            this.changeCurChess();
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
                if (chessArr[r][i].flag === flag) {
                    ++count;
                    sc = i;
                } else {
                    break;
                }
            }
            for (var _i = c + 1; _i <= this.goBang.c; ++_i) {
                if (chessArr[r][_i].flag === flag) {
                    ++count;
                    ec = _i;
                } else {
                    break;
                }
            }
            if (count >= 5) {
                result = true;
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
                if (chessArr[i][c].flag === flag) {
                    ++count;
                    sr = i;
                } else {
                    break;
                }
            }
            for (var _i2 = r + 1; _i2 <= this.goBang.r; ++_i2) {
                if (chessArr[_i2][c].flag === flag) {
                    ++count;
                    er = _i2;
                } else {
                    break;
                }
            }
            if (count >= 5) {
                result = true;
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
                if (chessArr[i][n].flag === flag) {
                    ++count;
                    sr = i;
                    sc = n;
                } else {
                    break;
                }
            }
            for (var _i3 = r + 1, _n = c + 1; _i3 <= this.goBang.r && _n <= this.goBang.c; ++_i3, ++_n) {
                if (chessArr[_i3][_n].flag === flag) {
                    ++count;
                    er = _i3;
                    ec = _n;
                } else {
                    break;
                }
            }
            if (count >= 5) {
                result = true;
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

            for (var i = r - 1, n = c + 1; i >= 0 && n <= this.goBang.c; --i, ++n) {
                if (chessArr[i][n].flag === flag) {
                    ++count;
                    sr = i;
                    sc = n;
                } else {
                    break;
                }
            }
            for (var _i4 = r + 1, _n2 = c - 1; _i4 <= this.goBang.r && _n2 >= 0; ++_i4, --_n2) {
                if (chessArr[_i4][_n2].flag === flag) {
                    ++count;
                    er = _i4;
                    ec = _n2;
                } else {
                    break;
                }
            }
            if (count >= 5) {
                result = true;
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
            if (this.isEnd) {
                alert('游戏已结束');
                return;
            }
            if (this.steps.length === 0) {
                alert('棋盘上没有可以反悔的棋子了');
                return;
            }
            var i = 0,
                loop = this.isAIMode ? 2 : 1;
            while (i < loop) {
                var chess = this.steps.pop();
                this.regrets.push({
                    chess: chess,
                    oriFlag: chess.flag
                });

                this.goBang.clearChess(chess);
                ++i;
            }
        }
    }, {
        key: 'cancelRreget',
        value: function cancelRreget() {
            if (this.isEnd) {
                alert('游戏已结束');
                return;
            }
            if (this.regrets.length === 0) {
                alert('没有反悔的棋子哦');
                return;
            }
            var i = 0,
                loop = this.isAIMode ? 2 : 1;
            while (i < loop) {
                var newChess = this.regrets.pop();
                this.steps.push(newChess.chess);
                this.goBang.cancelChess(newChess, newChess.oriFlag);
                ++i;
            }
        }
    }, {
        key: 'restart',
        value: function restart() {
            console.log(this);
            this.goBang.restart();
            this.isEnd = false;
            this.regrets.length = 0;
            this.steps.length = 0;
            this.isAI = false;
            this.curChess = this.playerChess;
            this.toolbar.changeCur('black');
        }
    }, {
        key: 'changeCurChess',
        value: function changeCurChess() {
            this.curChess = this.curChess === 1 ? 2 : 1;
            this.toolbar.changeCur(this.curChess === 1 ? 'white' : 'black');
            this.isAI = this.isAIMode ? !this.isAI : false;
            if (this.isAIMode && this.isAI) {
                setTimeout(this.aiPlay, 500);
            }
        }
    }, {
        key: 'aiPlay',
        value: function aiPlay() {
            var chess = this.maxWeightChess();
            this.goBang.drawChess(chess.x, chess.y, this.curChess, 0);
        }
    }, {
        key: 'maxWeightChess',
        value: function maxWeightChess() {
            var chessArr = this.goBang.chessArr,
                chess = null,
                maxWeight = 0;
            for (var i = 0, len1 = chessArr.length; i < len1; ++i) {
                for (var n = 0, len2 = chessArr[0].length; n < len2; ++n) {
                    if (chessArr[i][n].flag === 0) {
                        var aiWeight = 0,
                            playWeight = 0,
                            weight = 0;
                        for (var j = 0, len = this.weightDirection.length; j < len; ++j) {
                            var aiResult = this[this.weightDirection[j]](i, n, this.aiChess);
                            var playResult = this[this.weightDirection[j]](i, n, this.playerChess);
                            aiWeight += this.calcWeight(aiResult);
                            playWeight += this.calcWeight(playResult);
                        }
                        weight = aiWeight > playWeight ? aiWeight : playWeight;
                        if (maxWeight < weight) {
                            maxWeight = weight;
                            chess = chessArr[i][n];
                        }
                    }
                }
            }
            return chess;
        }
    }, {
        key: 'checkWeightlr',
        value: function checkWeightlr(r, c, flag) {
            var chessArr = this.goBang.chessArr,
                count = 1,
                side1 = false,
                side2 = false;

            for (var i = c - 1; i >= 0; --i) {
                if (chessArr[r][i].flag === flag) {
                    ++count;
                } else {
                    if (chessArr[r][i].flag === 0) {
                        side1 = true;
                    }
                    break;
                }
            }
            for (var _i5 = c + 1; _i5 <= this.goBang.c; ++_i5) {
                if (chessArr[r][_i5].flag === flag) {
                    ++count;
                } else {
                    if (chessArr[r][_i5].flag === 0) {
                        side2 = true;
                    }
                    break;
                }
            }

            return {
                side1: side1,
                side2: side2,
                count: count
            };
        }
    }, {
        key: 'checkWeighttb',
        value: function checkWeighttb(r, c, flag) {
            var chessArr = this.goBang.chessArr,
                count = 1,
                side1 = false,
                side2 = false;

            for (var i = r - 1; i >= 0; --i) {
                if (chessArr[i][c].flag === flag) {
                    ++count;
                } else {
                    if (chessArr[i][c].flag === 0) {
                        side1 = true;
                    }
                    break;
                }
            }
            for (var _i6 = r + 1; _i6 <= this.goBang.r; ++_i6) {
                if (chessArr[_i6][c].flag === flag) {
                    ++count;
                } else {
                    if (chessArr[_i6][c].flag === 0) {
                        side2 = true;
                    }
                    break;
                }
            }

            return {
                side1: side1,
                side2: side2,
                count: count
            };
        }
    }, {
        key: 'checkWeightlt',
        value: function checkWeightlt(r, c, flag) {
            var chessArr = this.goBang.chessArr,
                count = 1,
                side1 = false,
                side2 = false;

            for (var i = r - 1, n = c - 1; i >= 0 && n >= 0; --i, --n) {
                if (chessArr[i][n].flag === flag) {
                    ++count;
                } else {
                    if (chessArr[i][n].flag === 0) {
                        side1 = true;
                    }
                    break;
                }
            }
            for (var _i7 = r + 1, _n3 = c + 1; _i7 <= this.goBang.r && _n3 <= this.goBang.c; ++_i7, ++_n3) {
                if (chessArr[_i7][_n3].flag === flag) {
                    ++count;
                } else {
                    if (chessArr[_i7][_n3].flag === 0) {
                        side2 = true;
                    }
                    break;
                }
            }

            return {
                side1: side1,
                side2: side2,
                count: count
            };
        }
    }, {
        key: 'checkWeightrt',
        value: function checkWeightrt(r, c, flag) {
            var chessArr = this.goBang.chessArr,
                count = 1,
                side1 = false,
                side2 = false;

            for (var i = r - 1, n = c + 1; i >= 0 && n <= this.goBang.c; --i, ++n) {
                if (chessArr[i][n].flag === flag) {
                    ++count;
                } else {
                    if (chessArr[i][n].flag === 0) {
                        side1 = true;
                    }
                    break;
                }
            }
            for (var _i8 = r + 1, _n4 = c - 1; _i8 <= this.goBang.r && _n4 >= 0; ++_i8, --_n4) {
                if (chessArr[_i8][_n4].flag === flag) {
                    ++count;
                } else {
                    if (chessArr[_i8][_n4].flag === 0) {
                        side2 = true;
                    }
                    break;
                }
            }

            return {
                side1: side1,
                side2: side2,
                count: count
            };
        }
    }, {
        key: 'calcWeight',
        value: function calcWeight(obj) {
            var weight = 0,
                count = obj.count,
                side1 = obj.side1,
                side2 = obj.side2;
            switch (count) {
                case 1:
                    if (side1 && side2) {
                        weight = this.isAI ? 15 : 10;
                    }
                    break;
                case 2:
                    if (side1 && side2) {
                        weight = this.isAI ? 100 : 50;
                    } else if (side1 || side2) {
                        weight = this.isAI ? 10 : 5;
                    }
                    break;
                case 3:
                    if (side1 && side2) {
                        weight = this.isAI ? 500 : 200;
                    } else if (side1 || side2) {
                        weight = this.isAI ? 30 : 20;
                    }
                    break;
                case 4:
                    if (side1 && side2) {
                        weight = this.isAI ? 5000 : 2000;
                    } else if (side1 || side2) {
                        weight = this.isAI ? 400 : 100;
                    }
                    break;
                case 5:
                    weight = this.isAI ? 1000000 : 10000;
                default:
                    weight = this.isAI ? 500000 : 250000;
            }
            return weight;
        }
    }, {
        key: 'drawLine',
        value: function drawLine(res) {
            this.goBang.drawLine(res);
        }
    }, {
        key: 'end',
        value: function end(checkResult) {
            this.isEnd = true;
            this.drawLine(checkResult);
            var color = checkResult.flag === 1 ? '白' : '黑';
            setTimeout(function () {
                alert(color + '\u68CB\u624B\u80DC');
            }, 500);
        }
    }, {
        key: 'tied',
        value: function tied() {
            this.isEnd = true;
            setTimeout(function () {
                alert('平局');
            }, 500);
        }
    }]);

    return Game;
}();