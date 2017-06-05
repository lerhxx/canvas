window.onload = () => {
    let socket = null,
        firstConnect = true,
        regContent = document.getElementById('content'),
        msg = document.getElementById('message');
    
    document.getElementById('connect').addEventListener('click', () => {
        connect();
    })

    document.getElementById('send').addEventListener('click', () => {
        sendMsg();
    })

    function connect() {
        socket = io();
        // socket = io('http://localhost:8888', {reconnect: false});
        // socket.on('connect', () => {
        //     regContent.innerHTML = '连接成功';
        //     if(firstConnect) {
        //         firstConnect = false;
        //         regCon();
        //     }else {
        //         socket.reconnect;
        //     }
        // })
        socket.emit('message', () => {
            msg.value;
        })
    }

    function regCon() {
        if(socket) {
            socket.on('message', (msg) => {
                regContent.innerHTML = regContent.innerHTML + '\n' + msg;
            })
        }
    }

    function sendMsg() {
        console.log(msg.value)
        if(socket) {
            socket.send(msg.value);
        }
    }
}
