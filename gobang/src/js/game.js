class Game {
    constructor() {
        this.toolbar = new ToolBar({
            parent: document.getElementById('container'), 
            owner: this
        });
        this.curChess = 1;
        this.toolbar.changeCur(this.curChess === 1 ? 'white' : 'black');

        this.goBang = new GoBang({
            owner: this,
            r: 15,
            c: 15
        });

        if(!this.goBang) {
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
        if(this.steps.length === 0) {
            alert('棋盘上没有可以反悔的棋子了');
            return;
        }
        let chess = this.steps.pop();
        this.regrets.push({
            chess: chess,
            oriFlag: chess.flag
        });

        this.goBang.clearChess(chess.x, chess.y);
        this.changeCurChess();
    }

    cancelRreget() {
        if(this.regrets.length === 0) {
            alert('没有反悔的棋子哦');
            return;
        }
        let chess = this.regrets.pop();
        this.steps.push(chess.chess);
        this.goBang.cancelChess(chess.chess.x, chess.chess.y, chess.oriFlag);
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
        this.isAI = !this.isAI;
        if(this.isAI) {
            this.aiPlay();
        }
    }

    aiPlay() {
        let chess = this.maxWeightChess();
        this.goBang.drawChess(chess.x, chess.y, this.curChess, 0);
    }

    maxWeightChess() {
        let chessArr = this.goBang.chessArr,
            chess = null,
            maxWeight = 0;
        for(let i = 0, len1 = chessArr.length; i < len1; ++i) {
            for(let n = 0, len2 = chessArr[0].length; n < len2; ++n) {
                if(chessArr[i][n].flag === 0) {
                    let weight = 0;
                    for(let j = 0, len = this.weightDirection.length; j < len; ++j) {
                        let result = this[this.weightDirection[j]](i, n, this.curChess);
                        weight += this.calcWeight(result);
                    }
                    if(maxWeight < weight) {
                        maxWeight = weight;
                        chess = chessArr[i][n];
                    }
                    console.log(`i ${i} n ${n} w ${weight}`)
                }
            }
        }
        return chess;
    }

    checkWeightlr(r, c, flag) {
        let chessArr = this.goBang.chessArr,
            count = 1,
            side1 = false,
            side2 = false;

        for(let i = c - 1; i >= 0; --i) {
            if(chessArr[r][i].flag === flag) {
                ++count;
            }else {
                if(chessArr[r][i].flag === 0) {
                    side1 = true;
                }
                break;
            }
        }
        for(let i = c + 1; i <= this.goBang.c; ++i) {
            if(chessArr[r][i].flag === flag) {
                ++count;
            }else {
                if(chessArr[r][i].flag === 0) {
                    side2 = true;
                }
                break;
            }
        }

        return {
            side1,
            side2,
            count
        };
    }

    checkWeighttb(r, c, flag) {
        let chessArr = this.goBang.chessArr,
            count = 1,
            side1 = false,
            side2 = false;

        for(let i = r - 1; i >= 0; --i) {
            if(chessArr[i][c].flag === flag) {
                ++count;
            }else {
                if(chessArr[i][c].flag === 0) {
                    side1 = true;
                }
                break;
            }
        }
        for(let i = r + 1; i <= this.goBang.r; ++i) {
            if(chessArr[i][c].flag === flag) {
                ++count;
            }else {
                if(chessArr[i][c].flag === 0) {
                    side2 = true;
                }
                break;
            }
        }

        return {
            side1,
            side2,
            count
        };
    }

    checkWeightlt(r, c, flag) {
        let chessArr = this.goBang.chessArr,
            count = 1,
            side1 = false,
            side2 = false;

        for(let i = r - 1, n = c - 1; i >= 0 && n >= 0; --i, --n) {
            if(chessArr[i][n].flag === flag) {
                ++count;
            }else {
                if(chessArr[i][n].flag === 0) {
                    side1 = true;
                }
                break;
            }
        }
        for(let i = r + 1, n = c + 1; i <= this.goBang.r && n <= this.goBang.c; ++i, ++n) {
            if(chessArr[i][n].flag === flag) {
                ++count;
            }else {
                if(chessArr[i][n].flag === 0) {
                    side2 = true;
                }
                break;
            }
        }

        return {
            side1,
            side2,
            count
        };
    }

    checkWeightrt(r, c, flag) {
        let chessArr = this.goBang.chessArr,
            count = 1,
            side1 = false,
            side2 = false;

        for(let i = r - 1, n = c + 1; i >= 0 && n <= this.goBang.c; --i, ++n) {
            if(chessArr[i][n].flag === flag) {
                ++count;
            }else {
                if(chessArr[i][n].flag === 0) {
                    side1 = true;
                }
                break;
            }
        }
        for(let i = r + 1, n = c - 1; i <= this.goBang.r && n >= 0; ++i, --n) {
            if(chessArr[i][n].flag === flag) {
                ++count;
            }else {
                if(chessArr[i][n].flag === 0) {
                    side2 = true;
                }
                break;
            }
        }

        return {
            side1,
            side2,
            count
        };
    }

    calcWeight(obj) {
        let weight = 0,
            count = obj.count,
            side1 = obj.side1,
            side2 = obj.side2;
        switch(count) {
            case 1:
                if(side1 && side2) {
                    weight = this.isAI ? 15 : 10; 
                }
                break;
            case 2:
                if(side1 && side2) {
                    weight = this.isAI ? 100 : 50; 
                }else if(side1 || side2) {
                    weight = this.isAI ? 10 : 5; 
                }
                break;
            case 3:
                if(side1 && side2) {
                    weight = this.isAI ? 500 : 200; 
                }else if(side1 || side2) {
                    weight = this.isAI ? 30 : 20; 
                }
                break;
            case 4:
                if(side1 && side2) {
                    weight = this.isAI ? 5000 : 2000; 
                }else if(side1 || side2) {
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

