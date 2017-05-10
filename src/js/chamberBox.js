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