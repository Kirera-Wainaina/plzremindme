const http = require('http');
const http2 = require('http2');
const fs = require('fs');
const path = require('path');

const { Firestore } = require('@google-cloud/firestore');
const mimes = require('./utils/MIMETypes');

const dotenv = require('dotenv');
dotenv.config();

const firestore = new Firestore({
    keyFilename: process.env.SERVICE_ACCOUNT_PATH,
    projectId: process.env.GCLOUD_PROJECT_ID
})

/* HTTP/2 server and the respective handlers below*/
const options = {
    key: fs.readFileSync(process.env.KEY_PATH),
    cert: fs.readFileSync(process.env.CERT_PATH),
    allowHTTP1: true
}
const server = http2.createSecureServer(options);

server.listen(443, console.log('listening for http/s on 443...'))

server.on('stream', handleFileRoutes);

server.on('stream', handlePOSTRequests);

server.on('stream', createLog);

function handleFileRoutes(stream, headers) {
    if (!isPOSTRequest(headers)) {
        const respond = new FileResponder(stream, headers);
        respond.send();
    }
}

function handlePOSTRequests(stream, headers) {
    if (isPOSTRequest(headers)) {
        callClassFromPath(stream, headers)
    }
}

function isPOSTRequest(headers) {
    if (headers[':method'] == 'POST') return true
    return false;
}

function callClassFromPath(stream, headers) {
    const ClassCall = require(`.${headers[':path']}`);
    const call = new ClassCall(stream, headers);
    call.run();
}

class FileResponder {
    constructor(stream, headers) {
        this.stream = stream;
        this.headers = headers;
        this.responseHeaders = {};
    }

    setDefaultHeaders() {
        const ext = path.extname(this.headers[':path']) || '.html';
        this.responseHeaders['content-type'] = mimes.findMIMETypeFromExtension(ext);
        this.responseHeaders['status'] = 200;
    }

    addHeader(property, value) {
        this.responseHeaders[property] = value;
    }

    handleBrowserPaths() {
        return path.join(__dirname, process.env.INDEX_PATH)
    }

    getFilePath() {
        if (!path.extname(this.headers[':path'])) {
            return this.handleBrowserPaths()
        } else {
            return path.join(__dirname, this.headers[':path']);
        }
    }

    send() {
        this.setDefaultHeaders();
        this.stream.respond(this.responseHeaders);
        fs.createReadStream(this.getFilePath())
            .pipe(this.stream)
    }
}

class APIResponder {
    constructor(stream, headers) {
        this.stream = stream;
        this.headers = headers;
        this.client = null;
    }

    getCollection(collectionName) {
        return firestore.collection(collectionName)
    }

    retrieveData() {
        return new Promise((resolve, reject) => {
            this.stream.on('data', data => {
                resolve(JSON.parse(data))
            })  
        })
    }

    respond(msg) {
        if (this.client) this.client.close();
        switch (msg) {
            case 'unauthorized':
                this.stream.respond({':status': 401});
                break;
            case 'success':
                this.stream.respond({':status': 200});
                break;
            case 'error':
                this.stream.respond({':status': 500});
                break;
        }
        this.stream.end()
    }
}

function createLog(stream, headers) {
    console.log(new Date, headers[':path'])
    console.log(headers)
}

/* HTTP server and the respective functions are handled below */

const httpServer = http.createServer();

httpServer.listen(80, console.log('Http listening on port 80'));

httpServer.on('request', redirectHTTPRequests);

httpServer.on('error', handleHTTPErrors);

process.on('uncaughtException', logAllErrors);

function handleHTTPErrors(error) {
    throw error
}

function redirectHTTPRequests(request, response) {
    response.writeHead(300, { location: `${process.env.WEB_URL}${request.path}`});
    response.end();
}

function logAllErrors(error) {
    console.log(error)
}

exports.redirectHTTPRequests = redirectHTTPRequests;
exports.httpServer = httpServer;
exports.server = server;
exports.handleHTTPErrors = handleHTTPErrors;
exports.handleFileRoutes = handleFileRoutes;
exports.handlePOSTRequests = handlePOSTRequests;
exports.FileResponder = FileResponder;
exports.isPOSTRequest = isPOSTRequest;
exports.APIResponder = APIResponder;