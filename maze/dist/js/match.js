'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Mcard = function (_Card) {
    _inherits(Mcard, _Card);

    function Mcard(obj) {
        _classCallCheck(this, Mcard);

        var _this = _possibleConstructorReturn(this, (Mcard.__proto__ || Object.getPrototypeOf(Mcard)).call(this, obj));

        _this.deg = 0;
        _this.rId = null;
        _this.direction = 1; // 0 从左到右  1 从右到左
        _this.upImg = 1;

        _this.rotate = _this.rotate.bind(_this);
        return _this;
    }

    _createClass(Mcard, [{
        key: 'rotate',
        value: function rotate() {
            this.rId = requestAnimationFrame(this.rotate);
            if (this.deg >= 180) {
                cancelAnimationFrame(this.rId);
                this.deg = 0;
                this.upImg === 1 ? (this.upImg = 0, this.img) : (this.upImg = 1, this.backImg);
            }
            this.deg += 5;
            this.rotation += this.direction;

            this.render();
        }
    }, {
        key: 'render',
        value: function render() {
            var ctx = this.owner.ctx;
            ctx.clearRect(this.cx, this.cy, this.cw, this.ch);
            ctx.save();
            ctx.beginPath();
            ctx.rotate = this.rotation;
            this.rotateImg();
            ctx.closePath();
            ctx.restore();
        }
    }, {
        key: 'rotateImg',
        value: function rotateImg() {
            var cw = this.cw * Math.cos(this.deg * Math.PI / 180),
                cx = this.cx + (this.cw - cw) / 2;
            var img = this.deg > 90 ? this.upImg === 1 ? (this.upImg = 0, this.img) : (this.upImg = 1, this.backImg) : this.upImg === 1 ? (this.upImg = 1, this.backImg) : (this.upImg = 0, this.img);

            this.owner.ctx.drawImage(img, 0, 0, this.w, this.h, cx, this.cy, cw, this.ch);
        }
    }]);

    return Mcard;
}(Card);

var Match = function () {
    function Match(opt) {
        _classCallCheck(this, Match);

        this.r = 5;
        this.c = 4;
        this.pathArr = [];

        //图片资源
        this.imgSource = ['card1.jpg', 'card2.jpg', 'card3.jpg', 'card4.jpg', 'card5.jpg', 'card6.jpg', 'card7.jpg', 'card8.jpg', 'card9.jpg', 'back.jpg'];
        this.images = []; // 缓存图片
        this.imgMR = 10; // 图片垂直间距
        this.imgMC = 15; // 图片水平间距

        Object.assign(this, opt);
        console.log(this.imgW);

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

        this.match = [];
        this.matched = 0;

        this.bindEvent = this.bindEvent.bind(this);
        this.addEvent = this.addEvent.bind(this);
        this.removeEvent = this.removeEvent.bind(this);
        this.changeMaze = this.changeMaze.bind(this);

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
            var _this2 = this;

            var pr = [];
            this.imgSource = this.imgSource.map(function (source, i) {
                // 背面最后处理
                // 处理图片src
                if (!/^http(s)?:\/\//.test(source)) {
                    source = './dist/img/' + source;
                }

                if (i !== _this2.imgSource.length - 1) {
                    // 预加载图片
                    var p = PreLoadImg.loadImage(source).then(function (img) {
                        return _this2.images.push(img);
                    }).catch(function (err) {
                        return console.log(err);
                    });
                    pr.push(p);
                }
                return source;
            });

            // 图片全部加载完
            PreLoadImg.allLoadDone(pr).then(function () {
                pr = null;
                // 加载背面
                PreLoadImg.loadImage(_this2.imgSource[_this2.imgSource.length - 1]).then(function (img) {
                    _this2.images.push(img);
                    _this2.changeMaze();
                });
                console.log(_this2.images.length);
            });
        }
    }, {
        key: 'initMaze',
        value: function initMaze() {
            for (var i = 0; i < this.r; ++i) {
                this.pathArr[i] = [];
                for (var n = 0; n < this.c; ++n) {
                    this.pathArr[i][n] = new Mcard({
                        r: i,
                        c: n,
                        isMatch: false
                    });
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

            var sum = this.images.length - 2,
                backImg = this.images[this.images.length - 1];
            this.imgRW = ~~((this.canvas.width - this.imgMC * this.c - this.imgMC) / this.c); // canvas中图片实际宽度
            this.imgRH = ~~((this.canvas.height - this.imgMR * this.r - this.imgMR) / this.r); // canvas中图片实际高度

            for (var i = 0, len = this.r * this.c / 2; i < len; ++i) {
                var index = MathUtil.randomInt(sum),
                    num = 0;

                // 成对修改图片索引
                while (num < 2) {
                    var r = MathUtil.randomInt(this.r),
                        c = MathUtil.randomInt(this.c),
                        card = this.pathArr[r][c],
                        img = this.images[index];

                    if (card.picIndex < 0) {
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
                if (len === 0 || this.match[0] != cur) {
                    cur.isMatch = true;
                    this.match.push(cur);
                    cur.rotate();
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
                this.match[0].isMatch = false;
                this.match[1].isMatch = false;

                this.match[0].rotate();
                this.match[1].rotate();
                // this.render();
            } else {
                this.matched += 2;
            }

            // 未结束
            if (!this.isEnd()) {
                this.match.length = 0;
                this.bindEvent();
            }
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
            var imgCount = this.images.length;
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            for (var i = 0; i < this.r; ++i) {
                for (var n = 0; n < this.c; ++n) {
                    var img = null,
                        card = this.pathArr[i][n];
                    if (card.isMatch) {
                        img = card.img;
                    } else {
                        img = card.backImg;
                    }

                    this.ctx.drawImage(img, 0, 0, card.w, card.h, card.cx, card.cy, card.cw, card.ch);
                }
            }
        }
    }]);

    return Match;
}();

new Match({
    r: 5,
    c: 4,
    id: 'canvas'
});