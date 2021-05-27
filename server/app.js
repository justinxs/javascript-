const http = require('http')
const fs = require('fs')
const path = require('path')
const Request = require('./request')
const PORT = 8001;
const HOST = '0.0.0.0';

const server = http.createServer((req,res) => {
    const request = new Request(req);
    console.log(request.path, request.host, request.hostname, request.url, request.querystring)
    let filePath = /^\/?.+\.([^\/\s]+?)$/.test(request.path) ? request.path : request.path + '.html'
    fs.readFile(path.resolve(__dirname, '../' + filePath), (err, data) => {
        if(err){ 
            console.log(err);
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write('<h3>404</h3>');
            res.end();
        }else{
            res.write(data);
            res.end(); 
        }
    })
})

server.listen(PORT, HOST);