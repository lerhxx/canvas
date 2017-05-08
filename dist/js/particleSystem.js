'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

window.addEventListener('load', function () {
    var canvas = document.getElementById('particle'),
        ctx = canvas.getContext('2d'),
        run = document.getElementById('run');

    canvas.width = 500;
    canvas.height = 500;
    ctx.fillStyle = 'black';

    var play = new Play(ctx, canvas);
    run.addEventListener('click', play.start);
});

var Color = function Color(r, g, b) {
    _classCallCheck(this, Color);

    this.r = r;
    this.g = g;
    this.b = b;
};

Color.red = new Color(1, 0, 0);

var Vector2 = function () {
    function Vector2(x, y) {
        _classCallCheck(this, Vector2);

        this.x = x;
        this.y = y;
    }

    _createClass(Vector2, [{
        key: 'add',
        value: function add(v) {
            return new Vector2(this.x + v.x, this.y + v.y);
        }
    }, {
        key: 'substract',
        value: function substract(v) {
            return new Vector2(this.x - v.x, this.y - v.y);
        }
    }, {
        key: 'multiply',
        value: function multiply(f) {
            return new Vector2(this.x * f, this.y * f);
        }
    }, {
        key: 'divide',
        value: function divide(f) {
            return new Vector2(this.x / f, this.y / f);
        }
    }, {
        key: 'dot',
        value: function dot(v) {
            return new Vector2(this.x * v.x + this.y * v.y);
        }
    }, {
        key: 'negate',
        value: function negate() {
            return new Vector2(-this.x, -this.y);
        }
    }, {
        key: 'normalize',
        value: function normalize() {
            var len = this.length();
            return new Vector2(this.x / len, this.y / len);
        }
    }, {
        key: 'length',
        value: function length() {
            return Math.sqrt(this.sqrLength());
        }
    }, {
        key: 'sqrLength',
        value: function sqrLength() {
            return this.x * this.x + this.y * this.y;
        }
    }, {
        key: 'copy',
        value: function copy() {
            return new Vector2(this.x, this.y);
        }
    }]);

    return Vector2;
}();

Vector2.zero = new Vector2(0, 0);

var Particle = function Particle(position, velocity, radius, life, color) {
    _classCallCheck(this, Particle);

    this.position = position;
    this.velocity = velocity;
    this.acceleration = Vector2.zero;
    this.age = 0;
    this.life = life;
    this.color = color;

    this.r = radius;
    this.dt = .1;
};

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
        key: 'emit',
        value: function emit(particle) {
            this.particles.push(particle);
        }
    }, {
        key: 'aging',
        value: function aging(dt) {
            var len = this.particles.length,
                p = void 0;
            for (var _i = 0; _i < len;) {
                p = this.particles[_i];
                p.age += dt;
                if (p.age > p.life) {
                    this.kill(_i);
                    --len;
                } else {
                    ++_i;
                }
            }
        }
    }, {
        key: 'kill',
        value: function kill(i) {
            var len = this.particles.length;
            if (len > 1) {
                this.particles[i] = this.particles[len - 1];
            }
            this.particles.pop();
        }
    }, {
        key: 'simulate',
        value: function simulate(dt) {
            this.aging(dt);
            this.applyGravity();
            this.applyEffectors();
            this.kinematics(dt);
        }
    }, {
        key: 'render',
        value: function render(ctx) {
            var len = this.particles.length,
                i = 0;
            for (; i < len; ++i) {
                var p = this.particles[i];
                var alpha = 1 - p.age / p.life;
                ctx.fillStyle = 'rgba(' + Math.floor(p.color.r * 255) + ', ' + Math.floor(p.color.g * 255) + ', ' + Math.floor(p.color.b * 255) + ', ' + alpha.toFixed(2) + ')';
                ctx.beginPath();
                ctx.arc(p.position.x, p.position.y, p.r, 0, Math.PI * 2, true);
                ctx.closePath();
                ctx.fill();
            }
        }
    }, {
        key: 'applyGravity',
        value: function applyGravity() {
            var len = this.particles.length,
                i = 0;
            for (; i < len; ++i) {
                var p = this.particles[i];
                p.acceleration = this.gravity;
            }
        }
    }, {
        key: 'applyEffectors',
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
        key: 'kinematics',
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

var Play = function () {
    function Play(ctx, canvas) {
        _classCallCheck(this, Play);

        this.particleSystem = new ParticleSystem();
        this.dt = .01;
        this.ctx = ctx;
        this.canvas = canvas;
        this.oldPosition = Vector2.zero;
        this.newPosition = Vector2.zero;

        this.particleSystem.effectors.push(new ChamberBox(0, 0, this.canvas.width, this.canvas.height));
        this.step = this.step.bind(this);
        this.start = this.start.bind(this);
        this.sampleDirection = this.sampleDirection.bind(this);
        this.samplyNumber = this.samplyNumber.bind(this);
        this.clearCanvas = this.clearCanvas.bind(this);
        this.bindEvent();
    }

    _createClass(Play, [{
        key: 'step',
        value: function step() {
            if (this.oldPosition == Vector2.zero && this.newPosition == Vector2.zero) {} else {
                if (this.particleSystem.particles.length === 0) {
                    this.oldPosition = this.newPosition;
                }
                var velocity = this.newPosition.substract(this.oldPosition).multiply(10);
                velocity = velocity.add(this.sampleDirection(0, Math.PI * 2).multiply(20));
                var life = this.samplyNumber(1, 2),
                    size = this.samplyNumber(2, 4);
                this.particleSystem.emit(new Particle(this.newPosition, velocity, size, life, Color.red));
                this.oldPosition = this.newPosition;
                this.particleSystem.simulate(this.dt);

                this.clearCanvas();
                ++y;
                this.particleSystem.render(this.ctx);
            }
            requestAnimationFrame(this.step);
            // }
        }
    }, {
        key: 'start',
        value: function start() {
            // console.log(this)
            y = 0;
            this.particleSystem.particles = [];
            this.position = new Vector2(10, 200);
            this.velocity = new Vector2(50, -50);
            this.acceleration = new Vector2(0, 10);
            y = 0;
            requestAnimationFrame(this.step);
        }
    }, {
        key: 'sampleDirection',
        value: function sampleDirection(a1, a2) {
            // let theta = Math.random() * 2 * Math.PI;
            // return new Vector2(Math.cos(theta), Math.sin(theta));
            var t = Math.random();
            var theta = a1 * t + a2 * (1 - t);
            return new Vector2(Math.cos(theta), Math.sin(theta));
        }
    }, {
        key: 'samplyNumber',
        value: function samplyNumber(n1, n2) {
            var t = Math.random();
            return n1 * t + n2 * (1 - t);
        }
    }, {
        key: 'bindEvent',
        value: function bindEvent() {
            var _this = this;

            this.canvas.addEventListener('mousemove', function (e) {
                _this.newPosition = new Vector2(e.offsetX, e.offsetY);
                var velocity = _this.newPosition.substract(_this.oldPosition);
            });
        }
    }, {
        key: 'clearCanvas',
        value: function clearCanvas() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }]);

    return Play;
}();

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
        key: 'apply',
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

var y = 0;
var i = 0,
    a = [];
for (; i < 1000000; ++i) {
    a.push(i);
}
console.time('forin');
for (i = 0; i < 1000000; ++i) {
    ++y;
}
console.timeEnd('forin');
y = 0;
console.time('forEach');
a.forEach(function () {
    ++y;
});
console.timeEnd('forEach');
y = 0;
console.time('forof');
for (var x in a) {
    ++y;
}
console.timeEnd('forof');