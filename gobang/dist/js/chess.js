"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Chess = function Chess() {
    var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Chess);

    this.x = 0;
    this.y = 0;
    this.radius = 10; // 半径
    this.flag = 0; // 0为空，1为白棋，2为黑棋
    this.owner = null;

    Object.assign(this, obj);
};