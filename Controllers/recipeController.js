const { body, validationResult } = require('express-validator');
const { readRecipesFromFile, writeRecipesToFile } = require('../utils/fileUtils');
const { fetchRecipes, fetchRecipeById, storeRecipe, editRecipe } = require('../Services/recipeService');

// Helper function to get the latest recipes from the file
const getRecipesFromFile = async () => {
    try {
        const recipes = await readRecipesFromFile();
        return recipes;
    } catch (err) {
        throw new Error('Error reading recipes from file');
    }
};

// Fetch paginated list of recipes
exports.getRecipes = async (req, res) => {
    try {
        const recipes = await fetchRecipes(req);
        res.status(200).json(recipes);
    } catch (err) {
        console.error('Error fetching recipes:', err); 
        res.status(500).json({ message: err.message });
    }
}

// Fetch details of a single recipe
exports.getRecipeById = async (req, res) => {
    try {
        const recipe = await fetchRecipeById(req.params.id);
        if (recipe) {
            res.status(200).json({message: 'Success', data:recipe });
        } else {
            res.status(404).json({ message: 'Recipe not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Create a new recipe
exports.createRecipe = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { title, instructions, ingredients } = req.body;
        const image = req.file ? req.file.path : null;
        const newRecipe = await storeRecipe({ title, instructions, ingredients, image });
        res.status(201).json({message: 'Success', data:newRecipe });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update an existing recipe
exports.updateRecipe = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const recipeId = parseInt(req.params.id);
        const { title, instructions, ingredients } = req.body;
        const image = req.file ? req.file.path : null;
        const updatedRecipe = await editRecipe(recipeId, { title, instructions, ingredients, image });
        if (updatedRecipe) {
            res.status(200).json({message: 'Success', data:updatedRecipe });
        } else {
            res.status(404).json({ message: 'Recipe not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Delete a recipe
exports.deleteRecipe = async (req, res) => {
    try {
        const index = parseInt(req.params.id);

        if (!Number.isInteger(index)) {
            return res.status(400).json({ message: 'Invalid recipe ID' });
        }
        
        const recipes = await getRecipesFromFile();
        const recipeIndex = recipes.findIndex(r => r.id === index);
        if (recipeIndex !== -1) {
            recipes.splice(recipeIndex, 1);
            await writeRecipesToFile(recipes);
            res.status(204).json({ message: 'Deleted successfully' });
        } else {
            res.status(404).json({ message: 'Recipe not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
