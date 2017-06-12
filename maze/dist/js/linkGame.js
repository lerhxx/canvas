'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Match = function () {
    function Match(opt) {
        _classCallCheck(this, Match);

        this.r = 5;
        this.c = 4;
        this.pathArr = [];

        //图片资源
        this.imgSource = ['card1.jpg', 'card2.jpg', 'card3.jpg', 'card4.jpg', 'card5.jpg', 'card6.jpg', 'card7.jpg', 'card8.jpg', 'card9.jpg'];
        this.images = []; // 缓存图片
        this.imgW = 115; // 图片原宽度
        this.imgH = 115; // 图片原高度
        this.imgMR = 10; // 图片垂直间距
        this.imgMC = 15; // 图片水平间距

        Object.assign(this, opt);

        if (typeof this.id !== 'string') {
            console.error('There is no id.');
            return;
        }
        if (this.r * this.c % 2 !== 0) {
            console.error('Please enter at least one even number.');
            return;
        }
        this.getCanvas(this.id);
        if (!this.canvas || !this.ctx) {
            return;
        }
        console.log('start');

        this.imgRW = ~~((this.canvas.width - this.imgMC * this.c - this.imgMC) / this.c); // canvas中图片实际宽度
        this.imgRH = ~~((this.canvas.height - this.imgMR * this.r - this.imgMR) / this.r); // canvas中图片实际高度

        this.match = [];
        this.matched = 0;

        this.bindEvent = this.bindEvent.bind(this);
        this.addEvent = this.addEvent.bind(this);
        this.removeEvent = this.removeEvent.bind(this);

        this.preLoadImg();
        this.initMaze();
    }

    _createClass(Match, [{
        key: 'getCanvas',
        value: function getCanvas(id) {
            this.canvas = document.getElementById(id);
            if (!this.canvas) {
                console.error('There is no canvas that id is ' + id);
                return;
            }
            this.ctx = this.canvas.getContext('2d');
        }

        // 预处理图片

    }, {
        key: 'preLoadImg',
        value: function preLoadImg() {
            var _this = this;

            var pr = [];
            this.imgSource.map(function (source) {
                // 处理图片src
                if (!/^http(s)?:\/\//.test(source)) {
                    source = './dist/img/' + source;
                }

                // 预加载图片
                var p = PreLoadImg.loadImage(source).then(function (img) {
                    return _this.images.push(img);
                }).catch(function (err) {
                    return console.log(err);
                });
                pr.push(p);

                return source;
            });

            // 图片全部加载完
            PreLoadImg.allLoadDone(pr).then(function () {
                pr = null;
                _this.changeMaze();
                console.log(_this.images.length);
            });
        }
    }, {
        key: 'initMaze',
        value: function initMaze() {
            for (var i = 0; i < this.r; ++i) {
                this.pathArr[i] = [];
                for (var n = 0; n < this.c; ++n) {
                    this.pathArr[i][n] = new Card(i, n, -1);
                }
            }
        }
    }, {
        key: 'changeMaze',
        value: function changeMaze() {
            if (this.pathArr.length < 0) {
                console.log('There is no pathArr');
                return;
            }

            var sum = this.images.length - 2;

            for (var i = 0, len = this.r * this.c / 2; i < len; ++i) {
                var index = MathUtil.randomInt(sum),
                    num = 0;

                // 成对修改图片索引
                while (num < 2) {
                    var r = MathUtil.randomInt(this.r),
                        c = MathUtil.randomInt(this.c);

                    if (this.pathArr[r][c].picIndex < 0) {
                        this.pathArr[r][c].picIndex = index;
                        ++num;
                    }
                }
            }
            console.log(this.pathArr);
            this.bindEvent();
            this.render();
        }
    }, {
        key: 'bindEvent',
        value: function bindEvent() {
            this.canvas.addEventListener('click', this.addEvent);
        }
    }, {
        key: 'addEvent',
        value: function addEvent(e) {
            var r = ~~((e.offsetY - this.imgMR) / (this.imgRH + this.imgMR)),
                // 图片高度+下边间隔区域
            c = ~~((e.offsetX - this.imgMC) / (this.imgRW + this.imgMC)),
                // 图片宽度+右边间隔区域
            tr = (e.offsetY - this.imgMR - r * (this.imgRH + this.imgMR)) % this.imgRH,
                // 鼠标纵坐标实际区域
            tc = (e.offsetX - this.imgMC - c * (this.imgRW + this.imgMC)) % this.imgRW; // 鼠标横坐标实际区域

            // 鼠标是否位于图片区域
            if (tr > 10 && tc > 15) {
                var len = this.match.length,
                    cur = this.pathArr[r][c];

                // 已选中两张图片
                if (len >= 2) {
                    this.removeEvent();
                    return;
                }

                // 已选中0张或1张不同图片
                if (len === 0) {
                    this.match.push(cur);

                    this.ctx.save();
                    this.ctx.beginPath();
                    this.ctx.lineWidth = 10;
                    this.ctx.strokeStyle = 'red';
                    this.ctx.moveTo(cur.c * (this.imgRW + this.imgMC) + this.imgMR + this.imgW / 2, cur.r * (this.imgRH + this.imgMR) + this.imgMR + this.imgH / 2);
                } else if (len === 1 && this.match[0] != cur) {
                    this.match.push(cur);

                    this.ctx.lineTo(cur.c * (this.imgRW + this.imgMC) + this.imgMR + this.imgW / 2, cur.r * (this.imgRH + this.imgMR) + this.imgMR + this.imgH / 2);
                    this.ctx.stroke();
                    this.ctx.restore();

                    this.compare();
                }
            }
        }
    }, {
        key: 'removeEvent',
        value: function removeEvent() {
            this.canvas.removeEventListener('click', this.addEvent);
        }
    }, {
        key: 'compare',
        value: async function compare() {
            if (this.match.length === 2) {
                await this.sleep();
                this.matchPic();
            }
        }
    }, {
        key: 'matchPic',
        value: function matchPic() {
            if (!this.isEqualPic(this.match)) {
                this.render();
            } else {
                this.match[0].flag = 0;
                this.match[1].flag = 0;
                this.matched += 2;
                this.render();
            }

            // 未结束
            if (!this.isEnd()) {
                this.match.length = 0;
                this.bindEvent();
            }
            console.log(this.isEnd());
        }
    }, {
        key: 'sleep',
        value: function sleep() {
            var time = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 500;

            return new Promise(function (resolve) {
                setTimeout(resolve, time);
            });
        }
    }, {
        key: 'isEqualPic',
        value: function isEqualPic(arr) {
            if (arr.length < 2) {
                return false;
            }
            return arr[0].picIndex === arr[1].picIndex;
        }
    }, {
        key: 'isEnd',
        value: function isEnd() {
            return this.matched === this.r * this.c;
        }
    }, {
        key: 'render',
        value: function render() {
            // this.imgRW = ~~((this.canvas.width - 15 * this.c -15) / this.c),
            // this.imgRH = ~~((this.canvas.height  - 10 * this.r -10)/ this.r);
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            for (var i = 0; i < this.r; ++i) {
                for (var n = 0; n < this.c; ++n) {
                    if (this.pathArr[i][n].flag === 0) {
                        continue;
                    }
                    var img = this.images[this.pathArr[i][n].picIndex];
                    this.ctx.drawImage(img, 0, 0, this.imgW, this.imgH, n * (this.imgRW + this.imgMC) + this.imgMC, i * (this.imgRH + this.imgMR) + this.imgMR, this.imgRW, this.imgRH);
                }
            }
        }
    }]);

    return Match;
}();

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