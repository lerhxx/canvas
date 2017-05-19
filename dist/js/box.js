'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Box = function Box() {
    var borderWidth = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 500;
    var color = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '#f36';
    var activity = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

    _classCallCheck(this, Box);

    this.w = Math.random() * 80 + 20;
    this.h = Math.random() * 40 + 10;
    this.x = (borderWidth - this.w) / 2;
    this.y = 0;
    this.vx = 0;
    this.vy = 0;
    this.color = color;
    console.log(this.color);
};