'use strict';

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EventListener = function EventListener() {
    _classCallCheck(this, EventListener);
};

var AppEventListener = function (_EventListener) {
    _inherits(AppEventListener, _EventListener);

    function AppEventListener() {
        var param = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, AppEventListener);

        var _this = _possibleConstructorReturn(this, (AppEventListener.__proto__ || Object.getPrototypeOf(AppEventListener)).call(this));

        _this.enable = true;

        _this.beforeRender = param['beforeRender'] || _this.beforeRender;
        _this.afterRender = param['afterRender'] || _this.afterRender;
        return _this;
    }

    _createClass(AppEventListener, [{
        key: 'beforeRender',
        value: function beforeRender() {
            return true;
        }
    }, {
        key: 'afterRender',
        value: function afterRender() {
            return true;
        }
    }]);

    return AppEventListener;
}(EventListener);

var FrameState = function () {
    function FrameState() {
        _classCallCheck(this, FrameState);

        this.sTime = 0;
        this.curTime = 0;
        this.elapseTime = 0;
        this.minFrame = 999999;
        this.maxFrame = 0;
        this.curFrame = 0;
    }

    _createClass(FrameState, [{
        key: 'start',
        value: function start() {
            this.curTime = this.sTime = new Date();
        }
    }, {
        key: 'update',
        value: function update() {
            var time = new Date();
            this.elapseTime = time - this.curTime;
            this.curTime = time;
            if (time - this.sTime > 1000) {
                this.minFrame = this.curFrame < this.minFrame ? this.curFrame : this.minFrame;
                this.maxFrame = this.curFrame > this.maxFrame ? this.curFrame : this.maxFrame;
                this.sTime = time;
                this.curFrame = 0;
            } else {
                ++this.curFrame;
            }
        }
    }]);

    return FrameState;
}();

var RenderObj = function () {
    function RenderObj() {
        var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, RenderObj);

        this.name = args.name || 'name' + ++RenderObj.id;
        this.x = args.x || 0;
        this.y = args.y || 0;
        this.vx = args.vx || 0;
        this.vy = args.vy || 0;
        this.ax = args.ax || 0;
        this.ay = args.ay || 0;
        this.deg = args.deg || 0;
        this.canRemove = false;
    }

    _createClass(RenderObj, [{
        key: 'moveTo',
        value: function moveTo() {
            var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.x;
            var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.y;

            this.x = x;
            this.y = y;
        }
    }, {
        key: 'move',
        value: function move() {
            var xOff = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
            var yOff = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

            this.x += xOff;
            this.y += yOff;
        }
    }, {
        key: 'moveStep',
        value: function moveStep() {
            this.vx += this.ax;
            this.vy += this.ay;

            this.x += this.vx;
            this.y += this.vy;
        }
    }, {
        key: 'rotate',
        value: function rotate(deg) {
            this.deg = deg;
        }
    }, {
        key: 'update',
        value: function update() {
            this.moveStep();
        }
    }, {
        key: 'render',
        value: function render(ctx) {
            return;
        }
    }]);

    return RenderObj;
}();

RenderObj.id = 0;

var Ball = function (_RenderObj) {
    _inherits(Ball, _RenderObj);

    function Ball(name) {
        var r = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 10;

        _classCallCheck(this, Ball);

        var _this2 = _possibleConstructorReturn(this, (Ball.__proto__ || Object.getPrototypeOf(Ball)).call(this, { name: name }));

        _this2.r = r;
        _this2.color = 'white';
        return _this2;
    }

    _createClass(Ball, [{
        key: 'update',
        value: function update() {
            var w = this.owner.w,
                h = this.owner.h;
            if (this.x < this.r || this.x + this.r > w) {
                this.vx = -this.vx;
            }

            if (this.y < this.r || this.y + this.r > h) {
                this.vy = -this.vy;
            }

            _get(Ball.prototype.__proto__ || Object.getPrototypeOf(Ball.prototype), 'update', this).call(this);
        }
    }, {
        key: 'render',
        value: function render(ctx) {
            ctx.beginPath();
            ctx.fillStyle = this.color;
            ctx.arc(this.x, this.y, this.r - 3, 0, Math.PI * 2, false);
            ctx.fill();
            ctx.closePath();

            ctx.beginPath();
            ctx.strokeStyle = 'black';
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
            ctx.stroke();
            ctx.closePath();
        }
    }]);

    return Ball;
}(RenderObj);

var Scene = function () {
    function Scene() {
        var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, Scene);

        this.name = args.name || 'name ' + ++Scene.sceneId;

        this.x = args.x || 0;
        this.y = args.y || 0;
        this.w = args.w || 320;
        this.h = args.h || 200;
        this.color = args.color || 'black';

        this.holder = this.createHolder();
        this.canvas = this.createCanvas();
        this.ctx = this.canvas.getContext('2d');

        this.renderObj = [];
        this.renderObjName = {};
        this.listeners = [];

        this.setPos();
        this.setSize();
        this.setColor(this.color);

        this.holder.appendChild(this.canvas);

        document.body.appendChild(this.holder);
    }

    // 创建容器


    _createClass(Scene, [{
        key: 'createHolder',
        value: function createHolder() {
            var div = document.createElement('div');
            div.style.position = 'absolute';

            return div;
        }

        // 创建画布

    }, {
        key: 'createCanvas',
        value: function createCanvas() {
            var canvas = document.createElement('canvas');
            canvas.style.position = 'absolute';
            canvas.style.zIndex = -1;
            canvas.width = this.w;
            canvas.height = this.h;
            return canvas;
        }
    }, {
        key: 'createRObj',
        value: function createRObj() {
            var obj = new Ball();
            this.addRObj(obj);
            return obj;
        }
    }, {
        key: 'addRObj',
        value: function addRObj(obj) {
            obj.owner = this;
            this.renderObj.push(obj);
            this.renderObjName[obj.name] = obj;
        }
    }, {
        key: 'removeRObj',
        value: function removeRObj(obj) {
            this.removeRObjByName(obj.name);
        }
    }, {
        key: 'removeRObjByName',
        value: function removeRObjByName(name) {
            var obj = this.renderObjName[name];
            obj && (obj.canRemove = true);
        }
    }, {
        key: 'removeAllCanRemove',
        value: function removeAllCanRemove() {
            for (var i = 0, len = this.renderObj.length; i < len; ++i) {
                var obj = this.renderObj[i].canRemove;
                if (obj) {
                    this.renderObj.splice(i, 1);
                    delete this.renderObjName[obj.name];
                }
            }
        }
    }, {
        key: 'clearRObj',
        value: function clearRObj() {
            this.renderObj = [];
            this.renderObjName = {};
        }
    }, {
        key: 'getRObjName',
        value: function getRObjName(name) {
            return this.renderObjName[name];
        }
    }, {
        key: 'addListener',
        value: function addListener(listener) {
            this.listeners.push(listener);
        }
    }, {
        key: 'clearListener',
        value: function clearListener() {
            this.listeners = [];
        }

        // 定位

    }, {
        key: 'setPos',
        value: function setPos(x, y) {
            this.x = x || this.x;
            this.y = x || this.y;
            this.holder.style.left = this.x;
            this.holder.style.top = this.y;
        }

        // 调整尺寸

    }, {
        key: 'setSize',
        value: function setSize(w, h) {
            this.w = w || this.w;
            this.h = h || this.h;
            this.holder.style.width = this.h;
            this.holder.style.height = this.h;
        }

        // 设置背景颜色

    }, {
        key: 'setColor',
        value: function setColor(color) {
            this.holder.style.backgroundColor = color || this.color;
        }

        //更新场景

    }, {
        key: 'update',
        value: function update() {
            for (var i = 0, len = this.renderObj.length; i < len; ++i) {
                this.renderObj[i].update();
            }
            this.removeAllCanRemove();
        }

        // 渲染场景

    }, {
        key: 'render',
        value: function render() {
            this.clear();
            for (var i = 0, len = this.listeners.length; i < len; ++i) {
                this.listeners.enable && this.listeners[i].beforeRender();
            }

            this.renderRObj();

            for (var _i = 0, _len = this.listeners.length; _i < _len; ++_i) {
                this.listeners.enable && this.listeners[_i].afterRender();
            }
        }
    }, {
        key: 'renderRObj',
        value: function renderRObj() {
            for (var i = 0, len = this.renderObj.length; i < len; ++i) {
                this.ctx.save();
                this.renderObj[i].render(this.ctx);
                this.ctx.restore();
            }
        }

        // 清除背景

    }, {
        key: 'clear',
        value: function clear() {
            this.ctx.clearRect(0, 0, this.w, this.h);
        }

        // 显示场景

    }, {
        key: 'show',
        value: function show() {
            this.holder.style.display = 'block';
        }

        // 隐藏场景

    }, {
        key: 'hide',
        value: function hide() {
            this.holder.style.display = 'none';
        }

        // 场景淡入

    }, {
        key: 'fadeIn',
        value: function fadeIn() {}

        // 场景淡出

    }, {
        key: 'fadeOut',
        value: function fadeOut() {}

        // 设置背景图

    }, {
        key: 'setBGImg',
        value: function setBGImg(img, patern) {
            this.holder.style.backgroundImage = 'url(' + img + ')';
            switch (pattern) {
                case 1:
                    this.holder.style.backgroundPosition = 'center';
                    this.holder.style.backgroundRepeat = 'no-repeat';
                    break;
                case 2:
                    this.holder.style.backgroundSize = this.w + 'px ' + this.h + 'px';
                    break;
            }
        }

        // 清除场景

    }, {
        key: 'clean',
        value: function clean() {
            this.listeners = null;
            document.body.removeChild(this.holder);
            this.holder = this.canvas = this.ctx = null;
        }
    }]);

    return Scene;
}();

Scene.sceneId = 0;

var SceneManage = function () {
    function SceneManage() {
        _classCallCheck(this, SceneManage);

        this.scenesNamed = {};
        this.scenes = [];
    }

    // 创建场景


    _createClass(SceneManage, [{
        key: 'createScene',
        value: function createScene(args) {
            var scene = new Scene(args);
            this.pushScene(scene);
            return scene;
        }

        // 移除当前场景

    }, {
        key: 'removeCurScene',
        value: function removeCurScene() {
            var scene = null;
            if (this.scenes.length > 0) {
                scene = this.scenes.pop();
                delete this.scenesNamed[scene.name];
                scene.clean();
            }

            return scene;
        }

        // 移除所有场景

    }, {
        key: 'removeAllScene',
        value: function removeAllScene() {
            this.scenes.length = 0;
            this.scenesNamed = {};
        }

        // 移除所有场景

    }, {
        key: 'removeTarScene',
        value: function removeTarScene(name) {
            var scene = this.getScene(name),
                index = -1;
            if (scene) {
                index = this.getIndex(scene);
                this.scenes.splice(index, 1);
                delete this.scenesNamed[name];
                scene.clean();
                this.sortScenes();
            }
        }

        // 添加场景

    }, {
        key: 'pushScene',
        value: function pushScene(scene) {
            if (!this.getScene(scene.name)) {
                this.scenes.push(scene);
                this.scenesNamed[scene.name] = scene;
                return this.scenes.length;
                this.sortScenes();
            }
        }

        // 交换场景顺序

    }, {
        key: 'swapScene',
        value: function swapScene(from, to) {
            var len = this.scenes.length;
            if (from > 0 && from < len && to > 0 && to < len) {
                var tmp = from;
                from = to;
                to = tmp;
                this.sortScenes();
            }
        }

        // 场景前移

    }, {
        key: 'forwardScene',
        value: function forwardScene(name) {
            var index = this.getIndex(scene);
            if (index > 0) {
                this.swapScene(this.scenes[index], this.scenes[index + 1]);
            } else if (index === this.scenes.length - 1) {
                this.swapScene(this.scenes[index], this.scenes[0]);
            }
            this.sortScenes();
        }

        // 场景后移

    }, {
        key: 'backwardScene',
        value: function backwardScene(name) {
            var index = this.getIndex(scene),
                len = this.scenes.length;
            if (index > 0) {
                this.swapScene(this.scenes[index], this.scenes[index - 1]);
            } else if (index === 0) {
                this.swapScene(this.scenes[index], this.scenes[this.scenes.length - 1]);
            }
            this.sortScenes();
        }

        // 场景移到顶部

    }, {
        key: 'moveToTop',
        value: function moveToTop(scene) {
            var index = this.getIndex(scene);
            this.scenes.splice(index, 1);
            this.scenes.push(scene);
            this.sortScenes();
        }

        // 场景移到底部

    }, {
        key: 'moveToBottom',
        value: function moveToBottom(scene) {
            var index = this.getIndex(scene);
            this.scenes.splice(index, 1);
            this.scenes.unshift(scene);
            this.sortScenes();
        }

        // 场景排序

    }, {
        key: 'sortScenes',
        value: function sortScenes() {
            for (var i = 0, len = this.scenes.length; i < len; ++i) {
                this.scenes[i].holder.style.zIndex = i;
            }
        }

        // 获取当前场景

    }, {
        key: 'getCurScene',
        value: function getCurScene() {
            return this.scenes[this.scenes.length - 1];
        }

        // 获取场景索引

    }, {
        key: 'getIndex',
        value: function getIndex(name) {
            var index = -1;
            for (var i = 0, len = this.scenes.length; i < len; ++i) {
                if (this.scenes[i].name === name) {
                    index = i;
                    break;
                }
            }
            return index;
        }

        // 获取场景

    }, {
        key: 'getScene',
        value: function getScene(name) {
            return this.scenesNamed[name];
        }
    }]);

    return SceneManage;
}();

var Game = function () {
    function Game() {
        _classCallCheck(this, Game);

        this.handle = null;
        this.paused = false;
        this.frameState = new FrameState();

        this.run = this.run.bind(this);
        this.mainLoop = this.mainLoop.bind(this);
        this.listenerList = [];

        this.maxF = document.getElementById('max');
        this.minF = document.getElementById('min');
        this.curF = document.getElementById('cur');

        this.sceneManage = new SceneManage();

        this.executeListener = this.executeListener.bind(this);

        this.addListener(new AppEventListener({
            'beforeRender': function beforeRender() {
                // console.log('beforeRender')
            },
            'afterRender': function afterRender() {
                // console.log('afterRender')
            }
        }));
    }

    _createClass(Game, [{
        key: 'mainLoop',
        value: function mainLoop() {
            this.handle = requestAnimationFrame(this.mainLoop);
            this.frameState.update();
            this.executeListener('beforeRender');

            var scene = this.sceneManage.getCurScene();
            if (scene) {
                scene.update();
                scene.render();
            }

            if (!this.paused) {
                this.maxF.innerHTML = this.frameState.maxFrame;
                this.minF.innerHTML = this.frameState.minFrame;
                this.curF.innerHTML = this.frameState.curFrame;
            }
            this.executeListener('afterRender');
        }
    }, {
        key: 'run',
        value: function run() {
            this.frameState.start();
            this.mainLoop();
        }
    }, {
        key: 'pause',
        value: function pause() {
            this.paused = true;
        }
    }, {
        key: 'stop',
        value: function stop() {
            cancelAnimationFrame(this.handle);
        }
    }, {
        key: 'addListener',
        value: function addListener(listener) {
            this.listenerList.push(listener);
        }
    }, {
        key: 'clearListener',
        value: function clearListener() {
            this.listenerList.length = 0;
        }
    }, {
        key: 'removeListener',
        value: function removeListener(listener) {
            var index = this.listenerList.indexOf(listener);
            this.listenerList[index] = this.listenerList[this.listenerList.length - 1];
            this.listenerList.pop();
        }
    }, {
        key: 'executeListener',
        value: function executeListener(method) {
            for (var i = 0, len = this.listenerList.length; i < len; ++i) {
                this.listenerList[i].enable && this.listenerList[i][method]();
            }
        }
    }]);

    return Game;
}();

var BallGame = function () {
    function BallGame() {
        _classCallCheck(this, BallGame);

        this.game = new Game();
        this.initGame();
        this.game.run();
    }

    _createClass(BallGame, [{
        key: 'initGame',
        value: function initGame() {
            var sc = this.game.sceneManage.createScene({ w: 500, h: 500 });
            this.initRObj(sc);
        }
    }, {
        key: 'initRObj',
        value: function initRObj(sc) {
            for (var i = 0; i < 20; ++i) {
                var ball = sc.createRObj();
                ball.moveTo(randomInt(20, sc.w - 20), randomInt(20, sc.h - 20));
                ball.vx = randomInt(1, 3);
                ball.vy = randomInt(1, 3);
                ball.color = 'rgb(' + Math.floor(Math.random() * 256) + ', ' + Math.floor(Math.random() * 256) + ', ' + Math.floor(Math.random() * 256) + ')';
            }
        }
    }]);

    return BallGame;
}();

new BallGame();

function randomInt(a, b) {
    return Math.floor(Math.random() * (b - a) + a);
}