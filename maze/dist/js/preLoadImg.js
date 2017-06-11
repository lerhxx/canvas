"use strict";

var PreLoadImg = {
    // 预加载图片
    loadImage: function loadImage(url) {
        return new Promise(function (resolve, reject) {
            var img = new Image();
            img.onload = function () {
                return resolve(img);
            };
            img.onerror = reject;
            img.src = url;
        });
    },
    // 所有图片加载完成
    allLoadDone: function allLoadDone(p, resolveAll) {
        return Promise.all(p);
    }
};