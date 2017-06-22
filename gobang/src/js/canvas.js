class CanvasChess extends Chess {
    constructor(obj={}, r, c) {
        super(obj);

        this.r = r;
        this.c = c;

    }
    
    draw() {
        let ctx = this.owner.ctx;
        ctx.fillStyle = this.owner.fillColor;
        ctx.fillRect(this.x - this.radius, this.y - this.radius, 2 * this.radius, 2 * this.radius);
        if(this.flag === 0) {
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

    clear() {
        let ctx = this.owner.ctx;
        let x = this.x + .5,
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
}

class GoBang {
    constructor(obj={}) {
        this.d = 40;     //间隔
        this.id = 'canvas';
        this.fillColor = '#964f0a';
        this.strokeColor = 'black';
        this.owner = null;

        Object.assign(this, obj);

        this.r = this.r >= 4 ? this.r : 4;
        this.c = this.c >= 4 ? this.c : 4;

        this.getContext();
        if(!this.ctx) {
            console.error("Your broswer doesn't support canvas");
            return null;
        }

        this.chessArr = [];

        this.canvasEvent = this.canvasEvent.bind(this);

        this.init();
        console.log('canvas')
    }

    getContext() {
        this.canvas = document.getElementById(this.id);
        this.ctx = this.canvas.getContext('2d');

        this.canvas.width = (this.c + 1) * this.d;
        this.canvas.height = (this.r + 1) * this.d;
    }

    init() {
        this.initChessBoard();
        this.initChess();
        this.bindEvent();
    }

    bindEvent() {
        this.canvas.addEventListener('click', this.canvasEvent);
    }

    canvasEvent(e) {
        if(!this.owner.isAI && !this.owner.isEnd) {
            let flag = this.owner ? this.owner.curChess : 1;
            this.drawChess(e.offsetX, e.offsetY, flag, 0);
        }
    }
    
    initChessBoard() {
        let i = 0,
            n = 0,
            rad = this.d / 2,
            w = this.d * this.c + this.d - rad,
            h = this.d * this.r + this.d - rad;

        this.ctx.fillStyle = this.fillColor;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.strokeStyle = this.strokeColor;
        for(; i <= this.r && n <= this.c; ++i, ++n) {
            this.drawDimen(i, rad, w);
            this.drawLong(n, rad, h)
        }
        while(i <= this.r) {
            this.drawDimen(i, rad, w);
            ++i;
        }
        while(n <= this.c) {
            this.drawLong(n, rad, h);
            ++n;
        }
    }

    drawDimen(i, s, e) {
        let y = this.d * i + .5 + this.d / 2;
        this.ctx.beginPath();
        this.ctx.moveTo(s, y);
        this.ctx.lineTo(e, y);
        this.ctx.stroke();
    }

    drawLong(n, s, e) {
        let x = this.d * n + .5 + this.d / 2;
        this.ctx.beginPath();
        this.ctx.moveTo(x, s);
        this.ctx.lineTo(x, e);
        this.ctx.stroke();
    }

    initChess() {
        let rad = this.d / 2;
        for(let i = 0; i <= this.r; ++i) {
            this.chessArr[i] = [];
            for(let n = 0; n <= this.c; ++n) {
                this.chessArr[i][n] = new CanvasChess({
                    x: this.d * n + rad, 
                    y: this.d * i + rad,
                    radius: this.d / 2 - 5,
                    flag: 0,
                    owner: this
                }, i, n)
            }
        }
    }

    // type 0 新下的棋，1 悔棋, 2 撤销悔棋
    drawChess(x, y, flag, type) {
        let c = ~~(x / this.d),
            r = ~~(y / this.d);

        if(c < 0 || r < 0 || c > this.c || r > this.r || type === 0 && this.chessArr[r][c].flag !== 0) {
            return null;
        }

        this.chessArr[r][c].flag = flag;
        this.chessArr[r][c].draw();

        if(type === 0) {
            this.owner && this.owner.step && this.owner.step(this.chessArr[r][c]);
        }
    }

    clearChess(x, y) {
        this.drawChess(x, y, 0, 1);
    }

    cancelChess(x, y, flag) {
        this.drawChess(x, y, flag, 2);
    }

    restart() {
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.initChessBoard();
        this.chessArr.forEach(row => {
            row.forEach(col => {
                col.flag = 0;
            })
        })
        this.bindEvent();
    }

    drawLine(res) {
        let ctx = this.ctx,
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
}