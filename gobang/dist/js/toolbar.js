'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ToolBar = function () {
    function ToolBar() {
        var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, ToolBar);

        this.owner = null;
        this.parent = null;
        Object.assign(this, obj);

        this.init(parent);

        this.regretEvent = this.regretEvent.bind(this);
        this.cancelRreget = this.cancelRreget.bind(this);
        this.bindEvent = this.bindEvent.bind(this);
        this.changeMode = this.changeMode.bind(this);
    }

    _createClass(ToolBar, [{
        key: 'init',
        value: function init() {
            if (this.parent.nodeType !== 1) {
                console.error('There is no parent of toolbar');
                return;
            }
            var toolbar = '';
            if (this.aiTool) {
                toolbar = '<div class=\'toolbar\'>\n                    <div>\n                        \u5F53\u524D\u68CB\u5B50<span id=\'cur\'></span>\n                    </div>\n                    <button id=\'reget\' type=\'button\'>\u6094\u68CB</button>\n                    <button id=\'cancel-reget\' type=\'button\'>\u64A4\u9500\u6094\u68CB</button>\n                    <button id=\'restart\' type=\'button\'>\u91CD\u65B0\u5F00\u59CB</button>\n                    <button id=\'aiMode\' type=\'button\'>\u4EBA\u673A\u6A21\u5F0F</button>\n                    <button id=\'selfMode\' type=\'button\'>\u5355\u72EC\u6A21\u5F0F</button>\n                </div>';
            } else {
                toolbar = '<div class=\'toolbar\'>\n                    <div>\n                        \u5F53\u524D\u68CB\u5B50<span id=\'cur\'></span>\n                    </div>\n                    <button id=\'reget\' type=\'button\'>\u6094\u68CB</button>\n                    <button id=\'cancel-reget\' type=\'button\'>\u64A4\u9500\u6094\u68CB</button>\n                    <button id=\'restart\' type=\'button\'>\u91CD\u65B0\u5F00\u59CB</button>\n                </div>';
            }

            this.parent.innerHTML = this.parent.innerHTML + toolbar;
            this.cur = document.getElementById('cur');
            this.regBtn = document.getElementById('reget');
            this.cancelBtn = document.getElementById('cancel-reget');
            this.restartBtn = document.getElementById('restart');
            this.aiBtn = document.getElementById('aiMode');
            this.selfBtn = document.getElementById('selfMode');
            this.bindEvent();
        }
    }, {
        key: 'bindEvent',
        value: function bindEvent() {
            var _this = this;

            this.regBtn.addEventListener('click', function () {
                return _this.regretEvent();
            });
            this.cancelBtn.addEventListener('click', function () {
                return _this.cancelRreget();
            });
            this.restartBtn.addEventListener('click', function () {
                return _this.restart();
            });
            if (this.aiTool) {
                this.aiBtn.addEventListener('click', function () {
                    _this.restart();
                    _this.changeMode(1);
                });
                this.selfBtn.addEventListener('click', function () {
                    _this.restart();
                    _this.changeMode(2);
                });
            }
        }
    }, {
        key: 'regretEvent',
        value: function regretEvent() {
            this.owner.regret();
        }
    }, {
        key: 'cancelRreget',
        value: function cancelRreget() {
            this.owner.cancelRreget();
        }
    }, {
        key: 'restart',
        value: function restart() {
            this.owner.restart();
        }
    }, {
        key: 'changeCur',
        value: function changeCur(color) {
            this.cur.style.backgroundColor = color;
        }

        /*
         * mode 1: aiMode 2: selfMode
         */

    }, {
        key: 'changeMode',
        value: function changeMode(mode) {
            this.owner.changeMode(mode);
            if (mode === 1) {
                this.aiBtn.disabled = true;
                this.selfBtn.disabled = false;
            } else if (mode === 2) {
                this.aiBtn.disabled = false;
                this.selfBtn.disabled = true;
            }
        }
    }]);

    return ToolBar;
}();