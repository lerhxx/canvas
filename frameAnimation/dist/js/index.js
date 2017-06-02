'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FrameAnimation = function () {
    function FrameAnimation() {
        _classCallCheck(this, FrameAnimation);

        this.w = document.getElementById('width');
        this.h = document.getElementById('height');
        this.r = document.getElementById('row');
        this.c = document.getElementById('col');
        this.selection = document.getElementById('selection');
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.img = document.getElementById('image');
        this.runBtn = document.getElementById('run');
        this.timeHandle = null;
        this.frames = [];
        this.curFrame = 0;
        this.bindEvent();

        this.start = this.start.bind(this);
    }

    _createClass(FrameAnimation, [{
        key: 'bindEvent',
        value: function bindEvent() {
            var _this = this;

            var files = document.getElementById('file'),
                btn = document.getElementById('create'),
                self = this;

            files.addEventListener('change', function () {
                var file = this.files[0];
                if (!file) {
                    return;
                }
                if (/^image\/w+/.test(file.type)) {
                    alert('请选择图片文件');
                } else {
                    var reader = new FileReader();
                    reader.onload = function () {
                        self.img.setAttribute('src', this.result);
                        reader = null;
                    };
                    reader.readAsDataURL(file);
                }
                if (this.timeHandle) {
                    cancelAnimationFrame(this.timeHandle);
                }
                this.frames = [];
            });

            btn.addEventListener('click', function () {
                console.log(_this.img.src);
                if (!_this.img.src) {
                    alert('请选择图片');
                } else {
                    var w = _this.w.value || 32,
                        h = _this.h.value || 32,
                        r = _this.r.value || 1,
                        c = _this.c.value || 1,
                        str = '',
                        frame = 0;

                    for (var i = 0; i < r; ++i) {
                        for (var n = 0; n < c; ++n) {
                            _this.frames.push([n * w, i * h, w, h]);
                            str += '<option>' + ++frame + '\u5E27</option>';
                        }
                    }

                    _this.canvas.width = w;
                    _this.canvas.height = h;
                    _this.ctx.drawImage(_this.img, _this.frames[0][0], _this.frames[0][1], _this.frames[0][2], _this.frames[0][3], 0, 0, _this.canvas.width, _this.canvas.height);
                    _this.selection.innerHTML = str;
                }
            });

            this.selection.addEventListener('change', function () {
                var frame = parseInt(this.value) - 1,
                    w = self.canvas.width,
                    h = self.canvas.height;
                self.ctx.clearRect(0, 0, w, h);
                self.ctx.drawImage(self.img, self.frames[frame][0], self.frames[frame][1], self.frames[frame][2], self.frames[frame][3], 0, 0, w, h);
            });

            this.runBtn.addEventListener('click', function (e) {
                if (this.innerHTML === '运行动画') {
                    self.timeHandle = requestAnimationFrame(self.start);
                    this.innerHTML = '停止动画';
                } else {
                    cancelAnimationFrame(self.timeHandle);
                    this.innerHTML = '运行动画';
                }
            });
        }
    }, {
        key: 'run',
        value: function run() {}
    }, {
        key: 'start',
        value: function start() {
            var frame = this.curFrame,
                w = this.canvas.width,
                h = this.canvas.height,
                count = this.frames.length;
            this.ctx.clearRect(0, 0, w, h);
            this.ctx.drawImage(this.img, this.frames[frame][0], this.frames[frame][1], this.frames[frame][2], this.frames[frame][3], 0, 0, w, h);
            this.curFrame = ++this.curFrame % count;
            this.timeHandle = requestAnimationFrame(this.start);
        }
    }]);

    return FrameAnimation;
}();

new FrameAnimation();