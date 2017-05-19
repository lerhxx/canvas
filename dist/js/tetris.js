'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Tetris = function () {
    function Tetris(id) {
        _classCallCheck(this, Tetris);

        if (!id) {
            console.warn('there need an id');
            return;
        }
        this.init(id);
    }

    _createClass(Tetris, [{
        key: 'init',
        value: function init(id) {
            this.canvas = document.getElementById(id);

            if (!this.canvas) {
                this.canvas = document.createElement('canvas');
                this.canvas.width = 500;
                this.canvas.height = 500;
                document.body.appendChild(this.canvas);
            }

            this.ctx = this.canvas.getContext('2d');

            if (!this.ctx) {
                alert("your broswer doesn't support canvas");
                return;
            }

            this.borderWidth = this.canvas.width;
            this.borderHeight = this.canvas.height;
            this.boxes = [];
            this.colors = ['red', 'pink', 'blue', 'yellow', 'orange', 'purple', 'green'];
            this.colorLen = this.colors.length;
            this.gravity = .01;

            this.activityBox = this.createBox();

            this.bindEvent();

            this.draw = this.draw.bind(this);
            this.createBox = this.createBox.bind(this);
            this.shiftLeft = this.shiftLeft.bind(this);
            this.shiftRight = this.shiftRight.bind(this);
            this.speedUp = this.speedUp.bind(this);
            this.speedReduction = this.speedReduction.bind(this);
            this.start = this.start.bind(this);

            this.start();
        }
    }, {
        key: 'createBox',
        value: function createBox() {
            var color = this.colors[~~(Math.random() * this.colorLen)],
                box = new Box(this.borderWidth, color);
            this.boxes.push(box);
            return box;
        }
    }, {
        key: 'bindEvent',
        value: function bindEvent() {
            var _this = this;

            window.addEventListener('keydown', function (e) {
                switch (e.keyCode) {
                    case 37:
                        _this.shiftLeft(_this.activityBox);
                        break;
                    case 39:
                        _this.shiftRight(_this.activityBox);
                        break;
                    case 38:
                        _this.speedReduction();
                        break;
                    case 40:
                        _this.speedUp();
                        break;
                }
            });
        }

        /*
         * method: boundaryDetection
         * params {Box} box：检测的 box
         * params {Boolean} loop：是否循环
        */

    }, {
        key: 'boundaryDetection',
        value: function boundaryDetection(box) {
            var loop = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

            if (box.y + box.h > this.borderHeight) {
                box.y = this.borderHeight - box.h;
                this.activityBox = this.createBox();
                this.gravity = .01;
            }
            if (!loop) {
                if (box.x < 0) {
                    box.x = 0;
                }
                if (box.x + box.w > this.borderWidth) {
                    box.x = this.borderWidth - box.w;
                }
            } else {
                if (box.x + box.w < 0) {
                    box.x = this.borderWidth;
                }
                if (box.x > this.borderWidth) {
                    box.x = 0 - box.w;
                }
            }
        }
    }, {
        key: 'collisionDetection',
        value: function collisionDetection() {
            var len = this.boxes.length,
                stop = false,
                i = void 0;
            for (i = 0; i < len; ++i) {
                var box = this.boxes[i];
                if (box !== this.activityBox) {
                    stop = this.activityBox.y + this.activityBox.h;
                    if (stop >= box.y) {
                        console.log();
                    }
                    if (stop >= box.y && this.activityBox.y < box.y + box.h && this.activityBox.x < box.x + box.w && this.activityBox.x + this.activityBox.w > box.x) {
                        this.activityBox.y = box.y - this.activityBox.h;
                        if (this.boxes.length < 10) {
                            this.activityBox = this.createBox();
                        }
                        this.gravity = .01;
                        break;
                    } else {
                        // if(this.activityBox.x < box.x + box.w) {
                        //     this.activityBox.x = box.x + box.w;
                        // }
                        // if(this.activityBox.x + this.activityBox.w > box.x) {
                        //     this.activityBox.x = box.x - this.activityBox.w;
                        // }
                    }
                }
            }
        }
    }, {
        key: 'draw',
        value: function draw() {
            var len = this.boxes.length,
                box = void 0;

            this.activityBox.vy += this.gravity;
            if (this.activityBox.vy > 2.5) {
                this.activityBox.vy = 2.5;
            }
            this.activityBox.y += this.activityBox.vy;

            this.boundaryDetection(this.activityBox);
            for (var i = 0; i < len; ++i) {
                box = this.boxes[i];
                this.ctx.save();
                this.ctx.beginPath();
                this.ctx.fillStyle = box.color;

                this.collisionDetection();

                this.ctx.fillRect(box.x, box.y, box.w, box.h);
                this.ctx.fill();
                this.ctx.closePath();
                this.ctx.restore();
            }
        }
    }, {
        key: 'start',
        value: function start() {
            requestAnimationFrame(this.start);
            this.ctx.clearRect(0, 0, this.borderWidth, this.borderHeight);
            this.draw();
        }
    }, {
        key: 'shiftLeft',
        value: function shiftLeft(box) {
            box.x -= 5;
        }
    }, {
        key: 'shiftRight',
        value: function shiftRight(box) {
            box.x += 5;
        }
    }, {
        key: 'speedUp',
        value: function speedUp() {
            this.gravity += .02;
        }
    }, {
        key: 'speedReduction',
        value: function speedReduction() {
            this.gravity -= .02;
            if (this.gravity < .01) {
                this.gravity = .01;
            }
        }
    }]);

    return Tetris;
}();

new Tetris('canvas');