const path = require('path');
const dotenv = require('dotenv');
const index = require('./index');

dotenv.config()

test('listens on port 80', () => {
    expect(index.httpServer.listening).toBe(true)
})

test('redirects upon receiving a request', () => {
    const mockResponse = {
        writeHead: jest.fn(),
        end: jest.fn()
    };
    index.redirectHTTPRequests({}, mockResponse)
    expect(mockResponse.writeHead).toHaveBeenCalled();
    expect(mockResponse.end).toHaveBeenCalled();
})

test('throws received error', () => {
    expect(() => index.handleHTTPErrors(new Error)).toThrow();
})


describe('check API route', () => {
    test('is API route', () => {
        const route = '/api/AdminSignup';
        expect(index.isAPIRoute(route)).toBeTruthy();
    })

    test('is not API route', () => {
        const route = '/';
        expect(index.isAPIRoute(route)).toBeFalsy();
    })
})

describe('Responder class', () => {
    const mockStream = {
        _writable: jest.fn(),
    }
    const respond = new index.FileResponder(
        mockStream, 
        { ':path': '/'});
    const homePath = path.join(__dirname, process.env.INDEX_PATH);
        
    test('sets default headers', () => {
        respond.setDefaultHeaders();
        expect(respond.responseHeaders['status']).toBe(200);
        expect(respond.responseHeaders['content-type']).toBe('text/html')
    })

    test('adds a header', () => {
        respond.addHeader('content-type', 'application/json');
        expect(respond.responseHeaders['content-type']).toBe('application/json');
    })

    test('handle browser paths', () => {
        expect(respond.handleBrowserPaths()).toBe(homePath);

        const respondWithOtherPath = new index.FileResponder(
            {respond: jest.fn()}, 
            {':path': '/admin'});
        expect(respondWithOtherPath.handleBrowserPaths())
            .toBe(path.join(__dirname, 'frontend/html', 'admin' + '.html'))
    })

    test('gets file path', () => {
        expect(respond.getFilePath()).toBe(homePath);

        const respondWithOtherPath = new index.FileResponder(
            {respond: jest.fn()}, 
            {':path': '/favicon.ico'});
        expect(respondWithOtherPath.getFilePath())
            .toBe(path.join(__dirname, 'favicon.ico'))
    })

})

describe('APIResponder class', () => {
    test('connects to mongodb', () => {
        
    })
})

afterEach(() => {
    index.httpServer.close();
    index.server.close();
})