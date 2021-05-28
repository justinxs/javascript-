const http = require('http')
const https = require('https')
const fs = require('fs')
const path = require('path')
const Request = require('./request')
const HTTPPORT = 8001;
const SSLPORT = 8002;
const HOST = '0.0.0.0';
const credentials = {
    key: fs.readFileSync(path.resolve(__dirname, './certificate/private.pem')),
    cert: fs.readFileSync(path.resolve(__dirname, './certificate/file.crt'))
};

const requestListener = (req,res) => {
    const request = new Request(req);
    console.log(
        `protocol=${request.protocol};`,
        `host=${request.host};`,
        `host=${request.host};`,
        `hostname=${request.hostname};`,
        `url=${request.url};`,
        `path=${request.path};`,
        `querystring=${request.querystring}`
    )
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
}

const httpServer = http.createServer(requestListener)
const httpsServer = https.createServer(credentials, requestListener)

httpServer.listen(HTTPPORT, HOST);
httpsServer.listen(SSLPORT, HOST);
console.log(`http://localhost:${HTTPPORT}`)
console.log(`https://localhost:${SSLPORT}`)