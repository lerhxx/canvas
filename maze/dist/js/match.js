'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Mcard = function (_Card) {
    _inherits(Mcard, _Card);

    function Mcard() {
        var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, Mcard);

        var _this = _possibleConstructorReturn(this, (Mcard.__proto__ || Object.getPrototypeOf(Mcard)).call(this, obj));

        _this.deg = 0;
        _this.rId = null;
        _this.isBack = true;

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
                this.isBack = !this.isBack;
            }
            this.deg += 10;

            this.render();
        }
    }, {
        key: 'render',
        value: function render() {
            var ctx = this.owner.ctx;
            ctx.clearRect(this.cx, this.cy, this.cw, this.ch);
            ctx.save();
            ctx.beginPath();
            this.rotateImg();
            ctx.closePath();
            ctx.restore();
        }
    }, {
        key: 'rotateImg',
        value: function rotateImg() {
            var cw = this.cw * Math.cos(this.deg * Math.PI / 180),
                cx = this.cx + (this.cw - cw) / 2;
            var img = null;

            if (this.deg > 90) {
                img = this.isBack ? this.img : this.backImg;
            } else {
                img = this.isBack ? this.backImg : this.img;
            }
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

        this.owner = null;

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

        this.match = [];
        this.matched = 0;
        this.scoreIn = document.getElementById('score');
        this.score = 0;

        this.addEvent = this.addEvent.bind(this);
        this.removeEvent = this.removeEvent.bind(this);

        this.preLoadImg();
        this.bindEvent();
        this.initMaze();

        var self = this;

        document.getElementById('start').addEventListener('click', function () {
            this.parentNode.style.display = 'none';
            self.startTime = new Date().getTime();
        });
    }

    _createClass(Match, [{
        key: 'start',
        value: function start() {
            this.initMaze();
        }
    }, {
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
                // 处理图片src
                if (!/^http(s)?:\/\//.test(source)) {
                    source = './dist/img/' + source;
                }

                // 背面图片最后处理
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

            this.preLoadAllImg(pr);
        }
    }, {
        key: 'preLoadAllImg',
        value: function preLoadAllImg(pr) {
            var _this3 = this;

            // 图片全部加载完
            PreLoadImg.allLoadDone(pr).then(function () {
                pr = null;
                // 加载背面
                PreLoadImg.loadImage(_this3.imgSource[_this3.imgSource.length - 1]).then(function (img) {
                    _this3.images.push(img);
                    _this3.changeMaze();
                });
                console.log(_this3.images.length);
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
                        c: n
                    });
                }
            }
        }
    }, {
        key: 'changeMaze',
        value: function changeMaze() {
            console.log(this);
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
                this.match[0].rotate();
                this.match[1].rotate();
            } else {
                var dur = new Date().getTime() - this.startTime;
                this.matched += 2;
                this.owner.matched();
            }

            // 未结束
            if (!this.isEnd()) {
                this.match.length = 0;
                this.bindEvent();
            } else {
                this.owner.end();
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
                    this.pathArr[i][n].render();
                }
            }
        }
    }, {
        key: 'restart',
        value: function restart() {
            var r = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.r;
            var c = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.c;

            this.r = r;
            this.c = c;
            this.pathArr = [];
            this.match.length = 0;
            this.matched = 0;
            this.bindEvent();
            this.initMaze();
            this.changeMaze();
        }
    }]);

    return Match;
}();

var ToolBar = function () {
    function ToolBar() {
        var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, ToolBar);

        this.scoreBox = document.getElementById(obj.score || 'score');
        this.score = 0;
    }

    _createClass(ToolBar, [{
        key: 'add',
        value: function add() {
            var score = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

            this.score += score;
            this.changeScore();
            return this;
        }
    }, {
        key: 'substract',
        value: function substract() {
            var score = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

            this.score -= score;
            this.changeScore();
            return this;
        }
    }, {
        key: 'multiply',
        value: function multiply() {
            var score = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

            this.score *= score;
            this.changeScore();
            return this;
        }
    }, {
        key: 'divide',
        value: function divide() {
            var score = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

            if (score === 0) {
                console.error('The denominator cannot be zero');
                return;
            }
            this.multiply(1 / score);
            this.changeScore();
            return this;
        }
    }, {
        key: 'changeScore',
        value: function changeScore() {
            var score = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.score;

            this.scoreBox.innerHTML = score;
        }
    }, {
        key: 'clear',
        value: function clear() {
            this.score = 0;
            this.changeScore(0);
        }
    }]);

    return ToolBar;
}();

var MatchGame = function () {
    function MatchGame(obj) {
        _classCallCheck(this, MatchGame);

        this.r = 4;
        this.c = 3;

        Object.assign(this, obj);

        obj.owner = this;
        this.scene = new Match(obj);
        this.toolBar = new ToolBar();

        // 缓存dom
        this.rankWrapper = document.getElementById(obj.rankWrapper || 'rank-wrapper');
        this.rankScore = document.getElementById(obj.rankScore || 'rank-score');
        this.totalTime = document.getElementById(obj.totalTime || 'total-time');
        this.rank = document.getElementById(obj.rank || 'rank');

        this.bindEvent();
    }

    _createClass(MatchGame, [{
        key: 'bindEvent',
        value: function bindEvent() {
            var self = this;
            document.getElementById('start').addEventListener('click', function () {
                this.parentNode.style.display = 'none';
                self.startTime = new Date().getTime();
            });
            document.getElementById('restart').addEventListener('click', function (e) {
                self.restart();
            });
            document.getElementById('next').addEventListener('click', function (e) {
                self.next();
            });
            document.getElementById('more').addEventListener('click', function (e) {
                alert('这是个空白按钮哦~哈哈哈');
            });
        }
    }, {
        key: 'restart',
        value: function restart() {
            this.toolBar.clear();
            this.scene.restart(this.r, this.c);
            this.startTime = new Date().getTime();
            this.rankWrapper.style.display = 'none';
        }
    }, {
        key: 'next',
        value: function next() {
            this.r += 2;
            this.c += 1;
            this.restart();
        }
    }, {
        key: 'matched',
        value: function matched() {
            var now = new Date().getTime();
            var score = ~~(1000000 / (now - this.startTime));
            this.toolBar.add(score);
        }
    }, {
        key: 'end',
        value: function end() {
            this.rankWrapper.style.display = 'block';
            this.rankScore.innerHTML = this.toolBar.score;
            this.totalTime.innerHTML = this.formateTime(new Date().getTime() - this.startTime);
            this.rank.classList.add('dump');
        }
    }, {
        key: 'formateTime',
        value: function formateTime(time) {
            var sec = 0,
                min = 0,
                hour = 0,
                str = '';
            var HOUR = 60 * 60 * 1000,
                MIN = 60 * 1000,
                SEC = 1000;

            hour = ~~(time / HOUR);
            if (hour >= 24) {
                return '>1天';
            } else {
                time = time % HOUR;
                min = ~~(time / MIN);
                time = time % MIN;
                sec = ~~(time / SEC);
                return hour + '\uFF1A' + min + '\uFF1A' + sec;
            }
        }
    }]);

    return MatchGame;
}();

new MatchGame({
    r: 2,
    c: 2,
    id: 'canvas'
});