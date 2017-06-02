class FrameAnimation {
    constructor() {
        this.w = document.getElementById('width');
        this.h = document.getElementById('height');
        this.r = document.getElementById('row');
        this.c = document.getElementById('col');
        this.selection = document.getElementById('selection');
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.img = document.getElementById('image');
        this.runBtn = document.getElementById('run');
        this.timeHandle = null;
        this.frames = [];
        this.curFrame = 0;
        this.bindEvent();

        this.start = this.start.bind(this);
    }

    bindEvent() {
        let files = document.getElementById('file'),
            btn = document.getElementById('create'),
            self = this;

        files.addEventListener('change', function(){
            let file = this.files[0];
            if(!file) {
                return;
            }
            if(/^image\/w+/.test(file.type)) {
                alert('请选择图片文件');
            }else {
                let reader = new FileReader();
                reader.onload = function() {
                    self.img.setAttribute('src', this.result);
                    reader = null;
                }
                reader.readAsDataURL(file);
            }
            if(this.timeHandle) {
                cancelAnimationFrame(this.timeHandle);
            }
            this.frames = [];
        })

        btn.addEventListener('click', () => {
            console.log(this.img.src)
            if(!this.img.src) {
                alert('请选择图片')
            }else{
                let w = this.w.value || 32,
                    h = this.h.value || 32,
                    r = this.r.value || 1,
                    c = this.c.value || 1,
                    str = '',
                    frame = 0;

                for(let i = 0; i < r; ++i) {
                    for(let n = 0; n < c; ++n) {
                        this.frames.push([n * w, i * h, w, h]);
                        str += `<option>${++frame}帧</option>`;
                    }
                }

                this.canvas.width = w;
                this.canvas.height = h;
                this.ctx.drawImage(this.img, this.frames[0][0], this.frames[0][1], this.frames[0][2], this.frames[0][3], 0, 0, this.canvas.width, this.canvas.height);
                this.selection.innerHTML = str;
            }
        })

        this.selection.addEventListener('change', function() {
            let frame = parseInt(this.value) - 1,
                w = self.canvas.width,
                h = self.canvas.height;
            self.ctx.clearRect(0, 0, w, h);
            self.ctx.drawImage(self.img, self.frames[frame][0], self.frames[frame][1], self.frames[frame][2], self.frames[frame][3], 0, 0, w, h);
        })

        this.runBtn.addEventListener('click', function(e) {
            if(this.innerHTML === '运行动画') {
                self.timeHandle = requestAnimationFrame(self.start);
                this.innerHTML = '停止动画';
            }else {
                cancelAnimationFrame(self.timeHandle);
                this.innerHTML = '运行动画';
            }
        }) 
    }

    run() {

    }

    start() {
        let frame = this.curFrame,
            w = this.canvas.width,
            h = this.canvas.height,
            count = this.frames.length;
        this.ctx.clearRect(0, 0, w, h);
        this.ctx.drawImage(this.img, this.frames[frame][0], this.frames[frame][1], this.frames[frame][2], this.frames[frame][3], 0, 0, w, h);
        this.curFrame = (++this.curFrame) % count;
        this.timeHandle = requestAnimationFrame(this.start);
    }
}

new FrameAnimation();