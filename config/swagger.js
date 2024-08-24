const swaggerJsdoc = require('swagger-jsdoc');
require('dotenv').config();

const swaggerUi = require('swagger-ui-express');
const express = require('express'); 
const app = express();
const PORT = process.env.PORT || 4000;
const SERVER = process.env.SERVER || "http://localhost";

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'My API',
    version: '1.0.0',
    description: 'A description of my API',
  },
  //   url: 'http://localhost:4000'
  servers: [
    {
      url: `${SERVER}:${PORT}`,
      description: 'Development server',
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['../routes/recipeRoutes.js'], 
};

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJsdoc(options);

// Swagger-UI setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

module.exports = app;
