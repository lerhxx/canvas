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

