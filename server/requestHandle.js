let fs = require('fs');
let path = require('path');
let mine = require('./mine').types;

let handle = {
    index: (pathname, res) => {
        console.log('start')
        let filePath = '/index.html';
        fileExists(filePath, res)
        // fs.exists(filePath, exists => {
        //     if(exists) {
        //         res.writeHead(200, {'Content-Type': 'text/html'});
        //         let stream = fs.createReadStream(filePath, {flag: 'r', encoding: null});
        //         stream.on('error', () => {
        //             res.writeHead(500, {'Content-Type': 'text/html'});
        //             res.end('<h1>500 Server Error</h1>')
        //         })
        //         stream.pipe(res);
        //     }else {
        //         handle.notFound(res);
        //     }
        // })   
    },
    else: (pathname, res) => {
        fileExists(pathname, res)
    }
}

function fileExists(filePath, res) {
    filePath = decodeURI(filePath);
    let realPath = path.join(path.resolve(__dirname, '..'), filePath);
    let ext = path.extname(realPath).slice(1);

    fs.exists(realPath, exists => {
        if(!exists) {
            res.writeHead(404, {'Content-Type': 'text/html'});
            res.end(`This request URL ${filePath} was not found on this server`);
        }else {
            fs.readFile(realPath, (err, file) => {
                if(err) {
                    res.writeHead(500, {'Content-Type': 'text/plain'});
                    res.end(err)
                }else {
                    let contentType = mine[ext] || 'text/plain';
                        res.writeHead(200, {
                            'Content-Type': contentType
                        });
                        res.write(file);
                        res.end();
                }
            })
        }
    })
}


exports.handle = handle;