const { httpResponses } = require('../traits/httpResponses');

class HttpHandler {
    constructor(response, code = 200) {
        this.response = response;
        this.code = code;
    }

    sendJson(data, statusCode = 200) {
        httpResponses.sendJson(this.response, statusCode, data);
    }

    sendText(text) {
        httpResponses.sendText(this.response, this.code, text);
    }

    sendHtml(html) {
        httpResponses.sendHtml(this.response, this.code, html);
    }

    sendError(message, statusCode = 500) {
        httpResponses.sendError(this.response, statusCode, message);
    }
    

    send404Error(message) {
        httpResponses.sendError(this.response, 404, message);
    }
}

module.exports = HttpHandler;
