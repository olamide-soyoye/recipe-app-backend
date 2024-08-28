const Recipe = require('../models/recipe');

const readRecipesFromDb = async () => {
    try {
        const data = await Recipe.find();
        return data; 
    } catch (err) {
        throw new Error('Error reading recipes from file');
    }
};


const writeRecipesToDb = async (recipe) => {
    try {
        const newRecipe = new Recipe(recipe);
        await newRecipe.save();
        return newRecipe;
    } catch (err) {
        throw new Error(`Error writing recipe to database: ${err.message}`);
    }
};


const updateRecipe = async (recipeId, updateData) => {
    try {
        const updatedRecipe = await Recipe.findByIdAndUpdate(
            recipeId,
            { $set: updateData },
            { new: true, runValidators: true } 
        ); 
        return updatedRecipe;
    } catch (err) {
        throw new Error(`Error writing recipes to file: ${err.message}`);
    }
};

const deleteRecipe = async (recipeId) => {
    try {
        const deletedRecipe = await Recipe.findByIdAndDelete(recipeId); 
        return deletedRecipe;
    } catch (err) {
        throw new Error(`Error deleting recipe: ${err.message}`);
    }
};

module.exports = { readRecipesFromDb, writeRecipesToDb, updateRecipe, deleteRecipe };
