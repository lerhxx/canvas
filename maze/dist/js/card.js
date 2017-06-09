"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Card = function Card(r, c, pic) {
    _classCallCheck(this, Card);

    this.r = r;
    this.c = c;
    this.flag = 1;
    this.picIndex = pic;
    this.isMatch = false;
};