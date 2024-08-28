const express = require('express');
require('dotenv').config();
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
app.use('/images', express.static('images'));
const PORT = process.env.PORT || 4000;
const SERVER = process.env.SERVER || 'http://localhost';

// Middleware
app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'images')));

// Routes
const recipeRoutes = require('./routes/recipeRoutes');
app.use('/api/recipes', recipeRoutes);

app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Server running on ${SERVER}:${PORT}`);
});
