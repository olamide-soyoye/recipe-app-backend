const { readRecipesFromDb, writeRecipesToDb, updateRecipe, deleteRecipe} = require('../utils/fileUtils');
const { ObjectId } = require('mongodb');

// Helper function to get the latest recipes from the file
const getRecipesFromDb = async () => {
    try {
        const recipes = await readRecipesFromDb();
        return recipes;
    } catch (err) {
        throw new Error('Error reading recipes from file');
    }
};

// Fetch paginated list of recipes
exports.fetchRecipes = async (pageNumber, pageSize) => {
    try {
        const recipes = await getRecipesFromDb();
        const totalRecipes = recipes.length;
        const totalPages = Math.ceil(totalRecipes / pageSize);
        const startIndex = (pageNumber - 1) * pageSize;
        const endIndex = Math.min(startIndex + pageSize, totalRecipes);

        if (pageNumber > totalPages || pageNumber < 1) {
            throw { statusCode: 404, message: 'Page not found' };
        }

        const paginatedRecipes = recipes.slice(startIndex, endIndex);

        return {
            data: paginatedRecipes,
            pagination: {
                currentPage: pageNumber,
                totalPages: totalPages,
                totalCount: totalRecipes,
                pageSize: pageSize
            }
        };

    } catch (err) {
        throw { statusCode: 500, message: 'Failed to fetch recipes' };
    }
};


// Fetch details of a single recipe
exports.fetchRecipeById = async (id) => {
    try {
        const objectId = new ObjectId(id);

        const recipes = await getRecipesFromDb();
        const recipe = recipes.find(r => r._id.equals(objectId));
        return recipe || null;
    } catch (err) {
        throw new Error('Error fetching recipe by ID: ' + err.message);
    }
};


// Create a new recipe
exports.storeRecipe = async (recipeData) => {
    try {
        const { title, instructions, ingredients, image } = recipeData;
        const newRecipe = {
            title,
            instructions,
            ingredients,
            image: image || null
        };
        const createdRecipe = await writeRecipesToDb(newRecipe);
        return createdRecipe;
    } catch (err) {
        throw new Error(`Error storing recipe: ${err.message}`);
    }
};

// Update an existing recipe
exports.editRecipe = async (id, updateData) => {
    try {
        const updatedRecipe = await updateRecipe(id, updateData)

        if (!updatedRecipe) {
            return null;
        }

        return updatedRecipe;
    } catch (err) {
        throw new Error('Error updating recipe');
    }
};

exports.deleteRecipe = async (id) => {
    try {
        const deleted = await deleteRecipe(id)

        if (!deleted) {
            return null;
        }

        return deleted;
    } catch (err) {
        throw new Error('Error deleting recipe');
    }
};
