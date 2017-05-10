window.onload = function() {
    var canvas = document.getElementById('canvas'),
        ctx = canvas.getContext('2d');
    canvas.width = 500;
    canvas.height = 500;

    var gradient = ctx.createLinearGradient(20, 0, 50, 50);
    gradient.addColorStop(0, 'green');
    gradient.addColorStop(.2, 'blue');
    gradient.addColorStop(1, 'red');

    var x = 0,
        y = 0,
        xWidth = canvas.width,
        yWidth = canvas.height,
        xy = 15,
        i,
        n;
    
    ctx.strokeStyle = '#f36';

    let canvasPro = window.CanvasRenderingContext2D && CanvasRenderingContext2D.prototype;

    /*
     * @method setLineDotted: 绘制圆点线
     * @params {Number} radius 半径
     * @params {Number} x 起始点圆心横坐标
     * @params {Number} y 起始点圆心纵坐标
     * @params {Number} wx 水平长度
     * @params {Number} hy 纵向长度
     * @params {Number} dx 圆心横坐标距离
     * @params {Number} dy 圆心横坐标距离
     * @params {Number} startArc 开始角度
     * @params {Number} endArc 结束角度
     * @params {Number} direct 绘制方向，true为逆时针，false为顺时针
     * @params {String} style storke或fill
     * @params {String} color 颜色
     */
    canvasPro.setLineDotted = function(opt = {}) {
        let origin = {
            radius: 5,
            x: 5.5,
            y: 5.5,
            wx: 500,
            hy: 500,
            dx: 20,
            dy: 0,
            startArc: 0,
            endArc: Math.PI * 2,
            direct: true,
            style: 'stroke',
            color: '#f36',
        };
        Object.assign(origin, opt);

        this[`${origin.style}Style`] = origin.color;
        for(let i = origin.x, n = origin.y; i <= origin.wx && n <= origin.hy; i += origin.dx, n += origin.dy) {
            this.beginPath();
            this.moveTo(i + origin.radius * Math.cos(origin.startArc), n + origin.radius * Math.sin(origin.startArc));
            this.arc(i, n, origin.radius, origin.startArc, origin.endArc, origin.direct);
            this[origin.style]();
            this.closePath();
        }
    }
    // ctx.setLineDotted({dx: 0, dy: 20, style:'fill'});

    /*
     * @method drawStar: 绘制五角星
     * @params {CanvasRenderingContext2D} ctx canvas环境
     * @params {Number} x 中心点横坐标
     * @params {Number} y 中心点纵坐标
     * @params {Number} R 外圆半径
     * @params {Number} r 内圆半径
     */
    function drawStar(ctx, opt = {}) {
        if(!ctx) {
            console.warn('there is no ctx')
            return;
        }
        let origin = {
            R: 100,
            r: 50,
            x: 100,
            y: 150,
            rotation: 0,
            color: '#f36',
            style: 'fill'
        };
        Object.assign(origin, opt);
        
        ctx[`${origin.style}Style`] = origin.color;

        ctx.beginPath();
        for(let i = 0; i < 5; ++i) {
            ctx.lineTo(
                Math.cos((18 + 72 * i + origin.rotation) / 180 * Math.PI) * origin.R + origin.x,
               - Math.sin((18 + 72 * i + origin.rotation) / 180 * Math.PI) * origin.R + origin.y
            );
            ctx.lineTo(
                Math.cos((54 + 72 * i + origin.rotation) / 180 * Math.PI) * origin.r + origin.x,
                -Math.sin((54 + 72 * i + origin.rotation) / 180 * Math.PI) * origin.r + origin.y 
            );
        }
        ctx.closePath();
        ctx[origin.style]()
    }

    function drawFlag(ctx) {
        ctx.fillStyle = 'red'
        ctx.fillRect(0, 0, 450,300);

        drawStar(ctx, {
            x: 65,
            y: 70,
            R: 40,
            r: 15,
            color: 'yellow'
        }),
        drawStar(ctx, {
            x: 140,
            y: 30,
            R: 16,
            r: 6,
            rotation: -18,
            color: 'yellow'
        }),
        drawStar(ctx, {
            x: 170,
            y: 60,
            R: 16,
            r: 6,
            rotation: 10,
            color: 'yellow'
        }),
        drawStar(ctx, {
            x: 166,
            y: 105,
            R: 16,
            r: 6,
            rotation: 0,
            color: 'yellow'
        }),
        drawStar(ctx, {
            x: 135,
            y: 140,
            R: 16,
            r: 6,
            rotation: -25,
            color: 'yellow'
        })
    }
    // drawFlag(ctx)

    function drawSector(ctx, opt) {
        let origin = {
            x: 100,
            y: 100,
            r: 50,
            sDeg: 0,
            eDeg: 72 / 180 * Math.PI
        };
        Object.assign(origin, opt);

        ctx.translate(origin.x, origin.y);
        ctx.beginPath();

        ctx.arc(0, 0, origin.r, origin.sDeg, origin.eDeg);
        ctx.save();
        ctx.stroke();

        // ctx.rotate(origin.eDeg);
        ctx.lineTo(0, 0)
        // ctx.restore()
        // ctx.rotate(origin.sDeg)
        ctx.lineTo(origin.r, 0);
        ctx.closePath();
        ctx.restore;
        ctx.fill()

    }
    let rect = {}
    function dragRect() {
        canvas.addEventListener('mousedown', mouseDown, false);
        canvas.addEventListener('mousemove', mouseMove, false);
        canvas.addEventListener('mouseup', mouseUp, false);
    }

    function mouseDown(e) {
        rect.startX = e.pageX - this.offsetLeft;
        rect.startY = e.pageY - this.offsetTop;
        rect.drag = true;
        // console.log(rect.startX)
        // console.log(e.pageX)
    }

    function mouseMove(e) {
        if(rect.drag) {
            rect.w = (e.pageX - this.offsetLeft) - rect.startX;
            rect.h = (e.pageY - this.offsetTop) - rect.startY;
            // console.log(rect.w)
            ctx.clearRect(0, 0, this.width, this.height);
            drawRect('stroke');
            // console.log('mousemove')
        }
    }

    function mouseUp() {
        rect.drag = false;
        // console.log('mouseup')
    }

    function drawRect(style) {
        ctx[`${style}Rect`](rect.startX, rect.startY, rect.w, rect.h)
        console.log(rect.startX)
    }
    // dragRect()

    function drawCurve() {
        ctx.strokeStyle = '#f36';
        ctx.fillStyle = 'red';
        ctx.lineWidth = 1;

        ctx.fillRect(100 - 4, 50 - 4, 8, 8)
        ctx.fillRect(300 - 4, 200 - 4, 8, 8)
        ctx.fillRect(100 - 4, 200 - 4, 8, 8)

        ctx.beginPath();
        ctx.strokeStyle = 'pink';
        ctx.moveTo(100, 50);
        ctx.lineTo(100, 200);
        ctx.lineTo(300, 200);
        ctx.stroke()

        ctx.beginPath();
        ctx.strokeStyle = 'blue';
        ctx.moveTo(100, 50);
        ctx.quadraticCurveTo(100, 200, 300, 200);
        ctx.stroke()
    }
    // drawCurve()
    function drawLang() {
        let lineWidth = 2,
            oW = canvas.width,
            oH = canvas.height,
            r = (oW / 2),
            cR = r - 8 * lineWidth,
            oRange = document.getElementsByName('range')[0];
        let M = Math;
            Sin = M.sin;
            Cos = M.cos;
            Sqrt = M.sqrt;
            Pow = M.pow;
            PI = M.PI;
            Round = M.round;
        
        ctx.beginPath();
        ctx.lineWidth = lineWidth;
        let axisLength = 2 * r - 16 * lineWidth,
            unit = axisLength / 8,
            range = .2,
            nowrange = range,
            xoffset = 8 * lineWidth,
            data = ~~(oRange.value) / 100,
            sp = 0,
            nowdata = 0,
            waveupsp = 0.002,
            arcStack = [],
            bR = r - 8 * lineWidth,
            soffset = -(PI/2),
            circleLock = true;
        
        for(let i = soffset; i < soffset + 2 * PI; i += 1/(8 * PI)) {
            arcStack.push([
                r + bR * Cos(i),
                r + bR * Sin(i)
            ])
        }

        let cStartPoint = arcStack.shift();

        ctx.strokeStyle = '#1c86d1';
        ctx.moveTo(cStartPoint[0], cStartPoint[1])

        render();

        function render() {
             ctx.clearRect(0, 0, oW, oH);
             if(circleLock) {
                 if(arcStack.length) {
                     let temp = arcStack.shift();
                     ctx.lineTo(temp[0], temp[1]);
                     ctx.stroke();
                 }else {
                     circleLock = false;
                     ctx.lineTo(cStartPoint[0], cStartPoint[1]);
                     ctx.stroke();
                     arcStack = null;

                     ctx.globalCompositeOperation = 'destination-over';

                     ctx.beginPath();
                     ctx.lineWidth = lineWidth;
                     ctx.arc(r, r, bR, 0, 2 * PI, 1);
                     
                     ctx.beginPath();
                     ctx.save();
                     ctx.arc(r, r, r - 16 * lineWidth, 0, 2 * PI, 1);
                     ctx.restore();
                     ctx.clip();
                    //  ctx.fillRect(0, 0, oW, oH)

                     ctx.fillStyle = '#1c86d1';

                     oRange.addEventListener('change', () => {
                         data = ~~(oRange.value) / 100;
                         console.log(`data = ${data}`);
                     }, 0);
                 }
             }else {
                let t = range * .01;
                 if(data >= 0.85) {
                     if(nowrange > range / 4) {
                         nowrange -= t;
                     }
                 } else if (data <= .1) {
                     if(nowrange < range * 1.5) {
                         nowrange += t;
                     }
                 } else {
                     if(nowrange <= range) {
                         nowrange += t;
                     }
                     if(nowrange >= range) {
                         nowrange -= t;
                     }
                 }
                 if((data - nowdata) > 0) {
                     nowdata += waveupsp;
                 }
                 if((data - nowdata) < 0) {
                     nowdata -= waveupsp;
                 }
                 sp+= .07;
                 drawSine();
                 drawText();
             }

             requestAnimationFrame(render);
        }

        function drawSine() {
            ctx.beginPath();
            ctx.save();
            let Stack = [];
            for(let i = xoffset; i <= xoffset + axisLength; i += 20 / axisLength) {
                let x = sp + (xoffset + i) / unit,
                    y = Sin(x) * nowrange,
                    dx = i,
                    dy = 2 * cR * (1 - nowdata) + (r - cR) - (unit * y);
                
                ctx.lineTo(dx, dy);
                Stack.push([dx, dy]);
            }
            let startP = Stack[0];
            let endP = Stack[Stack.length - 1];

            ctx.lineTo(xoffset + axisLength, oW);
            ctx.lineTo(xoffset, oW);
            ctx.lineTo(startP[0], startP[1]);
            ctx.fillStyle = '#1c86d1';
            // ctx.fillStyle = 'pink'
            ctx.fill();
            ctx.restore();
        }
        function drawText() {
            ctx.globalCompositeOperation = 'source-over';
            let size = .4 * cR;
            ctx.font = 'bold ' + size + 'px Microsoft Yahei';

            let txt = (nowdata.toFixed(2) * 100).toFixed(0) + '%';

            let fonty = r + size / 2,
                fontx = r - size * .8;
            ctx.fillStyle = 'rgba(6, 85, 128, .8)';
            ctx.fillText(txt, fontx, fonty);
        }
    }
    // drawLang()

    class Loading{
        constructor(id) {
            this.init(id);
            
            this.x = this.canvas.width / 2;
            this.y = this.canvas.height / 2;
            this.r = Math.min(this.x, this.y) - 10;
            this.speed = .1;
            this.rad = Math.PI * 2 / 100;
            this.initialPoint = -Math.PI / 2;

            this.baseRound = this.baseRound.bind(this);
            this.progressBar = this.progressBar.bind(this);
            this.progressText = this.progressText.bind(this);
            this.start = this.start.bind(this);

            this.start();
        }

        init(id) {
            if(!id) {
                console.warn('there is no id')
                return null;
            }
            this.canvas = document.getElementById(id);
            this.ctx =this. canvas.getContext('2d');
        }

        baseRound() {
            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.strokeStyle = '#49f';
            this.ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
            this.ctx.closePath();
            this.ctx.stroke();
            this.ctx.restore();
        }

        progressBar(n) {
            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.strokeStyle = '#49f';
            this.ctx.lineWidth = 5;
            this.ctx.arc(this.x, this.y, this.r, this.initialPoint, n * this.rad + this.initialPoint, false);
            this.ctx.stroke();
            this.ctx.restore();
        }

        progressText(n) {
            this.ctx.save();
            this.ctx.strokeStyle = '#49f';
            this.ctx.font = '20px Arial';
            this.ctx.strokeText(n.toFixed(0) + '%', this.x - 15, this.y + 8);
            this.ctx.stroke();
            this.ctx.restore();
        }

        start() {
            requestAnimationFrame(this.start);
            // this.fillStyle = 'black';
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.baseRound();
            this.progressText(this.speed);
            this.progressBar(this.speed);
            if(this.speed <= 100) {
                this.speed += .1;
            }else {
                this.speed = 0;
            }
        }
    }
    new Loading('canvas1');

    class FallText {
        constructor(id) {
            this.init(id);
            let words = "0123456789qwertyuiopasdfghjklzxcvbnm,./;'\[]QWERTYUIOP{}ASDFGHJHJKL:ZXCVBBNM<>?";
            this.wordColor = '#3f3';
            this.clearColor = 'rgba(0, 0, 0, .1)';
            this.wordArr = words.split('');
            this.fontSize = 16;
            this.column = this.canvas.width / this.fontSize;
            this.drops = [];
            this.n = 0;

            this.initDrops = this.initDrops.bind(this);
            this.draw = this.draw.bind(this);
            this.start = this.start.bind(this);
            this.initDrops();
            this.start();
        }

        init(id) {
            if(!id) {
                console.warn('there is no id')
                return null;
            }
            this.canvas = document.getElementById(id);
            this.ctx =this. canvas.getContext('2d');
        }

        initDrops() {
            for(let i = 0; i < this.column; ++i) {
                this.drops[i] = 1;
            }
        }

        draw() {
            this.ctx.save();
            this.ctx.fillStyle = this.wordColor;
            for(let i = 0; i < this.column; ++i) {
                let text = this.wordArr[Math.floor(Math.random() * this.wordArr.length)];
                this.ctx.fillText(text, i * this.fontSize, this.drops[i] * this.fontSize);
                if(this.drops[i] * this.fontSize > this.canvas.height && Math.random() > .98) {
                    this.drops[i] = 0;
                }
                ++this.drops[i];
            }
            this.ctx.restore();
        }

        start() {
            requestAnimationFrame(this.start);
            this.ctx.fillStyle = this.clearColor;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.draw();
        }
    }
    new FallText('canvas2');

    class Arrow {
        constructor(id) {
            if(!this.init(id)) {
                return;
            }

            this.x = this.canvas.width / 2;
            this.y = this.canvas.height / 2;
            this.rotation = 0;
            this.color = '#ff0';
            this.speed = .2;

            this.bindEvent();

            this.draw = this.draw.bind(this);
            this.start = this.start.bind(this);

        }

        init(id) {
            if(!id) {
                console.warn('there is no id')
                return null;
            }
            this.canvas = document.getElementById(id);
            this.ctx =this. canvas.getContext('2d');
            return true;
        }

        bindEvent() {
            this.canvas.addEventListener('mousemove', (e) => {
                this.mouseX = e.offsetX;
                this.mouseY = e.offsetY;
                this.start();
            })
        }

        draw() {
            this.ctx.save();
            this.ctx.translate(this.x, this.y);
            this.ctx.rotate(this.rotation);
            this.ctx.lineWidth = 5;
            this.ctx.fillStyle = this.color;
            this.ctx.beginPath();
            this.ctx.moveTo(-50, -25);
            this.ctx.lineTo(0, -25);
            this.ctx.lineTo(0, -50);
            this.ctx.lineTo(50, 0);
            this.ctx.lineTo(0, 50);
            this.ctx.lineTo(0, 25);
            this.ctx.lineTo(-50, 25);
            this.ctx.closePath();
            this.ctx.stroke();
            this.ctx.fill();
            this.ctx.restore();
        }

        start() {
            requestAnimationFrame(this.start);
            let dx = this.mouseX - this.x + 50,
                dy = this.mouseY - this.y + 50,
                rotation = Math.atan2(dy, dx);
            let vx = Math.cos(rotation) * this.speed,
                vy = Math.sin(rotation) * this.speed;
            this.x += vx;
            this.y += vy;
            this.rotation = rotation;
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.draw();
        }
    }

    new Arrow('canvas3');

    class Ball {
        constructor(id, radius = 5, color = '#f36', speedX = .1, speedY = .1) {
            if(!this.init(id)) {
                return;
            }

            // this.x = this.canvas.width / 2;
            this.y = this.canvas.height / 2;
            this.x = radius;
            // this.y = 0;
            this.radius = radius;
            this.color = color;
            this.speedX = speedX;
            this.speedY = speedY;
            this.scaleX = 1;
            this.scaleY = 1;
            this.rad = 0;

            this.draw = this.draw.bind(this);
            this.start = this.start.bind(this);

            this.start();
        }

        init(id) {
            if(!id) {
                console.warn('there is no id')
                return null;
            }
            this.canvas = document.getElementById(id);
            this.ctx =this. canvas.getContext('2d');
            return true;
        }

        draw() {
            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.scale(this.scaleX, this.scaleY);
            this.ctx.fillStyle = this.color;
            this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
            this.ctx.fill();
            this.ctx.restore();
        }

        start() {
            requestAnimationFrame(this.start);
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.x += this.speedX * 10;
            this.y += Math.cos(this.rad) * 10;
            if(this.x > this.canvas.width - this.radius || this.x < this.radius) {
                this.speedX = -this.speedX;
            }
            // this.scaleX = this.scaleY = 1 + Math.sin(this.rad) * .5;
            this.rad += this.speedY;
            this.draw();
        }
    }
    new Ball('canvas4')
}