let url = require('url');
let server = require('http');
let path = require('path');
let fs = require('fs');
let mine = require('./mine').types;

function start(route, handle) {
    server.createServer((req, res) => {
        let pathname = url.parse(req.url).pathname;

        // pathname = decodeURI(pathname);
        // let realPath = path.join(path.resolve(__dirname, '..'), pathname);
        // let ext = path.extname(realPath).slice(1);

        // fs.exists(realPath, exists => {
        //     if(!exists) {
        //         res.writeHead(404, {
        //             'Content-Type': 'text/plain'
        //         });
        //         res.write(`This request URL ${pathname} was not found on this server`);
        //         res.end();
        //     }else {
        //         fs.readFile(realPath, (err, file) => {
        //             if(err) {
        //                 res.writeHead(500, {
        //                     'Content-Type': 'text/plain'
        //                 });
        //                 res.end(err);
        //             }else {
        //                 let contentType = mine[ext] || 'text/plain';
        //                 res.writeHead(200, {
        //                     'Content-Type': contentType
        //                 });
        //                 res.write(file);
        //                 res.end();
        //             }
        //         })
        //     }
        // })

        route(pathname, handle, res);

        // res.writeHead(200, {'Content-Type': 'text/plain'});
        // res.end('hello');
    }).listen(8888);
    console.log('connect to 8888');
}

exports.start = start;