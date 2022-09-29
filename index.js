const http = require('http');
const http2 = require('http2');
const fs = require('fs');
const path = require('path');

const { Firestore } = require('@google-cloud/firestore');
const Busboy = require('busboy');
const mimes = require('./utils/MIMETypes');
const CloudUploader = require('./handlers/CloudUploader')

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

server.on('stream', handleAPIGETRequests);

server.on('stream', createLog);

server.on('request', handleFormDataPOSTRequests)

function handleFileRoutes(stream, headers) {
    if (!isPOSTRequest(headers)) {
        if (!isAPIGETRequest(headers)) {
            const respond = new FileResponder(stream, headers);
            respond.send();
        }
    }
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

function handleAPIGETRequests(stream, headers) {
    if (!isPOSTRequest(headers)) {
        if (isAPIGETRequest(headers)) {
            callClassWithStreamArg(stream, headers);
        }
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

function isAPIGETRequest(headers) {
    const parentDir = path.dirname(path.dirname(headers[':path']));
    return parentDir == '/api' ? true : false;
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

class RequestHandler {
    constructor() {}

    getCollection(collectionName) {
        return firestore.collection(collectionName)
    }

    respond(msg, data=null) {
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
        data ? this.stream.end(data) : this.stream.end()
    }
}

class JSONHandler extends RequestHandler {
    constructor(stream, headers) {
        super();
        this.stream = stream;
        this.headers = headers;
    }

    retrieveData() {
        return new Promise((resolve, reject) => {
            this.stream.on('data', data => {
                resolve(JSON.parse(data))
            })  
        })
    }

}

class FormDataHandler extends RequestHandler {
    constructor(request) {
        super();
        this.request = request;
        this.fields = {};
        this.logoMetadata = null;
    }

    retrieveData() {
        return new Promise((resolve, reject) => {
            const busboy = Busboy({ headers: this.request.headers });
            busboy.on('field', (name, value) => this.fields[name] = value);
            busboy.on('file', async (name, file, info) => {
                await this.handleFile(name, file, info);
                resolve()
            });
            busboy.on('close', () => console.log('All file uploaded data is received'))
            this.request.pipe(busboy);
        })
    }

    handleFile(name, file, info) {
        return new Promise((resolve, reject) => {
            const extension = mimes.findExtensionFromMIMEType(info.mimeType);
            const filePath = path.join(__dirname, 'uploads', `${name}${extension}`)
            file.pipe(fs.createWriteStream(filePath))
            .on('close', () => console.log(`${name}${extension}`, 'Written to disk'))
            .on('close', async () => {
                    const cloudUploader =  new CloudUploader(filePath);
                    this.logoMetadata = await cloudUploader.run();
                    resolve()
                })
        })
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

class GETHandler extends RequestHandler {
    constructor(stream, headers) {
        super();

        this.stream = stream;
        this.headers = headers;
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
exports.GETHandler = GETHandler;