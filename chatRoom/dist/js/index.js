'use strict';

window.onload = function () {
    var socket = null,
        firstConnect = true,
        regContent = document.getElementById('content'),
        msg = document.getElementById('message');

    document.getElementById('connect').addEventListener('click', function () {
        connect();
    });

    document.getElementById('send').addEventListener('click', function () {
        sendMsg();
    });

    function connect() {
        socket = io('http://localhost:8888', { reconnect: false });
        socket.on('connect', function () {
            regContent.innerHTML = '连接成功';
            if (firstConnect) {
                firstConnect = false;
                regCon();
            } else {
                socket.reconnect;
            }
        });
    }

    function regCon() {
        if (socket) {
            socket.on('message', function (msg) {
                regContent.innerHTML = regContent.innerHTML + '\n' + msg;
            });
        }
    }

    function sendMsg() {
        console.log(msg.value);
        if (socket) {
            socket.send(msg.value);
        }
    }
};