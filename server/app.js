const http = require('http')
const https = require('https')
const fs = require('fs')
const path = require('path')
const Request = require('./request')
const HTTPPORT = 8001;
const SSLPORT = 8002;
const HOST = '0.0.0.0';
const suffixReg = /^\/?.+\.([^\/\s]+?)$/;
const credentials = {
    key: fs.readFileSync(path.resolve(__dirname, './certificate/private.pem')),
    cert: fs.readFileSync(path.resolve(__dirname, './certificate/file.crt'))
};


const requestListener = (req, res) => {
    const request = new Request(req);
    console.log(
        `protocol< ${request.protocol} >`,
        `host< ${request.host} >`,
        `host< ${request.host} >`,
        `hostname< ${request.hostname} >`,
        `url< ${request.url} >`,
        `path< ${request.path} >`,
        `querystring< ${request.querystring} >`
    )
    if (request.path === '/api/file') {
        let fileData = []
        fs.opendir(path.resolve(__dirname, '../'), async (err, dir) => {
            for await (const dirent of dir) {
            console.log(dirent.name);
            fileData.push({
                name: dirent.name,
                path: dirent.path,
                isFile: dirent.isFile(),
                isDirectory: dirent.isDirectory(),
            })
            }
            console.log(JSON.stringify(fileData))

            res.writeHead(200, { 'Content-Type': 'application/json;charset=UTF-8' });
            res.write(JSON.stringify(fileData));
            res.end();
        })
        
        return
    }

    let filePath = request.path === '/'
        ? 'index.html'
        : suffixReg.test(request.path) ? request.path : request.path + '.html';
    
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