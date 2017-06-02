class EventListener {
    constructor() {
    }
}

class AppEventListener extends EventListener{
    constructor(param={}) {
        super();

        this.enable = true;

        this.beforeRender = param['beforeRender'] || this.beforeRender;
        this.afterRender = param['afterRender'] || this.afterRender;
    }

    beforeRender() {
        return true;
    }

    afterRender() {
        return true;
    }

}

class FrameState {
    constructor() {
        this.sTime = 0;
        this.curTime = 0;
        this.elapseTime = 0;
        this.minFrame = 999999;
        this.maxFrame = 0;
        this.curFrame = 0;
    }

    start() {
        this.curTime = this.sTime = new Date();
    }

    update() {
        let time = new Date();
        this.elapseTime = time - this.curTime;
        this.curTime = time;
        if(time - this.sTime > 1000) {
            this.minFrame = this.curFrame < this.minFrame ? this.curFrame : this.minFrame;
            this.maxFrame = this.curFrame > this.maxFrame ? this.curFrame : this.maxFrame;
            this.sTime = time;
            this.curFrame = 0;
        }else {
            ++this.curFrame;
        }
    }
}

class RenderObj {
    constructor(args={}) {
        this.name = args.name || `name${++RenderObj.id}`;
        this.x = args.x || 0;
        this.y = args.y || 0;
        this.vx = args.vx || 0;
        this.vy = args.vy || 0;
        this.ax = args.ax || 0;
        this.ay = args.ay || 0;
        this.deg = args.deg || 0;
        this.canRemove = false;
    }

    moveTo(x=this.x, y=this.y) {
        this.x = x;
        this.y = y;
    }

    move(xOff=0, yOff=0) {
        this.x += xOff;
        this.y += yOff;
    }

    moveStep() {
        this.vx += this.ax;
        this.vy += this.ay;

        this.x += this.vx;
        this.y += this.vy;
    }

    rotate(deg) {
        this.deg = deg;
    }

    update() {
        this.moveStep();
    }

    render(ctx) {
        return;
    }
}
RenderObj.id = 0;

class Ball extends RenderObj{
    constructor(name, r=10) {
        super({name});
        this.r = r;
        this.color = 'white';
    }

    update() {
        let w = this.owner.w,
            h = this.owner.h;
        if(this.x < this.r || this.x + this.r > w) {
            this.vx = -this.vx;
        }

        if(this.y < this.r || this.y + this.r > h) {
            this.vy = -this.vy;
        }

        super.update();
    }

    render(ctx) {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x , this.y, this.r - 3, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.closePath();

        ctx.beginPath();
        ctx.strokeStyle = 'black';
        ctx.arc(this.x , this.y, this.r, 0, Math.PI * 2, false);
        ctx.stroke();
        ctx.closePath();
    }
}

class Scene {
    constructor(args={}) {
        this.name = args.name || `name ${++Scene.sceneId}`;

        this.x = args.x || 0;
        this.y = args.y ||0;
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
    createHolder() {
        let div = document.createElement('div');
        div.style.position = 'absolute';

        return div;
    }

    // 创建画布
    createCanvas() {
        let canvas = document.createElement('canvas');
        canvas.style.position = 'absolute';
        canvas.style.zIndex = -1;
        canvas.width = this.w;
        canvas.height = this.h;
        return canvas;
    }

    createRObj() {
        let obj = new Ball();
        this.addRObj(obj);
        return obj;
    }

    addRObj(obj) {
        obj.owner = this;
        this.renderObj.push(obj);
        this.renderObjName[obj.name] = obj;
    }

    removeRObj(obj) {
        this.removeRObjByName(obj.name);
    }

    removeRObjByName(name) {
        let obj = this.renderObjName[name];
        obj && (obj.canRemove = true);
    }

    removeAllCanRemove() {
        for(let i = 0, len = this.renderObj.length; i < len; ++i) {
            let obj = this.renderObj[i].canRemove;
            if(obj) {
                this.renderObj.splice(i, 1);
                delete this.renderObjName[obj.name];
            }
        }
    }

    clearRObj() {
        this.renderObj = [];
        this.renderObjName = {};
    }

    getRObjName(name) {
        return this.renderObjName[name];
    }

    addListener(listener) {
        this.listeners.push(listener);
    }

    clearListener() {
        this.listeners = [];
    }

    // 定位
    setPos(x, y) {
        this.x = x || this.x;
        this.y = x || this.y;
        this.holder.style.left = this.x;
        this.holder.style.top = this.y;
    }

    // 调整尺寸
    setSize(w, h) {
        this.w = w || this.w;
        this.h = h || this.h;
        this.holder.style.width = this.h;
        this.holder.style.height = this.h;
    }

    // 设置背景颜色
    setColor(color) {
        this.holder.style.backgroundColor = color || this.color;
    }

    //更新场景
    update() {
        for(let i = 0, len = this.renderObj.length; i < len; ++i) {
            this.renderObj[i].update();
        }
        this.removeAllCanRemove();
    }

    // 渲染场景
    render() {
        this.clear();
        for(let i = 0, len = this.listeners.length; i < len; ++i) {
            this.listeners.enable && this.listeners[i].beforeRender();
        }

        this.renderRObj();

        for(let i = 0, len = this.listeners.length; i < len; ++i) {
            this.listeners.enable && this.listeners[i].afterRender();
        }
    }

    renderRObj() {
        for(let i = 0, len = this.renderObj.length; i < len; ++i) {
            this.ctx.save();
            this.renderObj[i].render(this.ctx);
            this.ctx.restore();
        }
    }

    // 清除背景
    clear() {
        this.ctx.clearRect(0, 0, this.w, this.h);
    }

    // 显示场景
    show() {
        this.holder.style.display = 'block';
    }

    // 隐藏场景
    hide() {
        this.holder.style.display = 'none';
    }

    // 场景淡入
    fadeIn() {}

    // 场景淡出
    fadeOut() {}

    // 设置背景图
    setBGImg(img, patern) {
        this.holder.style.backgroundImage = `url(${img})`;
        switch(pattern) {
            case 1:
                this.holder.style.backgroundPosition = 'center';
                this.holder.style.backgroundRepeat = 'no-repeat';
                break;
            case 2:
                this.holder.style.backgroundSize = `${this.w}px ${this.h}px`;
                break;
        }
    }

    // 清除场景
    clean() {
        this.listeners = null;
        document.body.removeChild(this.holder);
        this.holder = this.canvas = this.ctx = null;
        
    }
}
Scene.sceneId = 0;

class SceneManage {
    constructor() {
        this.scenesNamed = {};
        this.scenes = [];
    }

    // 创建场景
    createScene(args) {
        let scene = new Scene(args);
        this.pushScene(scene);
        return scene;
    }

    // 移除当前场景
    removeCurScene() {
        let scene = null;
        if(this.scenes.length > 0) {
            scene = this.scenes.pop();
            delete this.scenesNamed[scene.name];
            scene.clean();
        }

        return scene;
    }

    // 移除所有场景
    removeAllScene() {
        this.scenes.length = 0;
        this.scenesNamed = {};
    }

    // 移除所有场景
    removeTarScene(name) {
        let scene = this.getScene(name),
            index = -1;
        if(scene) {
            index = this.getIndex(scene);
            this.scenes.splice(index, 1);
            delete this.scenesNamed[name];
            scene.clean();
            this.sortScenes();
        }
        
    }

    // 添加场景
    pushScene(scene) {
        if(!this.getScene(scene.name)) {
            this.scenes.push(scene);
            this.scenesNamed[scene.name] = scene;
            return this.scenes.length;
            this.sortScenes();
        }
    }

    // 交换场景顺序
    swapScene(from, to) {
        let len = this.scenes.length;
        if(from > 0 && from < len && to > 0 && to < len) {
            let tmp = from;
            from = to;
            to = tmp;
            this.sortScenes();
        }
    }

    // 场景前移
    forwardScene(name) {
        let index = this.getIndex(scene);
        if(index > 0) {
            this.swapScene(this.scenes[index], this.scenes[index + 1]);
        }else if(index === this.scenes.length - 1) {
            this.swapScene(this.scenes[index], this.scenes[0]);
        }
        this.sortScenes();
    }

    // 场景后移
    backwardScene(name) {
        let index = this.getIndex(scene),
            len = this.scenes.length;
        if(index > 0) {
            this.swapScene(this.scenes[index], this.scenes[index - 1]);
        }else if(index === 0) {
            this.swapScene(this.scenes[index], this.scenes[this.scenes.length - 1]);
        }
        this.sortScenes();
    }

    // 场景移到顶部
    moveToTop(scene) {
        let index = this.getIndex(scene);
        this.scenes.splice(index, 1);
        this.scenes.push(scene);
        this.sortScenes();
    }

    // 场景移到底部
    moveToBottom(scene) {
        let index = this.getIndex(scene);
        this.scenes.splice(index, 1);
        this.scenes.unshift(scene);
        this.sortScenes();
    }

    // 场景排序
    sortScenes() {
        for(let i = 0, len = this.scenes.length; i < len; ++i) {
            this.scenes[i].holder.style.zIndex = i;
        }
    }

    // 获取当前场景
    getCurScene() {
        return this.scenes[this.scenes.length - 1];
    }

    // 获取场景索引
    getIndex(name) {
        let index = -1;
        for(let i = 0, len = this.scenes.length; i < len; ++i) {
            if(this.scenes[i].name === name) {
                index = i;
                break;
            }
        }
        return index;
    }

    // 获取场景
    getScene(name) {
        return this.scenesNamed[name];
    }

}

class Game {
    constructor() {
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
            'beforeRender': () => {
                // console.log('beforeRender')
            },
            'afterRender': () => {
                // console.log('afterRender')
            }
        }))
    }

    mainLoop() {
        this.handle = requestAnimationFrame(this.mainLoop);
        this.frameState.update();
        this.executeListener('beforeRender');

        let scene = this.sceneManage.getCurScene();
        if(scene) {
            scene.update();
            scene.render();
        }

        if(!this.paused) {
            this.maxF.innerHTML = this.frameState.maxFrame;
            this.minF.innerHTML = this.frameState.minFrame;
            this.curF.innerHTML = this.frameState.curFrame;
        }
        this.executeListener('afterRender');
    }

    run() {
        this.frameState.start();
        this.mainLoop();
    }

    pause() {
        this.paused = true;
    }

    stop() {
        cancelAnimationFrame(this.handle);
    }
    
    addListener(listener) {
        this.listenerList.push(listener);
    }

    clearListener() {
        this.listenerList.length = 0;
    }

    removeListener(listener) {
        let index = this.listenerList.indexOf(listener);
        this.listenerList[index] = this.listenerList[this.listenerList.length - 1];
        this.listenerList.pop();
    }

    executeListener(method) {
        for(let i = 0, len = this.listenerList.length; i < len; ++i) {
            this.listenerList[i].enable && this.listenerList[i][method]();
        }
    }
}

class BallGame {
    constructor() {
        this.game = new Game();
        this.initGame();
        this.game.run();
    }

    initGame() {
        let sc = this.game.sceneManage.createScene({w: 500, h: 500});
        this.initRObj(sc);
    }

    initRObj(sc) {
        for(let i = 0; i < 20; ++i) {
            let ball = sc.createRObj();
            ball.moveTo (randomInt(20, sc.w - 20), randomInt(20, sc.h - 20));
            ball.vx = randomInt(1, 3);
            ball.vy = randomInt(1, 3);
            ball.color = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
        }
    }
}

new BallGame();

function randomInt(a, b) {
    return Math.floor(Math.random() * (b - a) + a);
}