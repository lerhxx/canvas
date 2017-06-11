"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Card = function () {
    function Card(obj) {
        _classCallCheck(this, Card);

        this.r = 0;
        this.c = 0;
        this.w = 0; // 图片宽度
        this.h = 0; // 图片高度
        this.cx = 0; // 图片在canvas中的横坐标
        this.cy = 0; // 图片在canvas中的纵坐标
        this.cw = 0; // 图片在canvas中的宽度
        this.ch = 0; // 图片在canvas中的高度
        this.picIndex = -1;
        this.img = null;
        this.backImg = null;
        this.rotation = 0;
        this.owner = null;

        Object.assign(this, obj);
    }

    _createClass(Card, [{
        key: "render",
        value: function render() {
            return;
        }
    }]);

    return Card;
}();