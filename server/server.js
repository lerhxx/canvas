let url = require('url');
let server = require('http');
let path = require('path');
let fs = require('fs');
let mine = require('./mine').types;

function start(route, handle) {
    server.createServer((req, res) => {
        let pathname = url.parse(req.url).pathname;

        route(pathname, handle, res);

    }).listen(8888);
    console.log('connect to 8888');
}

exports.start = start;