'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var canvas = void 0,
    ctx = void 0,
    message = void 0,
    w = void 0,
    h = void 0,
    gridX = 7,
    gridY = 7,
    color = '#f36',
    shape = void 0;
window.onload = function () {
    canvas = document.getElementById('textParticle');
    ctx = canvas.getContext('2d');

    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;

    shape = new Shape(w / 2, h / 2);

    bindEvent();
};

window.addEventListener('resize', function () {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
}, false);

function bindEvent() {
    var messageInput = document.getElementById('text');
    messageInput.addEventListener('change', function () {
        message = this.value;
        shape.draw(message);
        // console.log(message);
    }, false);
}

var Shape = function () {
    function Shape(x, y) {
        _classCallCheck(this, Shape);

        this.x = x;
        this.y = y;
        this.particles = [];

        this.draw = this.draw.bind(this);
        this.getParticles = this.getParticles.bind(this);
    }

    _createClass(Shape, [{
        key: 'getParticles',
        value: function getParticles(message) {
            ctx.clearRect(0, 0, this.x, this.y);
            ctx.textAlign = 'center';
            ctx.font = '200px arial';
            ctx.fillText(message, w / 2, h / 2);

            var data = ctx.getImageData(0, 0, w, h),
                buffer32 = new Uint32Array(data.data.buffer);

            for (var n = 0; n < h; n += gridY) {
                for (var i = 0; i < w; i += gridX) {
                    if (buffer32[n * w + i]) {
                        this.particles.push(new Particle(new Vector2(i, n, 10, 10, color)));
                    }
                }
            }
        }
    }, {
        key: 'draw',
        value: function draw() {
            requestAnimationFrame(this.draw);
            this.getParticles(message);
            ctx.clearRect(0, 0, w, h);
            var len = this.particles.length;
            ctx.fillStyle = '#f36';
            for (var i = 0; i < len; ++i) {
                this.particles[i].update(ctx);
            }
        }
    }]);

    return Shape;
}();