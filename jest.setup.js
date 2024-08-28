const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const express = require('express');
const http = require('http');

const mongoServer = new MongoMemoryServer();
let server;
let app;

const createApp = () => {
    const app = express();
    app.use(express.json());

    app.get('/', (req, res) => {
        res.send('Hello World!');
    });

    return app;
};

beforeAll(async () => {
    const mongoUri = await mongoServer.getUri();
    await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    app = createApp();
    server = http.createServer(app);
    await new Promise((resolve) => server.listen(0, resolve)); 
}, 60000);

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
    await new Promise((resolve) => server.close(resolve)); 
});
