'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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