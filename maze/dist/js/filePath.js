'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Point = function Point(r, c) {
    var flag = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

    _classCallCheck(this, Point);

    this.r = r;
    this.c = c;
    this.flag = flag; // 0 可以通过 1不能通过
    this.state = -1; // 0 在openList 1 在closeList -1 未处理

    this.f = 0;
    this.g = 0;
    this.h = 0;
    this.parent = null;
};

var FindPathGame = function () {
    function FindPathGame(maze) {
        _classCallCheck(this, FindPathGame);

        if (maze instanceof Maze) {
            this.r = 2 * maze.r + 1;
            this.c = 2 * maze.c + 1;
            this.pathArr = [];

            var oriArr = maze.arr;
            this.ctx = maze.ctx;
            this.canvas = maze.canvas;

            this.openList = [];
            this.closeList = [];

            this.start = null;
            this.end = null;

            this.quickSort = this.quickSort.bind(this);

            this.initArr(oriArr);

            this.findPath = this.findPath.bind(this);
            this.render = this.render.bind(this);
            this.removeEvent = this.removeEvent.bind(this);
            this.addEvent = this.addEvent.bind(this);
        } else {
            console.error('There is no maze!');
            return;
        }
    }

    _createClass(FindPathGame, [{
        key: 'initArr',
        value: function initArr(oriArr) {
            var _this = this;

            oriArr.forEach(function (row, i) {
                _this.pathArr[i] = [];
                row.forEach(function (col, n) {
                    _this.pathArr[i][n] = new Point(i, n, col);
                });
            });
        }
    }, {
        key: 'findPath',
        value: function findPath(start, end) {
            var curPoint = start;
            // 上下左右顶点偏移量
            var near = [{
                r: -1,
                c: 0
            }, {
                r: 1,
                c: 0
            }, {
                r: 0,
                c: -1
            }, {
                r: 0,
                c: 1
            }];
            var finded = false;
            start.f = start.h = this.distPoint(start, end);
            this.openList.push(start);

            while (this.openList.length > 0) {
                curPoint = this.openList.pop();
                curPoint.state = 1;
                this.closeList.push(curPoint);
                finded = this.processPoint(near, curPoint, end);
                if (finded) {
                    break;
                }
            }
        }
    }, {
        key: 'distPoint',
        value: function distPoint(ori, tar) {
            return Math.abs(ori.r - tar.r) + Math.abs(ori.c - tar.c);
        }
    }, {
        key: 'processPoint',
        value: function processPoint(near, curPoint, end) {
            var len = near.length,
                i = 0;

            while (i < len) {
                var tr = curPoint.r + near[i].r,
                    tc = curPoint.c + near[i].c;
                if (this.between(tr, 0, this.r - 1) && this.between(tc, 0, this.c - 1)) {
                    var tp = this.pathArr[tr][tc];
                    if (tp.flag === 0 && tp.state !== 1) {
                        // 判断 tp 是否为终点
                        if (this.isEqual(tp, end)) {
                            tp.parent = curPoint;
                            return true;
                        }
                        // tp不在openList（估值未计算）
                        if (tp.state === -1) {
                            tp.parent = curPoint;
                            tp.g = curPoint.g + 1;
                            tp.h = this.distPoint(tp, end);
                            tp.f = tp.g + tp.h;
                            this.addArrSort(this.openList, tp, this.comPonitF);
                        } else {
                            var g = curPoint + 1;
                            if (g < tp.g) {
                                tp.g = g;
                                tp.f = tp.g + tp.h;
                                this.quickSort(this.openList, 0, this.openList.length, this.comPonitF);
                            }
                        }
                    }
                }
                ++i;
            }
            return false;
        }
    }, {
        key: 'isEqual',
        value: function isEqual(p1, p2) {
            return p1.r === p2.r && p1.c === p2.c;
        }
    }, {
        key: 'between',
        value: function between(v, min, max) {
            return v >= min && v <= max;
        }
    }, {
        key: 'comPonitF',
        value: function comPonitF(p1, p2) {
            return p1.f - p2.f;
        }
    }, {
        key: 'addArrSort',
        value: function addArrSort(arr, point) {
            var fun = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function (a, b) {
                return a - b;
            };

            if (arr.length === 0) {
                arr.push(point);
                return;
            }
            var left = 0,
                right = arr.length - 1;
            while (left < right) {
                var mid = left + right >> 1;
                // console.log(arr)
                var result = fun(arr[mid], point);
                if (result > 0) {
                    right = mid - 1;
                } else if (result < 0) {
                    left = mid + 1;
                } else {
                    left = mid;
                    break;
                }
            }
            for (var i = arr.length - 1; i >= left; --i) {
                arr[i + 1] = arr[i];
            }
            arr[left] = point;
            return left;
        }
    }, {
        key: 'quickSort',
        value: function quickSort() {
            var arr = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
            var left = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
            var right = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : arr.length - 1;
            var fun = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : function (a, b) {
                return a - b;
            };

            if (left >= right) {
                return;
            }

            var index = this.sort(arr, left, right, fun);
            this.quickSort(arr, 0, index - 1);
            this.quickSort(arr, index + 1, right);
        }
    }, {
        key: 'sort',
        value: function sort() {
            var arr = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
            var left = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
            var right = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : arr.length - 1;
            var fun = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : function (a, b) {
                return a - b;
            };

            var tmp = arr[left];
            while (left < right) {
                while (left < right && fun(arr[right], tmp) > 0) {
                    --right;
                }
                arr[left] = arr[right];
                while (left < right && fun(arr[left], tmp) <= 0) {
                    ++left;
                }
                arr[right] = arr[left];
            }
            arr[left] = tmp;
            return left;
        }
    }, {
        key: 'render',
        value: function render(end) {
            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.fillStyle = 'red';
            this.ctx.fillRect(end.c * 10, end.r * 10, 10, 10);
            var tar = end.parent;

            while (tar) {
                this.ctx.fillRect(tar.c * 10, tar.r * 10, 10, 10);
                tar = tar.parent;
            }
            this.ctx.stroke();
            this.ctx.restore();
            this.renderPer(this.start, 'yellow');
            this.renderPer(this.end, 'blue');
        }
    }, {
        key: 'renderPer',
        value: function renderPer(point) {
            var color = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'red';

            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.fillStyle = color;
            this.ctx.fillRect(point.c * 10, point.r * 10, 10, 10);
            this.ctx.fill();
            this.ctx.restore();
        }
    }, {
        key: 'bindEvent',
        value: function bindEvent() {
            this.canvas.addEventListener('click', this.addEvent);
        }
    }, {
        key: 'addEvent',
        value: function addEvent(e) {
            if (this.start && this.end) {
                this.removeEvent();
                return;
            }
            var c = ~~(e.offsetX / 10),
                r = ~~(e.offsetY / 10);
            if (this.pathArr[r][c].flag === 0) {
                if (!this.start) {
                    this.start = this.pathArr[r][c];
                    this.renderPer(this.start, 'yellow');
                } else {
                    this.end = this.pathArr[r][c];
                    this.findPath(this.start, this.end);
                    this.render(this.end);
                }
            }
        }
    }, {
        key: 'removeEvent',
        value: function removeEvent() {
            this.canvas.removeEventListener('click', this.addEvent);
        }
    }]);

    return FindPathGame;
}();