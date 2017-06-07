class Point {
    constructor(r, c, flag=1) {
        this.r = r;
        this.c = c;
        this.flag = flag;         // 0 可以通过 1不能通过
        this.state = -1;        // 0 在openList 1 在closeList -1 未处理

        this.f = 0;
        this.g = 0;
        this.h = 0;
        this.parent = null;
    }
}

class FindPathGame {
    constructor(r, c) {
        this.r = 2 * r + 1;
        this.c = 2 * c + 1;
        this.pathArr = [];
        let maze = new Maze(r, c);
        let oriArr = maze.arr;
        this.ctx = maze.ctx;
        this.canvas = maze.canvas;

        this.openList = [];
        this.closeList = [];

        this.start = null;
        this.end = null;

        this.quickSort = this.quickSort.bind(this);

        this.initArr(oriArr);
        // this.findPath(this.pathArr[1][0], this.pathArr[this.r - 2][this.c - 1]);

        this.findPath = this.findPath.bind(this);
        this.render = this.render.bind(this);
        this.removeEvent = this.removeEvent.bind(this);
        this.addEvent = this.addEvent.bind(this);
        
        // this.render(this.pathArr[this.r - 2][this.c - 1]);
        this.bindEvent();
    }

    initArr(oriArr) {
        oriArr.forEach((row, i) => {
            this.pathArr[i] = [];
            row.forEach((col, n) => {
                this.pathArr[i][n] = new Point(i, n, col);
            })
        })
    }

    findPath(start, end) {
        let curPoint = start;
        // 上下左右顶点偏移量
        let near = [{
            r: -1,
            c: 0
        }, {
            r: 1,
            c: 0
        }, {
            r: 0,
            c: -1
        }, {
            r: 0,
            c: 1
        }];
        let finded = false;
        start.f = start.h = this.distPoint(start, end);
        this.openList.push(start);

        while(this.openList.length > 0) {
            curPoint = this.openList.pop();
            curPoint.state = 1;
            this.closeList.push(curPoint);
            finded = this.processPoint(near, curPoint, end);
            if(finded) {
                break;
            }
        }
    }

    distPoint(ori, tar) {
        return Math.abs(ori.r - tar.r) + Math.abs(ori.c - tar.c);
    }

    processPoint(near, curPoint, end) {
        let len = near.length,
            i = 0;

        while(i < len) {
            let tr = curPoint.r + near[i].r,
                tc = curPoint.c + near[i].c;
            if(this.between(tr, 0, this.r - 1) && this.between(tc, 0, this.c - 1)) {
                let tp = this.pathArr[tr][tc];
                if(tp.flag === 0 && tp.state !== 1) {
                    // 判断 tp 是否为终点
                    if(this.isEqual(tp, end)) {
                        tp.parent = curPoint;
                        return true;
                    }
                    // tp不在openList（估值未计算）
                    if(tp.state === -1) {
                        tp.parent = curPoint;
                        tp.g = curPoint.g + 1;
                        tp.h = this.distPoint(tp, end);
                        tp.f = tp.g + tp.h;
                        this.addArrSort(this.openList, tp, this.comPonitF);
                    }else {
                        let g = curPoint + 1;
                        if(g < tp.g) {
                            tp.g = g;
                            tp.f = tp.g + tp.h;
                            this.quickSort(this.openList, 0, this.openList.length, this.comPonitF);
                        }
                    }
                }
            }
            ++i;
        }
        return false;
    }

    isEqual(p1, p2) {
        return (p1.r === p2.r) && (p1.c === p2.c);
    }

    between(v, min, max) {
        return (v >= min) && (v <= max);
    }

    comPonitF(p1, p2) {
        return p1.f - p2.f;
    }

    addArrSort(arr, point,  fun = (a, b) => (a - b)) {
        if(arr.length === 0) {
            arr.push(point);
            return;
        }
        let left = 0,
            right = arr.length - 1;
        while(left < right) {
            let mid = (left + right) >> 1;
            // console.log(arr)
            let result = fun(arr[mid], point)
            if(result > 0) {
                right = mid - 1;
            }else if(result < 0) {
                left = mid + 1;
            }else {
                left = mid;
                break;
            }
        }
        for(let i = arr.length - 1; i >= left; --i) {
            arr[i + 1] = arr[i];
        }
        arr[left] = point;
        return left;
    }

    quickSort(arr = [], left = 0, right = arr.length - 1, fun = (a, b) => (a - b)) {
        if(left >= right) {
            return;
        }

        let index = this.sort(arr, left, right, fun);
        this.quickSort(arr, 0, index - 1);
        this.quickSort(arr, index + 1, right);
    }

    sort(arr = [], left = 0, right = arr.length - 1, fun = (a, b) => (a - b)) {
        console.log(fun)
        let tmp = arr[left];
        while(left < right) {
            while(left < right && fun(arr[right], tmp) > 0) {
                --right;
            }
            arr[left] = arr[right];
            while(left < right && fun(arr[left], tmp) <= 0) {
                ++left;
            }
            arr[right] = arr[left];
        }
        arr[left] = tmp;
        return left;
    }

    render(end) {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.fillStyle = 'red';
        this.ctx.fillRect(end.c * 10, end.r * 10, 10, 10);
        let tar = end.parent;

        while(tar) {
            this.ctx.fillRect(tar.c * 10, tar.r *10, 10, 10);
            tar = tar.parent;
        }
        this.ctx.stroke();
        this.ctx.restore();
        this.renderPer(this.start, 'yellow');
        this.renderPer(this.end, 'blue');
        console.log(this.pathArr)
    }

    renderPer(point, color='red') {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.fillStyle = color;
        this.ctx.fillRect(point.c * 10, point.r * 10, 10, 10);
        this.ctx.fill();
        this.ctx.restore();
    }

    bindEvent() {
        this.canvas.addEventListener('click', this.addEvent)
    }

    addEvent(e) {
        if(this.start && this.end) {
            this.removeEvent();
            return;
        }
        let c = ~~(e.offsetX / 10),
            r = ~~(e.offsetY / 10);
        if(this.pathArr[r][c].flag === 0) {
            if(!this.start) {
                this.start = this.pathArr[r][c];
                this.renderPer(this.start, 'yellow');
            }else {
                this.end = this.pathArr[r][c];
                this.findPath(this.start, this.end);
                this.render(this.end);
            }
        }
    }

    removeEvent() {
        this.canvas.removeEventListener('click', this.addEvent);
    }

}

new FindPathGame(20, 20);
