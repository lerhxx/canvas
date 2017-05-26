window.onload = () => {
    new DrawSth('canvas');
}

class DrawSth {
    constructor(id) {
        if(!this.init(id)) {
            return;
        }
        this.colors = ["#000000", "#999999", "#FF0000","#FF9900", "#FFFF00","#008000", "#00CCFF", "#0099FF", "#FF33CC", "#CC66FF","#FFCCCC", "#6633FF", "#CCFFCC"];
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

    init(id) {
        if(!id) {
            console.error('no id');
            return;
        }

        this.canvas = document.getElementById(id);
        if(!this.canvas) {
            this.canvas = document.createElement('canvas');
            this.canvas.width = 500;
            this.canvas.height = 500;
            this.canvas.style.border = '1px solid pink';
            document.body.appendChild(this.canvas);
        }

        this.ctx = this.canvas.getContext('2d');

        if(!this.ctx) {
            console.error("your browser doesn't support canvas");
            return;
        }

        return true;
    }

    initTool(tools, modal, boxId) {
        if(!tools || !tools.length) {
            return;
        }

        let str = '',
            box = document.getElementById(boxId);
        for(let i = 0, len = tools.length; i < len; ++i) {
            str += modal(tools[i]);
        }
        box.innerHTML = str;
    }

    initColorBox(tool) {
        return `<span class='color' style='background: ${tool}' data-color='${tool}'></span>`;
    }

    initPanBox(tool) {
        return `<i class='pan pan-${tool}' data-line='${tool}'></i>`;
    }

    initEraserBox(tool) {
        return `<span class='eraser eraser-${tool}' data-radius='${tool * 5}'></span>`;
    }

    bindEvent() {
        this.canvas.addEventListener('mousedown', (e) => {
            this.ctx.beginPath();
            this.canPaint = true;
            this.ctx.moveTo(e.offsetX, e.offsetY);
        })
        this.canvas.addEventListener('mousemove', (e) => {
            if(this.canPaint) {
                this.ctx.lineTo(e.offsetX, e.offsetY);
                this.ctx.stroke();
            }
        })
        this.canvas.addEventListener('mouseup', (e) => {
            this.canPaint = false;
        })

        document.getElementById('color-box').addEventListener('click', (e) => {
            this.ctx.closePath();
            this.color  = e.target.getAttribute('data-color');
            this.ctx.strokeStyle = this.color;
            this.ctx.lineWidth = this.line;
        })

        document.getElementById('pan-box').addEventListener('click', (e) => {
            this.ctx.closePath();
            this.line  = e.target.getAttribute('data-line');
            this.ctx.lineWidth = this.line;
            this.ctx.strokeStyle = this.color;
        })

        document.getElementById('eraser-box').addEventListener('click', (e) => {
            this.ctx.closePath();
            this.ctx.strokeStyle = '#fff';
            this.ctx.lineWidth = e.target.getAttribute('data-radius');
        })
    }
}