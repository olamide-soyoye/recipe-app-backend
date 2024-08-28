exports.httpResponses = {
    sendJson(response, statusCode, data) {
        response.statusCode = statusCode;
        response.setHeader('Content-Type', 'application/json');
        response.end(JSON.stringify(data));
    },

    sendText(response, statusCode, text) {
        response.statusCode = statusCode;
        response.setHeader('Content-Type', 'text/plain');
        response.end(text);
    },

    sendHtml(response, statusCode, html) {
        response.statusCode = statusCode;
        response.setHeader('Content-Type', 'text/html');
        response.end(html);
    },

    sendError(response, statusCode, message) {
        this.sendJson(response, statusCode, { error: message });
    }
};
