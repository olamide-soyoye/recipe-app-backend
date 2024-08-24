const express = require('express');
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const multer = require('multer');
// const indexRouter = require('./routes/index.js');
const { body, validationResult } = require('express-validator');

const app = express();
const PORT = process.env.PORT || 4000;


// Middleware
app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'images')));
// app.use('/', indexRouter);

// In-memory recipe storage
let recipes = [];

// Image upload setup
const upload = multer({ dest: 'images/' });

// Utility function to read recipes from file
const readRecipesFromFile = () => {
    try {
        const data = fs.readFileSync(path.join(__dirname, 'data', 'recipes.json'), 'utf8');
        recipes = JSON.parse(data);
    } catch (error) {
        recipes = [];
    }
};

// Utility function to write recipes to file
const writeRecipesToFile = () => {
    fs.writeFileSync(path.join(__dirname, 'data', 'recipes.json'), JSON.stringify(recipes, null, 2));
};

// Fetch paginated list of recipes
app.get('/api/recipes', (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    res.json(recipes.slice(startIndex, endIndex));
});

// Fetch details of a single recipe
app.get('/api/recipes/:id', (req, res) => {
    const recipe = recipes.find(r => r.id === parseInt(req.params.id));
    if (recipe) {
        res.json(recipe);
    } else {
        res.status(404).json({ message: 'Recipe not found' });
    }
});

// Create a new recipe
app.post('/api/recipes', [
    body('title').isString().notEmpty(),
    body('instructions').isString().notEmpty(),
    body('ingredients').isArray().notEmpty(),
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { title, instructions, ingredients, image } = req.body;
    const newRecipe = {
        id: recipes.length ? recipes[recipes.length - 1].id + 1 : 1,
        title,
        instructions,
        ingredients,
        image: image || null
    };
    recipes.push(newRecipe);
    writeRecipesToFile();
    res.status(201).json(newRecipe);
});

// Update an existing recipe
app.put('/api/recipes/:id', [
    body('title').optional().isString(),
    body('instructions').optional().isString(),
    body('ingredients').optional().isArray(),
    body('image').optional().isString(),
], (req, res) => {
    console.log('Request body:', req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const index = recipes.findIndex(r => r.id === parseInt(req.params.id));
    console.log('My index:', index);
    // return 
    if (index !== -1) {
        const { title, instructions, ingredients, image } = req.body;
        const updatedRecipe = {
            ...recipes[index],
            title: title !== undefined ? title : recipes[index].title,
            instructions: instructions !== undefined ? instructions : recipes[index].instructions,
            ingredients: ingredients !== undefined ? ingredients : recipes[index].ingredients,
            image: image !== undefined ? image : recipes[index].image
        };
        recipes[index] = updatedRecipe;
        writeRecipesToFile();
        res.json(updatedRecipe);
    } else {
        res.status(404).json({ message: 'Recipe not found' });
    }
});

// Delete a recipe
app.delete('/api/recipes/:id', (req, res) => {
    const index = recipes.findIndex(r => r.id === parseInt(req.params.id));
    if (index !== -1) {
        recipes.splice(index, 1);
        writeRecipesToFile();
        res.status(204).json({ message: 'Deleted successfully' });
    } else {
        res.status(404).json({ message: 'Recipe not found' });
    }
});


// Upload an image
app.post('/api/recipes/:id/image', upload.single('image'), (req, res) => {
    const recipeId = parseInt(req.params.id);
    const recipe = recipes.find(r => r.id === recipeId);

    if (recipe) {
        const imageFile = req.file;
        if (imageFile) {
            recipe.image = `/images/${imageFile.filename}`;
            writeRecipesToFile();
            res.json(recipe);
        } else {
            res.status(400).json({ message: 'No image file uploaded' });
        }
    } else {
        res.status(404).json({ message: 'Recipe not found' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    readRecipesFromFile();
});
