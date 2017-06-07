'use strict';

function initCanvas(id) {
    var obj = {};
    if (typeof id === 'string') {
        obj.canvas = document.getElementById(id);
        obj.ctx = obj.canvas.getContext('2d');
    } else {
        obj = createCanvas();
    }

    return obj;
}

function createCanvas() {
    var obj = {};
    obj.canvas = document.createElement('canvas');
    obj.ctx = obj.canvas.getContext('2d');

    obj.canvas.width = window.innerWidth;
    obj.canvas.height = window.innerHeight;
    document.body.appendChild(obj.canvas);

    return obj;
}