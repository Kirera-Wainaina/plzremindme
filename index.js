const http = require('http');
const http2 = require('http2');
const fs = require('fs');
const path = require('path');

const { Firestore } = require('@google-cloud/firestore');
const Busboy = require('busboy');
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

server.on('stream', handleJSONPOSTRequests);

server.on('stream', createLog);

server.on('request', handleFormDataPOSTRequests)

function handleFileRoutes(stream, headers) {
    if (!isPOSTRequest(headers)) {
        const respond = new FileResponder(stream, headers);
        respond.send();
    }
    // There will be an alternative to handle GET API requests
}

function handleJSONPOSTRequests(stream, headers) {
    if (isPOSTRequest(headers)) {
        if (isJSONRequest(headers)) {
            callClassWithStreamArg(stream, headers)
        }
    }
}

function handleFormDataPOSTRequests(request, response) { 
    if (isFormData(request.headers)) {
        callClassWithRequestArg(request, response);
    }
}

function isPOSTRequest(headers) {
    if (headers[':method'] == 'POST') return true
    return false;
}

function isJSONRequest(headers) {
    if (headers['content-encoding'] == 'application/json') return true
    return false
}

function isFormData(headers) {
    if (isPOSTRequest(headers) && !isJSONRequest(headers)) return true;
    return false
}

function callClassWithStreamArg(stream, headers) {
    const ClassCall = require(`.${headers[':path']}`);
    const call = new ClassCall(stream, headers);
    call.run();
}

function callClassWithRequestArg(request, response) {
    const ClassCall = require(`.${request.headers[':path']}`);
    const call = new ClassCall(request);
    call.run(response);
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

class JSONHandler {
    constructor(stream, headers) {
        this.stream = stream;
        this.headers = headers;
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

class FormDataHandler {
    constructor(request) {
        this.request = request;
        this.fields = {};
    }

    getCollection(collectionName) {
        return firestore.collection(collectionName)
    }

    retrieveData() {
        return new Promise((resolve, reject) => {
            const busboy = Busboy({ headers: this.request.headers });
            busboy.on('field', (name, value) => this.fields[name] = value);
            busboy.on('file', this.handleFile);
            busboy.on('close', () => resolve())
            this.request.pipe(busboy);
        })
    }

    handleFile(name, file, info) {
        const extension = mimes.findExtensionFromMIMEType(info.mimeType);
        file.pipe(fs.createWriteStream(path.join(__dirname, 'uploads', `${name}${extension}`)))
            .on('close', () => console.log(`${name}${extension}`, 'Written to disk'))
    }

    respond(response, msg) {
        switch(msg){
            case 'success':
                response.writeHead(200);
                break;
            case 'error':
                response.writeHead(500);
                break;
        }
        response.end();
    }

}

function createLog(stream, headers) {
    console.log(new Date, headers[':path'])
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
exports.handleJSONPOSTRequests = handleJSONPOSTRequests;
exports.FileResponder = FileResponder;
exports.isPOSTRequest = isPOSTRequest;
exports.JSONHandler = JSONHandler;
exports.FormDataHandler = FormDataHandler;