'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Card = function Card(r, c, pic) {
    _classCallCheck(this, Card);

    this.r = r;
    this.c = c;
    this.flag = 1;
    this.picIndex = pic;
    this.isMatch = false;
};

var linkGame = function () {
    function linkGame(r, c, id) {
        _classCallCheck(this, linkGame);

        if (typeof id !== 'string') {
            console.err('There is no id.');
            return;
        }
        if (r * c % 2 === 1) {
            console.error('Please enter at least one even number.');
            return;
        }
        this.getCanvas(id);
        if (!this.canvas || !this.ctx) {
            return;
        }
        console.log('start');

        this.r = r;
        this.c = c;
        this.pathArr = [];
        this.isEnd = false;

        //图片资源
        this.imgSource = ['card1.jpg', 'card2.jpg', 'card3.jpg', 'card4.jpg', 'card5.jpg', 'card6.jpg', 'card7.jpg', 'card8.jpg', 'card9.jpg', 'back.jpg'];
        this.images = []; // 缓存图片
        this.imgCount = 0; // 已下载图片数量
        this.imgW = 0;
        this.imgH = 0;
        this.imgRW = 0;
        this.imgRH = 0;

        this.match = [];

        this.bindEvent = this.bindEvent.bind(this);
        this.addEvent = this.addEvent.bind(this);
        this.removeEvent = this.removeEvent.bind(this);

        this.initMaze();
        this.loadImage();
    }

    _createClass(linkGame, [{
        key: 'getCanvas',
        value: function getCanvas(id) {
            this.canvas = document.getElementById(id);
            if (!this.canvas) {
                console.error('There is no canvas that id is ' + id);
                return;
            }
            this.ctx = this.canvas.getContext('2d');
        }

        // 缓存图片

    }, {
        key: 'loadImage',
        value: function loadImage() {
            var _this = this;

            this.imgSource.forEach(function (src, i) {
                _this.images[i] = new Image();
                _this.images[i].onload = function () {
                    ++_this.imgCount;
                    if (_this.imgCount >= _this.imgSource.length) {
                        console.log('ok');
                        _this.imgW = _this.images[0].width;
                        _this.imgH = _this.images[0].height;
                        _this.changeMaze();
                    }
                };
                _this.images[i].src = './dist/img/' + src;
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
                this.isEnd = true;
                return;
            }

            var sum = this.imgCount - 2;

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
            var _this2 = this;

            var r = ~~((e.offsetY - 10) / (this.imgRH + 10)),
                c = ~~((e.offsetX - 15) / (this.imgRW + 15)),
                tr = (e.offsetY - 10 - r * (this.imgRH + 10)) % this.imgRH,
                tc = (e.offsetX - 15 - c * (this.imgRW + 15)) % this.imgRW;

            if (tr > 10 && tc > 15) {
                var len = this.match.length,
                    cur = this.pathArr[r][c];
                if (len >= 2) {
                    this.removeEvent();
                    return;
                }

                if (len === 0) {
                    cur.isMatch = true;
                    this.match.push(cur);
                } else {
                    if (this.match[0] != cur) {
                        cur.isMatch = true;
                        this.match.push(cur);
                        setTimeout(function () {
                            if (!_this2.matchPic(_this2.match)) {
                                _this2.match[0].isMatch = false;
                                _this2.match[1].isMatch = false;
                                _this2.render();
                            }
                            _this2.match.length = 0;
                            _this2.bindEvent();
                        }, 500);
                    }
                }
                console.log(this.match.length);
                this.render();
            }
        }
    }, {
        key: 'removeEvent',
        value: function removeEvent() {
            this.canvas.removeEventListener('click', this.addEvent);
        }
    }, {
        key: 'matchPic',
        value: function matchPic(arr) {
            if (arr.length < 2) {
                return false;
            }
            return arr[0].picIndex === arr[1].picIndex;
        }
    }, {
        key: 'render',
        value: function render() {
            this.imgRW = ~~((this.canvas.width - 15 * this.c - 15) / this.c), this.imgRH = ~~((this.canvas.height - 10 * this.r - 10) / this.r);
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            for (var i = 0; i < this.r; ++i) {
                for (var n = 0; n < this.c; ++n) {
                    var img = null;
                    if (this.pathArr[i][n].isMatch) {
                        img = this.images[this.pathArr[i][n].picIndex];
                    } else {
                        img = this.images[this.imgCount - 1];
                    }
                    this.ctx.drawImage(img, 0, 0, this.imgW, this.imgH, n * (this.imgRW + 15) + 15, i * (this.imgRH + 10) + 10, this.imgRW, this.imgRH);
                }
            }
        }
    }]);

    return linkGame;
}();

new linkGame(5, 4, 'canvas');

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