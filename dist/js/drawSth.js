"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

window.onload = function () {
    new DrawSth('canvas');
};

var DrawSth = function () {
    function DrawSth(id) {
        _classCallCheck(this, DrawSth);

        if (!this.init(id)) {
            return;
        }
        this.colors = ["#000000", "#999999", "#FF0000", "#FF9900", "#FFFF00", "#008000", "#00CCFF", "#0099FF", "#FF33CC", "#CC66FF", "#FFCCCC", "#6633FF", "#CCFFCC"];
        this.pans = [1, 2, 3, 4, 5];
        this.eraser = [1, 2, 3];

        this.canPaint = false;

        this.color = '#000';
        this.line = 1;

        this.initTool(this.colors, this.initColorBox, 'color-box');
        this.initTool(this.pans, this.initPanBox, 'pan-box');
        this.initTool(this.eraser, this.initEraserBox, 'eraser-box');

        this.bindEvent = this.bindEvent.bind(this);

        this.bindEvent();
    }

    _createClass(DrawSth, [{
        key: "init",
        value: function init(id) {
            if (!id) {
                console.error('no id');
                return;
            }

            this.canvas = document.getElementById(id);
            if (!this.canvas) {
                this.canvas = document.createElement('canvas');
                this.canvas.width = 500;
                this.canvas.height = 500;
                this.canvas.style.border = '1px solid pink';
                document.body.appendChild(this.canvas);
            }

            this.ctx = this.canvas.getContext('2d');

            if (!this.ctx) {
                console.error("your browser doesn't support canvas");
                return;
            }

            return true;
        }
    }, {
        key: "initTool",
        value: function initTool(tools, modal, boxId) {
            if (!tools || !tools.length) {
                return;
            }

            var str = '',
                box = document.getElementById(boxId);
            for (var i = 0, len = tools.length; i < len; ++i) {
                str += modal(tools[i]);
            }
            box.innerHTML = str;
        }
    }, {
        key: "initColorBox",
        value: function initColorBox(tool) {
            return "<span class='color' style='background: " + tool + "' data-color='" + tool + "'></span>";
        }
    }, {
        key: "initPanBox",
        value: function initPanBox(tool) {
            return "<i class='pan pan-" + tool + "' data-line='" + tool + "'></i>";
        }
    }, {
        key: "initEraserBox",
        value: function initEraserBox(tool) {
            return "<span class='eraser eraser-" + tool + "' data-radius='" + tool * 5 + "'></span>";
        }
    }, {
        key: "bindEvent",
        value: function bindEvent() {
            var _this = this;

            this.canvas.addEventListener('mousedown', function (e) {
                _this.ctx.beginPath();
                _this.canPaint = true;
                _this.ctx.moveTo(e.offsetX, e.offsetY);
            });
            this.canvas.addEventListener('mousemove', function (e) {
                if (_this.canPaint) {
                    _this.ctx.lineTo(e.offsetX, e.offsetY);
                    _this.ctx.stroke();
                }
            });
            this.canvas.addEventListener('mouseup', function (e) {
                _this.canPaint = false;
            });

            document.getElementById('color-box').addEventListener('click', function (e) {
                _this.ctx.closePath();
                _this.color = e.target.getAttribute('data-color');
                _this.ctx.strokeStyle = _this.color;
                _this.ctx.lineWidth = _this.line;
            });

            document.getElementById('pan-box').addEventListener('click', function (e) {
                _this.ctx.closePath();
                _this.line = e.target.getAttribute('data-line');
                _this.ctx.lineWidth = _this.line;
                _this.ctx.strokeStyle = _this.color;
            });

            document.getElementById('eraser-box').addEventListener('click', function (e) {
                _this.ctx.closePath();
                _this.ctx.strokeStyle = '#fff';
                _this.ctx.lineWidth = e.target.getAttribute('data-radius');
            });
        }
    }]);

    return DrawSth;
}();