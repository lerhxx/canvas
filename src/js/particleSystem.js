window.addEventListener('load', () => {
    let canvas = document.getElementById('particle'),
        ctx = canvas.getContext('2d'),
        run = document.getElementById('run');
    
    canvas.width = 500;
    canvas.height = 500;

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
        this.particles.forEach((p, i) => {
            p.age += dt;
            if(p.age >= p.life) {
                this.kill(i);
            }
        })
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
        this.particles.forEach(p => {
            let alpha = 1 - p.age / p.life;
            ctx.fillStyle = `rgba(${Math.floor(p.color.r * 255)}, ${Math.floor(p.color.g * 255)}, ${Math.floor(p.color.b * 255)}, ${alpha.toFixed(2)})`
            ctx.beginPath();
            ctx.arc(p.position.x, p.position.y, p.r, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.fill();
        })
    }

    applyGravity() {
        this.particles.forEach(p => {
            p.acceleration = this.gravity;
        })
    }

    applyEffectors() {
        this.effectors.forEach(e => {
            var apply = e.apply;
            for (var i in this.particles)
                apply(this.particles[i]);    
        })
    }

    kinematics(dt) {
        this.particles.forEach(p => {
            p.position = p.position.add(p.velocity.multiply(dt));
            p.velocity = p.velocity.add(p.acceleration.multiply(dt));
        })
    }
}

class Play {
    constructor(ctx, canvas) {
        this.particleSystem = new ParticleSystem();
        this.dt = .01;
        this.ctx = ctx;
        this.canvas = canvas;

        this.step = this.step.bind(this);
        this.start = this.start.bind(this);
        this.sampleDirection = this.sampleDirection.bind(this);
        this.clearCanvas = this.clearCanvas.bind(this);
    }

    step() {
        this.particleSystem.emit(new Particle(new Vector2(200, 200), this.sampleDirection().multiply(100), 5, 1, Color.red));
        this.particleSystem.simulate(this.dt);

        this.clearCanvas();
        ++n;
        if(n < 100) {
            this.particleSystem.render(this.ctx);
            requestAnimationFrame(this.step);
        }
    }

    start() {
        // console.log(this)
        n = 0;
        this.particleSystem.particles = [];
        this.position = new Vector2(10, 200);
        this.velocity = new Vector2(50, -50);
        this.acceleration = new Vector2(0, 10);
        n = 0;
        requestAnimationFrame(this.step);
    }

    sampleDirection() {
        let theta = Math.random() * 2 * Math.PI;
        return new Vector2(Math.cos(theta), Math.sin(theta));
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

}

let n = 0;