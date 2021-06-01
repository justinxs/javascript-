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
const ignoreDirs = ['.git', '.gitignore', '.vscode', 'favicon.ico', 'server']

let dirTreeCache = null;
const getDirTree = async (fPath = '') => {
    fPath = fPath ? fPath[0] === '/' ? fPath : `/${fPath}` : '/'
    let tree = []
    const dir = await fs.promises.opendir(path.resolve(__dirname, '..' + fPath));
    for await (const dirent of dir) {
        let treeItem = {
            name: dirent.name,
            path: `${fPath === '/' ? '' : fPath}/${dirent.name}`,
            isFile: dirent.isFile(),
            isDirectory: dirent.isDirectory()
        }
        if (!ignoreDirs.includes(treeItem.name)) {
            tree.push(treeItem)
            if (treeItem.isDirectory) {
                treeItem.child = await getDirTree(treeItem.path)
            }
        }
    }

    return tree
}

const requestListener = async (req, res) => {
    console.log(JSON.stringify({
        'remoteAddress': req.connection.remoteAddress,
        'X-Real-IP': req.headers['x-real-ip'] || req.headers['X-Real-IP'],
        'X-Forwarded-For': req.headers['x-forwarded-for'] || req.headers['X-Forwarded-For'],
        'X-NginX-Proxy': req.headers['x-nginx-proxy'] || req.headers['X-NginX-Proxy'],
        'X-Host': req.headers['x-host'] || req.headers['X-Host'],
    }))
    console.log(req.headers)


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
        let data = null;
        try {
            if (!dirTreeCache || +request.query.reload) {
                dirTreeCache = await getDirTree('/')
            } else {
                console.log('dirTreeCache')
            }
            data = {
                code: 200,
                data: dirTreeCache,
                msg: ''
            }
        } catch (error) {
            console.log('tree error', error)
            data = {
                code: 500,
                data: null,
                msg: error.message
            }
        }
        res.writeHead(200, { 'Content-Type': 'application/json;charset=UTF-8' });
        res.write(JSON.stringify(data));
        return res.end();
    }

    let filePath = request.path === '/'
        ? 'index.html'
        : suffixReg.test(request.path) ? request.path : request.path + '.html';
    
    fs.readFile(path.resolve(__dirname, '../' + decodeURIComponent(filePath)), (err, data) => {
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