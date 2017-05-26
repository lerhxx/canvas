class Player {
    constructor() {
        this.playList = [];
        this.currentId = -1;
        this.audioObj = null;

        this.bindEvent();
    }

    init() {
        this.audioObj = document.createElement('audio');
        this.audioObj.setAttribute('id', 'audio');
    }

    clearList() {
        this.playList.length = 0;
        this.currentId = -1;
    }

    add(name, url) {
        this.playList.push({name:name, ulr: url})
    }

    delete(name) {
        delete this.playList[name];
    }

    play(index) {
        let song = this.playList[index];
        if(song) {
            if(this.audioObj.readyState === 4 && this.currentId === index) {
                this.audioObj.play();
            }else {
                this.currentId = index;
                this.stop();
                this.audioObj.src = song.url;
                this.audioObj.addEventListener('canplaythrough', () => {
                    this.play();
                })
            }
        }
    }

    stop() {
        this.audioObj.pause();
    }

    isEmptyList() {
        return !!this.playList.length;
    }

    playStep(step) {
        if(!this.isEmptyList) {
            if(!this.currentId) {
                this.currentId = 0;
            }
            if(step > 0) {
                this.currentId = this.currentId < this.playList.length ? ++this.currentId : 0;
            }else {
                this.currentId = this.currentId > 0 ? --this.currentId : this.playList.length - 1;
            }
            this.play(this.currentId); 
        }else {
            return;
        }
    }

    playPrev() {
        this.playStep(-1);
    }

    playNext() {
        this.playStep(1);
    }

    bindEvent() {
        // 暂停
        document.getElementById('pause').click(() => {
            this.audioObj && this.audioObj.pause();
        })

        // 开始
        document.getElementById('play').click(() => {
            this.audioObj && this.audioObj.start(0);
        })

        // 上一首
        document.getElementById('prev').click(() => {
            this.currentId = this.currentId > 0 ? --this.currentId : this.playList.length - 1;
            this.audioObj = this.playList[this.currentId];
            this.audioObj.start(0);
        })

        // 下一首
        document.getElementById('next').click(() => {
            this.currentId = this.currentId < this.playList.length ? ++this.currentId : 0;
            this.audioObj = this.playList[this.currentId];
            this.audioObj.start(0);
        })

        // 添加文件
        document.getElementById('file').on('change', () => {
            console.log('change')
            console.log(this.files)
        })
    }
}