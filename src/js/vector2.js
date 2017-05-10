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