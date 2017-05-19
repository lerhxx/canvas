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

        this.update = this.update.bind(this);
    }

    update(ctx) {
        if(Math.random() > .9) {
            this.r = this.r * Math.random() + 2;
        }
        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.position.x, this.position.y, this.r, 0, Math.PI * 2, false);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }
}