window.addEventListener('load', () => {
    let canvas = document.getElementById('particle'),
        ctx = canvas.getContext('2d'),
        run = document.getElementById('run');
    
    canvas.width = 500;
    canvas.height = 500;
    ctx.fillStyle = 'black';

    let play = new Play(ctx, canvas);
    run.addEventListener('click', play.start);
    
})

class Color {
    constructor(r, g, b) {
        this.r = r;
        this.g = g;
        this.b = b;
    }
}

Color.red = new Color(1, 0, 0);

class Vector2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }


    add(v) {
        return new Vector2(this.x + v.x, this.y + v.y);
    }

    substract(v) {
        return new Vector2(this.x - v.x, this.y - v.y);
    }

    multiply(f) {
        return new Vector2(this.x * f, this.y * f);
    }

    divide(f) {
        return new Vector2(this.x / f, this.y / f);
    }

    dot(v) {
        return new Vector2(this.x * v.x + this.y * v.y);
    }

    negate() {
        return new Vector2(-this.x , -this.y);
    }

    normalize() {
        let len = this.length();
        return new Vector2(this.x / len, this.y / len);
    }

    length() {
        return Math.sqrt(this.sqrLength());
    }

    sqrLength() {
        return this.x * this.x + this.y * this.y;
    }

    copy() {
        return new Vector2(this.x, this.y);
    }
}
Vector2.zero = new Vector2(0, 0);
class Particle {
    constructor(position, velocity, radius, life, color) {
        this.position = position;
        this.velocity = velocity;
        this.acceleration = Vector2.zero;
        this.age = 0;
        this.life = life;
        this.color = color;

        this.r = radius;
        this.dt = .1;
    }
}

class ParticleSystem {
    constructor() {
        this.particles = [];
        this.gravity = new Vector2(0, 100);
        this.effectors = [];

        this.emit = this.emit.bind(this);
        this.aging = this.aging.bind(this);
        this.kill = this.kill.bind(this);
        this.simulate = this.simulate.bind(this);
        this.render = this.render.bind(this);
        this.applyGravity = this.applyGravity.bind(this);
        this.applyEffectors = this.applyEffectors.bind(this);
        this.kinematics = this.kinematics.bind(this);
    }

    emit(particle) {
        this.particles.push(particle);
    }

    aging(dt) {
        let len = this.particles.length,
            p;
        for(let i = 0; i < len;) {
            p = this.particles[i];
            p.age += dt;
            if(p.age > p.life) {
                this.kill(i);
                --len;
            }else {
                ++i;
            }
        }
    }

    kill(i) {
        let len = this.particles.length;
        if(len > 1) {
            this.particles[i] = this.particles[len - 1];
        }
        this.particles.pop();
    }

    simulate(dt) {
        this.aging(dt);
        this.applyGravity();
        this.applyEffectors();
        this.kinematics(dt);
    }

    render(ctx) {
        let len = this.particles.length,
            i = 0;
        for(; i < len; ++i) {
            let p = this.particles[i];
            let alpha = 1 - p.age / p.life;
            ctx.fillStyle = `rgba(${Math.floor(p.color.r * 255)}, ${Math.floor(p.color.g * 255)}, ${Math.floor(p.color.b * 255)}, ${alpha.toFixed(2)})`
            ctx.beginPath();
            ctx.arc(p.position.x, p.position.y, p.r, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.fill();
        }
    }

    applyGravity() {
        let len = this.particles.length,
            i = 0;
        for(; i < len; ++i) {
            let p = this.particles[i];
            p.acceleration = this.gravity;
        }
    }

    applyEffectors() {
        let len = this.effectors.length,
            l = this.particles.length,
            i = 0,
            n = 0,
            apply;
        for(; i < len; ++i) {
            n = 0;
            apply = this.effectors[i].apply;
            for (; n < l; ++n){
                apply(this.particles[n]); 
            }   
        }
    }

    kinematics(dt) {
        let len = this.particles.length,
            i = 0;
        for(; i < len; ++i) {
            let p = this.particles[i];
            p.position = p.position.add(p.velocity.multiply(dt));
            p.velocity = p.velocity.add(p.acceleration.multiply(dt));
        }
    }
}

class Play {
    constructor(ctx, canvas) {
        this.particleSystem = new ParticleSystem();
        this.dt = .01;
        this.ctx = ctx;
        this.canvas = canvas;
        this.oldPosition = Vector2.zero;
        this.newPosition = Vector2.zero;

        this.particleSystem.effectors.push(new ChamberBox(0, 0, this.canvas.width, this.canvas.height));
        this.step = this.step.bind(this);
        this.start = this.start.bind(this);
        this.sampleDirection = this.sampleDirection.bind(this);
        this.samplyNumber = this.samplyNumber.bind(this);
        this.clearCanvas = this.clearCanvas.bind(this);
        this.bindEvent();
    }

    step() {
        if(this.oldPosition == Vector2.zero && this.newPosition == Vector2.zero) {
        }else {
            if(this.particleSystem.particles.length === 0) {
                this.oldPosition = this.newPosition;
            }
            let velocity = this.newPosition.substract(this.oldPosition).multiply(10);
            velocity = velocity.add(this.sampleDirection(0, Math.PI * 2).multiply(20));
            let life = this.samplyNumber(1, 2),
                size = this.samplyNumber(2, 4);
            this.particleSystem.emit(new Particle(this.newPosition, velocity, size, life, Color.red));
            this.oldPosition = this.newPosition;
            this.particleSystem.simulate(this.dt);

            this.clearCanvas();
            ++y;
            this.particleSystem.render(this.ctx);
        }
        requestAnimationFrame(this.step);
        // }
    }

    start() {
        // console.log(this)
        y = 0;
        this.particleSystem.particles = [];
        this.position = new Vector2(10, 200);
        this.velocity = new Vector2(50, -50);
        this.acceleration = new Vector2(0, 10);
        y = 0;
        requestAnimationFrame(this.step);
    }

    sampleDirection(a1, a2) {
        // let theta = Math.random() * 2 * Math.PI;
        // return new Vector2(Math.cos(theta), Math.sin(theta));
        let t = Math.random();
        let theta = a1 * t + a2 * (1 - t);
        return new Vector2(Math.cos(theta), Math.sin(theta));
    }

    samplyNumber(n1, n2) {
        let t = Math.random();
        return n1 * t + n2 * (1 - t);
    }

    bindEvent() {
        this.canvas.addEventListener('mousemove', (e) => {
            this.newPosition = new Vector2(e.offsetX, e.offsetY);
            let velocity = this.newPosition.substract(this.oldPosition);
        })
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}
class ChamberBox {
    constructor(x1, y1, x2, y2) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.apply = this.apply.bind(this);
    }

    apply(p) {
        if(p.position.x - p.r < this.x1 || p.position.x + p.r > this.x2) {
            p.velocity.x = -p.velocity.x;
        }
        if(p.position.y - p.r < this.y1 || p.position.y + p.r > this.y2) {
            p.velocity.y = -p.velocity.y;
        }
    }
}

let y = 0;
var i = 0,
    a = [];
for(; i < 1000000; ++i) {
    a.push(i);
}
console.time('forin');
for(i = 0; i < 1000000; ++i) {
    ++y;
}
console.timeEnd('forin');
y = 0;
console.time('forEach');
a.forEach(function() {
    ++y;
})
console.timeEnd('forEach');
y = 0;
console.time('forof');
for(let x in a) {
    ++y;
}
console.timeEnd('forof');