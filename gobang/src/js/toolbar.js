class ToolBar {
    constructor(obj={}) {
        this.owner = null;
        this.parent = null;
        Object.assign(this, obj);


        this.init(parent);

        this.regretEvent = this.regretEvent.bind(this);
        this.cancelRreget = this.cancelRreget.bind(this);
        this.bindEvent = this.bindEvent.bind(this);
        this.changeMode = this.changeMode.bind(this);

    }

    init() {
        if(this.parent.nodeType !== 1) {
            console.error('There is no parent of toolbar');
            return;
        }
        let toolbar = '';
        if(this.aiTool) {
            toolbar = `<div class='toolbar'>
                    <div>
                        当前棋子<span id='cur'></span>
                    </div>
                    <button id='reget' type='button'>悔棋</button>
                    <button id='cancel-reget' type='button'>撤销悔棋</button>
                    <button id='restart' type='button'>重新开始</button>
                    <button id='aiMode' type='button'>人机模式</button>
                    <button id='selfMode' type='button'>单独模式</button>
                </div>`;
        }else {
            toolbar = `<div class='toolbar'>
                    <div>
                        当前棋子<span id='cur'></span>
                    </div>
                    <button id='reget' type='button'>悔棋</button>
                    <button id='cancel-reget' type='button'>撤销悔棋</button>
                    <button id='restart' type='button'>重新开始</button>
                </div>`;
        }

        this.parent.innerHTML = this.parent.innerHTML + toolbar;
        this.cur = document.getElementById('cur');
        this.regBtn = document.getElementById('reget');
        this.cancelBtn = document.getElementById('cancel-reget');
        this.restartBtn = document.getElementById('restart');
        this.aiBtn = document.getElementById('aiMode');
        this.selfBtn = document.getElementById('selfMode');
        this.bindEvent();

    }

    bindEvent() {
        this.regBtn.addEventListener('click', () => this.regretEvent());
        this.cancelBtn.addEventListener('click', () => this.cancelRreget());
        this.restartBtn.addEventListener('click', () => this.restart());
        if(this.aiTool) {
            this.aiBtn.addEventListener('click', () => {
                this.restart();
                this.changeMode(1)
            });
            this.selfBtn.addEventListener('click', () => {
                this.restart();
                this.changeMode(2)
            });
        }
    }

    regretEvent() {
        this.owner.regret();
    }

    cancelRreget() {
        this.owner.cancelRreget();
    }

    restart() {
        this.owner.restart();
    }

    changeCur(color) {
        this.cur.style.backgroundColor = color;
    }

    /*
     * mode 1: aiMode 2: selfMode
     */
    changeMode(mode) {
        this.owner.changeMode(mode);
        if(mode === 1) {
            this.aiBtn.disabled = true;
            this.selfBtn.disabled = false;
        }else if(mode === 2){
            this.aiBtn.disabled = false;
            this.selfBtn.disabled = true;
        }
    }
}