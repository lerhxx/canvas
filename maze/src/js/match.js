class Mcard extends Card {
    constructor(obj={}) {
        super(obj);

        this.deg = 0;
        this.rId = null;
        this.direction = 1;   // 0 从左到右  1 从右到左
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
        this.rotation += this.direction;

        this.render();
    }

    render() {
        let ctx = this.owner.ctx;
        ctx.clearRect(this.cx, this.cy, this.cw, this.ch);
        ctx.save();
        ctx.beginPath();
        ctx.rotate = this.rotation;
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

        this.owner = null;

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

        this.addEvent = this.addEvent.bind(this);
        this.removeEvent = this.removeEvent.bind(this);
        

        this.preLoadImg();
        this.bindEvent();
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

        // 图片全部加载完
        PreLoadImg.allLoadDone(pr)
                .then(() => {
                    pr = null;
                    // 加载背面
                    PreLoadImg.loadImage(this.imgSource[this.imgSource.length - 1])
                            .then((img) => {
                                this.images.push(img);
                                this.changeMaze()
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
            this.matched += 2;
            this.owner.matched();
        }

        // 未结束
        if(!this.isEnd()) {
            this.match.length = 0;
            this.bindEvent();
        }else {
            this.owner.end();
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

    restart(r=this.r, c=this.c) {
        this.r = r;
        this.c = c;
        this.pathArr = [];
        this.match.length = 0;
        this.matched = 0;
        this.bindEvent();
        this.initMaze();
        this.changeMaze();
    }
}

class ToolBar {
    constructor(obj={}) {
        this.scoreBox = document.getElementById(obj.score || 'score');
        this.score = 0;
    }

    add(score=0) {
        this.score += score;
        this.changeScore();
        return this;
    }

    substract(score=0) {
        this.score -= score;
        this.changeScore();
        return this;
    }

    multiply(score = 1) {
        this.score *= score;
        this.changeScore();
        return this;
    }

    divide(score=1) {
        if(score === 0) {
            console.error('The denominator cannot be zero');
            return;
        }
        this.multiply(1 / score);
        this.changeScore();
        return this;
    }

    changeScore(score=this.score) {
        this.scoreBox.innerHTML = score;
    }

    clear() {
        this.score = 0;
        this.changeScore(0);
    }
}

class MatchGame {
    constructor(obj) {
        this.r = 4;
        this.c = 3;

        Object.assign(this, obj);

        obj.owner = this;
        this.scene = new Match(obj);
        this.toolBar = new ToolBar();

        // 缓存dom
        this.rankWrapper = document.getElementById(obj.rankWrapper || 'rank-wrapper');
        this.rankScore = document.getElementById(obj.rankScore || 'rank-score');
        this.totalTime =  document.getElementById(obj.totalTime || 'total-time');
        this.rank = document.getElementById(obj.rank || 'rank');

        this.bindEvent();
    }

    bindEvent() {
        let self = this;
        document.getElementById('start').addEventListener('click', function() {
            this.parentNode.style.display = 'none';
            self.startTime = new Date().getTime();
        })
        document.getElementById('restart').addEventListener('click', (e) => {
            self.restart();
        })
        document.getElementById('next').addEventListener('click', (e) => {
            self.next();
        })
        document.getElementById('more').addEventListener('click', (e) => {
            alert('这是个空白按钮哦~哈哈哈');
        })
    }

    restart() {
        this.toolBar.clear();
        this.scene.restart(this.r, this.c);
        this.startTime = new Date().getTime();
        this.rankWrapper.style.display = 'none';
    }

    next() {
        this.r += 2;
        this.c += 1;
        this.restart();
    }

    matched() {
        let now = new Date().getTime();
        let score = ~~(1000000/(now - this.startTime));
        this.toolBar.add(score);
    }

    end() {
        this.rankWrapper.style.display = 'block';
        this.rankScore.innerHTML = this.toolBar.score;
        this.totalTime.innerHTML = this.formateTime(new Date().getTime() - this.startTime);
        this.rank.classList.add('dump');
    }

    formateTime(time) {
        let sec = 0,
            min = 0,
            hour = 0,
            str = '';
        let HOUR = 60 * 60 * 1000,
            MIN = 60 * 1000,
            SEC = 1000;

        hour = ~~(time / HOUR);
        if(hour >= 24) {
            return '>1天';
        }else {
            time = time % HOUR;
            min = ~~(time / MIN);
            time = time % MIN;
            sec = ~~(time / SEC);
            return `${hour}：${min}：${sec}`;
        }
    }
}

new MatchGame({
    r: 2,
    c: 2,
    id: 'canvas'
});

