'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Card = function Card(r, c, pic) {
    _classCallCheck(this, Card);

    this.r = r;
    this.c = c;
    this.flag = 1;
    this.picIn = pic;
};

var linkGame = function () {
    function linkGame(r, c, id) {
        _classCallCheck(this, linkGame);

        if (typeof id !== 'string') {
            console.err('There is no id');
            return;
        }
        this.getCanvas(id);
        if (!this.canvas) {
            return;
        }
        console.log('start');

        this.r = r;
        this.c = c;
        this.pathArr = [];
        this.imgNum = 9;

        this.createMaze();
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
    }, {
        key: 'createMaze',
        value: function createMaze() {
            for (var i = 0; i < this.r; ++i) {
                this.pathArr[i] = [];
                for (var n = 0; n < this.c; ++n) {
                    this.pathArr[i][n] = new Card(i, n, MathUtil.randomInt(this.imgNum));
                }
            }
            console.log(this.pathArr);
        }
    }]);

    return linkGame;
}();

new linkGame(10, 10, 'canvas');

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