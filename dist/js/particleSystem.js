"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ParticleSystem = function () {
    function ParticleSystem() {
        _classCallCheck(this, ParticleSystem);

        this.particles = [];
        this.gravity = new Vector2(0, 100);
        this.effectors = [];

        this.emit = this.emit.bind(this);
        this.aging = this.aging.bind(this);
        this.kill = this.kill.bind(this);
        this.simulate = this.simulate.bind(this);
        this.render = this.render.bind(this);
        this.applyGravity = this.applyGravity.bind(this);
        this.applyEffectors = this.applyEffectors.bind(this);
        this.kinematics = this.kinematics.bind(this);
    }

    _createClass(ParticleSystem, [{
        key: "emit",
        value: function emit(particle) {
            this.particles.push(particle);
        }
    }, {
        key: "aging",
        value: function aging(dt) {
            var len = this.particles.length,
                p = void 0;
            for (var i = 0; i < len;) {
                p = this.particles[i];
                p.age += dt;
                if (p.age > p.life) {
                    this.kill(i);
                    --len;
                } else {
                    ++i;
                }
            }
        }
    }, {
        key: "kill",
        value: function kill(i) {
            var len = this.particles.length;
            if (len > 1) {
                this.particles[i] = this.particles[len - 1];
            }
            this.particles.pop();
        }
    }, {
        key: "simulate",
        value: function simulate(dt) {
            this.aging(dt);
            this.applyGravity();
            this.applyEffectors();
            this.kinematics(dt);
        }
    }, {
        key: "render",
        value: function render(ctx) {
            var len = this.particles.length,
                i = 0;
            for (; i < len; ++i) {
                var p = this.particles[i];
                var alpha = 1 - p.age / p.life;
                ctx.fillStyle = "rgba(" + Math.floor(p.color.r * 255) + ", " + Math.floor(p.color.g * 255) + ", " + Math.floor(p.color.b * 255) + ", " + alpha.toFixed(2) + ")";
                ctx.beginPath();
                ctx.arc(p.position.x, p.position.y, p.r, 0, Math.PI * 2, true);
                ctx.closePath();
                ctx.fill();
            }
        }
    }, {
        key: "applyGravity",
        value: function applyGravity() {
            var len = this.particles.length,
                i = 0;
            for (; i < len; ++i) {
                var p = this.particles[i];
                p.acceleration = this.gravity;
            }
        }
    }, {
        key: "applyEffectors",
        value: function applyEffectors() {
            var len = this.effectors.length,
                l = this.particles.length,
                i = 0,
                n = 0,
                apply = void 0;
            for (; i < len; ++i) {
                n = 0;
                apply = this.effectors[i].apply;
                for (; n < l; ++n) {
                    apply(this.particles[n]);
                }
            }
        }
    }, {
        key: "kinematics",
        value: function kinematics(dt) {
            var len = this.particles.length,
                i = 0;
            for (; i < len; ++i) {
                var p = this.particles[i];
                p.position = p.position.add(p.velocity.multiply(dt));
                p.velocity = p.velocity.add(p.acceleration.multiply(dt));
            }
        }
    }]);

    return ParticleSystem;
}();