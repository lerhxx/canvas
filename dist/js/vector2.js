"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Vector2 = function () {
    function Vector2(x, y) {
        _classCallCheck(this, Vector2);

        this.x = x;
        this.y = y;
    }

    _createClass(Vector2, [{
        key: "add",
        value: function add(v) {
            return new Vector2(this.x + v.x, this.y + v.y);
        }
    }, {
        key: "substract",
        value: function substract(v) {
            return new Vector2(this.x - v.x, this.y - v.y);
        }
    }, {
        key: "multiply",
        value: function multiply(f) {
            return new Vector2(this.x * f, this.y * f);
        }
    }, {
        key: "divide",
        value: function divide(f) {
            return new Vector2(this.x / f, this.y / f);
        }
    }, {
        key: "dot",
        value: function dot(v) {
            return new Vector2(this.x * v.x + this.y * v.y);
        }
    }, {
        key: "negate",
        value: function negate() {
            return new Vector2(-this.x, -this.y);
        }
    }, {
        key: "normalize",
        value: function normalize() {
            var len = this.length();
            return new Vector2(this.x / len, this.y / len);
        }
    }, {
        key: "length",
        value: function length() {
            return Math.sqrt(this.sqrLength());
        }
    }, {
        key: "sqrLength",
        value: function sqrLength() {
            return this.x * this.x + this.y * this.y;
        }
    }, {
        key: "copy",
        value: function copy() {
            return new Vector2(this.x, this.y);
        }
    }]);

    return Vector2;
}();

Vector2.zero = new Vector2(0, 0);