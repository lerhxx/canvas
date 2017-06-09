class Match {
    constructor(opt) {
        this.r = 5;
        this.c = 4;
        this.pathArr = [];

        //图片资源
        this.imgSource = ['card1.jpg', 'card2.jpg', 'card3.jpg', 'card4.jpg', 'card5.jpg', 'card6.jpg', 'card7.jpg', 'card8.jpg', 'card9.jpg'];
        this.images = [];      // 缓存图片
        this.imgW = 115;        // 图片原宽度
        this.imgH = 115;        // 图片原高度
        this.imgRW = 0;         // canvas中图片实际宽度
        this.imgRH = 0;         // canvas中图片实际高度
        this.imgMR = 10;         // 图片水平间距
        this.imgMC = 15;         // 图片垂直间距

        Object.assign(this, opt);
        console.log(this.imgW)

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

        this.bindEvent = this.bindEvent.bind(this);
        this.addEvent = this.addEvent.bind(this);
        this.removeEvent = this.removeEvent.bind(this);

        this.preLoadImg();
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
        this.imgSource.map(source => {
            // 处理图片src
            if(!/^http(s)?:\/\//.test(source)) {
                source = `./dist/img/${source}`;
            }

            let p = this.loadImage(source)
                        .then(img => this.images.push(img))
                        .catch(err => console.log(err))

            pr.push(p);
            return source;
        })

        this.allLoadDone(pr);

    }

    // 预加载图片
    loadImage(url) {
        return new Promise((resolve, reject) => {
            let img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = url;
        })
    }

    // 所有图片加载完成
    allLoadDone(p) {
        Promise.all(p).then(() => {
            p = null;
            this.changeMaze();
            console.log(this.images.length);
        })
    }

    initMaze() {
        for(let i = 0; i < this.r; ++i) {
            this.pathArr[i] = [];
            for(let n = 0; n < this.c; ++n) {
                this.pathArr[i][n] = new Card(i, n, -1);
            }
        }
    }

    changeMaze() {
        if(this.pathArr.length < 0) {
            console.log('There is no pathArr');
            return;
        }

        let sum = this.images.length - 2;

        for(let i = 0, len = this.r * this.c / 2; i < len; ++i) {
            let index = MathUtil.randomInt(sum),
                num = 0;

            // 成对修改图片索引
            while(num < 2) {
                let r = MathUtil.randomInt(this.r),
                    c = MathUtil.randomInt(this.c);

                if(this.pathArr[r][c].picIndex < 0) {
                    this.pathArr[r][c].picIndex = index;
                    ++num;
                }
            }

        }
        console.log(this.pathArr);
        this.bindEvent();
        this.render();
    }

    bindEvent() {
        this.canvas.addEventListener('click', this.addEvent)
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
                    cur.isMatch = true;
                    this.match.push(cur);
                    this.render();
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
            this.match[0].isMatch = false;
            this.match[1].isMatch = false;
            this.render();
        }else {
            this.matched += 2;
        }

        // 未结束
        if(!this.isEnd()) {
            this.match.length = 0;
            this.bindEvent();
        }
        console.log(this.isEnd())
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
        this.imgRW = ~~((this.canvas.width - 15 * this.c -15) / this.c),
        this.imgRH = ~~((this.canvas.height  - 10 * this.r -10)/ this.r);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for(let i = 0; i < this.r; ++i) {
            for(let n = 0; n < this.c; ++n) {
                let img = this.images[this.pathArr[i][n].picIndex];
                this.ctx.drawImage(img, 0, 0, this.imgW, this.imgH, n * (this.imgRW + 15) + 15, i * (this.imgRH + 10) + 10, this.imgRW, this.imgRH);
            }
        }

    }
}

// new linkGame(5, 4, 'canvas');
new Match({
    r: 5,
    c: 4,
    id: 'canvas'
});

// 传入r，c(r * c % 2 === 0)
// 加载缓存图片
// 随机生成r*c/2个数字，实例化Card，保存到pathArr
// 数组removeList保存已消除card
// 绘制pathArr
// 添加点击事件
// 数组arr保存card
// if(arr.lenght == 2)
    // if(搜索路径)
        // if(图片对比)
            // 对应位置清空
            // if(removeList.length >= r * c)
               // 游戏结束
        // else
            // arr.pop()
