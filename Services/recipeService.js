const { body, validationResult } = require('express-validator');
const { readRecipesFromFile, writeRecipesToFile } = require('../utils/fileUtils');

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
exports.fetchRecipes = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query||{};
        const pageNumber = parseInt(page, 10);
        const pageSize = parseInt(limit, 10);

        if (pageNumber < 1 || pageSize < 1) {
            return res.status(400).json({ error: 'Page and limit must be greater than 0' });
        }

        const recipes = await getRecipesFromFile();
        const totalRecipes = recipes.length;
        const totalPages = Math.ceil(totalRecipes / pageSize);
        const startIndex = (pageNumber - 1) * pageSize;
        const endIndex = Math.min(startIndex + pageSize, totalRecipes);

        if (pageNumber > totalPages) {
            return res.status(404).json({ error: 'Page not found' });
        }

        const paginatedRecipes = recipes.slice(startIndex, endIndex);

        return{
            data: paginatedRecipes,
            pagination: {
                currentPage: pageNumber,
                totalPages: totalPages,
                totalCount: totalRecipes,
                pageSize: pageSize
            }
        };

    } catch (err) {
        throw new Error('Failed to fetch recipes'); 
    }
};


// Fetch details of a single recipe
exports.fetchRecipeById = async (id) => {
    try {
        const recipes = await getRecipesFromFile();
        const recipe = recipes.find(r => r.id === parseInt(id, 10));
        return recipe || null;
    } catch (err) {
        throw new Error('Error fetching recipe by ID');
    }
};

// Create a new recipe
exports.storeRecipe = async (recipeData) => {
    try {
        const { title, instructions, ingredients, image } = recipeData;
        const recipes = await readRecipesFromFile();
        const newRecipe = {
            id: recipes.length ? recipes[recipes.length - 1].id + 1 : 1,
            title,
            instructions,
            ingredients,
            image: image || null
        };
        recipes.push(newRecipe);
        await writeRecipesToFile(recipes);
        return newRecipe;
    } catch (err) {
        throw new Error('Error storing recipe');
    }
};

// Update an existing recipe
exports.editRecipe = async (id, updateData) => {
    try {
        const recipes = await readRecipesFromFile();
        const recipeIndex = recipes.findIndex(r => r.id === id);
        if (recipeIndex !== -1) {
            const recipe = recipes[recipeIndex];
            const updatedRecipe = {
                ...recipe,
                ...updateData
            };
            recipes[recipeIndex] = updatedRecipe;
            await writeRecipesToFile(recipes);
            return updatedRecipe;
        } else {
            return null;
        }
    } catch (err) {
        throw new Error('Error updating recipe');
    }
};
