const { validationResult } = require('express-validator');
const { readRecipesFromFile, writeRecipesToFile } = require('../utils/fileUtils');
const { fetchRecipes, fetchRecipeById, storeRecipe, editRecipe } = require('../Services/recipeService');
const HttpHandler = require('../HttpHandler/responseHandler');


// Fetch paginated list of recipes
exports.getRecipes = async (req, res) => {
    const handler = new HttpHandler(res);
    try {
        const { page = 1, limit = 10 } = req.query || {};
        const pageNumber = parseInt(page, 10);
        const pageSize = parseInt(limit, 10);

        if (pageNumber < 1 || pageSize < 1) {
            return handler.sendError({ 
                status: 'failed', 
                message: 'Page and limit must be greater than 0' 
            }, 400);
        }

        const result = await fetchRecipes(pageNumber, pageSize);
        handler.sendJson({
            status: 'success',
            message: 'Paginated data successfully fetched',
            data: result.data,
            pagination: result.pagination
        });

    } catch (err) {
        const statusCode = err.statusCode || 500;
        const message = err.message || 'Internal Server Error';
        handler.sendError({ status: 'failed', message }, statusCode);
    }
};

// Fetch details of a single recipe
exports.getRecipeById = async (req, res) => {
    const handler = new HttpHandler(res);
    try {
        const recipe = await fetchRecipeById(req.params.id);
        if (recipe) {
            handler.sendJson({ 
                status: 'success', 
                message: 'Data successfully fetched',
                data:recipe
            });
        } else {
            handler.sendError({ status: 'failed', message: 'Recipe not found'},404);
        }
    } catch (err) {
        handler.sendError({status: 'failed', message: err.message});
    }
};

// Create a new recipe
exports.createRecipe = async (req, res) => {
    const handler = new HttpHandler(res);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errors = errors.array()

        handler.sendError({ 
            status: 'failed', 
            message:  errors[0],
        },400);
    }

    try {
        const { title, instructions, ingredients } = req.body;
        const image = req.file ? req.file.path : null;
        const newRecipe = await storeRecipe({ title, instructions, ingredients, image });
        handler.sendJson({ 
            status: 'success', 
            message: 'Data successfully inserted',
            data:newRecipe,
        }, 201);
    } catch (err) {
        handler.sendError({status: 'failed', message: err.message});
    }
};

// Update an existing recipe
exports.updateRecipe = async (req, res) => {
    const handler = new HttpHandler(res);
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const errors = errors.array()
        handler.sendError({ status: 'failed', message: errors[0]},400);
    }

    try {
        const recipeId = parseInt(req.params.id);
        const { title, instructions, ingredients, image } = req.body;
        
        let imagePath = null;

        if (req.file) {
            imagePath = req.file.path;
        } else if (image) {
            imagePath = image;
        }
        
        const updatedRecipe = await editRecipe(recipeId, { title, instructions, ingredients, image: imagePath });
        
        if (updatedRecipe) {
            handler.sendJson({ 
                status: 'success', 
                message: 'Data successfully updated',
                data:updatedRecipe,
            }, 200);
        } else {
            handler.sendError({ status: 'failed', message: 'Recipe not found'},404);
        }
    } catch (err) {
        handler.sendError({status: 'failed', message: err.message});
    }
};


// Delete a recipe
exports.deleteRecipe = async (req, res) => {
    const handler = new HttpHandler(res);

    try {
        const index = parseInt(req.params.id);

        if (!Number.isInteger(index)) {
            handler.sendError({ status: 'failed', message: 'Invalid recipe ID'},400);
        }
        
        const recipes = await readRecipesFromFile();
        const recipeIndex = recipes.findIndex(r => r.id === index);
        if (recipeIndex !== -1) {
            recipes.splice(recipeIndex, 1);
            await writeRecipesToFile(recipes);
            handler.sendJson({ 
                status: 'success', 
                message: 'Deleted successfully'
            }, 204);
        } else {
            handler.sendError({ status: 'failed', message: 'Recipe not found'},404);
        }
    } catch (err) {
        handler.sendError({status: 'failed', message: err.message});
    }
};
