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