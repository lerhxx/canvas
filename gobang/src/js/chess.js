class Chess {
    constructor(obj={}) {
        this.x = 0;
        this.y = 0;
        this.radius = 10;      // 半径
        this.flag = 0;      // 0为空，1为白棋，2为黑棋
        this.owner = null;

        Object.assign(this, obj);
    }
}