let server = require('./server');
let router = require('./router');
let requestHandle = require('./requestHandle').handle;

let handle = {};
// handle['index'] = requestHandle.idnex;
// handle['else'] = requestHandle.else;
handle = requestHandle;

server.start(router.route, handle);

let io = require('socket.io')(server);

io.on('connnection', client => {
    console.log('connection')
    client.on('message', (msg) => {
        console.log(msg)
        doMsg(client, msg);
    })
})

function doMsg(client, msg) {
    let ip = client.handshake.address.address;
    console.log(`receive msg from: ${ip}`);

    client.send('Server received msg');
    client.broadcast.send(`${ip} send message: ${msg}`);
}

