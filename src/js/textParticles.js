let canvas,
    ctx,
    message,
    w,
    h,
    gridX = 7,
    gridY = 7,
    color = '#f36',
    shape;
window.onload = () => {
    canvas = document.getElementById('textParticle');
    ctx = canvas.getContext('2d');

    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;

    shape = new Shape(w / 2, h / 2);

    bindEvent();
}

window.addEventListener('resize', () => {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    
}, false);

function bindEvent() {
    let messageInput = document.getElementById('text');
    messageInput.addEventListener('change', function() {
        message = this.value;
        shape.draw(message);
        // console.log(message);
    }, false)
}

class Shape {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.particles = [];

        this.draw = this.draw.bind(this);
        this.getParticles = this.getParticles.bind(this);
    }

    getParticles(message) {
        ctx.clearRect(0, 0, this.x, this.y);
        ctx.textAlign = 'center';
        ctx.font = '200px arial';
        ctx.fillText(message, w / 2, h / 2);

        let data = ctx.getImageData(0, 0, w, h),
            buffer32 = new Uint32Array(data.data.buffer);
        
        for(let n = 0; n < h; n += gridY) {
            for(let i = 0; i < w; i += gridX) {
                if(buffer32[n * w + i]) {
                    this.particles.push(new Particle(new Vector2(i, n, 10, 10, color)))
                }
            }
        }
    }

    draw() {
        requestAnimationFrame(this.draw);
        this.getParticles(message)
        ctx.clearRect(0, 0, w, h);
        let len = this.particles.length;
        ctx.fillStyle = '#f36';
        for(let i = 0; i < len; ++i) {
            this.particles[i].update(ctx);
        }
    }
}
