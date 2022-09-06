const path = require('path');
const dotenv = require('dotenv');
const index = require('./index');
const { hasUncaughtExceptionCaptureCallback } = require('process');
const { Stream } = require('stream');

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

describe('Responder class', () => {
    const mockStream = {
        _writable: jest.fn(),
    }
    const respond = new index.Responder(
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

        const respondWithOtherPath = new index.Responder(
            {respond: jest.fn()}, 
            {':path': '/admin'});
        expect(respondWithOtherPath.handleBrowserPaths())
            .toBe(path.join(__dirname, 'frontend/html', 'admin' + '.html'))
    })

    test('gets file path', () => {
        expect(respond.getFilePath()).toBe(homePath);

        const respondWithOtherPath = new index.Responder(
            {respond: jest.fn()}, 
            {':path': '/favicon.ico'});
        expect(respondWithOtherPath.getFilePath())
            .toBe(path.join(__dirname, 'favicon.ico'))
    })

})

afterAll(() => {
    index.httpServer.close();
    index.server.close();
})