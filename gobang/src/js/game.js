class Game {
    constructor() {
        this.toolbar = new ToolBar({
            parent: document.getElementById('container'), 
            owner: this
        });
        this.curChess = 2;
        this.toolbar.changeCur(this.curChess === 1 ? 'white' : 'black');

        this.goBang = new GoBang({
            owner: this,
            r: 15,
            c: 15,
            d: 30
        });

        if(!this.goBang) {
            return;
        }

        this.steps = [];
        this.regrets = [];
        this.direction = ['checklr', 'checktb', 'checklt', 'checkrt'];
        this.isEnd = false;

        this.regret = this.regret.bind(this);
        this.cancelRreget = this.cancelRreget.bind(this);

    }

    step(chess) {
        if(chess) {
            this.checkGmae(chess);
        }
        if(this.regrets.length !== 0) {
            this.regrets.length = 0;
        }
    }

    checkGmae(chess) {
        let chessArr = this.goBang.chessArr,
            count = 0,
            r = chess.r,
            c = chess.c,
            flag = chess.flag,
            sum = chessArr.length * chessArr[0].length;

        this.steps.push(chess);

        if(this.steps.length >= sum) {
            this.tied();
            return;
        }

        for(let i = 0, len = this.direction.length; i < len; ++i) {
            let checkResult = this[this.direction[i]](r, c, flag);
            if(checkResult.result) {
                checkResult.flag = chess.flag;
                this.end(checkResult);
                return;
            }
        }
        this.changeCurChess();
    }

    checklr(r, c, flag) {
        let chessArr = this.goBang.chessArr,
            count = 1,
            sc = c,
            ec = c,
            result = false;

        for(let i = c - 1; i >= 0; --i) {
            if(chessArr[r][i].flag === flag) {
                ++count;
                sc = i;
            }else {
                break;
            }
        }
        for(let i = c + 1; i <= this.goBang.c; ++i) {
            if(chessArr[r][i].flag === flag) {
                ++count;
                ec = i;
            }else {
                break;
            }
        }
        if(count >= 5) {
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

    checktb(r, c, flag) {
        let chessArr = this.goBang.chessArr,
            count = 1,
            sr = r,
            er = r,
            result = false;

        for(let i = r - 1; i >= 0; --i) {
            if(chessArr[i][c].flag === flag) {
                ++count;
                sr = i;
            }else {
                break;
            }
        }
        for(let i = r + 1; i <= this.goBang.r; ++i) {
            if(chessArr[i][c].flag === flag) {
                ++count;
                er = i;
            }else {
                break;
            }
        }
        if(count >= 5) {
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

    checklt(r, c, flag) {
        let chessArr = this.goBang.chessArr,
            count = 1,
            sr = r,
            sc = c,
            er = r,
            ec = c,
            result = false;

        for(let i = r - 1, n = c - 1; i >= 0 && n >= 0; --i, --n) {
            if(chessArr[i][n].flag === flag) {
                ++count;
                sr = i;
                sc = n;
            }else {
                break;
            }
        }
        for(let i = r + 1, n = c + 1; i <= this.goBang.r && n <= this.goBang.c; ++i, ++n) {
            if(chessArr[i][n].flag === flag) {
                ++count;
                er = i;
                ec = n;
            }else {
                break;
            }
        }
        if(count >= 5) {
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

    checkrt(r, c, flag) {
        let chessArr = this.goBang.chessArr,
            count = 1,
            sr = r,
            sc = c,
            er = r,
            ec = c,
            result = false;

        for(let i = r - 1, n = c + 1; i >= 0 && n <= this.goBang.c; --i, ++n) {
            if(chessArr[i][n].flag === flag) {
                ++count;
                sr = i;
                sc = n;
            }else {
                break;
            }
        }
        for(let i = r + 1, n = c - 1; i <= this.goBang.r && n >= 0; ++i, --n) {
            if(chessArr[i][n].flag === flag) {
                ++count;
                er = i;
                ec = n;
            }else {
                break;
            }
        }
        if(count >= 5) {
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

    regret() {
        if(this.isEnd) {
            alert('游戏已结束');
            return;
        }
        if(this.steps.length === 0) {
            alert('棋盘上没有可以反悔的棋子了');
            return;
        }
        let chess = this.steps.pop();
        this.regrets.push({
            chess: chess,
            oriFlag: chess.flag
        });

        this.goBang.clearChess(chess);
        this.changeCurChess();
    }

    cancelRreget() {
        if(this.isEnd) {
            alert('游戏已结束');
            return;
        }
        if(this.regrets.length === 0) {
            alert('没有反悔的棋子哦');
            return;
        }
        let newChess = this.regrets.pop();
        this.steps.push(newChess.chess);
        this.goBang.cancelChess(newChess, newChess.oriFlag);
        this.changeCurChess();
    }

    restart() {
        this.goBang.restart();
        this.isEnd = false;
        this.regrets.length = 0;
        this.steps.length = 0;
    }

    changeCurChess() {
        this.curChess = this.curChess === 1 ? 2 : 1;
        this.toolbar.changeCur(this.curChess === 1 ? 'white' : 'black');
    }

    drawLine(res) {
        this.goBang.drawLine(res)
    }

    end(checkResult) {
        this.isEnd = true;
        this.drawLine(checkResult);
        let color = checkResult.flag === 1 ? '白' : '黑';
        setTimeout(() => {
            alert(`${color}棋手胜`);
        }, 500)
    }

    tied() {
        this.isEnd = true;
        setTimeout(() => {
            alert('平局');
        }, 500)
    }
}