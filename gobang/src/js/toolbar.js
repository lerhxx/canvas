class ToolBar {
    constructor(obj={}) {
        this.owner = null;
        this.parent = null;
        Object.assign(this, obj);


        this.init(parent);

        this.regretEvent = this.regretEvent.bind(this);
        this.cancelRreget = this.cancelRreget.bind(this);
        this.bindEvent = this.bindEvent.bind(this);

    }

    init() {
        if(this.parent.nodeType !== 1) {
            console.error('There is no parent of toolbar');
            return;
        }
        let toolbar = `<div class='toolbar'>
                <div>
                    当前棋子<span id='cur'></span>
                </div>
                <button id='reget' type='button'>悔棋</button>
                <button id='cancel-reget' type='button'>撤销悔棋</button>
            </div>`;

        this.parent.innerHTML = this.parent.innerHTML + toolbar;
        this.cur = document.getElementById('cur');
        this.regBtn = document.getElementById('reget');
        this.cancelBtn = document.getElementById('cancel-reget');
        this.bindEvent();
    }

    bindEvent() {
        this.regBtn.addEventListener('click', () => this.regretEvent())
        this.cancelBtn.addEventListener('click', () => this.cancelRreget())
    }

    regretEvent() {
        this.owner.regret();
    }

    cancelRreget() {
        this.owner.cancelRreget();
    }

    changeCur(color) {
        this.cur.style.backgroundColor = color;
    }
}