class Maze {
    constructor(r, c) {
        this.r = r;
        this.c = c;
        this.accessed = [];
        this.notAccessed = [];
        this.arr = [];

        this.init()
    }

    init() {
        if(this.r === 0 || this.c === 0) {
            return;
        }
        this.initArray();
        this.createCanvas();
        this.generate();
        this.render();
    }

    initArray() {
        for(let i = 0; i < 2 * this.r + 1; ++i) {
            this.arr[i] = [];
            for(let n = 0; n < 2 * this.c + 1; ++n) {
                if((n ^ (n - 1)) === 1 && (i ^ (i - 1)) === 1) {
                    this.arr[i][n] = 0;
                    this.notAccessed.push(0);
                }else {
                    this.arr[i][n] = 1;
                }
            }
        }
        // this.arr[1][0] = 0;
        // this.arr[2 * this.r - 1][2 * this.c] = 0;
    }

    generate() {
        let count = this.r * this.c;
        let pos = MathUtil.randomInt(0, count);
        let offs = [-this.c, this.c, -1, 1],
            offr = [-1, 1, 0, 0],
            offc = [0, 0, -1, 1];
        this.accessed.push(pos);

        while(this.accessed.length < count) {
            let tar = this.notAccessed[pos];
            let tr = Math.floor(pos / this.c),
                tc = pos % this.c;
            let num = 0,
                off = -1;
            while(++num < 5) {
                let around = MathUtil.randomInt(0, 4),
                    nr = tr + offr[around],
                    nc = tc + offc[around];
                if(nr >= 0 && nc >= 0 && nr < this.r && nc < this.c && this.notAccessed[pos + offs[around]] === 0) {
                    off = around;
                    break;
                }
            }

            if(off < 0) {
                pos = this.accessed[MathUtil.randomInt(0, this.accessed.length)];
            }else {
                tr = 2 * tr + 1;
                tc = 2 * tc + 1;
                this.arr[tr + offr[off]][tc + offc[off]] = 0;
                pos = pos + offs[off];
                this.notAccessed[pos] = 1;
                this.accessed.push(pos);
            }
        }
    }
    
    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');

        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        document.body.appendChild(this.canvas);

    }

    render() {
        this.arr.forEach((value, i) => {
            value.forEach((item, n) => {
                this.ctx.save();
                this.ctx.beginPath();
                this.ctx.fillStyle = item === 1 ? 'black' : 'white';
                this.ctx.rect(n * 10, i * 10, 10, 10);
                this.ctx.fill();
                this.ctx.closePath();
                this.ctx.restore();
            })
        })
    }
}

let MathUtil = {
    randomInt: (a, b) => {
        if(b === 'undefined') {
            a = a || 1;
            return Math.floor(Math.random() * a);
        }else {
            return Math.floor(Math.random() * (b - a) + a);
        }
    }
}

new Maze(10, 10);
