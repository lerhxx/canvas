class Card {
    constructor(r, c, pic) {
        this.r = r;
        this.c = c;
        this.flag = 1;
        this.picIn = pic;
    }
}

class linkGame {
    constructor(r, c, id) {
        if(typeof id !== 'string') {
            console.err('There is no id');
            return;
        }
        this.getCanvas(id);
        if(!this.canvas) {
            return;
        }
        console.log('start');

        this.r = r;
        this.c = c;
        this.pathArr = [];
        this.imgNum = 9;

        this.createMaze();
    }

    getCanvas(id) {
        this.canvas = document.getElementById(id);
        if(!this.canvas) {
            console.error(`There is no canvas that id is ${id}`);
            return;
        }
        this.ctx = this.canvas.getContext('2d');
    }

    createMaze() {
        for(let i = 0; i < this.r; ++i) {
            this.pathArr[i] = [];
            for(let n = 0; n < this.c; ++n) {
                this.pathArr[i][n] = new Card(i, n, MathUtil.randomInt(this.imgNum));
            }
        }
        console.log(this.pathArr)
    }
}

new linkGame(10, 10, 'canvas');

// 传入r，c(r * c % 2 === 0)
// 加载缓存图片
// 随机生成r*c/2个数字，实例化Card，保存到pathArr
// 数组removeList保存已消除card
// 绘制pathArr
// 添加点击事件
// 数组arr保存card
// if(arr.lenght == 2)
    // if(搜索路径)
        // if(图片对比)
            // 对应位置清空
            // if(removeList.length >= r * c)
               // 游戏结束
        // else
            // arr.pop()
