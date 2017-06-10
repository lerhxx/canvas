class Card {
    constructor(obj) {
        this.r = 0;
        this.c = 0;
        this.w = 0;        // 图片宽度
        this.h = 0;        // 图片高度
        this.cx = 0;        // 图片在canvas中的横坐标
        this.cy = 0;        // 图片在canvas中的纵坐标
        this.cw = 0;        // 图片在canvas中的宽度
        this.ch = 0;        // 图片在canvas中的高度
        this.picIndex = -1;
        this.rotate = 0;

        Object.assign(this, obj);
    }

    render() {

    }
}