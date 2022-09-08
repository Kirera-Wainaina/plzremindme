const http = require('http');
const http2 = require('http2');
const fs = require('fs');
const path = require('path');
const util = require('util')

const MongoClient = require('mongodb').MongoClient;

const mimes = require('./utils/MIMETypes');

const dotenv = require('dotenv');
dotenv.config();

const mongoClient = new MongoClient(process.env.DB_URI);

/* HTTP/2 server and the respective handlers below*/
const options = {
    key: fs.readFileSync(process.env.KEY_PATH),
    cert: fs.readFileSync(process.env.CERT_PATH),
    allowHTTP1: true
}
const server = http2.createSecureServer(options);

server.listen(443, console.log('listening for http/s on 443...'))

server.on('stream', handleFileRoutes);

server.on('stream', handleAPIRoutes);

server.on('stream', createLog);

function handleFileRoutes(stream, headers) {
    if (!isAPIRoute(headers[':path'])) {
        const respond = new FileResponder(stream, headers);
        respond.send();
    }
}

function handleAPIRoutes(stream, headers) {
    if (isAPIRoute(headers[':path'])) {
        console.log('api called')
        const ClassCall = require(`.${headers[':path']}`);
        const call = new ClassCall(stream, headers);
        call.log();
    }
}

function isAPIRoute(route) {
    if (path.dirname(route) == '/api') return true;
    return false;
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
        if (this.headers[':path'] == '/') {
            return path.join(__dirname, process.env.INDEX_PATH)
        } else {
            return path.join(__dirname, 'frontend/html', this.headers[':path'] + '.html');
        }
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
    constructor(stream, header) {
        this.stream = stream;
        this.header = header;
        this.collection = null;
        this.client = null;
    }

    set collection(collectionName) {
        mongoClient.connect((error, client) => {
            if (error) console.log(error);

            this.client = client;
            this.collection = this.client.db(process.env.DB_NAME)
                .collection(collectionName)
        })
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
exports.FileResponder = FileResponder;
exports.isAPIRoute = isAPIRoute;
exports.APIResponder = APIResponder;