'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Player = function () {
    function Player() {
        _classCallCheck(this, Player);

        this.playList = [];
        this.currentId = -1;
        this.audioObj = null;

        this.bindEvent();
    }

    _createClass(Player, [{
        key: 'init',
        value: function init() {
            this.audioObj = document.createElement('audio');
            this.audioObj.setAttribute('id', 'audio');
        }
    }, {
        key: 'clearList',
        value: function clearList() {
            this.playList.length = 0;
            this.currentId = -1;
        }
    }, {
        key: 'add',
        value: function add(name, url) {
            this.playList.push({ name: name, ulr: url });
        }
    }, {
        key: 'delete',
        value: function _delete(name) {
            delete this.playList[name];
        }
    }, {
        key: 'play',
        value: function play(index) {
            var _this = this;

            var song = this.playList[index];
            if (song) {
                if (this.audioObj.readyState === 4 && this.currentId === index) {
                    this.audioObj.play();
                } else {
                    this.currentId = index;
                    this.stop();
                    this.audioObj.src = song.url;
                    this.audioObj.addEventListener('canplaythrough', function () {
                        _this.play();
                    });
                }
            }
        }
    }, {
        key: 'stop',
        value: function stop() {
            this.audioObj.pause();
        }
    }, {
        key: 'isEmptyList',
        value: function isEmptyList() {
            return !!this.playList.length;
        }
    }, {
        key: 'playStep',
        value: function playStep(step) {
            if (!this.isEmptyList) {
                if (!this.currentId) {
                    this.currentId = 0;
                }
                if (step > 0) {
                    this.currentId = this.currentId < this.playList.length ? ++this.currentId : 0;
                } else {
                    this.currentId = this.currentId > 0 ? --this.currentId : this.playList.length - 1;
                }
                this.play(this.currentId);
            } else {
                return;
            }
        }
    }, {
        key: 'playPrev',
        value: function playPrev() {
            this.playStep(-1);
        }
    }, {
        key: 'playNext',
        value: function playNext() {
            this.playStep(1);
        }
    }, {
        key: 'bindEvent',
        value: function bindEvent() {
            var _this2 = this;

            // 暂停
            document.getElementById('pause').click(function () {
                _this2.audioObj && _this2.audioObj.pause();
            });

            // 开始
            document.getElementById('play').click(function () {
                _this2.audioObj && _this2.audioObj.start(0);
            });

            // 上一首
            document.getElementById('prev').click(function () {
                _this2.currentId = _this2.currentId > 0 ? --_this2.currentId : _this2.playList.length - 1;
                _this2.audioObj = _this2.playList[_this2.currentId];
                _this2.audioObj.start(0);
            });

            // 下一首
            document.getElementById('next').click(function () {
                _this2.currentId = _this2.currentId < _this2.playList.length ? ++_this2.currentId : 0;
                _this2.audioObj = _this2.playList[_this2.currentId];
                _this2.audioObj.start(0);
            });

            // 添加文件
            document.getElementById('file').on('change', function () {
                console.log('change');
                console.log(_this2.files);
            });
        }
    }]);

    return Player;
}();