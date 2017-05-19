class Box {
    constructor(borderWidth = 500, color = '#f36', activity = true) {
        this.w = Math.random() * 80 + 20;
        this.h = Math.random() * 40 + 10;
        this.x = (borderWidth - this.w) / 2;
        this.y = 0;
        this.vx = 0;
        this.vy = 0;
        this.color = color;
        console.log(this.color)
    }
}