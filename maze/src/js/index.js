class Maze {
    constructor(r, c) {
        this.r = r;
        this.c = c;
        this.accessed = [];
        this.notAccessed = [];
        this.arr = [];

        this.init()
    }

    init() {
        this.initArray();
        console.log(this.arr)
    }

    initArray() {
        for(let i = 0; i < 2 * this.r + 1; ++i) {
            for(let n = 0; n < 2 * this.c + 1; ++n) {
                if(c ^ (c - 1) === 1) {
                    this.arr.push(1);
                }else {
                    this.arr.push(0);
                    this.notAccessed.push(0);
                }
            }
        }
    }
}