const express = require('express');
require('dotenv').config();
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
app.use('/images', express.static('images'));
const PORT = process.env.PORT || 4000;
const SERVER = process.env.SERVER || "http://localhost";

// Middleware
app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'images')));

// Routes
const swagger = require('./config/swagger'); 
const recipeRoutes = require('./routes/recipeRoutes');
// const imageRoutes = require('./routes/imageRoutes');
app.use('/api/recipes', recipeRoutes);
// app.use('/api/recipes/:id/image', imageRoutes);
app.use('/api-docs', swagger);

app.listen(PORT, () => {
    console.log(`Server running on ${SERVER}:${PORT}`);
});
