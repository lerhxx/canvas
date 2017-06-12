let PreLoadImg = {
     // 预加载图片
    loadImage: (url) => {
        return new Promise((resolve, reject) => {
            let img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = url;
        })
    },
    // 所有图片加载完成
    allLoadDone(p, resolveAll) {
        return Promise.all(p)
    }
}