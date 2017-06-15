class Mcard extends Card {
    constructor(obj) {
        super(obj);

        this.deg = 0;
        this.rId = null;
        this.isBack = true;

        this.rotate = this.rotate.bind(this);
    }

    rotate() {
        this.rId = requestAnimationFrame(this.rotate);
        if(this.deg >= 180) {
            cancelAnimationFrame(this.rId);
            this.deg = 0;
            this.isBack = !this.isBack;
        }
        this.deg += 10;

        this.render();
    }

    render() {
        let ctx = this.owner.ctx;
        ctx.clearRect(this.cx, this.cy, this.cw, this.ch);
        ctx.save();
        ctx.beginPath();
        this.rotateImg();
        ctx.closePath();
        ctx.restore();
    }

    rotateImg() {
        let cw = this.cw * Math.cos(this.deg * Math.PI / 180),
            cx = this.cx + (this.cw - cw) / 2;
        let img = null;

        if(this.deg > 90) {
            img = this.isBack ? this.img : this.backImg;
        }else {
            img = this.isBack ? this.backImg : this.img;
        }
        this.owner.ctx.drawImage(img, 0, 0, this.w, this.h, cx, this.cy, cw, this.ch);
    }
}

class Match {
    constructor(opt) {
        this.r = 5;
        this.c = 4;
        this.pathArr = [];

        //图片资源
        this.imgSource = ['card1.jpg', 'card2.jpg', 'card3.jpg', 'card4.jpg', 'card5.jpg', 'card6.jpg', 'card7.jpg', 'card8.jpg', 'card9.jpg', 'back.jpg'];
        this.images = [];      // 缓存图片
        this.imgMR = 10;         // 图片垂直间距
        this.imgMC = 15;         // 图片水平间距

        Object.assign(this, opt);

        if(typeof this.id !== 'string') {
            console.error('There is no id.');
            return;
        }
        if(this.r * this.c % 2 !== 0) {
            console.error('Please enter at least one even number.');
            return;
        }
        this.getCanvas(this.id);
        if(!this.canvas || !this.ctx) {
            return;
        }
        console.log('start');

        this.match = [];
        this.matched = 0;
        this.scoreIn = document.getElementById('score');
        this.score = 0;

        this.bindEvent = this.bindEvent.bind(this);
        this.addEvent = this.addEvent.bind(this);
        this.removeEvent = this.removeEvent.bind(this);
        this.changeMaze = this.changeMaze.bind(this);
        this.initMaze = this.initMaze.bind(this);

        this.preLoadImg();
        this.initMaze();

        let self = this;

        document.getElementById('start').addEventListener('click', function() {
            this.parentNode.style.display = 'none';
            self.startTime = new Date().getTime();
        })
    }

    start() {
        this.initMaze();
    }

    getCanvas(id) {
        this.canvas = document.getElementById(id);
        if(!this.canvas) {
            console.error(`There is no canvas that id is ${id}`);
            return;
        }
        this.ctx = this.canvas.getContext('2d');
    }

    // 预处理图片
    preLoadImg() {
        let pr = [];
        this.imgSource = this.imgSource.map((source, i) => {
            // 处理图片src
            if(!/^http(s)?:\/\//.test(source)) {
                source = `./dist/img/${source}`;
            }

            // 背面图片最后处理
            if(i !== this.imgSource.length - 1) {
                // 预加载图片
                let p = PreLoadImg.loadImage(source)
                            .then(img => this.images.push(img))
                            .catch(err => console.log(err))
                pr.push(p);
            }
            return source;
        })

        this.preLoadAllImg(pr);

    }

    preLoadAllImg(pr) {
        // 图片全部加载完
        PreLoadImg.allLoadDone(pr)
                .then(() => {
                    pr = null;
                    // 加载背面
                    PreLoadImg.loadImage(this.imgSource[this.imgSource.length - 1])
                            .then((img) => {
                                this.images.push(img);
                                this.changeMaze();
                            })
                    console.log(this.images.length);
                });
    }

    initMaze() {
        for(let i = 0; i < this.r; ++i) {
            this.pathArr[i] = [];
            for(let n = 0; n < this.c; ++n) {
                this.pathArr[i][n] = new Mcard({
                    r: i,
                    c: n
                });
            }
        }
    }

    changeMaze() {
        console.log(this)
        if(this.pathArr.length < 0) {
            console.log('There is no pathArr');
            return;
        }

        let sum = this.images.length - 2,
            backImg = this.images[this.images.length - 1];
        this.imgRW = ~~((this.canvas.width - this.imgMC * this.c -this.imgMC) / this.c);         // canvas中图片实际宽度
        this.imgRH = ~~((this.canvas.height  - this.imgMR * this.r -this.imgMR)/ this.r);         // canvas中图片实际高度

        for(let i = 0, len = this.r * this.c / 2; i < len; ++i) {
            let index = MathUtil.randomInt(sum),
                num = 0;

            // 成对修改图片索引
            while(num < 2) {
                let r = MathUtil.randomInt(this.r),
                    c = MathUtil.randomInt(this.c),
                    card = this.pathArr[r][c],
                    img = this.images[index];

                if(card.picIndex < 0) {
                    card.picIndex = index;
                    card.w = img.width;
                    card.h = img.height;
                    card.cw = this.imgRW;
                    card.ch = this.imgRH;
                    card.cx = card.c * (card.cw + this.imgMC) + this.imgMC;
                    card.cy = card.r * (card.ch + this.imgMR) + this.imgMR;
                    card.img = img;
                    card.backImg = backImg;
                    card.owner = this;
                    ++num;

                }
            }

        }
        console.log(this.pathArr);
        this.bindEvent();
        this.render();
    }

    bindEvent() {
        this.canvas.addEventListener('click', this.addEvent);
    }

    addEvent(e) {
        let r = ~~((e.offsetY - this.imgMR) / (this.imgRH + this.imgMR)),     // 图片高度+下边间隔区域
            c = ~~((e.offsetX - this.imgMC) / (this.imgRW + this.imgMC)),     // 图片宽度+右边间隔区域
            tr = (e.offsetY - this.imgMR - r * (this.imgRH + this.imgMR)) % this.imgRH,     // 鼠标纵坐标实际区域
            tc = (e.offsetX - this.imgMC - c * (this.imgRW + this.imgMC)) % this.imgRW;     // 鼠标横坐标实际区域
            
            // 鼠标是否位于图片区域
            if(tr > 10 && tc > 15) {
                let len = this.match.length,
                    cur = this.pathArr[r][c];
                
                // 已选中两张图片
                if(len >= 2) {
                    this.removeEvent();
                    return;
                }

                // 已选中0张或1张不同图片
                if(len === 0 || this.match[0] != cur) {
                    this.match.push(cur);
                    cur.rotate();
                    this.compare();
                }
            }
    }

    removeEvent() {
        this.canvas.removeEventListener('click', this.addEvent);
    }

    async compare() {
        if(this.match.length === 2) {
            await this.sleep();
            this.matchPic();
        }
    }

    matchPic() {
        if(!this.isEqualPic(this.match)) {
            this.match[0].rotate();
            this.match[1].rotate();
        }else {
            let dur = new Date().getTime() - this.startTime;
            this.matched += 2;
            this.score += 100000 * 1 / dur;
            console.log(this.startTime)
            console.log(dur)
            this.score.value = this.score;
        }

        // 未结束
        if(!this.isEnd()) {
            this.match.length = 0;
            this.bindEvent();
        }
    }

    sleep(time=500) {
        return new Promise(resolve => {
            setTimeout(resolve, time);
        })
    }

    isEqualPic(arr) {
        if(arr.length < 2) {
            return false;
        }
        return arr[0].picIndex === arr[1].picIndex;
    }

    isEnd() {
        return this.matched === this.r * this.c;
    }

    render() {
        let imgCount = this.images.length;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for(let i = 0; i < this.r; ++i) {
            for(let n = 0; n < this.c; ++n) {
                this.pathArr[i][n].render();
            }
        }
    }
}

new Match({
    r: 5,
    c: 4,
    id: 'canvas'
});

