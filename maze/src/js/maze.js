class Maze {
    constructor(r, c, id) {
        this.r = r;
        this.c = c;
        this.accessed = [];
        this.notAccessed = [];
        this.arr = [];

        this.init(id);
    }

    init(id) {
        if(this.r === 0 || this.c === 0) {
            return;
        }
        this.initArray();
        this.initCanvas(id);
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
        this.arr[1][0] = 0;
        this.arr[2 * this.r - 1][2 * this.c] = 0;
    }

    generate() {
        let count = this.r * this.c;
        let cur = MathUtil.randomInt(0, count);
        let offs = [-this.c, this.c, -1, 1],
            offr = [-1, 1, 0, 0],
            offc = [0, 0, -1, 1];
        this.accessed.push(cur);
        this.notAccessed[cur] = 1;

        while(this.accessed.length < count) {
            let tr = Math.floor(cur / this.c),
                tc = cur % this.c;
            let num = 0,
                off = -1;

            while(++num < 5) {
                let around = MathUtil.randomInt(0, 4),
                    nr = tr + offr[around],
                    nc = tc + offc[around];
                if(nr >= 0 && nc >= 0 && nr < this.r && nc < this.c && this.notAccessed[cur + offs[around]] === 0) {
                    off = around;
                    break;
                }
            }

            if(off < 0) {
                cur = this.accessed[MathUtil.randomInt(0, this.accessed.length)];
            }else {
                tr = 2 * tr + 1;
                tc = 2 * tc + 1;
                this.arr[tr + offr[off]][tc + offc[off]] = 0;
                cur = cur + offs[off];
                this.notAccessed[cur] = 1;
                this.accessed.push(cur);
            }
        }
    }

    initCanvas(id) {
        if(typeof id === 'string') {
            this.canvas = document.getElementById(id);
            this.ctx = this.canvas.getContext('2d');
        }else {
            this.createCanvas();
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
