const http = require('http')
const fs = require('fs')
const path = require('path')
const Request = require('./request')
const PORT = 8001;
const HOST = '0.0.0.0';

http.createServer((req,res) => {
    const request = new Request(req);
    console.log(request.path, request.host, request.hostname, request.url, request.querystring)
    fs.readFile(path.resolve(__dirname, '../' + request.path), (err, data) => {
        if(err){ 
            console.log(err);
            res.write('<h3>404</h3>');
            res.end();
        }else{
            res.write(data);
            res.end(); 
        }
    })
}).listen(PORT, HOST);