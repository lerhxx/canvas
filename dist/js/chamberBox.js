"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ChamberBox = function () {
    function ChamberBox(x1, y1, x2, y2) {
        _classCallCheck(this, ChamberBox);

        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.apply = this.apply.bind(this);
    }

    _createClass(ChamberBox, [{
        key: "apply",
        value: function apply(p) {
            if (p.position.x - p.r < this.x1 || p.position.x + p.r > this.x2) {
                p.velocity.x = -p.velocity.x;
            }
            if (p.position.y - p.r < this.y1 || p.position.y + p.r > this.y2) {
                p.velocity.y = -p.velocity.y;
            }
        }
    }]);

    return ChamberBox;
}();