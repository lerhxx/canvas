"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Particle = function () {
    function Particle(position, velocity, radius, life, color) {
        _classCallCheck(this, Particle);

        this.position = position;
        this.velocity = velocity;
        this.acceleration = Vector2.zero;
        this.age = 0;
        this.life = life;
        this.color = color;

        this.r = radius;
        this.dt = .1;

        this.update = this.update.bind(this);
    }

    _createClass(Particle, [{
        key: "update",
        value: function update(ctx) {
            ctx.arc(this.position.x, this.position.y, this.r, 0, Math.PI * 2, false);
        }
    }]);

    return Particle;
}();