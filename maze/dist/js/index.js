"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Maze = function () {
    function Maze(r, c) {
        _classCallCheck(this, Maze);

        this.r = r;
        this.c = c;
        this.accessed = [];
        this.notAccessed = [];
        this.arr = [];

        this.init();
    }

    _createClass(Maze, [{
        key: "init",
        value: function init() {
            this.initArray();
            console.log(this.arr);
        }
    }, {
        key: "initArray",
        value: function initArray() {
            for (var i = 0; i < 2 * this.r + 1; ++i) {
                for (var n = 0; n < 2 * this.c + 1; ++n) {
                    if (c ^ c - 1 === 1) {
                        this.arr.push(1);
                    } else {
                        this.arr.push(0);
                        this.notAccessed.push(0);
                    }
                }
            }
        }
    }]);

    return Maze;
}();