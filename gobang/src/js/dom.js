class DomChess extends Chess {
    constructor(obj={}, r, c) {
        super(obj);

        this.r = r;
        this.c = c;
        this.ele = null;
    }

    draw(color) {
        this.ele.style.backgroundColor = color;
    }
}

class GoBang {
    constructor(obj={}) {
        this.id = 'panel';
        this.owner = null;

        Object.assign(this, obj);

        this.r = this.r >= 4 ? this.r : 4;
        this.c = this.c >= 4 ? this.c : 4;

        this.d = this.d > 0 ? this.d : 30;     // 棋盘间隔
        this.ra = this.ra > 0 ? this.ra : 20;  // 棋子半径
        this.chessArr = [];
        this.parent = document.getElementById(this.id);
        if(!parent) {
            console.error('There is no container');
            return;
        }

        this.parentEvent = this.parentEvent.bind(this);
        this.win = document.getElementById('win');

        this.init();
        this.bindEvent();
        console.log('dom')
    }

    init() {
        this.initChessBoard();
        this.initChessArr();
    }

    initChessBoard() {
        let str = '<div class="table">',
            strdiv = '<div class="chess-box">',
            rd = this.ra / 2,
            i;
        for(i = 0; i < this.r; ++i) {
            str += `<div class="tr" style="height: ${this.d}px;">`;
            for(let n = 0; n <= this.c; ++n) {
                if(n < this.c && i < this.r) {
                    str += `<div class="td" style="width:${this.d}px;height:${this.d}px;"></div>`;
                }
                strdiv += `<div class='chess' style='top: ${i * this.d + 20 - rd}px;left: ${n * this.d + 20 - rd}px;width:${this.ra}px;height:${this.ra}px;'></div>`;
            }
            str += '</div>';
        }
        for(let n = 0; n <= this.c; ++n) {
            strdiv += `<div class='chess' style='top: ${i * this.d + 20 - rd}px;left: ${n * this.d + 20 - rd}px;width:${this.ra}px;height:${this.ra}px;'></div>`;
        }
        str += '</div>' + strdiv + '</div>';

        this.parent.innerHTML = str;
    }

    initChessArr() {
        for(let i = 0; i <= this.r; ++i) {
            this.chessArr[i] = [];
            for(let n = 0; n <= this.c; ++n) {
                this.chessArr[i][n] = new DomChess({
                    x: this.d * n, 
                    y: this.d * i,
                    flag: 0,
                    owner: this
                }, i, n)
            }
        }
        console.log(this.chessArr)
    }

    bindEvent() {
        this.parent.addEventListener('click', this.parentEvent)
    }

    parentEvent(e) {
        if(e.target !== this.parent && e.target.classList.contains('chess') && !this.owner.isEnd) {
            let flag = this.owner ? this.owner.curChess : 1;
            this.drawChess(flag, e.target);
        }
    }

    drawChess(flag, tar, tx, ty) {
        let y = ty || parseInt(tar.style.top),
            x = tx || parseInt(tar.style.left);
        let c = ~~(x / this.d),
            r = ~~(y / this.d);

        if(c < 0 || r < 0 || c > this.c || r > this.r || this.chessArr[r][c].flag !== 0) {
            return null;
        }
        this.chessArr[r][c].flag = flag,
        this.chessArr[r][c].ele = tar;
        this.chessArr[r][c].draw(flag === 1 ? 'white' : 'black');

        this.owner && this.owner.step && this.owner.step(this.chessArr[r][c]);
    }

    clearChess(chess) {
        this.chessArr[chess.r][chess.c].ele.style.backgroundColor = 'transparent';
        this.chessArr[chess.r][chess.c].flag = 0;
    }

    cancelChess(newChess, flag) {
        let chess = newChess.chess;
        this.chessArr[chess.r][chess.c].ele.style.backgroundColor = flag === 1 ? 'white' : 'black';
        this.chessArr[chess.r][chess.c].flag = flag;
    }

    restart() {
        this.chessArr.forEach(row => {
            row.forEach(col => {
                col.flag = 0;
                if(col.ele) {
                    col.draw('transparent');
                    col.ele = null;
                }
            })
        })
        this.win.classList.add('hide');
        this.bindEvent();
        this.win.className = 'hide';
    }

    drawLine(checkResult) {
        let win = this.win,
            list = win.classList;
        let sr = checkResult.sr,
            sc = checkResult.sc,
            er = checkResult.er,
            ec = checkResult.ec,
            top = 0,
            left = 0,
            width = Math.abs(sc - ec) * this.d;
        if(sr < er && sc === ec) {
            width = Math.abs(sr - er) * this.d;
            win.classList.add('vertical');
            win.style.width = `${width}px`;
            left += 5;
        }else if(sr < er && sc < ec) {
            win.classList.add('blackslash');
            win.style.width = `${width * 1.45}px`;
            top -= 5;
        }else if(sr < er && sc > ec) {
            win.classList.add('slash');
            win.style.width = `${width * 1.45}px`;
            left += 5;
        }else if(sr === er && sc < ec){
            win.style.width = `${width}px`;
        }
        top += sr * this.d + this.r;
        win.style.top = `${top}px`;
        win.style.left = `${left}px`;
        list.remove('hide');
    }
}